# Kraken89 – propojení vydání s Heyfolk

Nahraj obsah složky Kraken89-main do kořene repozitáře Kraken89 na GitHubu (ne složku samotnou). Vyčkej na úspěšné nasazení GitHub Pages. Pokud je web již totožný s přiloženým základem, stačí nahradit aplikace/aplikace.js a tři HTML stránky aplikace, které mají nový parametr pro obnovení skriptu.

Hlavní zdroj: https://www.heyfolk.eu/api/updates.php

V administraci Heyfolk vytvoř vydání, nahraj EXE, instalační ZIP a portable ZIP a publikuj ho. Při dalším otevření stránky aplikace na Kraken89 se načte aktuální publikovaná verze, popis novinek, velikost a SHA-256 EXE i všechny tři odkazy ke stažení. Rozepsané vydání se neukazuje. API nevyžaduje přihlášení.

Web nevyžaduje ruční aktualizaci JSONu pro nové vydání. Záložní místní JSON se použije pouze při nedostupnosti či neplatné odpovědi Heyfolk; stránka v takovém případě výslovně upozorní, že záložní vydání nemusí být nejnovější.

Historie starších verzí zůstává v aplikace/prekladac-her/historie.json. Aktuální nová verze a její poznámky se do přehledu doplní z Heyfolk. Úplná automatická historie všech vydání by vyžadovala další API centra.

Stávající Windows aplikace dál používá svou původní aktualizační adresu. Tato úprava propojuje weby, nemění aktualizace programu ani statický soubor prekladac-her/aktualizace.json.

Heyfolk musí mít base_url https://www.heyfolk.eu a API povolené. Jeho současné API povoluje načítání z https://kraken89.cz; používej tuto kanonickou adresu Kraken89. Samostatná kopie otevřená z disku nemusí kvůli CORS fungovat.

Ověření 6. 10. 2026: veřejné API a stránka Heyfolk odpovídají HTTP 200 a poskytují publikované vydání 1.3.4 (release=1). API povoluje origin https://kraken89.cz. Ověřena syntaxe a simulované načítání, všechny tři odkazy, záložní režim a odmítnutí cizího serveru. Vzhled nebyl ověřen v prohlížeči.

Vydání na Heyfolk má SHA-256 204e77831c10cdc70330e75d8d24672720f70a568287848b56f9a79be91d0079: je to dřívější sestavení 1.3.4. Novější připravený instalátor s aktualizacemi z Heyfolk má SHA-256 8e1d674f6820086e3a279dc13003c78f98d7143beaf53594f3b247b7e2533abc. Samotné propojení webů nemění již nainstalovanou aplikaci.
