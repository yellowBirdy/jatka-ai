export const gameModes={classic:{name:'Klasyczny',slots:8},fantasy:{name:'Fantastyczny',slots:10}};
export const fantasySlots=[
 {id:'specialItem',name:'Przedmiot specjalny',icon:'❖',options:[
  {id:'vitality',name:'Amulet żywotności',icon:'♥',stats:{health:14},desc:'+14 bazowego zdrowia; premia skaluje się z długością walki.'},
  {id:'focus-charm',name:'Talizman skupienia',icon:'◎',stats:{accuracy:8},desc:'+8 celności wszystkich ataków bronią.'},
  {id:'swift-boots',name:'Buty wędrowca',icon:'➶',stats:{speed:4},desc:'+4 szybkości: lepsza inicjatywa i uniki.'},
  {id:'war-banner',name:'Sztandar wytrwałości',icon:'⚑',stats:{stamina:20},desc:'+20 kondycji: późniejsze zmęczenie.'},
  {id:'strength-belt',name:'Pas olbrzyma',icon:'◆',stats:{attack:3},desc:'+3 siły ataków bronią.'}
 ]},
 {id:'magicPower',name:'Moc magiczna',icon:'✧',options:[
  {id:'fire',name:'Płomień',icon:'♨',stats:{},desc:'Co piąty własny atak: podpalenie za 3 HP na początku dwóch następnych ataków rywala. Ogień omija osłony.'},
  {id:'frost',name:'Uścisk lodu',icon:'❄',stats:{},desc:'Co piąty własny atak: −8 szybkości rywala na dwa jego ataki. Efekt nie kumuluje się.'},
  {id:'lightning',name:'Błyskawica',icon:'ϟ',stats:{},desc:'Co piąty własny atak: 8 pewnych obrażeń przez pancerz. Magiczna osłona może je pochłonąć.'},
  {id:'healing',name:'Odnowa',icon:'✚',stats:{},desc:'Co piąty własny atak: odzyskanie do 12 HP, bez przekraczania maksimum.'},
  {id:'earth',name:'Kamienna aura',icon:'⬡',stats:{},desc:'Co piąty własny atak: osłona pochłania do 8 obrażeń jednego trafienia bronią lub błyskawicą. Nie kumuluje się.'}
 ]}
];
export const fantasyDefaults=Object.fromEntries(fantasySlots.map(slot=>[slot.id,slot.options[0].id]));
export function resolveFantasy(picks){return Object.fromEntries(fantasySlots.map(slot=>{
 const id=picks[slot.id]??fantasyDefaults[slot.id];const item=slot.options.find(o=>o.id===id);
 if(!item)throw Error(`Wybierz: ${slot.name}`);return [slot.id,item];
}));}
