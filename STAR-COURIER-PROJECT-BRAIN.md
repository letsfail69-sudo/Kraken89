# Star Courier – paměť integrace Kraken89 / V1 / 10. 10. 2026

Zadání: zpřístupnit existující funkční Star Courier přímo z Kraken89.cz. Vychází z přiloženého Kraken89-main (2)(1).zip. Cílem je balík pro stávající GitHub Pages, nikoli publikace na jiném Sites projektu. Zachovat ostatní obsah, překladač i Rozvozák Idle.

Změny: index.html přidává kartu, online-hry/index.html přidává hru a stažení. Nové online-hry/star-courier/index.html + player.css + player.js zobrazují přehrávač Heyfolk po kliknutí Spustit hru tady. Fullscreen API s CSS fallbackem; vždy stejný iframe bez reloadu. Přímé otevření a stažení jsou dostupné i bez JS. Žádné fiktivní účty, vlastní lokální kopie hry, alternativní backend ani zpracování SDK zpráv v Kraken wrapperu.

Herní URL: https://www.heyfolk.eu/games.php?game=star-courier&view=play
Download: https://www.heyfolk.eu/games.php?game=star-courier&view=download
Kraken stránka po nasazení: https://kraken89.cz/online-hry/star-courier/
Slug musí zůstat stejný, vydání aktivovat na Heyfolk. Hra 0.4.0 CZ/ENG, účty/pozice/statistiky z modulu Hry 1.1.0, core >=0.5.16. Kanonické herní zdroje i její podrobná paměť jsou v samostatném StarCourier-Zdroje-0.4.0.zip.

Uživatel potvrdil funkčnost hry a chce současnou verzi ponechat hotovou. Budoucí UI: jedno velké okno se záložkami; další obsah podle návrhů hráčů. Tyto rozšíření nejsou v této integraci implementované. Veřejný žebříček/multiplayer zůstávají budoucí etapa.

Nasazení: obsah plného ZIPu nebo ZIPu změn do kořene stávajícího GitHub repozitáře. Nesmazat jiné soubory. .nojekyll, CNAME, ads/analytics, původní hry a aplikace zachované. Pokyny: STAR-COURIER-NASAZENI.md.

Ověření: kontrola relativních cest, odkazů, obsahu archivu a JavaScript start/fullscreen/fallback; byte porovnání ostatních souborů s dodaným ZIPem. Živé nasazení Kraken89 a skutečný browser render nejsou ověřené. Ověření Heyfolk je samostatně popsáno v nasazovacím dokumentu podle aktuálního výsledku HTTP kontroly. Cross-origin iframe load není důkaz úspěšného loginu, proto wrapper nehlásí ověřené serverové uložení.
