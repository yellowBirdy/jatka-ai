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

W katalogu jest 160 nazwanych cech. Każda z 20 specjalnych umiejętności ma własny efekt: od kontry i uszkadzania pancerza po odbieranie kondycji, spowalnianie, dwucios, warunkowe leczenie i oszczędzanie sił. Opis karty jest zgodny z regułą w `abilities.js`, a faktyczne skutki są widoczne w dzienniku walki.

## Zasady walki

Cechy modyfikują zdrowie, atak, obronę, szybkość, celność, kondycję i przebicie pancerza. Szybkość wpływa na inicjatywę i uniki. Kondycja spada z każdym atakiem; zmęczenie osłabia obrażenia. Umiejętność specjalna uruchamia się co czwarty własny atak. Rozbrojenie osłabia kolejny atak rywala, a precyzyjny cios zawsze trafia i częściowo omija pancerz. Mechanika jest niemagiczna; utrata HP oznacza zdolność do dalszej walki.

Wygrywa postać, która sprowadzi HP rywala do zera. Po 160 wymianach decyduje pozostały procent HP; remis rozstrzyga inicjatywa. Symulacja jest niezależna od animacji i przyjmuje generator losowy do powtarzalnych testów. Gra nie używa AI ani backendu: opisy są składane lokalnie z faktycznych wydarzeń.

Balans jest wstępny: testy sprawdzają równe szanse identycznych postaci i poprawność wielu zestawów, ale nie dowodzą równowagi wszystkich kombinacji. Następny etap to strojenie cech po testach z graczami.

## GitHub Pages

Workflow `.github/workflows/pages.yml` uruchamia testy silnika oraz wszystkie cztery zestawy testów przeglądarkowych przed publikacją. Dopiero gdy przejdą, publikuje pliki gry i lokalne tekstury SVG po pushu do `master`. W repozytorium w **Settings → Pages → Build and deployment → Source** wybierz **GitHub Actions**. Jeśli pierwszy workflow uruchomił się przed włączeniem Pages, uruchom go ponownie w **Actions → Test and publish game → Run workflow**. Adres witryny po udanym wdrożeniu: https://yellowbirdy.github.io/jatka-ai/ .

## Balans umiejętności

Każda umiejętność aktywuje się co czwarty własny atak. Warunki trafienia, czasy trwania, limity trwałych osłabień i zakaz leczenia po śmiertelnej kontrze mają osobne testy. Test porównuje też przebiegi walki wszystkich 20 umiejętności, aby zmiana samego opisu nie mogła udawać unikalnej mechaniki.

`npm run balance` wykonuje 547 200 deterministycznych walk: 20 umiejętności, wszystkie pary, 40 losowych zestawów pozostałych cech, 12 ziaren walki, obie strony i trzy długości. Porównujemy identyczne zestawy różniące się umiejętnością, aby oddzielić jej wpływ od przewagi ekwipunku. Test regresji używa osobnej próby 24 zestawów i 8 ziaren. Raport w `docs/balans-umiejetnosci.md` nie gwarantuje równowagi każdego możliwego zestawu.

## Materiały głównej broni

Pod bronią są dwa podpunkty: **część bojowa (ostrze / głowica)** i **rękojeść / drzewce**. Każdy ma pięć materiałów dopasowanych do rodziny wybranej broni. Opisy pokazują dodatnie i ujemne modyfikatory; oba wybory sumują się ze statystykami wojownika i zmieniają tekstury głównej broni. Kostury i maczugi mają osobny wybór drewnianych rdzeni zamiast metalowych ostrzy. Broń dodatkowa zachowuje swój materiał.

Stal i jesion to domyślne materiały bez premii. Stal hartowana zwiększa siłę i przebicie kosztem szybkości i kondycji; lekka brzoza zwiększa szybkość kosztem siły. Kreator pokazuje teraz także celność, przebicie i kondycję. Losowanie cech oraz zmiana rodzaju broni zachowują pasujące materiały. Niepasujące wybory zastępują neutralne materiały nowego typu broni, a kreator wyświetla komunikat. Każdy gracz wybiera je osobno, edycja i rewanż je zachowują, a nowi wojownicy zaczynają od stali i jesionu albo twardego drewna i jesionu dla kosturów i maczug.

Testy obejmują 25 kombinacji modyfikatorów, ich rzeczywisty wpływ na obrażenia, 500 kombinacji rodzaju broni i materiałów oraz pełne przejście przez wybór, wygląd, statystyki, rewanż, edycję i reset w przeglądarce.

### Materiały według rodzaju broni

| Rodzina | Część bojowa | Chwyt / drzewce |
|---|---|---|
| Miecze, szable, rapiery, koncerze | stal, żelazo, brąz, stal hartowana, stal damasceńska | jesion, orzech, skórzany oplot, kość, len |
| Topory i sierpy | stal, żelazo, stal hartowana, stal damasceńska, krzemień | jesion, dąb, skórzany oplot, hikora, brzoza |
| Włócznie, halabardy, glewie, piki, trójzęby | stal, żelazo, brąz, stal hartowana, kość | jesion, dąb, bambus, brzoza, hikora |
| Młoty, buławy, cepy, nadziaki | stal, żelazo, brąz, stal hartowana, granit | jesion, dąb, żelazo, skórzany oplot, hikora |
| Kostury i maczugi | twarde drewno, drewno wzmacniane, bambus, drewno żelazne, rattan | jesion, skórzany oplot, len, surowa skóra, orzech |

Każdy materiał ma własny opis bonusów i kosztów. Silnik odrzuca niedozwolone kombinacje zamiast potajemnie naliczać ich premie. Testy sprawdzają dostępność dla wszystkich 20 broni oraz komplet 500 legalnych kombinacji.
