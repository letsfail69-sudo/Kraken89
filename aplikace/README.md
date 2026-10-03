# Aplikace na webu Kraken89

Nahraj obsah složky Kraken89-main do stávajícího repozitáře webu.

- Katalog: aplikace/index.html
- Překladač: aplikace/prekladac-her/index.html
- Historie: aplikace/prekladac-her/historie.html
- Údaje historie: aplikace/prekladac-her/historie.json

## Další vydání
1. Zveřejni GitHub release vX.Y.Z se soubory Prekladac_Her_Setup.exe, Prekladac_Her_Instalator.zip a Prekladac_Her_Portable.zip.
2. Uprav původní prekladac-her/aktualizace.json: Version, InstallerUrl, InstallerSha256, InstallerBytes a Notes podle skutečného vydání. Cestu neměň, používá ji také aplikace.
3. Přidej záznam do historie.json. Status může být prepared (připraveno), released (vydáno), archive (starší bez odkazu na release). Date je YYYY-MM-DD nebo null. Changes je seznam změn.
4. Uprav také výchozí texty a odkazy v HTML pro návštěvníky bez JavaScriptu.

Web načítá aktuální vydání z aktualizace.json. Připravený záznam označí jako vydaný jen při shodě s aktuální verzí tohoto souboru. Nyní je veřejná verze 1.3.1; 1.3.2 je připravená.

Další aplikaci přidej do vlastní podsložky a vlož kartu do katalogu. Do webu nepatří API klíče ani soukromý autorský balíček.
