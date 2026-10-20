# Balans procentowych aktywacji

Umiejętności specjalne mają 25% szans przy każdym własnym ataku. Magia ma osobne losowanie: ogień 25%, lód 30%, błyskawica 20%, odnowa 15%, kamienna aura 20%. Nie ma okresowego wyzwalania po czterech lub pięciu atakach. Efekty wymagające trafienia nadal wymagają celnego ciosu.

Próba klasyczna: 547 200 walk, 40 losowych zestawów bazowych, 12 ziaren, wszystkie pary 20 umiejętności, obie strony i trzy długości. Zestawy w parze różnią się tylko umiejętnością. Test regresji korzysta z osobnej próby 24 zestawów i 8 ziaren.

| Długość | Najniższy odsetek wygranych | Najwyższy odsetek wygranych |
|---|---:|---:|
| Krótka | 46.23% | 53.72% |
| Średnia | 45.02% | 54.30% |
| Długa | 43.79% | 54.91% |

Test 10 000 własnych ataków weryfikuje częstość aktywacji specjalnej umiejętności i magii z tolerancją 2 punktów procentowych. Testy sprawdzają też granice 0% i 100%, niezależne losowania, wspólną aktywację oraz aktywację w pierwszym ataku. Podane odsetki wygranych nie są szansą uruchomienia efektu i nie dowodzą równowagi każdego możliwego zestawu.

| Umiejętność | Warunek i efekt |
|---|---|
| Szał berserkerski | 25% szans na aktywację przy każdym własnym ataku. +9 siły przy trafieniu. |
| Rozbrojenie | 25% szans na aktywację przy każdym własnym ataku. Po trafieniu: −12 siły następnego ciosu rywala. |
| Precyzyjny cios | 25% szans na aktywację przy każdym własnym ataku. pewne trafienie i pominięcie 10 obrony. |
| Drugi oddech | 25% szans na aktywację przy każdym własnym ataku. odzyskuje do 8 HP i 15 kondycji. |
| Szarża | 25% szans na aktywację przy każdym własnym ataku. +12 siły, ale następny cios rywala pomija 6 obrony. |
| Cios znad głowy | 25% szans na aktywację przy każdym własnym ataku. ignoruje cały pancerz, +4 siły, −15 pkt proc. celności. |
| Uderzenie barkiem | 25% szans na aktywację przy każdym własnym ataku. Po trafieniu: +5 siły i odebranie rywalowi 22 kondycji. |
| Seria uderzeń | 25% szans na aktywację przy każdym własnym ataku. dodatkowy cios z 60% siły, z osobnym testem trafienia i pancerza. |
| Blokada nadgarstka | 25% szans na aktywację przy każdym własnym ataku. Trafienie przygotowuje kontrę: najbliższe nieśmiertelne trafienie rywala wywołuje ripostę za 9 HP. |
| Zaczepienie broni | 25% szans na aktywację przy każdym własnym ataku. Po trafieniu: dwa kolejne ataki pomijają 12 obrony rywala. |
| Piasek w oczy | 25% szans na aktywację przy każdym własnym ataku. Po trafieniu: −25 pkt proc. celności dwóch następnych ataków rywala. |
| Cios głowicą | 25% szans na aktywację przy każdym własnym ataku. Po trafieniu: następny atak rywala zadaje tylko 45% obrażeń. |
| Cios w szczelinę | 25% szans na aktywację przy każdym własnym ataku. Po trafieniu: trwale niszczy 3 obrony rywala, do 9 w całej walce. |
| Wypad | 25% szans na aktywację przy każdym własnym ataku. +8 siły oraz 0,7 za każdy punkt przewagi szybkości (łącznie do +15). |
| Zwód i pchnięcie | 25% szans na aktywację przy każdym własnym ataku. po chybieniu pewna poprawka z 80% obrażeń; po trafieniu +30 pkt proc. celności następnego ataku. |
| Niskie cięcie | 25% szans na aktywację przy każdym własnym ataku. Po trafieniu: +4 siły i trwałe odjęcie 4 szybkości rywala, do 12 w całej walce. |
| Kontrola oddechu | 25% szans na aktywację przy każdym własnym ataku. odzyskuje 38 kondycji przed ciosem, usuwając zmęczenie tego ataku. Cios ma +6 siły. Nie leczy. |
| Mobilizacja | 25% szans na aktywację przy każdym własnym ataku. odzyskuje do 12 HP, wyłącznie gdy ma mniej niż połowę zdrowia. |
| Odzyskanie postawy | 25% szans na aktywację przy każdym własnym ataku. osłona pochłania do 9 obrażeń najbliższego trafienia (bez kumulacji). |
| Zmiana tempa | 25% szans na aktywację przy każdym własnym ataku. dwa następne ataki nie zużywają kondycji i mają +3 siły oraz +12 pkt proc. celności. |
