# JATKA — Arena wojowników

Lokalna gra dla dwóch osób przy jednym ekranie. Każdy wybiera imię i po jednej cesze w ośmiu kategoriach (w każdym slocie oferta 5 wylosowanych cech z puli 20). Potem oglądacie automatyczny pojedynek i opis oparty na zdarzeniach walki. Dostępne są rewanż, edycja postaci i rozpoczęcie od nowa. Interfejs po polsku, responsywne postacie SVG, bez zewnętrznych obrazów, fontów i usług.

## Walka anime (V53)

Osobna karta „Walka anime” otwiera pojedynek One Piece. Każdy gracz otrzymuje niezależne oferty 5 owoców z katalogu 168, 5 broni z 20 oraz 5 diali z 19. Wybiera po jednej opcji; ponowne losowanie dotyczy tylko bieżącego gracza. Dial jest wyposażeniem wybranej broni. Dostępne są trzy długości pojedynku, pojedyncze ruchy z atakiem/obroną/odpoczynkiem, automatyczna walka ×1/×2/×3, historia, rewanż i edycja. Ten tryb nie przyznaje ani nie wydaje EXP.

Owoce mają 30% szansy aktywacji, diale 25%, w niezależnych losowaniach po ataku. Efekty są adaptacją do zasad gry: obrażenia, leczenie, osłony, uniki, statusy, kondycja i uszkodzenia ochrony. Karty pokazują dokładne działanie oraz procent. Zdolności nie działają podczas odpoczynku/obrony, po nokaucie ani podczas ogłuszenia. Gomu Gomu i Hito Hito: Nika to jedna opcja; różne modele Zoan są osobnymi opcjami.

