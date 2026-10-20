# Balans 20 unikalnych umiejętności

Każda nazwa ma odrębną mechanikę. Kontra, kontrola celności, uszkodzenie pancerza, spowolnienie, dwucios, poprawka po chybieniu, atak zależny od szybkości, ryzykowna szarża, ignorowanie pancerza, osłona, regeneracja i zarządzanie tempem są rozliczane w stanie walki, nie w samym opisie.

Pomiar: `npm run balance` — 547 200 walk, 40 losowych zestawów bazowych, 12 ziaren walki, wszystkie pary 20 umiejętności, obie strony, trzy długości. Zestawy w parze są identyczne poza umiejętnością. Test regresji korzysta z osobnej próby 24 zestawów i 8 ziaren.

| Długość | Najniższa skuteczność | Najwyższa skuteczność |
|---|---:|---:|
| Krótka | gap: 47.08% | precise: 54.03% |
| Średnia | feint-strike: 45.23% | precise: 54.58% |
| Długa | feint-strike: 45.05% | breath: 53.91% |

## Efekty

| Umiejętność | Działanie co czwarty atak |
|---|---|
| Szał berserkerski | Co czwarty atak: +9 siły przy trafieniu. |
| Rozbrojenie | Co czwarty celny atak: −12 siły następnego ciosu rywala. |
| Precyzyjny cios | Co czwarty atak: pewne trafienie i pominięcie 10 obrony. |
| Drugi oddech | Co czwarty atak: odzyskuje do 8 HP i 15 kondycji. |
| Szarża | Co czwarty atak: +12 siły, ale następny cios rywala pomija 6 obrony. |
| Cios znad głowy | Co czwarty atak: ignoruje cały pancerz, +4 siły, −15 pkt proc. celności. |
| Uderzenie barkiem | Co czwarty atak po trafieniu: +5 siły i odebranie rywalowi 22 kondycji. |
| Seria uderzeń | Co czwarty atak: dodatkowy cios z 60% siły, z osobnym testem trafienia i pancerza. |
| Blokada nadgarstka | Co czwarty celny atak przygotowuje kontrę: najbliższe nieśmiertelne trafienie rywala wywołuje ripostę za 9 HP. |
| Zaczepienie broni | Co czwarty celny atak: dwa kolejne ataki pomijają 12 obrony rywala. |
| Piasek w oczy | Co czwarty celny atak: −25 pkt proc. celności dwóch następnych ataków rywala. |
| Cios głowicą | Co czwarty celny atak: następny atak rywala zadaje tylko 45% obrażeń. |
| Cios w szczelinę | Co czwarty celny atak: trwale niszczy 3 obrony rywala, do 9 w całej walce. |
| Wypad | Co czwarty atak: +8 siły oraz 0,7 za każdy punkt przewagi szybkości (łącznie do +15). |
| Zwód i pchnięcie | Co czwarty atak: po chybieniu pewna poprawka z 80% obrażeń; po trafieniu +30 pkt proc. celności następnego ataku. |
| Niskie cięcie | Co czwarty celny atak: +4 siły i trwałe odjęcie 4 szybkości rywala, do 12 w całej walce. |
| Kontrola oddechu | Co czwarty atak: odzyskuje 38 kondycji przed ciosem, usuwając zmęczenie tego ataku. Cios ma +6 siły. Nie leczy. |
| Mobilizacja | Co czwarty atak: odzyskuje do 12 HP, wyłącznie gdy ma mniej niż połowę zdrowia. |
| Odzyskanie postawy | Co czwarty atak: osłona pochłania do 9 obrażeń najbliższego trafienia (bez kumulacji). |
| Zmiana tempa | Co czwarty atak: dwa następne ataki nie zużywają kondycji i mają +3 siły oraz +12 pkt proc. celności. |

To wyniki zbiorcze dla wskazanej próby. Nie gwarantują równego wyniku każdej pary ani każdego możliwego zestawu. Kontrola oddechu pomaga po utracie kondycji, mobilizacja przy niskim HP, a cios w szczelinę przeciwko opancerzeniu.
