# JATKA — Arena wojowników

Lokalna gra dla dwóch osób przy jednym ekranie. Każdy wybiera imię i po jednej cesze w ośmiu kategoriach (po cztery opcje). Potem oglądacie automatyczny pojedynek i opis oparty na zdarzeniach walki. Dostępne są rewanż, edycja postaci i rozpoczęcie od nowa. Interfejs po polsku, responsywne postacie SVG, bez zewnętrznych obrazów, fontów i usług.

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

## Zasady pierwszej wersji

Cechy modyfikują zdrowie, atak, obronę, szybkość, celność, kondycję i przebicie pancerza. Szybkość wpływa na inicjatywę i uniki. Kondycja spada z każdym atakiem; zmęczenie osłabia obrażenia. Umiejętność specjalna uruchamia się co czwarty własny atak. Rozbrojenie osłabia kolejny atak rywala, a precyzyjny cios zawsze trafia i częściowo omija pancerz. Mechanika jest niemagiczna; utrata HP oznacza zdolność do dalszej walki.

Wygrywa postać, która sprowadzi HP rywala do zera. Po 160 wymianach decyduje pozostały procent HP; remis rozstrzyga inicjatywa. Symulacja jest niezależna od animacji i przyjmuje generator losowy do powtarzalnych testów. Gra nie używa AI ani backendu: opisy są składane lokalnie z faktycznych wydarzeń.

Balans jest wstępny: testy sprawdzają równe szanse identycznych postaci i poprawność wielu zestawów, ale nie dowodzą równowagi wszystkich kombinacji. Następny etap to strojenie cech po testach z graczami.

## GitHub Pages

Workflow `.github/workflows/pages.yml` uruchamia testy i publikuje wyłącznie cztery pliki gry po pushu do `master`. W repozytorium w **Settings → Pages → Build and deployment → Source** wybierz **GitHub Actions**. Jeśli pierwszy workflow uruchomił się przed włączeniem Pages, uruchom go ponownie w **Actions → Test and publish game → Run workflow**. Adres witryny po udanym wdrożeniu: https://yellowbirdy.github.io/jatka-ai/ .
