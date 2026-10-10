# Kraken89.cz – Star Courier / integrace webu V1

Balík je upravený přiložený web. Nahraj OBSAH tohoto ZIPu do kořene stávajícího GitHub repozitáře Kraken89, nikoli další obalovou složku. Nahraď existující soubory a přidej nové. Nemusíš mazat jiné soubory repozitáře. Soubor .nojekyll a CNAME zůstávají zachované.

Pokud používáš balík pouze se změnami, nahraj jeho obsah stejným způsobem; obsahuje jen index.html, online-hry/index.html, online-hry/star-courier/, README.md a tuto dokumentaci/paměť. Ostatní sekce se nemění.

Po dokončení GitHub Pages bude hra dostupná na:
https://kraken89.cz/online-hry/star-courier/
Homepage → Hrát Star Courier a Online hry → Hrát Star Courier otevřou tuto stránku. Tlačítko Spustit hru tady vloží přehrávač Heyfolk přímo do Kraken89. Celá obrazovka zachová stejný iframe i přihlášený účet. Pokud prohlížeč nepodporuje Fullscreen API, rozšíří okno přes celou stránku. Vždy je dostupné Otevřít samostatně.

Hra se nadále spouští z:
https://www.heyfolk.eu/games.php?game=star-courier&view=play
Stažení aktuálního vydání:
https://www.heyfolk.eu/games.php?game=star-courier&view=download
Další vydání aktivované u stejné hry na Heyfolk se načte automaticky bez přepisování herních souborů na GitHubu. Slug star-courier musí odpovídat správě Heyfolk. Pokud je jiný, změň data-src a odkazy v launcheru i odkaz ke stažení v Online hry.

Na Heyfolk musí být aktivní hra a vydání 0.4.0 (nebo novější kompatibilní) a modul Hry 1.1.0 na jádře >=0.5.16. Uživatel již potvrdil samostatné hraní jako funkční. Tato integrace nemění hru ani modul, nepotřebuje nové PHP na Kraken89. Přihlášení, SDK, statistiky a postup zajišťuje Heyfolk uvnitř vloženého přehrávače. Kraken89 nečte hesla, tokeny, pozice ani jeho DOM.

Vnější iframe záměrně nemá sandbox: vnitřní izolaci hry zajišťuje Heyfolk. Je povolen fullscreen/autoplay. CSP Heyfolk musí v obou vrstvách povolovat frame-ancestors https://kraken89.cz a https://www.kraken89.cz (dodané moduly toto povolení obsahují). Blokované úložiště třetí strany řeš otevřením hry samostatně; herní účet načte stejné serverové pozice.

Pro kontrolu po nasazení: otevři novou stránku, klikni Spustit, přihlas se ke svému hernímu účtu, zkontroluj starý postup, spusť a ukonči misi, vyzkoušej celou obrazovku i její ukončení, CZ/ENG, mobil a odkaz ke stažení. Nové otevření přehrávače vyžaduje přihlášení. Stažená hra je samostatný offline postup.

V balíčku nejsou herní ZIP ani PHP modul; ty už jsou nasazené na Heyfolk. Integrace V1 přidává pouze odkazové karty a wrapper. Nové herní prostředí s jedním velkým oknem a záložkami je odložené na další rozšíření podle návrhů hráčů.

## Ověření 10. 10. 2026

Přímý přehrávač Heyfolk odpověděl HTTP 200. Vnitřní herní HTML také HTTP 200. CSP obou dokumentů povoluje vložení na https://kraken89.cz i https://www.kraken89.cz; X-Frame-Options není nastavena. Stažení odpovědělo HTTP 200 application/zip a release.json obsahuje verzi hry 0.4.0.

Lokálně ověřeno: všechny nové relativní odkazy/assety, přepnutí spuštění pouze jednou, native fullscreen i CSS fallback, návrat bez restartu iframe a zachování ostatních původních souborů. Skutečné zobrazení v prohlížeči a nasazení na Kraken89 se ověří po nahrání do GitHubu.
