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
const item=(id,name,icon,stats,desc)=>({id,name,icon,stats,desc});
fantasySlots[0].options.push(
 item('iron-ring','Pierścień żelaza','◉',{defense:4,speed:-1},'+4 obrony · −1 szybkości.'),
 item('eagle-lens','Soczewka orła','◈',{accuracy:5,pierce:2},'+5 celności · +2 przebicia.'),
 item('moon-cloak','Płaszcz księżyca','☽',{speed:3,defense:2},'+3 szybkości · +2 obrony.'),
 item('war-gauntlet','Rękawica wojny','✊',{attack:4,stamina:-8},'+4 siły · −8 kondycji.'),
 item('stone-heart','Kamienne serce','⬢',{health:10,defense:2,speed:-1},'+10 bazowego HP · +2 obrony · −1 szybkości.'),
 item('ranger-brooch','Brosza tropiciela','➶',{speed:2,accuracy:4},'+2 szybkości · +4 celności.'),
 item('dragon-tooth','Smoczy kieł','†',{pierce:5,accuracy:-2},'+5 przebicia · −2 celności.'),
 item('travel-flask','Bukłak podróżnika','◒',{stamina:14,health:5},'+14 kondycji · +5 bazowego HP.'),
 item('guard-token','Znak strażnika','⬡',{defense:3,accuracy:2},'+3 obrony · +2 celności.'),
 item('duelist-medal','Medalion pojedynkowicza','⚔',{attack:2,accuracy:3},'+2 siły · +3 celności.'),
 item('wind-feather','Pióro wichru','ϟ',{speed:6,health:-6},'+6 szybkości · −6 bazowego HP.'),
 item('sun-pendant','Wisiorek słońca','☀',{health:8,stamina:10},'+8 bazowego HP · +10 kondycji.'),
 item('crystal-eye','Kryształowe oko','◎',{accuracy:10,defense:-2},'+10 celności · −2 obrony.'),
 item('oak-talisman','Dębowy talizman','♣',{defense:2,stamina:12},'+2 obrony · +12 kondycji.'),
 item('hunter-fang','Kieł łowcy','◆',{attack:2,pierce:3,speed:-1},'+2 siły · +3 przebicia · −1 szybkości.')
);
const spell=(id,name,icon,chance,desc)=>({id,name,icon,chance,stats:{},desc});
fantasySlots[1].options.push(
 spell('life-drain','Kradzież życia','♡',.2,'6 obrażeń przez pancerz; leczy o faktycznie odebrane HP. Magiczna osłona może zatrzymać efekt.'),
 spell('silence','Pieczęć ciszy','⊘',.25,'3 obrażenia przez pancerz i blokada magii na dwa kolejne ataki rywala.'),
 spell('cleanse','Oczyszczenie','✦',.25,'Usuwa podpalenie, zamrożenie, oślepienie, ciszę, korzenie, rozbrojenie i oszołomienie; leczy do 4 HP.'),
 spell('mana','Przypływ energii','≋',.3,'Odzyskuje do 32 kondycji, bez przekraczania maksimum.'),
 spell('meteor','Meteor','☄',.1,'16 obrażeń przez pancerz, ale rzucający traci 4 HP (nie mniej niż do 1 HP). Magiczna osłona może zatrzymać pocisk.'),
 spell('roots','Więzy korzeni','♣',.25,'Dwa kolejne ataki rywala kosztują dodatkowe 10 kondycji; daje rzucającemu 4 punkty jednorazowej magicznej osłony.'),
 spell('thorns','Cierniowa skóra','✧',.25,'Dwa najbliższe nieśmiertelne trafienia bronią wywołują kontrę za 4 HP. Efekt nie kumuluje się.'),
 spell('barrier','Kryształowa bariera','◇',.2,'Pula 12 osłony przed bronią, zużywana stopniowo przez kolejne trafienia. Nie kumuluje się.'),
 spell('mark','Piętno słabości','⊕',.25,'Dwa kolejne celne ciosy bronią w rywala zadają po 3 dodatkowe obrażenia.'),
 spell('blink','Migotanie','↝',.2,'Gwarantowany unik całego następnego ataku bronią, także serii ciosów. Nie chroni przed magią.'),
 spell('battlecry','Runiczny okrzyk','⚑',.25,'Dwa kolejne ataki bronią mają +4 siły. Efekt nie kumuluje się.'),
 spell('dispel','Rozproszenie','✕',.25,'Usuwa osłony, barierę, ciernie i przygotowaną kontrę rywala; zadaje 4 obrażenia przez pancerz.'),
 spell('entropy','Pochłonięcie energii','◔',.25,'Odbiera rywalowi do 20 kondycji i przywraca tyle samo rzucającemu, do jego limitu.'),
 spell('thunder','Grom ogłuszenia','ϟ',.25,'3 obrażenia przez pancerz i blokada specjalnej umiejętności przy następnym ataku rywala.'),
 spell('mist','Zasłona mgły','☁',.3,'Dwa kolejne ataki bronią w rzucającego mają −20 punktów procentowych celności.')
);
export function drawFantasyOptions(random=Math.random){
 return Object.fromEntries(fantasySlots.map(slot=>{
  const pool=[...slot.options];
  for(let i=pool.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}
  return [slot.id,pool.slice(0,5)];
 }));
}
const magicChances={fire:.25,frost:.3,lightning:.2,healing:.15,earth:.2};
for(const power of fantasySlots[1].options){
 power.chance??=magicChances[power.id];
 power.desc=`${Math.round(power.chance*100)}% szans po każdym własnym ataku: ${power.desc.replace('Co piąty własny atak: ','')}`;
}
export const magicRules=Object.fromEntries(fantasySlots[1].options.map(power=>[power.id,power]));
export const fantasyDefaults=Object.fromEntries(fantasySlots.map(slot=>[slot.id,slot.options[0].id]));
export function resolveFantasy(picks){return Object.fromEntries(fantasySlots.map(slot=>{
 const id=picks[slot.id]??fantasyDefaults[slot.id];const item=slot.options.find(o=>o.id===id);
 if(!item)throw Error(`Wybierz: ${slot.name}`);return [slot.id,item];
}));}
