const weapons=[
 ['sword','Wado Ichimonji','Katana Zoro, wymagająca opanowanego cięcia.','cut',2],['axe','Topór Morgana','Ciężki topór do przełamywania gardy.','blunt',5],['spear','Murakumogiri','Naginata Białobrodego o ogromnym zasięgu.','cut',6],['hammer','Kabuto','Proca Usoppa, pozwalająca walczyć z dystansu.','ranged',0],['sabre','Gryphon','Szabla Shanksa do zdecydowanego natarcia.','cut',5],['rapier','Soul Solid','Lekki miecz Brooka do szybkich pchnięć.','cut',2],['greatsword','Yoru','Czarne ostrze Mihawka, stworzone do potężnych cięć.','cut',8],['falchion','Shusui','Ciężkie czarne ostrze Ryumy.','cut',5],['halberd','Enma','Ostrze, które wydobywa Haki, ale męczy użytkownika.','cut',7],['glaive','Ame no Habakiri','Katana Odena, groźna w bliskiej walce.','cut',5],['pike','Kikoku','Długie ostrze Lawa, bez automatycznego przyznawania mocy jego owocu.','cut',4],['trident','Mogura','Trójząb Katakuriego do przebijających pchnięć.','pierce',4],['mace','Hassaikai','Kanabo Kaido, którego uderzenie może przełamać gardę.','blunt',8],['flail','Eisen Whip','Bicz Ohma, którego ostrze zmienia kształt.','cut',3],['club','Alvida — żelazna maczuga','Ciężka maczuga do walki w zwarciu.','blunt',4],['warpick','Kiribachi','Zębate ostrze Arlonga.','cut',4],['staff','Clima-Tact','Baton Nami, wykorzystujący pogodę i podmuchy.','wind',1],['sickle','Sandai Kitetsu','Przeklęta katana Zoro o niebezpiecznym ostrzu.','cut',4],['scimitar','Shigure','Katana Tashigi do precyzyjnego szermierczego starcia.','cut',2],['estoc','Jitte Smokera','Broń z końcówką z kamienia morskiego; trafiony użytkownik owocu słabnie.','seastone',1]
];
export const animeWeapons=weapons.map(([id,name,desc,kind,attack])=>({id,name,desc,kind,attack,icon:kind==='ranged'?'➶':kind==='blunt'?'♜':'⚔'}));
export const animeHaki=[
 {id:'armament',name:'Haki uzbrojenia',icon:'⬢',desc:'Utwardza ataki i broń. Pozwala dosięgnąć prawdziwego ciała Logii.',touch:true,recoil:.5,attack:5,defense:2},
 {id:'defense',name:'Haki obrony',icon:'⬡',desc:'Osłania ciało przed ciosami i pomaga przetrwać odrzut dialu.',recoil:.2,defense:9},
 {id:'observation',name:'Haki obserwacji',icon:'◎',desc:'Pozwala wyczuć zamiar przeciwnika i uniknąć zaskakującego natarcia.',speed:7,accuracy:6,dodge:true},
 {id:'conqueror',name:'Haki królewskie',icon:'♛',desc:'Potężna wola potrafi przerwać koncentrację przeciwnika i jego następną technikę.',pressure:true}
];
export function combineHaki(first,second){
 const values=[first,second].filter(Boolean),combined={name:values.map(h=>h.name).join(' + '),touch:values.some(h=>h.touch),dodge:values.some(h=>h.dodge),pressure:values.some(h=>h.pressure),recoil:Math.min(...values.map(h=>h.recoil??1))};
 for(const stat of ['attack','defense','speed','accuracy','pierce'])combined[stat]=values.reduce((sum,h)=>sum+(h[stat]||0),0);
 return combined;
}
