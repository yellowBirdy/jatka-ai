# Balans umiejętności specjalnych

Próba: 547 200 walk na wersję, wszystkie pary 20 umiejętności, 40 losowych zestawów bazowych, 12 ziaren walki, zamiana stron i trzy długości. W każdej parze pozostałe cechy są identyczne. Skrypt: `npm run balance`. Test regresji korzysta z innych zestawów (ziarno 19391 zamiast 947).

Zmiany: rozbrojenie −7 → −12 siły następnego ataku po trafieniu; usunięte pasywne premie wariantów, które wcześniej były mocniejsze od podstawowej umiejętności. Szał nadal daje +9 siły, precyzyjny cios gwarantuje trafienie i pomija 10 obrony, drugi oddech odzyskuje do 8 HP i 15 kondycji. Aktywacja co czwarty własny atak.

| Długość | Zakres wygranych przed | Zakres po |
|---|---:|---:|
| Krótka | 44.16–56.73% | 48.44–51.51% |
| Średnia | 42.60–57.37% | 49.29–50.71% |
| Długa | 38.53–57.73% | 49.37–51.54% |

To pomiar zbiorczy, nie gwarancja 50% dla każdej pary i każdej konfiguracji. Dwadzieścia nazw reprezentuje cztery rodziny mechanik; nazwy w tej samej rodzinie nie dostają dodatkowej przewagi. Przewaga konkretnej umiejętności zależy nadal od celności, zbroi, kondycji i długości walki.
