# JATKA — Arena wojowników

Lokalna gra dla dwóch osób przy jednym ekranie. Każdy wybiera imię i po jednej cesze w ośmiu kategoriach (w każdym slocie oferta 5 wylosowanych cech z puli 20). Potem oglądacie automatyczny pojedynek i opis oparty na zdarzeniach walki. Dostępne są rewanż, edycja postaci i rozpoczęcie od nowa. Interfejs po polsku, responsywne postacie SVG, bez zewnętrznych obrazów, fontów i usług.

## Uruchomienie

W katalogu repozytorium:

```sh
npm start
```

Wymagany Python 3. Gra działa na porcie 8000. Samo uruchomienie gry nie wymaga instalowania pakietów ani budowania. Można użyć dowolnego serwera statycznego. Należy serwować pliki przez HTTP, ponieważ JavaScript korzysta z modułów.

## Testy

Wymagany Node.js 24 (testy silnika nie mają zależności):

```sh
npm test
```

Test przeglądarkowy wymaga Playwright, Chromium i działającego serwera na porcie 8000:

```sh
npm ci --cache /tmp/jatka-npm-cache
npm run test:browser
```

Domyślny Chromium: `/usr/bin/chromium`; można ustawić `CHROMIUM_PATH`. Test sprawdza pełną animowaną walkę, zmiany zdrowia, rewanż, pominięcie animacji, edycję, reset, instrukcję i widok mobilny. Zrzuty zapisuje w `/tmp/jatka-*.png`. Przełącznik `--no-sandbox` w teście jest przeznaczony dla izolowanego kontenera.

## Losowanie i długość gry

Każdy gracz otrzymuje osobną ofertę: 5 różnych cech z puli 20 w każdej z 8 kategorii. Wybór cechy nie losuje pozostałych. „Losuj nowe opcje” odświeża całą ofertę bieżącego gracza i wybiera pierwszą z nowych propozycji. Edycja zachowuje oferty i wybrane cechy; nowi wojownicy otrzymują nowe oferty. Rewanż zachowuje postacie.

Długość jest wspólna dla obu wojowników: **krótka — 65% HP**, **średnia — 100% HP**, **długa — 160% HP**. Mnożnik jest stosowany po bonusach cech, z zaokrągleniem do całego punktu. Pozostałe statystyki i tempo animacji pozostają takie same. Zmiana długości aktualizuje także zatwierdzonego wojownika; podczas walki ustawienie jest zablokowane.

W katalogu jest 160 nazwanych cech. Dodatkowe umiejętności korzystają z czterech niemagicznych mechanik aktywnych (mocne uderzenie, osłabienie kolejnego ataku, precyzyjny cios, regeneracja sił), z równą siłą wariantów w obrębie każdej mechaniki, bez dodatkowych bonusów pasywnych. Nie każda nazwa oznacza osobny system walki.

## Zasady walki

Cechy modyfikują zdrowie, atak, obronę, szybkość, celność, kondycję i przebicie pancerza. Szybkość wpływa na inicjatywę i uniki. Kondycja spada z każdym atakiem; zmęczenie osłabia obrażenia. Umiejętność specjalna uruchamia się co czwarty własny atak. Rozbrojenie osłabia kolejny atak rywala, a precyzyjny cios zawsze trafia i częściowo omija pancerz. Mechanika jest niemagiczna; utrata HP oznacza zdolność do dalszej walki.

Wygrywa postać, która sprowadzi HP rywala do zera. Po 160 wymianach decyduje pozostały procent HP; remis rozstrzyga inicjatywa. Symulacja jest niezależna od animacji i przyjmuje generator losowy do powtarzalnych testów. Gra nie używa AI ani backendu: opisy są składane lokalnie z faktycznych wydarzeń.

Balans jest wstępny: testy sprawdzają równe szanse identycznych postaci i poprawność wielu zestawów, ale nie dowodzą równowagi wszystkich kombinacji. Następny etap to strojenie cech po testach z graczami.

## GitHub Pages

Workflow `.github/workflows/pages.yml` uruchamia testy i publikuje wyłącznie pliki gry i lokalne tekstury SVG po pushu do `master`. W repozytorium w **Settings → Pages → Build and deployment → Source** wybierz **GitHub Actions**. Jeśli pierwszy workflow uruchomił się przed włączeniem Pages, uruchom go ponownie w **Actions → Test and publish game → Run workflow**. Adres witryny po udanym wdrożeniu: https://yellowbirdy.github.io/jatka-ai/ .

## Balans umiejętności

Rozbrojenie osłabia tylko następny atak rywala o 12 siły (poprzednio 7), pod warunkiem trafienia. Warianty o tej samej mechanice mają identyczną siłę, bez darmowych bonusów pasywnych. Szczegóły widoczne na kartach pochodzą z `abilityRules`, z którego korzysta też silnik.

`npm run balance` wykonuje 547 200 deterministycznych walk: 20 umiejętności, wszystkie pary, 40 losowych zestawów pozostałych cech, 12 ziaren walki, obie strony i trzy długości. Porównujemy identyczne zestawy różniące się umiejętnością, aby oddzielić jej wpływ od przewagi ekwipunku. Test regresji używa osobnej próby 24 zestawów i 8 ziaren. Raport w `docs/balans-umiejetnosci.md` nie gwarantuje równowagi każdego możliwego zestawu.
