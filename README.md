# Kraken89.cz – GitHub Pages verze

Statická verze původního webu Kraken89.cz připravená pro GitHub Pages.

## Nasazení
1. Vytvoř nový GitHub repository.
2. Nahraj celý obsah této složky do kořene repozitáře.
3. V GitHubu otevři **Settings → Pages**.
4. Source nastav na **Deploy from a branch**.
5. Vyber větev `main` a složku `/ (root)`.
6. Ulož nastavení.

## Vlastní doména
Až budeš chtít přepnout `kraken89.cz` z Bloggeru na GitHub Pages, nastav vlastní doménu v GitHub Pages a uprav DNS u registrátora. Soubor `CNAME.example` můžeš přejmenovat na `CNAME`.

## Poznámky
- Web je čisté HTML/CSS/JS a nepotřebuje PHP ani databázi.
- Kontaktní formulář používá `mailto:`, protože GitHub Pages nemá serverový backend.
- Spotify zůstává vložené jako externí embed.
- Sociální sítě a YouTube kanály zůstávají jako externí odkazy.
- Blogger komentáře, Atom feed, štítky a další Blogger funkce byly odstraněny.
- Původní fotky z jednotlivých Blogger příspěvků nejsou v archivu obsaženy.

## Herní nástroje
Stránka `cheaty.html` obsahuje přehled nástrojů. Každá hra má vlastní složku v `cheaty/`; další postup pro rozšíření je v `cheaty/README.md`. První editor je `cheaty/the-crust/index.html` pro The Crust.

## Online hry
Rozcestník `online-hry/index.html` vede na hry v samostatných podsložkách. Rozvozák Idle je v `online-hry/rozvozak/index.html` a nepotřebuje další soubory. Postup ukládá pouze do `localStorage` v prohlížeči hráče.

## Aplikace
Sekce aplikace/ obsahuje Překladač her, stažení a historii verzí. Pokyny k dalším vydáním jsou v aplikace/README.md.

## Star Courier – hraní přímo z webu

Nová stránka `online-hry/star-courier/index.html` otevírá existující přehrávač Heyfolk uvnitř webu. Karta je na homepage i v Online hry. Herní účty, postup a statistiky zůstávají na Heyfolk; GitHub Pages neobsahuje kopii hry ani PHP. Celý postup nasazení: STAR-COURIER-NASAZENI.md. Paměť dalšího vývoje: STAR-COURIER-PROJECT-BRAIN.md.


## Propojení Kraken89 / Kraken89Games – 17. 11. 2026
Původní css/style.css, barvy, logo, hlavní úvodní obsah a rozložení jsou zachovány.
Doplněna stránka projekty.html, sekce vydaných a plánovaných projektů a odkazy
na hernu. js/projects.js načítá veřejný JSON feed /api/projects.php z herny bez
přihlašovacích údajů. Při nedostupnosti použije označený datovaný přehled.
Hraní Star Courier v původním obalu míří na Kraken89Games, ne na starý Heyfolk.
Odkaz na stažení ZIPu hry odstraněn, nahrazen veřejným feedbackem.
Původní lokální prototyp Rozvozák Idle je zachován beze změny; jeho místní
postup se do herny automaticky nepřevádí. Zastaralé odkazy ve starších souborech
STAR-COURIER-NASAZENI a PROPOJENI-HEYFOLK ber jako archiv, aktuální návod je
v dodaném balíčku pro propojení obou webů.
