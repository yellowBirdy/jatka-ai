// Each entry has its own mechanic. Values also generate the card description.
export const abilityRules={
 rage:{power:9,description:'Co czwarty atak: +9 siły przy trafieniu.'},
 disarm:{penalty:12,description:'Co czwarty celny atak: −12 siły następnego ciosu rywala.'},
 precise:{pierce:10,description:'Co czwarty atak: pewne trafienie i pominięcie 10 obrony.'},
 breath:{heal:8,energy:15,description:'Co czwarty atak: odzyskuje do 8 HP i 15 kondycji.'},
 charge:{power:12,exposure:6,description:'Co czwarty atak: +12 siły, ale następny cios rywala pomija 6 obrony.'},
 overhead:{power:4,accuracy:-.15,description:'Co czwarty atak: ignoruje cały pancerz, +4 siły, −15 pkt proc. celności.'},
 shoulder:{drain:22,power:5,description:'Co czwarty atak po trafieniu: +5 siły i odebranie rywalowi 22 kondycji.'},
 combo:{ratio:.6,description:'Co czwarty atak: dodatkowy cios z 60% siły, z osobnym testem trafienia i pancerza.'},
 'wrist-lock':{counter:9,description:'Co czwarty celny atak przygotowuje kontrę: najbliższe nieśmiertelne trafienie rywala wywołuje ripostę za 9 HP.'},
 'weapon-hook':{pierce:12,duration:2,description:'Co czwarty celny atak: dwa kolejne ataki pomijają 12 obrony rywala.'},
 sand:{accuracy:.25,duration:2,description:'Co czwarty celny atak: −25 pkt proc. celności dwóch następnych ataków rywala.'},
 pommel:{ratio:.45,description:'Co czwarty celny atak: następny atak rywala zadaje tylko 45% obrażeń.'},
 gap:{break:3,cap:9,description:'Co czwarty celny atak: trwale niszczy 3 obrony rywala, do 9 w całej walce.'},
 lunge:{power:8,speedRatio:.7,cap:15,description:'Co czwarty atak: +8 siły oraz 0,7 za każdy punkt przewagi szybkości (łącznie do +15).'},
 'feint-strike':{ratio:.8,focus:.3,description:'Co czwarty atak: po chybieniu pewna poprawka z 80% obrażeń; po trafieniu +30 pkt proc. celności następnego ataku.'},
 'low-cut':{slow:4,cap:12,power:4,description:'Co czwarty celny atak: +4 siły i trwałe odjęcie 4 szybkości rywala, do 12 w całej walce.'},
 breathing:{energy:38,power:6,description:'Co czwarty atak: odzyskuje 38 kondycji przed ciosem, usuwając zmęczenie tego ataku. Cios ma +6 siły. Nie leczy.'},
 rally:{heal:12,threshold:.5,description:'Co czwarty atak: odzyskuje do 12 HP, wyłącznie gdy ma mniej niż połowę zdrowia.'},
 'reset-stance':{shield:9,description:'Co czwarty atak: osłona pochłania do 9 obrażeń najbliższego trafienia (bez kumulacji).'},
 pace:{duration:2,accuracy:.12,power:3,description:'Co czwarty atak: dwa następne ataki nie zużywają kondycji i mają +3 siły oraz +12 pkt proc. celności.'}
};
for(const rule of Object.values(abilityRules)){
 rule.chance=.25;
 const effect=rule.description.replace(/^Co czwarty celny atak:/,'Po trafieniu:').replace(/^Co czwarty celny atak /,'Trafienie ').replace(/^Co czwarty atak po trafieniu:/,'Po trafieniu:').replace(/^Co czwarty atak: /,'');
 rule.description=`${Math.round(rule.chance*100)}% szans na aktywację przy każdym własnym ataku. ${effect}`;
}
