import {categories} from './engine.js?v=variety-51';
import {fantasySlots} from './fantasy.js?v=variety-51';
import {beasts} from './mounts.js?v=variety-51';
const lookup=(key,id)=>categories.find(c=>c.id===key)?.options.find(o=>o.id===id)?.name||id;
const magicName=id=>fantasySlots.find(s=>s.id==='magicPower').options.find(o=>o.id===id)?.name||id;
const describeBonus=stats=>Object.entries(stats||{}).filter(([,v])=>v!==0).map(([k,v])=>`${v>0?'+':''}${v} ${({attack:'siły',defense:'ochrony',health:'HP',accuracy:'celności',speed:'szybkości',stamina:'kondycji',pierce:'przebicia'})[k]}`).join(', ');
const infantryRows=[
 ['Tarczownik',95,'sword','mail','wrist-lock',{defense:3,attack:-2},'Obronny miecznik z naciskiem na ochronę i kontrę.'],
 ['Strażnik bramy',120,'halberd','halfplate','weapon-hook',{defense:2,health:6,speed:-2},'Blokuje przejście halabardą i zahacza broń przeciwnika.'],
 ['Wojownik klanów',115,'axe','hide','rage',{attack:3,stamina:8,defense:-2},'Lekko opancerzony topornik walczący w szale.'],
 ['Miecznik',125,'greatsword','brigandine','overhead',{attack:3,pierce:2,speed:-2},'Ciężkie dwuręczne ostrze do przełamywania ochrony.'],
 ['Legionista',105,'sword','bronze','shoulder',{defense:2,stamina:12},'Zdyscyplinowany żołnierz w brązie, odporny na zmęczenie.'],
 ['Topornik',115,'axe','reinforced-mail','combo',{attack:2,pierce:2,stamina:-6},'Wzmocniona kolczuga i agresywna seria ciosów toporem.'],
 ['Sierżant',120,'mace','mail','rally',{accuracy:5,stamina:10,attack:-1},'Weteran z buławą, wykorzystujący bojową mobilizację.'],
 ['Pogromca',125,'warpick','leather','gap',{pierce:5,defense:-1},'Nadziak i trafienia w szczeliny pancerza.']
];
const riderRows=[
 ['bear','Niedźwiedzi strażnik',195,'mace','plate','wrist-lock',{health:8,defense:2,speed:-2},'Ciężki obrońca na niedźwiedziu brunatnym.'],
 ['rhino','Jeździec nosorożca',205,'spear','halfplate','charge',{pierce:3,stamina:-6},'Przebijająca szarża wsparta rogiem nosorożca.'],
 ['tiger','Tygrysi jeździec',185,'sabre','leather','combo',{speed:3,defense:-1},'Szybki flankier wykorzystujący podwójne pazury.'],
 ['lion','Lwi rycerz',195,'sword','brigandine','shoulder',{attack:2,accuracy:3},'Ryk lwa utrudnia przeciwnikowi użycie umiejętności.'],
 ['mammoth','Mamuci taran',220,'hammer','plate','overhead',{health:12,speed:-3},'Powolny, wytrzymały oddział z mamucią barierą.'],
 ['lizard','Warański łowca',180,'glaive','scale','gap',{pierce:2,accuracy:3},'Glewia i jadowite ukąszenie warana.'],
 ['ostrich','Strusi zwiadowca',165,'spear','cloth','pace',{speed:4,health:-4},'Bardzo mobilny zwiadowca, którego struś przygotowuje unik.'],
 ['camel','Jeździec wielbłąda',170,'scimitar','leather','breath',{stamina:18,attack:-1},'Długodystansowy wojownik z dużym zapasem kondycji.'],
 ['bison','Żubrzy pancerny',200,'warpick','halfplate','wrist-lock',{defense:3,speed:-2},'Żubr przygotowuje osłonę i kontrę, jeździec przebija pancerz.'],
 ['buffalo','Bawoli włócznik',190,'spear','lamellar','charge',{attack:2,stamina:8},'Napór bawołu odbiera wrogowi kondycję.'],
 ['hyena','Hieni łupieżca',170,'flail','studded','feint-strike',{accuracy:4,speed:2},'Hiena przechwytuje kondycję, a jeździec używa kiścienia.'],
 ['stag','Jeleni harcownik',175,'rapier','leather','lunge',{speed:3,accuracy:3},'Zwinny jeździec z pchnięciem rapiera i celnym zwrotem jelenia.'],
 ['panther','Panterzy skrytobójca',185,'sickle','cloth','precise',{pierce:3,speed:2,health:-4},'Pantera oznacza cel, sierp i precyzja dobijają osłabionego.'],
 ['polar-bear','Polarny wartownik',205,'hammer','scale','shoulder',{health:8,defense:2,speed:-2},'Niedźwiedź polarny spowalnia wroga i osłabia jego cios.'],
 ['yak','Górski jeździec',185,'mace','mail','breathing',{stamina:14,defense:1},'Jak usuwa zamrożenie i korzenie, a jeździec odzyskuje oddech.'],
 ['crocodile','Krokodyli jeździec',195,'trident','scale','weapon-hook',{pierce:3,accuracy:2},'Szczęki krokodyla zwiększają koszt ruchów przeciwnika.']
];
const mageRows=[
 ['earth','Geomanta','iron-ring','wrist-lock','fortress',185,{defense:2},'Kamienna osłona i obronna postawa.'],
 ['life-drain','Wampirzy mag','hunter-fang','low-cut','pressure',195,{attack:2,health:-4},'Kradzież życia zamiast zwykłego leczenia.'],
 ['silence','Pieczętarz','crystal-eye','precise','technical',190,{accuracy:4,attack:-1},'Pieczęć ciszy blokuje magię przeciwnika.'],
 ['cleanse','Egzorcysta','guard-token','breathing','defensive',170,{health:8},'Oczyszcza własne negatywne stany i oszczędza siły.'],
 ['mana','Mag many','war-banner','breath','patient',165,{stamina:15},'Przypływ energii pozwala dłużej walczyć bez odpoczynku.'],
 ['meteor','Astromanta','strength-belt','overhead','offensive',210,{attack:3,speed:-2},'Meteor do przełamania twardego przeciwnika.'],
 ['roots','Druid korzeni','oak-talisman','weapon-hook','distance',180,{defense:1,stamina:8},'Korzenie zwiększają koszt kondycji wroga.'],
 ['thorns','Cierniowy druid','stone-heart','wrist-lock','counter',185,{health:6,speed:-1},'Cierniowa skóra karze rywala za kontakt.'],
 ['barrier','Kryształowy mag','guard-token','breathing','fortress',190,{defense:3,attack:-2},'Tworzy pulę bariery osłaniającej go przed obrażeniami.'],
 ['mark','Łowca słabości','eagle-lens','gap','measured',190,{pierce:3},'Piętno słabości wzmacnia kolejne trafienia w cel.'],
 ['blink','Iluzjonista','wind-feather','feint-strike','evasive',185,{speed:3,health:-3},'Migotanie i zwody pomagają uniknąć ataku.'],
 ['battlecry','Runiczny herold','duelist-medal','rally','balanced',185,{stamina:10},'Runiczny okrzyk wzmacnia kolejne własne ciosy.'],
 ['dispel','Łamacz zaklęć','moon-cloak','disarm','technical',180,{accuracy:3,pierce:1},'Rozproszenie usuwa magiczne zabezpieczenia przeciwnika.'],
 ['entropy','Mag entropii','dragon-tooth','pommel','pressure',195,{pierce:2,stamina:-5},'Pochłania energię, ograniczając kondycję wroga.'],
 ['thunder','Gromowładny','war-gauntlet','shoulder','brutal',205,{attack:2,accuracy:-2},'Grom ogłuszenia utrudnia rywalowi wykonanie następnego ciosu.'],
 ['mist','Tkacz mgły','ranger-brooch','pace','evasive',175,{speed:2,defense:1},'Zasłona mgły utrudnia trafienie tego maga.']
];
// Every ranged specialist has an authored equipment/skill/stat combination.
const rangedRows=[
 ['Łucznik','bow',85,'leather','hunter','precise',{accuracy:8,attack:2,defense:-1},'Podstawowy celny łuk z lekką ochroną.'],
 ['Kusznik','crossbow',100,'mail','guard','gap',{accuracy:6,attack:4,pierce:3,speed:-2},'Bełty przebijające zbroję kosztem tempa.'],
 ['Łucznik długiego łuku','bow',115,'linen','borderlander','overhead',{accuracy:10,attack:5,stamina:-8},'Mocne strzały z długiego łuku zużywają kondycję.'],
 ['Leśny tropiciel','bow',100,'hide','hunter','feint-strike',{accuracy:9,speed:3,health:-4},'Ruchliwy zwiadowca używający zwodów.'],
 ['Ciężki kusznik','crossbow',145,'plate','knight','gap',{attack:8,pierce:6,speed:-4,accuracy:4},'Ciężka kusza i płyty do zwalczania pancernych celów.'],
 ['Łucznik stepowy','bow',110,'leather','steppe','pace',{accuracy:8,speed:4,stamina:8},'Mobilny strzelec z dużym zapasem sił.'],
 ['Strzelec wyborowy','bow',135,'cloth','duelist','precise',{accuracy:15,pierce:4,health:-6},'Maksymalna precyzja za cenę słabej odporności.'],
 ['Lekki kusznik','crossbow',95,'cloth','mercenary','lunge',{accuracy:8,attack:3,speed:3,defense:-2},'Lżejsza kusza do szybkich wypadów.'],
 ['Łucznik górski','bow',115,'scale','highlander','breath',{accuracy:8,defense:3,stamina:10,speed:-1},'Opancerzony strzelec odporny na zmęczenie.'],
 ['Kusznik straży','crossbow',120,'brigandine','guard','wrist-lock',{accuracy:7,defense:4,attack:3},'Strzelec obronny, który potrafi odpowiedzieć kontrą.'],
 ['Łucznik pustyni','bow',105,'linen','desert','breathing',{accuracy:9,stamina:20,health:-3},'Oszczędna walka na długim dystansie.'],
 ['Strzelec klanów','bow',110,'hide','viking','rage',{accuracy:6,attack:6,defense:-1},'Agresywny łucznik korzystający z szału.'],
 ['Leśny zasadzkarz','bow',120,'leather','hunter','disarm',{accuracy:10,speed:2,pierce:2},'Zasadzka i rozbrojenie osłabiają odpowiedź rywala.'],
 ['Kusznik weteran','crossbow',130,'mail','arena-veteran','reset-stance',{accuracy:10,attack:4,health:8},'Doświadczenie i reset postawy zamiast czystej szybkości.'],
 ['Łucznik królewski','bow',140,'ceremonial','knight','rally',{accuracy:12,attack:4,stamina:10},'Dobrze wyszkolony strzelec z bojową mobilizacją.'],
 ['Strzelec pogranicza','bow',115,'quilted','borderlander','weapon-hook',{accuracy:8,pierce:3,defense:2},'Przebijające strzały i zahaczanie broni przeciwnika.'],
 ['Łucznik morski','bow',100,'studded','sailor','pommel',{accuracy:7,speed:2,health:6},'Wytrzymały żołnierz portowy przygotowany na zwarcie.'],
 ['Kusznik szturmowy','crossbow',150,'halfplate','legionary','combo',{accuracy:6,attack:7,pierce:4,stamina:-10},'Silne serie ataków z cięższą ochroną.'],
 ['Łucznik cienia','bow',125,'cloth','pirate','feint-strike',{accuracy:11,speed:5,pierce:2,health:-8},'Kruchy, bardzo szybki strzelec ukrywający zamiary.'],
 ['Mistrz łuku','bow',155,'leather','samurai','precise',{accuracy:16,attack:5,pierce:3,stamina:-5},'Elitarna precyzja i siła wymagające kontroli kondycji.']
];
export function buildArmyRoster(base){
 const groups=[{id:'ranged',name:'1. Strzelcy',icon:'➶',options:[]},{id:'cavalry',name:'2. Kawaleria',icon:'♞',options:[]},{id:'infantry',name:'3. Piechota',icon:'⚔',options:[]},{id:'mages',name:'4. Magowie',icon:'✦',options:[]}];
 const group=id=>groups.find(g=>g.id===id);
 for(const source of base){const id=source.beast?'cavalry':source.mode==='fantasy'?'mages':'infantry';group(id).options.push({...source,picks:{...source.picks},bonus:{...source.bonus},category:id});}
 const lancer=group('cavalry').options.find(u=>u.id==='lancer');Object.assign(lancer,{name:'Łosi kopijnik',beast:'elk',cost:180,desc:'Kopijnik na łosiu olbrzymim, wykorzystujący poroże do odsłonięcia celu.'});
 infantryRows.forEach(([name,cost,weapon,armor,ability,bonus,desc],i)=>group('infantry').options.push({id:`infantry-${i+1}`,name,cost,role:'front',category:'infantry',icon:weapon==='axe'?'⚒':'⚔',desc,bonus,picks:{weapon,armor,ability,origin:['legionary','guard','highlander','mercenary','legionary','viking','guard','gladiator'][i],style:['defensive','fortress','offensive','measured','defensive','pressure','technical','brutal'][i],advantage:['guard-master','reach','toughness','precision','iron-body','strength','resolve','armor-reader'][i],weakness:['slow','stiff','reckless','heavy-feet','tired','slow','stiff','weak-grip'][i]}}));
 riderRows.forEach(([beast,name,cost,weapon,armor,ability,bonus,desc],i)=>group('cavalry').options.push({id:`cavalry-${i+1}`,name,cost,role:'flank',category:'cavalry',icon:beasts.find(b=>b.id===beast).icon,beast,desc,bonus,picks:{weapon,armor,ability,origin:i%2?'nomad':'knight',style:['defensive','offensive','mobile','pressure'][i%4],advantage:i%2?'quick-feet':'toughness',weakness:i%2?'poor-guard':'slow'}}));
 mageRows.forEach(([magicPower,name,specialItem,ability,style,cost,bonus,desc],i)=>group('mages').options.push({id:`mages-${i+1}`,name,cost,role:'support',category:'mages',icon:fantasySlots.find(s=>s.id==='magicPower').options.find(m=>m.id===magicPower).icon,mode:'fantasy',desc,bonus,picks:{weapon:'staff',armor:i%3===0?'quilted':'cloth',origin:'monk',ability,style,advantage:i%2?'endurance':'precision',weakness:'fragile',specialItem,magicPower}}));
 rangedRows.forEach(([name,ranged,cost,armor,origin,ability,bonus,desc],i)=>group('ranged').options.push({id:i===0?'archer':`ranged-${i+1}`,name,cost,ranged,role:'ranged',category:'ranged',icon:ranged==='crossbow'?'⌁':'➶',desc,bonus,picks:{weapon:'staff',armor,origin,ability,style:i===3||i===12?'ambush':'distance',advantage:i%2?'precision':'steady-hand',weakness:'fragile'}}));
 for(const g of groups)for(const unit of g.options){const p=unit.picks;unit.flavor=unit.desc;unit.desc=`${unit.flavor} Broń: ${unit.ranged?(unit.ranged==='crossbow'?'Kusza':'Łuk'):lookup('weapon',p.weapon)}. Ochrona: ${lookup('armor',p.armor)}. Technika: ${lookup('ability',p.ability)}.${unit.beast?' Wierzchowiec: '+beasts.find(b=>b.id===unit.beast).name+'.':''}${p.magicPower?' Magia: '+magicName(p.magicPower)+'.':''}${Object.keys(unit.bonus||{}).length?' Parametry: '+describeBonus(unit.bonus)+'.':''}`;}
 return groups;
}
