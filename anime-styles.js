const powerful=new Set('gomu-gomu uo-uo-seiryu magu-magu gura-gura ope-ope yami-yami soru-soru pika-pika goro-goro hie-hie tori-tori-phoenix hito-hito-daibutsu'.split(' '));
const strong=new Set('mera-mera zushi-zushi mori-mori doku-doku ito-ito jiki-jiki mochi-mochi neko-neko-leopard neko-neko-saber-tiger inu-inu-okuchi-no-makami inu-inu-kyubi-no-kitsune ryu-ryu-allosaurus ryu-ryu-spinosaurus ryu-ryu-pteranodon ryu-ryu-brachiosaurus ryu-ryu-pachycephalosaurus ryu-ryu-triceratops zou-zou-mammoth hebi-hebi-yamata-no-orochi hobi-hobi uta-uta nikyu-nikyu'.split(' '));
const modest=new Set('sube-sube jake-jake fuku-fuku hiso-hiso hito-hito inu-inu-dachshund ushi-ushi-holstein uma-uma-zebra'.split(' '));
export const fruitTier=fruit=>powerful.has(fruit.id)?4:strong.has(fruit.id)?3:modest.has(fruit.id)?0:1;
const names={
 'ope-ope':['K-ROOM — miecz w polu operacji','Rozległy ROOM','Shambles — zamiana miejsc','Counter Shock','Gamma Knife'],
 'uo-uo-seiryu':['Boro Breath','Smocza forma','Podmuchy Kaifu','Hybryda smoka','Płonący smok'],
 'gomu-gomu':['Rozciągliwe pięści','Gear Second','Gear Third','Gear Fourth','Gear Fifth — swobodna walka'],
 'mera-mera':['Hiken — ognista pięść','Ściana płomieni','Ogniste włócznie','Ognisty doskok','Entei — ogniste słońce'],
 'moku-moku':['Biały cios','Dymna zasłona','Dymne więzy','Lot w dymie','Rozległy obłok'],
 'suna-suna':['Pustynne ostrze','Piaskowa osłona','Wysuszenie podłoża','Piaskowy ślizg','Sables — piaskowe tornado'],
 'goro-goro':['El Thor','Piorunowa osłona','Piorunowy paraliż','Przemieszczenie w błyskawicy','Amaru — burzowe ciało'],
 'hie-hie':['Lodowa szabla','Lodowa ściana','Ice Time','Ślizg po lodzie','Ice Age'],
 'yami-yami':['Kurozu — przyciągnięcie','Ciemna osłona','Black Hole','Uwolnienie pochłoniętych przeszkód','Pochłonięcie pola walki'],
 'gura-gura':['Wstrząsowa pięść','Pęknięcie natarcia','Trzęsące się podłoże','Przełamanie przestrzeni','Rozbicie pola walki'],
 'bari-bari':['Barierowa pięść','Pełna bariera','Barierowe więzienie','Schody z bariery','Napierająca bariera'],
 'sube-sube':['Śliskie natarcie','Ześlizgnięcie ciosu','Wytrącenie równowagi','Ślizg na stopach','Nieuchwytny taniec'],
 'ito-ito':['Nici tnące','Sieć ochronna','Pasożytnicze nici','Podniebna droga','Przebudzone nici'],
 'tori-tori-phoenix':['Szpony feniksa','Błękitne płomienie odnowy','Płomienne osaczenie','Lot feniksa','Pełne odrodzenie']
};
const controlDescription={fire:'Zamyka przeciwnikowi drogę płomieniami.',ice:'Zatrzymuje ruch lodem.',lightning:'Wyładowania zakłócają ruch.',sand:'Wir piasku zasłania przeciwnikowi pole widzenia.',beast:'Osacza przeciwnika i nie pozwala mu się wycofać.',bind:'Rozbudowuje więzy wokół przeciwnika.',evade:'Zmyla przeciwnika i zmusza go do odsłonięcia.',guard:'Przyciska przeciwnika osłoną.',heal:'Odzyskuje siły i szuka korzystnego ustawienia.'};
export function fruitStyles(fruit,combatStyle='weapon'){
 const base=fruit.rule,custom=names[fruit.id],animal=['beast','dragon'].includes(fruit.family);
 const titles=custom?[...custom]:[`${fruit.move} — natarcie`,`${fruit.power} — osłona`,`${fruit.power} — kontrola pola`,`${fruit.power} — manewr`,`${fruit.move} — pełna moc`];
 const copies=()=>({...base,statuses:{...base.statuses}});
 const attack=copies();attack.damage=(attack.damage||3)+5;attack.shield=Math.floor((attack.shield||0)/2);
 const defense=copies();defense.damage=Math.floor((defense.damage||0)/2);defense.shield=(defense.shield||0)+10;
 const control=copies();control.damage=Math.floor((control.damage||0)*.7);control.statuses[fruit.family==='ice'?'frozen':fruit.family==='sand'?'blind':fruit.family==='fire'?'burn':'marked']=3;
 const mobile=copies();mobile.damage=Math.floor((mobile.damage||0)*.7);mobile.evade=1;mobile.energy=(mobile.energy||0)+7;
 const ultimate=copies();ultimate.damage=(ultimate.damage||5)+11;ultimate.energy=0;ultimate.cost=18;
 const rules=[attack,defense,control,mobile,ultimate];
 if(fruit.id==='ope-ope')rules.splice(0,5,
  {damage:24,armor:5,statuses:{marked:1}},
  {damage:8,statuses:{rooted:3,marked:3}},
  {damage:6,evade:1,statuses:{marked:2}},
  {damage:16,statuses:{stunned:1},element:'lightning'},
  {damage:25,armor:7,cost:18}
 );
 if(fruit.id==='uo-uo-seiryu'){rules[1]={damage:16,shield:27};rules[2]={damage:18,armor:3,element:'wind'};rules[3]={damage:23,shield:12,boost:2};}
 if(fruit.id==='sube-sube')rules.splice(0,5,{damage:6,evade:1},{evade:1,shield:5},{statuses:{marked:2},energy:8},{evade:1,energy:17},{evade:1,statuses:{mist:3},cost:12});
 if(fruit.id==='tori-tori-phoenix')rules[4]={heal:32,shield:12,cost:18};
 if(fruit.id==='ope-ope'&&combatStyle==='fists'){titles[0]='Scalpel — operacyjne dłonie';rules[0]={damage:16,armor:4,statuses:{marked:1}};}
 return titles.map((name,i)=>({id:`${fruit.id}-${i}`,name,icon:['✹','⬡','◎','➶','✦'][i],rule:rules[i],desc:[animal?'Wykorzystuje siłę przemiany w bezpośrednim natarciu.':'Skupia moc w zdecydowanym ataku.','Rezygnuje z części natarcia, by przygotować osłonę.',controlDescription[fruit.family]||'Wykorzystuje właściwości owocu do przejęcia inicjatywy.','Stawia na ruch, uniki i korzystne ustawienie.','Rozwija pełną technikę. Jest wyczerpująca i wymaga odzyskania oddechu.'][i]}));
}