Katalog `anime-catalog.js` obejmuje nazwane moce głównej serii i animowanych dodatków/filmów, z oznaczeniem pochodzenia. Nie obejmuje nienazwanych mocy i pozycji wyłącznie z gier. Spis kontrolny `tests/anime-fruit-reference.json` opiera się na publicznym [DevilFruits](https://github.com/conorkenn/DevilFruits/blob/main/fruits.js); sprawdza brak pominięć względem tego starszego katalogu, ale nie stanowi potwierdzenia kompletności wszystkich najnowszych odcinków. Strony referencyjne do dalszej aktualizacji: [Devil Fruit Encyclopedia](https://onepiece.fandom.com/wiki/Devil_Fruit/Devil_Fruit_Encyclopedia) i [Dials](https://onepiece.fandom.com/wiki/Dials). W tej sesji bezpośredni dostęp do wiki był zablokowany.

## Armie i Totalna miazga (V51)

Karta „Armie” uruchamia rekrutację dwóch oddziałów. Obaj gracze dostają ten sam budżet: 500, 800 lub 1200 punktów, maksymalnie 12 żołnierzy. Osobna karta „Totalna miazga” uruchamia bitwę z **10 000 punktów rekrutacji na stronę i bez niezależnego limitu liczby żołnierzy** — liczebność ogranicza wyłącznie budżet. To nie jest EXP profilu; rekrutacja nie wydaje ani nie przyznaje EXP.

Jednostki wybiera się z czterech osobnych kategorii: **1. Strzelcy, 2. Kawaleria, 3. Piechota, 4. Magowie**. Każda ma 20 unikalnych typów (80 łącznie), a każdy gracz dostaje własne 5 losowych propozycji z każdej kategorii. Automatyczna rekrutacja korzysta tylko z tych ofert. Oferta zachowuje się przy edycji; ponowne losowanie zmienia oferty i usuwa skład tylko bieżącej armii. Przyklejony do górnej krawędzi licznik pokazuje pozostałe punkty, wydane punkty i liczebność również po przewinięciu listy.

Każdy z 80 typów ma własny rzeczywisty profil walki, nie tylko inną nazwę. Kawaleria używa 20 różnych gatunków wierzchowców, magowie mają 20 różnych mocy z istniejącego katalogu, a strzelcy oraz piechota autorskie zestawy uzbrojenia, umiejętności i premii. Opisy wyposażenia są składane z faktycznego katalogu jednostki. Karty pokazują bazowe HP, siłę, ochronę, szybkość, celność i przebicie przed premiami całej armii; rozwijane szczegóły podają broń, zbroję, technikę, wierzchowca i moc. Test sprawdza unikalność skutecznych profili, pomijając nazwy, ceny i opisy.

Strzelcy mają łuki lub kusze, premię celności i +8 inicjatywy w pierwszej rundzie. Chroni ich pierwsza linia, ale kawaleria może ich oskrzydlić. Duże bitwy przedstawiają zwykłych żołnierzy kompaktowymi ikonami, zachowując osobne HP i pełne uczestnictwo każdej jednostki; magiczne bestie nadal mają pełny portret.

Dodatkowo każda armia wybiera taktykę, pochodzenie i jedną magiczną bestię. Każda z tych trzech kategorii ma pulę 20 opcji i własną ofertę 5. Taktyka ustala sposób ataku i premiuje statystyki armii; pochodzenie daje niezależne premie. Magiczna bestia ma własne HP, inicjatywę, umiejętność gatunku i moc magiczną. Jest dodatkową jednostką bez kosztu rekrutacji, poza limitem 12 żołnierzy. Jeźdźcy nadal mają zwykłe wierzchowce. Nowe losowanie odświeża wszystkie cztery oferty tylko bieżącej armii i resetuje jej skład. Rewanż i edycja zachowują wybrane cechy.

Każda jednostka korzysta z istniejącego silnika walki, własnego HP, kondycji, broni i umiejętności. Pierwsza linia chroni wsparcie, kawaleria omija ją i atakuje magów. Kolejność każdej rundy wynika z szybkości i losowania; każda żywa jednostka wykonuje jeden ruch w rundzie. Taktyka jest wybierana dla całej armii, a wyczerpane jednostki odpoczywają. Wygrywa armia, która wyeliminuje przeciwników. Przy limicie 160 ruchów na jednostkę decyduje średni procent pozostałego HP.

Mniej liczna żywa armia otrzymuje premię do inicjatywy każdego członka: `6 × (liczebność przeciwnika − własna liczebność) / liczebność przeciwnika`, maksymalnie +6. Liczą się wszystkie żywe postacie, w tym magiczna bestia. Równe oraz liczniejsze armie nie otrzymują tej premii. Kolejność nadal uwzględnia szybkość, losowanie i premię otwarcia strzelców. Liczebność i premia są przeliczane na początku każdej rundy; straty nie przebudowują już rozpoczętej kolejki. Nad polem bitwy widnieje rzeczywiście zastosowana premia danej rundy. Statystyka szybkości nie jest zmieniana.

Bitwę można oglądać automatycznie z prędkością ×1/×2/×3, rozgrywać krokami lub przewinąć do końca. Dostępne są historia walki, rewanż z pełnym zdrowiem i edycja obu składów. „Zwykła arena” wraca do poprzedniego wojownika bez resetowania profili i EXP.

## Balans bestii i Obsydianowy Kolos (V45)

Tygrys szablozębny, gryf i smok skalny nadal przewyższają zwykłe bestie, ale mają niższe premie bojowe oraz słabsze umiejętności podstawowe. Smok skalny jest cięższym, mniej zwinnym wierzchowcem z kosztem kondycji. Szansa uruchomienia umiejętności pozostaje 25%. Najsilniejsze legendarne smoki zachowują swoje premie.

`npm run balance:beasts` porównuje trzy bestie z tygrysem, lwem, nosorożcem, panterą i mamutem: 12 wspólnych zestawów, rotacja pięciu zbroi i pięciu umiejętności, trzy długości walki, cztery ziarna losowe i obie kolejności postaci. W 4320 takich walkach częstość zwycięstw zmieniła się: szablozębny 96,9% → 84,6%, gryf 99,2% → 88,3%, smok skalny 99,8% → 88,3%. To porównanie testowych zestawów, nie gwarancja wyniku każdej rozgrywki.

Legendarny skin smoka skalnego nosi nazwę „Obsydianowy Kolos”. Zmienia sylwetkę, grzbiet, rogi i ogon, dodaje kryształy oraz animowane szczeliny magmy. Nie zmienia statystyk. Identyfikator `drake-skin-midnight` pozostaje ten sam, więc wcześniej zdobyte skiny otrzymują nowy wygląd automatycznie. Animacje respektują ograniczenie ruchu w przeglądarce.

## Profile, EXP i boxy

U góry gry można nazwać cztery lokalne profile, a w kreatorze przypisać profil do każdej postaci. Po walce profil dostaje 60 EXP za wygraną, −40 za porażkę (minimum 0 EXP na profilu) lub 40 za remis, raz na walkę również przy kilku postaciach tego samego profilu. Za wygraną w rewanżu nagroda wynosi 30 EXP. Goście i boty nie dostają EXP.

W kreatorze można otworzyć box za 100 EXP. Pula zawiera 20 zbroi, od zwykłej (30%) do legendarnej (1%). Pełne szanse i statystyki są widoczne w grze. Zdobyta zbroja dołącza do standardowej puli zbroi profilu, z której losuje się 5 ofert w zwykłym slocie Zbroja. Duplikat zwraca 25 EXP. Postęp i nazwy zapisują się w localStorage tej przeglądarki, bez logowania i synchronizacji między urządzeniami. Zmiana nazwy profilu zachowuje jego postęp.

Lekkie zbroje premiują szybkość (Płaszcz zwiadowcy: 1 ochrony, +6 szybkości), ciężkie ją obniżają. Premie zbroi z boxów nie przekraczają 18 ochrony, 30 HP i 4 siły. 15 lepszych zbroi z boxów ma własne zdolności, opisane na kartach. Aktywują się co 4 lub 5 własny atak; Ostatnia nadzieja działa raz przy maksymalnie 35% HP. Odpoczynek i obrona nie nabijają licznika. Działanie zdolności zapisuje się w historii walki.

Panel „Mam kod” u góry profili pozwala odebrać nagrodę na wybrany profil. Kod `cheat` przyznaje 1000 EXP jednorazowo na profil; wykorzystanie zapisuje się wraz z postępem.

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

Katalog klasyczny ma 160 nazwanych cech, a tryb fantastyczny dodaje 40 kolejnych. Każda z 20 specjalnych umiejętności ma własny efekt: od kontry i uszkadzania pancerza po odbieranie kondycji, spowalnianie, dwucios, warunkowe leczenie i oszczędzanie sił. Opis karty jest zgodny z regułą w `abilities.js`, a faktyczne skutki są widoczne w dzienniku walki.

## Zasady walki

Cechy modyfikują zdrowie, atak, obronę, szybkość, celność, kondycję i przebicie pancerza. Szybkość wpływa na inicjatywę i uniki. Kondycja spada z każdym atakiem; zmęczenie osłabia obrażenia. Umiejętność specjalna ma 25% szans aktywacji przy każdym własnym ataku. Rozbrojenie osłabia kolejny atak rywala, a precyzyjny cios zawsze trafia i częściowo omija pancerz. Tryb klasyczny jest niemagiczny; utrata HP oznacza zdolność do dalszej walki.

Wygrywa postać, która sprowadzi HP rywala do zera. Po 160 wymianach decyduje pozostały procent HP; remis rozstrzyga inicjatywa. Symulacja jest niezależna od animacji i przyjmuje generator losowy do powtarzalnych testów. Gra nie używa AI ani backendu: opisy są składane lokalnie z faktycznych wydarzeń.

Balans jest wstępny: testy sprawdzają równe szanse identycznych postaci i poprawność wielu zestawów, ale nie dowodzą równowagi wszystkich kombinacji. Następny etap to strojenie cech po testach z graczami.

## GitHub Pages

Workflow `.github/workflows/pages.yml` uruchamia testy silnika oraz wszystkie szesnaście zestawów testów przeglądarkowych przed publikacją. Dopiero gdy przejdą, publikuje pliki gry i lokalne tekstury SVG po pushu do `master`. W repozytorium w **Settings → Pages → Build and deployment → Source** wybierz **GitHub Actions**. Jeśli pierwszy workflow uruchomił się przed włączeniem Pages, uruchom go ponownie w **Actions → Test and publish game → Run workflow**. Adres witryny po udanym wdrożeniu: https://yellowbirdy.github.io/jatka-ai/ .

## Balans umiejętności

Każda umiejętność ma 25% szans na aktywację przy każdym własnym ataku. Warunki trafienia, czasy trwania, limity trwałych osłabień i zakaz leczenia po śmiertelnej kontrze mają osobne testy. Test porównuje też przebiegi walki wszystkich 20 umiejętności, aby zmiana samego opisu nie mogła udawać unikalnej mechaniki.

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

## Tryb fantastyczny

Przełącznik nad kreatorem wybiera wspólny dla obu wojowników tryb: **Klasyczny** (8 cech, bez magii) albo **Fantastyczny** (10 cech). W fantastycznym dochodzą dwa sloty, każdy z pulą 20 opcji. Dla każdego gracza losowanych jest po 5 różnych propozycji. Przykłady:

- Przedmiot specjalny: amulet żywotności (+14 bazowego HP), talizman skupienia (+8 celności), buty wędrowca (+4 szybkości), sztandar wytrwałości (+20 kondycji), pas olbrzyma (+3 siły).
- Moc magiczna: płomień (podpalenie na dwa ataki), uścisk lodu (tymczasowe spowolnienie), błyskawica (obrażenia przez pancerz), odnowa (leczenie), kamienna aura (jednorazowa osłona).

Magia jest losowana po każdym własnym ataku, jeśli obaj wojownicy nadal żyją: płomień 25%, uścisk lodu 30%, błyskawica 20%, odnowa 15%, kamienna aura 20%. Umiejętność niemagiczna ma osobne 25% szans przy każdym ataku. Wyniki są niezależne i oba efekty mogą zadziałać jednocześnie, nawet w pierwszym ataku. Nie ma cyklu ani gwarancji aktywacji po określonej liczbie ataków. Leczenie nie przekracza maksimum i nie wskrzesza. Magiczna osłona działa przeciw broni i błyskawicy, ale podpalenie ją omija. Podpalenie i zamrożenie odświeżają czas działania zamiast się kumulować. Szczegóły są na kartach i w dzienniku walki.

Zmiana trybu przelicza statystyki obu wojowników. Klasyczny ignoruje premie i moce z dodatkowych slotów. Powrót do fantastycznego, edycja i rewanż zachowują wcześniejsze wybory. W trakcie walki przełącznik trybu jest zablokowany. Fioletowa aura i znak przedmiotu odróżniają postacie fantastyczne.

## Procentowe aktywacje

Procent na karcie jest szansą uruchomienia efektu, a nie gwarancją trafienia: rozbrojenie i podobne efekty nadal wymagają trafienia po udanym losowaniu. Przedmioty specjalne dają stałe premie; ich działanie nie jest losowane. Testy obejmują progi 0%/100%, niezależne losowania, jednoczesną aktywację, brak cyklicznego wyzwalania i częstości z 10 000 ataków. Losowość wciąż może być odtwarzana przez ziarno w symulacjach.

## Losowane pule fantastyczne

Przedmiot specjalny i moc magiczna mają osobne pule po 20 opcji. Oferty po 5 są losowane niezależnie dla każdego gracza, bez powtórzeń w slocie. Wybór opcji ani zmiana trybu nie losują ponownie oferty. Edycja i rewanż zachowują ofertę oraz wybory. „Losuj nowe opcje” odświeża wszystkie oferty bieżącego gracza, a nowi wojownicy otrzymują nowe oferty. Losowanie nie zmienia oferty drugiego gracza. Materiały zachowują dotychczasowe zasady zgodności z bronią.

Nowe moce obejmują kradzież życia, ciszę, oczyszczenie, odzyskiwanie kondycji, meteor, korzenie, ciernie, trwałą pulę bariery, piętno, migotanie, runiczny okrzyk, rozproszenie, pochłanianie kondycji, grom i mgłę. Wszystkie mają opis efektu i szansę aktywacji (10–30%). Nowe przedmioty dają różne zestawy premii i kosztów statystyk.

Testy obejmują wszystkie 400 zestawów przedmiotu i mocy w trzech długościach, unikalność efektów, ograniczenia zasobów, czas działania stanów, losowanie i zachowanie ofert w przeglądarce. GitHub Actions testuje gałąź `development`; publikacja Pages uruchamia się wyłącznie z `master`.

## Walka drużynowa 2 na 2

Wybierz **2 na 2** nad kreatorem. Tworzysz kolejno dwóch wojowników drużyny A i dwóch drużyny B; każdy otrzymuje własną ofertę cech. Format działa w trybie klasycznym i fantastycznym oraz we wszystkich długościach. Zmiana formatu rozpoczyna tworzenie nowych postaci.

Po rozpoczęciu walki wybierz **atakującego** i **cel ataku** z list lub przyciskami przy postaciach, a następnie kliknij **Atakuj**. Drużyny ruszają się na zmianę; inicjatywa zależy od ich łącznej szybkości. Każdy żywy sojusznik musi wykonać ruch, zanim ta sama postać zaatakuje ponownie. Samotny ocalały może atakować w każdej turze swojej drużyny. Nie można atakować sojuszników ani pokonanych. Efekty umiejętności i magii pozostają przypisane do konkretnej postaci także po zmianie celu; wybór postaci pokonanej przez podpalenie zużywa turę.

Wygrywa drużyna, która pokona obu rywali. Po 320 turach decyduje suma pozostałych procentów HP jej członków; identyczny wynik daje remis. Historia zapisuje rzeczywistych atakujących i cele. Rewanż zachowuje cztery postacie i przywraca ich pełne zdrowie. Podczas walki format, tryb i długość są zablokowane.

Testy drużynowe obejmują dozwolone i zabronione cele, kolejność ruchów, śmierć od podpalenia, przenoszenie stanów między turami, zakończenie, remis oraz serie walk w obu trybach. Test przeglądarkowy sprawdza tworzenie czterech postaci, wybór kartami, zmianę HP wskazanego celu, widok mobilny, rewanż i powrót do 1 na 1.

## Interaktywny samouczek

Przycisk **Samouczek ▷** w nagłówku uruchamia przewodnik na bieżącym ekranie. Podświetla prawdziwe elementy gry i reaguje na wybór imienia, broni, materiału i umiejętności. W trybie fantastycznym obejmuje też przedmiot i moc, a w 2 na 2 prowadzi przez wybór atakującego, celu oraz pierwszy atak. Kolejne etapy to przygotowanie pozostałych postaci, walka i wynik. Ustawienia potwierdzasz przyciskiem „Dalej”; pozostałe kroki przechodzą po wykonaniu wskazanej akcji.

Przewodnik można uruchomić także na arenie lub po zakończeniu walki. „Zamknij ×” oraz Escape wyłączają wskazówki bez resetowania postaci, ofert, ustawień i trwającej walki. Samouczek działa z klawiaturą i na telefonie; nie uruchamia się automatycznie.

Test przeglądarkowy przechodzi przez pełny samouczek pojedynku, dodatkowe sloty fantastyczne i pierwszą turę drużynową. Sprawdza też zamknięcie, ponowne uruchomienie, zachowanie wyborów i szerokość mobilną.

## Modyfikacja: Wierzchowce

W sekcji **Modyfikacje gry** zaznacz **Wierzchowce**. Jest to opcja wspólna dla wszystkich wojowników, niezależna od formatu 1 na 1 / 2 na 2 oraz trybu klasycznego / fantastycznego. Każdy wojownik wybiera własną bestię spośród pięciu losowych propozycji z puli dwudziestu. Pod nią jest **Zbroja bestii**: bez zbroi, skórzana, kolczuga, łuskowa lub płytowa.

Bestia i jeździec walczą jako jedna postać ze wspólnym HP. Opisy pokazują dokładne premie i koszty; bonusy bestii i zbroi sumują się z pozostałymi statystykami przed skalowaniem HP przez długość gry. Ciężka zbroja daje więcej ochrony kosztem szybkości i kondycji. Bestia nie wykonuje osobnego ataku ani nie ma osobnego paska zdrowia. W 2 na 2 wybierasz cel dla całej postaci.

Podgląd i arena pokazują jeźdźca na bestii, z różnymi sylwetkami zwierząt i widocznym opancerzeniem. Wyłączenie modyfikacji usuwa premie i przywraca wygląd pieszego wojownika, zachowując wcześniejsze wybory do ponownego włączenia. Rewanż i edycja zachowują wybory oraz oferty. Losowanie odświeża ofertę bestii bieżącej postaci i zachowuje jej zbroję. Nowi wojownicy dostają nowe oferty i zaczynają bez zbroi bestii. Podczas walki modyfikacja jest zablokowana. Samouczek obejmuje oba nowe wybory.

Testy sprawdzają 300 zestawów bestia × zbroja × długość, wszystkie kombinacje w walkach klasycznych i fantastycznych, walkę drużynową, zachowanie wyborów, wyłączenie premii oraz przejście przez interfejs z widokiem mobilnym i samouczkiem.

## Zbroje i wyjątkowe umiejętności bestii

Każda z 20 bestii ma cztery własne zbroje i opcję „Bez zbroi”. To 80 nazwanych, dopasowanych pancerzy z indywidualnymi premiami do HP oraz zdobieniami na podglądzie. Podpunkt **1. Zbroja bestii** aktualizuje się po zmianie zwierzęcia. Zachowuje poziom pancerza, np. płytowy, ale wybiera model nowej bestii. Silnik odrzuca zbroję przypisaną innemu zwierzęciu.

Podpunkt **2. Umiejętność bestii** pozwala wybrać dokładnie jedną z pięciu zdolności własnych bestii. Każda ma niezależne 25% szans aktywacji po własnym ataku, jeśli jeździec i cel nadal żyją. Nie zużywa dodatkowej tury. Nie można przypisać bestii zdolności innego zwierzęcia. Zmiana bestii wybiera pierwszą zdolność nowego zwierzęcia. Rewanż, edycja i wyłączenie modyfikacji zachowują wybory.

Zdolności mają różne skutki: koń wspiera tempo, wilk dobija osłabiony cel, dzik uszkadza pancerz, niedźwiedź leczy się warunkowo i osłania, nosorożec przebija, tygrys wykonuje dwa ciosy, lew odbiera kondycję i blokuje zdolność jeźdźca, łoś odsłania gardę, mamut tworzy barierę, waran zatruwa, struś przygotowuje unik, wielbłąd regeneruje kondycję i usuwa piasek, żubr osłania i kontruje, bawół naciera i męczy, hiena przejmuje kondycję i leczy, jeleń usuwa spowolnienie i zwiększa celność, pantera oznacza i uderza, niedźwiedź polarny osłabia i spowalnia, jak usuwa zimno i korzenie oraz osłania, a krokodyl zwiększa koszty ataków rywala i męczy go.

Dodatkowe ciosy ignorują pancerz, lecz korzystają z istniejących osłon i kontr. Jad warana trwa dwa ataki celu, zadaje po 3 HP przez osłony i może zakończyć walkę przed atakiem zatrutej postaci. Oczyszczenie usuwa także jad. W 2 na 2 wszystkie efekty są przypisane do faktycznie wybranego celu. Aktywacje są opisane jako „Bestia” w komentarzu i historii. Testy porównują rzeczywiste zmiany stanu oraz dodatkowe ciosy wszystkich 20 zdolności, ich niezależność od magii, śmiertelne kontry, dopasowanie zbroi i przebieg w przeglądarce.

Włączone Wierzchowce dają dodatkowo **+10 obrażeń na każde celne trafienie bronią jeźdźca**, także każdy cios serii. Bonus jest dodawany po obliczeniu obrażeń i zmęczenia, przed osłonami; nie zwiększa obrażeń magii, jadu, kontr ani dodatkowych ciosów zdolności bestii. Chybienie nie zadaje obrażeń. Wyłączenie modyfikacji usuwa bonus.

## Pięć umiejętności na wierzchowca

Każda z 20 bestii ma stały zestaw 5 własnych umiejętności: łącznie 100 nazwanych wyborów. Wszystkie pięć jest widoczne jednocześnie, bez dodatkowego losowania. Gracz wybiera dokładnie jedną; każda ma 25% szans aktywacji. Dotychczasowa zdolność pozostaje pierwszą propozycją, a cztery nowe dają alternatywy ofensywne, obronne i wspierające z opisanymi wartościami efektów.

Edycja, rewanż, zmiana długości lub trybu oraz wyłączenie i ponowne włączenie Wierzchowców zachowują wybór. Zmiana bestii dopasowuje listę i wybiera jej pierwszą zdolność. Losowanie oferty również wybiera domyślną zdolność wylosowanej bestii. W walce uruchamia się wyłącznie wybrana umiejętność; premia +10 obrażeń bronią pozostaje niezależna.

Testy obejmują komplet 100 wyborów, odrzucenie cudzych zdolności, zachowanie wyboru, aktywacje i zakończenie walk w obu trybach. Test przeglądarkowy sprawdza pięć kart, pojedynczy wybór, przełączanie, edycję i historię walki.

U góry gry znajduje się tabela siedmiu statystyk z liczbowymi przelicznikami oraz rozwijanymi przykładami trafienia, obrażeń, zmęczenia, inicjatywy i wpływu wierzchowców. Na telefonie szeroką tabelę można przewijać poziomo.

## Taktyki i animacje bestii

W 1 na 1 każda postać wybiera przed walką stałą taktykę na karcie areny: zrównoważoną, agresywną lub ostrożną. W 2 na 2 wybierasz taktykę przed każdym ruchem; dostępny jest również odpoczynek. Agresywna daje +5 siły i −4 ochrony do kolejnego własnego ruchu tej postaci. Ostrożna daje −3 siły i +15 pkt proc. celności (z końcowym limitem 99%). Zrównoważona zachowuje zwykłe reguły. Odpoczynek zużywa turę i miejsce w kolejce drużyny, odzyskuje do 21 kondycji, pomija atak oraz losowania wszystkich zdolności i magii. Podpalenie i jad nadal działają przed odpoczynkiem. Po ruchu 2 na 2 wybór taktyki wraca do zrównoważonej. Karty pokazują aktualną kondycję.

Aktywacja umiejętności bestii pokazuje nazwę zdolności na karcie jeźdźca oraz efekt odpowiadający jej działaniu: pazury na przeciwniku, tarczę, leczenie lub energię na własnej postaci, fale kontroli lub jad na wskazanym celu. Efekt odtwarza się przy każdym rzeczywistym wyzwoleniu, a poprzednie oznaczenia są usuwane przy kolejnym ruchu, rewanżu i edycji. Preferencja ograniczonego ruchu wyłącza animację, zachowując symbol i czytelną nazwę. Efekty nie wpływają na wynik walki.

Testy sprawdzają zmiany siły i celności, utratę ochrony, odzyskiwanie kondycji, zużycie tury, śmierć przed odpoczynkiem, zachowanie taktyk na rewanż, animację rzeczywistej aktywacji, czyszczenie efektów, ograniczenie ruchu i widok mobilny.

## Automatyczne 2 na 2 i turowe 1 na 1

Przełącznik **Sposób walki** udostępnia **Automatyczny** i **Turowy** w obu formatach. Domyślnie 1 na 1 jest automatyczne, a 2 na 2 turowe. Zmiana sposobu przed rozpoczęciem walki zachowuje stworzone postacie. W trakcie walki przełącznik jest zablokowany.

W automatycznym 2 na 2 gra losuje dostępnego wojownika i żywego przeciwnika w każdej turze, przestrzegając kolejności drużyn i zasady jednego ruchu każdego żywego sojusznika w cyklu. Walka ma animacje, możliwość pominięcia, wynik drużynowy oraz pełną historię. Rewanż zachowuje sposób walki. Tryb działa także z magią i bestiami.

W turowym 1 na 1 gracze przy wspólnym ekranie wykonują na zmianę po jednej akcji: **Atakuj** wybraną taktyką, **Odpocznij** (do +21 kondycji, bez ataku i losowania zdolności) lub **Broń się**. Obrona nie zadaje obrażeń: do kolejnego własnego ruchu połowi następne trafienie bronią (zaokrąglając pozostałe obrażenia w górę), po czym się zużywa. Dotyczy też premii +10 i dodatkowych ciosów bestii, ale nie magii, jadu ani podpalenia. Działa przed osłonami. Chybienie jej nie zużywa. Obrona nie kumuluje się, nie przywraca kondycji i nie uruchamia zdolności. W 2 na 2 jest także dostępna jako taktyka.

Inicjatywa, obrażenia i limit 160 akcji w pojedynku zachowują istniejące reguły. Po limicie rozstrzyga procent HP, a przy równości inicjator. Jad i podpalenie mogą zakończyć walkę przed wybraną akcją. Oba sposoby obsługują wynik, rewanż i edycję. Testy obejmują przejście tur, obronę, odpoczynek, decyzję po limicie, automatyczne drużyny, magię, bestie, pomijanie animacji i interfejs mobilny.

## Modyfikacja: Hybrydy

Włącz **Hybrydy** w sekcji Modyfikacje gry. Zamiast wojownika tworzysz zwierzę z pięciu części: głowy, tułowia, przednich kończyn, tylnych kończyn i ogona. Dla każdej części wybierasz spośród 10 gatunków: geparda, wilka, niedźwiedzia, lwa, nosorożca, krokodyla, orła, skorpiona, węża i goryla. Możliwe jest 100 000 połączeń, w tym powtarzanie tego samego gatunku. Wszystkie opcje części są dostępne bez losowania.

Każda część wnosi opisane premie i koszty do statystyk, a jej kształt i kolor są widoczne na złożonej sylwetce SVG. Głowa mocniej wpływa na celność i uderzenie, tułów na HP i ochronę, przednie kończyny na siłę, tylne na szybkość, a ogon na równowagę i przebicie. Premie sumują się przed mnożnikiem HP. Hybryda korzysta z naturalnej broni i nie dostaje ukrytych premii wcześniejszych wyborów uzbrojenia, materiałów ani pochodzenia wojownika.

Osobno wybierasz instynkt specjalny z dotychczasowych umiejętności (5 losowych propozycji z puli 20). Tryb fantastyczny nadal dodaje przedmiot i moc. Hybrydy działają w obu formatach oraz automatycznie i turowo, z atakiem, odpoczynkiem, obroną i taktykami. Hybryda jest samodzielną postacią — jej włączenie wyłącza Wierzchowce. Powrót do zwykłych wojowników zachowuje wybory części do kolejnego włączenia. Edycja i rewanż również zachowują budowę, a Losuj nowe opcje wybiera nowe zwierzęta dla wszystkich części bieżącej hybrydy.

Testy obejmują każdą część i gatunek, dokładne statystyki, wyłączenie premii ekwipunku, skalowanie HP, oba tryby i formaty, obie metody walki, edycję, przełączanie, samouczek oraz widok mobilny.

## Tekstury i kolorowy przebieg walki

Hybrydy i wierzchowce mają wzory futra, cętek, łusek, piór lub grubej skóry, zachowując kolor wybranego zwierzęcia. Metal wyposażenia ma nową szczotkowaną teksturę z refleksami, krawędziami i nitami. Każdy portret ma własne identyfikatory wzorów SVG, aby tekstury nie mieszały się między postaciami.

W walce kolor i podpis razem odróżniają obrażenia (czerwone), leczenie (zielone), obronę/unik (niebieskie), kondycję (złote), magię (fioletowe) i bestie (pomarańczowe). Nad postaciami pojawiają się osobne napisy, także przy jednoczesnym leczeniu i otrzymaniu obrażeń. Pod areną są kolorowe komunikaty z imionami oraz legenda. Liczby wynikają z rzeczywistych wydarzeń; nie ma fikcyjnych trafień krytycznych ani premii.

Ataki mają zamach i doskok, trafienia odrzut i smugę uderzenia, uniki zejście, a odpoczynek i obrona poświaty. Podgląd postaci ma łagodny ruch oddechu. Preferencja ograniczonego ruchu wyłącza animacje, zachowując czytelne napisy i symbole. Efekty są sprzątane przed następną akcją, edycją i rewanżem. Testy obejmują treść napisów, tekstury, kolory, reset efektów, bezpieczne wyświetlanie imion i widok mobilny.

Automatyczne 1 na 1 ma przełącznik prędkości **×1 / ×2 / ×3**: odpowiednio 1200 / 600 / 400 ms między akcjami. Domyślne ×1 jest wolniejsze od wcześniejszych 650 ms. Prędkość można zmieniać także w trakcie walki; wybór pozostaje na rewanż. Nie zmienia wyniku symulacji, tempa 2 na 2 ani walk turowych. Preferencja ograniczonego ruchu nadal pokazuje wynik od razu.

## Mocne trafienia i głębsze tekstury

Trafienie jest oznaczone jako mocne, jeśli faktycznie odebrało co najmniej 30 HP albo co najmniej 25% maksymalnego zdrowia celu i minimum 18 HP. Liczą się łączne obrażenia broni i magii danej akcji. To opis siły istniejącego trafienia, bez dodatkowej premii do obrażeń. Pojawia się napis „MOCNE TRAFIENIE”, fala uderzenia i pojedynczy, krótki wstrząs areny. Na telefonie wstrząs jest słabszy, a przy preferencji ograniczonego ruchu nie występuje; napisy pozostają widoczne. Efekt jest czyszczony przed kolejną akcją, rewanżem i edycją.

Animacja ciosu ma wyraźniejszy zamach i doskok, a trafiona postać reaguje odrzutem. Skóra wojownika ma cieniowanie, tkanina nowy splot, a wzory futra, łusek, piór i skóry zwierząt zyskały gradienty oraz mocniejsze szczegóły. Tekstury i wstrząsy nie zmieniają mechaniki walki.

## PvE — gracz kontra bot

W sekcji **Przeciwnik** wybierz **Gracz kontra bot (PvE)**. W 1 na 1 tworzysz tylko swoją postać; w 2 na 2 tworzysz dwóch sojuszników drużyny A. Przeciwników bot dobiera automatycznie z własnych ofert według tych samych zasad i bez dodatkowych premii. Działa z magią, wierzchowcami, hybrydami i każdą długością walki. Zmiana przeciwnika rozpoczyna tworzenie nowych postaci, a PvE domyślnie wybiera walkę turową.

W turach kierujesz swoją stroną. Bot wykonuje swój ruch po krótkiej chwili; panel pokazuje „Bot wybiera ruch…”, a sterowanie przeciwnikiem jest wtedy zablokowane. Odpoczywa przy kondycji poniżej 7, jeśli nie jest na skraju porażki, stara się dobijać osłabione cele, czasem broni się przy niskim HP oraz dobiera agresywną lub ostrożną taktykę. W drużynie wybiera dostępnego wojownika i żywego przeciwnika z najmniejszym pozostałym HP. Nie korzysta z przyszłych losowań walki.

Automatyczny PvE także jest dostępny: w pojedynku Twoja postać stosuje wybraną stałą taktykę, a bot dobiera własne akcje. W automatycznej walce drużynowej obie strony podejmują proste decyzje. To lokalny bot oparty na regułach; gra nie wymaga konta, klucza API ani połączenia z modelem AI.

Rewanż zachowuje przeciwników i Twoje postacie. Edycja pozwala zmienić Twoją stronę, a „Nowi wojownicy” losuje także nowych botów. Timery bota są kasowane przy końcu walki i powrocie do kreatora. Testy obejmują legalne konfiguracje bez ukrytych premii, decyzje, wybór żywych postaci, granice tur, serie PvE w obu formatach i trybach, blokadę przejęcia ruchu bota, wyniki, rewanż, edycję i zachowanie gry lokalnej.



Gra korzysta z klasycznych postaci i wyposażenia SVG oraz prostych kart cech. Ilustrowane menu areny zachowuje ciemny, turkusowy styl.
