/* CORE_START */
const Core = (() => {
  const encoder = new TextEncoder();
  const MAGIC = 0x9e2a83c1n;
  const HEADER_SIZE = 48;
  const MAX_RAW = 512 * 1024 * 1024;

  function number64(view, offset) {
    const value = view.getBigUint64(offset, true);
    if (value > BigInt(Number.MAX_SAFE_INTEGER)) throw new Error("Nepodporovaná velikost save.");
    return Number(value);
  }
  function asBytes(text) { return encoder.encode(text); }
  function search(data, needle, start = 0, end = data.length) {
    let p = start;
    while ((p = data.indexOf(needle[0], p)) !== -1 && p + needle.length <= end) {
      let i = 1;
      while (i < needle.length && data[p + i] === needle[i]) i++;
      if (i === needle.length) return p;
      p++;
    }
    return -1;
  }
  function stringKey(name) {
    const word = asBytes(name);
    const key = new Uint8Array(5 + word.length);
    new DataView(key.buffer).setUint32(0, word.length + 1, true);
    key.set(word, 4);
    return key;
  }
  function field(data, beginning, prefix) {
    const at = search(data, asBytes(prefix), beginning, beginning + 870);
    if (at < 0) throw new Error("Schází očekávané pole kreditů: " + prefix);
    const type = search(data, asBytes("FloatProperty\0"), at, at + 115);
    if (type < 0) throw new Error("Neznámý typ pole kreditů: " + prefix);
    const headerAt = type + "FloatProperty\0".length;
    if (headerAt + 13 > data.length) throw new Error("Poškozené pole kreditů.");
    const view = new DataView(data.buffer, data.byteOffset);
    if (number64(view, headerAt) !== 4 || data[headerAt + 8] !== 0) {
      throw new Error("Nový formát pole kreditů. Soubor nebyl upraven.");
    }
    const offset = headerAt + 9;
    const value = view.getFloat32(offset, true);
    if (!Number.isFinite(value)) throw new Error("Neplatná hodnota kreditů.");
    return {offset, value};
  }
  function findObject(data, name) {
    const key = stringKey(name);
    const matches = [];
    let cursor = 0;
    while (cursor < data.length) {
      const at = search(data, key, cursor);
      if (at < 0) break;
      cursor = at + key.length;
      const next = search(data, asBytes("floatvalue_2_"), cursor, Math.min(data.length, cursor + 115));
      if (next < 0) continue;
      if (name === "Credits") {
        const parent = stringKey("Resource");
        if (search(data, parent, Math.max(0, at - 220), at) < 0) continue;
      }
      matches.push(at + 4);
    }
    if (matches.length !== 1) throw new Error("Nelze jednoznačně určit " + name + " (" + matches.length + " nálezů).");
    return matches[0];
  }
  function locateCredits(data) {
    const specifications = [
      {name: "CreditsCount", main: "BaseValue_15_"},
      {name: "Resource_Credits", main: "UnexpressedValue_6_"},
      {name: "Credits", main: "UnexpressedValue_6_"}
    ];
    const records = specifications.map(spec => {
      const start = findObject(data, spec.name);
      return {
        name: spec.name,
        current: field(data, start, "floatvalue_2_"),
        previous: field(data, start, "LastFloatValue_4_"),
        main: field(data, start, spec.main)
      };
    });
    const current = records[0].current.value;
    if (!Number.isInteger(current) || current < 0 || current > 1e10 ||
        records.some(r => r.current.value !== current || r.main.value !== current)) {
      throw new Error("Záznamy kreditů spolu nesouhlasí. Původní soubor nebyl upraven.");
    }
    return {current, records};
  }
  async function transform(bytes, format) {
    const stream = new Blob([bytes]).stream().pipeThrough(
      format === "inflate" ? new DecompressionStream("deflate") : new CompressionStream("deflate")
    );
    return new Uint8Array(await new Response(stream).arrayBuffer());
  }
  async function readLevel(input, onProgress = () => {}) {
    if (!(input instanceof Uint8Array) || input.length < HEADER_SIZE) {
      throw new Error("Vyber soubor Level.sav.");
    }
    const view = new DataView(input.buffer, input.byteOffset, input.byteLength);
    const chunks = [];
    let cursor = 0;
    let rawLength = 0;
    while (cursor < input.length) {
      if (cursor + HEADER_SIZE > input.length) throw new Error("Soubor končí uprostřed bloku.");
      const signature = view.getBigUint64(cursor, true);
      const maxBlock = number64(view, cursor + 8);
      const compressedLength = number64(view, cursor + 16);
      const rawSize = number64(view, cursor + 24);
      if (signature !== MAGIC || maxBlock < 1 || maxBlock > 1024 * 1024 ||
          rawSize < 1 || rawSize > maxBlock || compressedLength < 1 ||
          compressedLength > input.length - cursor - HEADER_SIZE ||
          number64(view, cursor + 32) !== compressedLength ||
          number64(view, cursor + 40) !== rawSize) {
        throw new Error("Nepodporovaný nebo poškozený formát Level.sav.");
      }
      const packedStart = cursor + HEADER_SIZE;
      const packedEnd = packedStart + compressedLength;
      const rawPart = await transform(input.subarray(packedStart, packedEnd), "inflate");
      if (rawPart.length !== rawSize) throw new Error("Nesouhlasí velikost rozbaleného bloku.");
      chunks.push({header: input.slice(cursor, packedStart), packed: input.slice(packedStart, packedEnd), raw: rawPart, rawOffset: rawLength});
      rawLength += rawSize;
      if (rawLength > MAX_RAW) throw new Error("Soubor je příliš velký.");
      cursor = packedEnd;
      if (chunks.length % 50 === 0) onProgress(chunks.length);
    }
    if (rawLength < 4) throw new Error("Prázdný save.");
    const raw = new Uint8Array(rawLength);
    for (const part of chunks) raw.set(part.raw, part.rawOffset);
    if (new DataView(raw.buffer).getUint32(0, true) !== rawLength - 4) {
      throw new Error("Nesouhlasí velikost dat uložené pozice.");
    }
    return {raw, chunks, ...locateCredits(raw)};
  }
  async function buildLevel(source, target, onProgress = () => {}) {
    if (!Number.isInteger(target) || target < 0 || target > 1_000_000_000) {
      throw new Error("Zadej celé číslo od 0 do 1 000 000 000.");
    }
    const stored = Math.fround(target);
    const changed = source.raw.slice();
    const view = new DataView(changed.buffer);
    for (const r of source.records) {
      for (const property of [r.current, r.previous, r.main]) {
        view.setFloat32(property.offset, stored, true);
      }
    }
    const encoded = [];
    for (let i = 0; i < source.chunks.length; i++) {
      const part = source.chunks[i];
      const altered = changed.subarray(part.rawOffset, part.rawOffset + part.raw.length);
      let hasChange = false;
      for (let j = 0; j < part.raw.length; j++) {
        if (part.raw[j] !== altered[j]) { hasChange = true; break; }
      }
      if (hasChange) {
        const packed = await transform(altered, "deflate");
        const header = part.header.slice();
        const h = new DataView(header.buffer);
        h.setBigUint64(16, BigInt(packed.length), true);
        h.setBigUint64(32, BigInt(packed.length), true);
        const test = await transform(packed, "inflate");
        if (test.length !== altered.length || test.some((value, index) => value !== altered[index])) {
          throw new Error("Ověření komprese se nezdařilo.");
        }
        encoded.push(header, packed);
      } else {
        encoded.push(part.header, part.packed);
      }
      if (i % 50 === 0) onProgress(i);
    }
    const length = encoded.reduce((total, part) => total + part.length, 0);
    const result = new Uint8Array(length);
    let offset = 0;
    for (const part of encoded) { result.set(part, offset); offset += part.length; }
    // Check that the output can be read and all three live balances agree.
    const reloaded = await readLevel(result);
    if (reloaded.current !== stored) throw new Error("Kontrola výsledného souboru se nezdařila.");
    return {bytes: result, stored};
  }
  return {readLevel, buildLevel};
})();
/* CORE_END */

