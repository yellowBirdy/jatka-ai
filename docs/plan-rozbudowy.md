# Plan: losowane cechy i długość gry

1. Najpierw testy: po 20 unikalnych cech w 8 kategoriach; losowanie 5 bez powtórzeń, bez mutacji katalogu, powtarzalne z ziarnem. Trzy długości skalują końcowe HP obu graczy, zachowując bonusy cech. Testy wszystkich nowych cech i ukończenia walki.
2. Rozbudować katalog do 160 opcji. Nowe umiejętności pozostają niemagiczne i mają faktyczny wpływ na silnik.
3. Losować osobną ofertę dla każdego gracza. Zmiana wyboru i edycja zachowują ofertę. Przycisk nowej oferty losuje ponownie 5 opcji w każdym slocie; nowa gra losuje obie oferty; rewanż zachowuje zestawy.
4. Dodać wspólny wybór długości: krótka (65% HP), średnia (100%, domyślna), długa (160%). Ustawienie dotyczy obu graczy, również już zatwierdzonego. Nie zmienia siły, prędkości animacji ani innych statystyk. Podczas walki zablokowane.
5. Testy przeglądarkowe: 5 ofert na slot, zachowanie wyborów, ponowne losowanie, HP obu graczy, blokada ustawień, walka, rewanż, mobile. Publikacja przez push na master i istniejący GitHub Actions Pages; sprawdzić API/stronę, jeśli dostępne.
