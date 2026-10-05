# Web Kraken89 — balík pro Překladač her 1.3.4

1. Rozbal ZIP. Nahraj OBSAH složky Kraken89-main do kořene existujícího webu/repozitáře. Nenahrávej jen ZIP jako soubor a nevytvářej další vnořenou složku Kraken89-main.
2. Web nyní ukazuje novinky 1.3.4 jako připravené. Aktivní stahování a aktualizace zůstávají na 1.3.3.
3. Po testu na Windows vytvoř na GitHubu vydání s přesným tagem 1.3.4 (bez v).
4. Do vydání přilož poslední rozšířené soubory Prekladac_Her_Setup.exe, Prekladac_Her_Instalator.zip a Prekladac_Her_Portable.zip.
5. Až budou všechny tři soubory dostupné, nahraď prekladac-her/aktualizace.json obsahem prekladac-her/aktualizace-1.3.4.json. Původní cestu /prekladac-her/aktualizace.json neměň.
6. Web automaticky přepne tlačítka, verzi, velikost a SHA-256 na 1.3.4 a historii označí jako aktuální vydání. Datum vydání můžeš potom doplnit do aplikace/prekladac-her/historie.json a změnit Status na released.

Přibalený nový JSON patří k poslednímu rozšířenému instalátoru 1.3.4; starší testovací balík měl jiný součet.
Pro návštěvníky bez JavaScriptu zůstává v HTML funkční dosavadní stažení 1.3.3. Po vydání můžeš také ručně aktualizovat výchozí verze/odkazy v HTML; návštěvníci s JavaScriptem se řídí aktivním JSON.

Soukromé zdrojové kódy aplikace do veřejného webu ani vydání nepatří. Nový komunitní server ani odesílání dat nejsou součástí tohoto balíku.