const $ = id => document.getElementById(id);
let selected = null;
let originalFile = null;
let backupPrepared = false;
let busy = false;
const formatter = new Intl.NumberFormat("cs-CZ", {maximumFractionDigits: 0});
function message(text, kind = "") {
  $("status").className = "cheat-status" + (kind ? " " + kind : "");
  $("status").textContent = text;
}
function controls() {
  $("backupButton").disabled = busy || !selected;
  $("patchButton").disabled = busy || !selected || !backupPrepared;
  $("saveFile").disabled = busy;
}
function download(bytes, filename) {
  const url = URL.createObjectURL(new Blob([bytes], {type: "application/octet-stream"}));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}
$("saveFile").addEventListener("change", async event => {
  selected = null;
  backupPrepared = false;
  originalFile = event.target.files[0] || null;
  $("currentAmount").textContent = "—";
  $("filename").textContent = originalFile ? originalFile.name : "Žádný";
  controls();
  if (!originalFile) return;
  if (originalFile.name.toLowerCase() !== "level.sav") {
    message("Vyber přímo soubor Level.sav ze složky uložené pozice.", "error");
    return;
  }
  if (!("DecompressionStream" in window) || !("CompressionStream" in window)) {
    message("Tento prohlížeč neumí potřebnou kompresi. Otevři nástroj v aktuálním Edge nebo Chromu.", "error");
    return;
  }
  busy = true; controls();
  message("Načítám uloženou pozici…");
  try {
    const bytes = new Uint8Array(await originalFile.arrayBuffer());
    const loaded = await Core.readLevel(bytes, blocks => message("Čtu data pozice: " + blocks + " bloků…"));
    selected = {bytes, loaded};
    $("currentAmount").textContent = formatter.format(loaded.current);
    message("Načteno. Nejdříve stáhni zálohu, potom zvol nový počet kreditů.");
  } catch (error) {
    message("Nelze načíst pozici: " + error.message, "error");
  } finally {
    busy = false; controls();
  }
});
$("backupButton").addEventListener("click", () => {
  if (!selected || busy) return;
  const date = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  download(selected.bytes, "Level_zaloha_" + date + ".sav");
  backupPrepared = true;
  controls();
  message("Záloha byla nabídnuta ke stažení. Zkontroluj ji ve složce Stažené soubory.");
});
$("patchButton").addEventListener("click", async () => {
  if (!selected || !backupPrepared || busy) return;
  const cleaned = $("newAmount").value.replace(/[\s\u00a0\u202f]/g, "");
  if (!/^\d+$/.test(cleaned)) { message("Zadej nové kredity jako celé číslo bez dalších znaků.", "error"); return; }
  const amount = Number(cleaned);
  if (!Number.isSafeInteger(amount) || amount > 1_000_000_000) {
    message("Zadej celé číslo od 0 do 1 000 000 000.", "error");
    return;
  }
  if (Math.fround(amount) !== amount &&
      !window.confirm("Hra ukládá kredity jako Float. Částka " + formatter.format(amount) +
        " se zaokrouhlí na " + formatter.format(Math.fround(amount)) + ". Pokračovat?")) return;
  busy = true; controls();
  message("Připravuji upravenou pozici…");
  try {
    const result = await Core.buildLevel(selected.loaded, amount, blocks => {
      message("Balím data pozice: " + blocks + " z " + selected.loaded.chunks.length + " bloků…");
    });
    download(result.bytes, "Level.sav");
    message("Hotovo: připraven soubor Level.sav s " + formatter.format(result.stored) +
      " kredity. Zkopíruj jej do původní složky pozice podle návodu níže.", "success");
  } catch (error) {
    message("Úprava se nezdařila: " + error.message + " Původní soubor se nezměnil.", "error");
  } finally {
    busy = false; controls();
  }
});
