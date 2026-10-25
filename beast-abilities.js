import {rollChance} from './probability.js?v=variety-51';
const ability=(name,desc)=>({name,desc:`25% po własnym ataku: ${desc}`,chance:.25,stats:{}});
export const beastAbilities={
 horse:ability('Galop bojowy','odzyskaj do 12 kondycji; następny atak nie zużywa kondycji, ma +3 siły i +12 pkt proc. celności.'),
 wolf:ability('Dobijający kieł','dodatkowy cios za 6 HP, gdy cel ma mniej niż połowę zdrowia, w przeciwnym razie za 3 HP.'),
 boar:ability('Rozpruwające kły','trwale uszkodź pancerz celu o 3, do limitu 9 i jego bazowej obrony.'),
 bear:ability('Instynkt przetrwania','jeśli masz mniej niż połowę HP, ulecz do 8 HP; przygotuj osłonę jednego trafienia do 4 HP.'),
 rhino:ability('Przebicie rogiem','dodatkowy cios za 8 HP ignorujący pancerz.'),
 tiger:ability('Podwójne pazury','dwa dodatkowe ciosy po 4 HP; śmiertelna kontra przerywa serię.'),
 lion:ability('Ryk dominacji','odbierz celowi do 14 kondycji i zablokuj następne losowanie jego umiejętności specjalnej.'),
 elk:ability('Rozwarcie porożem','następny atak w cel pomija dodatkowe 8 ochrony; efekt odświeża się, zamiast kumulować.'),
 mammoth:ability('Żywy bastion','ustaw pulę bariery na co najmniej 10 HP; zapłać do 4 kondycji.'),
 lizard:ability('Jadowite ukąszenie','zatruj cel: traci 3 HP na początku dwóch następnych własnych ataków; jad omija osłony i nie kumuluje czasu.'),
 ostrich:ability('Zryw strusia','przygotuj unik całego następnego ataku bronią; zapłać do 5 kondycji.'),
 camel:ability('Pustynna wytrwałość','odzyskaj do 22 kondycji i usuń oślepienie piaskiem.'),
 bison:ability('Obronny taran','przygotuj osłonę jednego trafienia do 8 HP i jednorazową kontrę za 9 HP.'),
 buffalo:ability('Napór stada','odbierz celowi do 8 kondycji i wykonaj dodatkowy cios za 3 HP.'),
 hyena:ability('Łupieżczy instynkt','przejmij do 9 kondycji celu, do własnego limitu, i ulecz do 3 HP.'),
 stag:ability('Zwrot jelenia','usuń do 4 punktów trwałego spowolnienia i zyskaj +30 pkt proc. celności do następnego ataku.'),
 panther:ability('Zasadzka z cienia','oznacz cel na dwa trafienia i wykonaj cios za 3 HP; oznaczenie dodaje po 3 obrażenia do tego ciosu i następnego trafienia.'),
 'polar-bear':ability('Polarny uścisk','osłab procentowo następny atak celu i spowolnij go o 2, do limitu 8.'),
 yak:ability('Górska niezłomność','usuń zamrożenie i korzenie oraz przygotuj osłonę jednego trafienia do 3 HP.'),
 dragon:ability('Ognisty oddech','zadaj dodatkowe 18 HP i przygotuj osłonę do 8 HP.'),
 'chinese-dragon':ability('Oddech niebios','zadaj dodatkowe 14 HP i odzyskaj do 8 kondycji.'),
 drake:ability('Skalny pogrom','zadaj dodatkowe 8 HP i przygotuj osłonę do 4 HP.'),
 griffin:ability('Pikowanie gryfa','zadaj dodatkowe 7 HP i odbierz do 4 kondycji.'),
 sabretooth:ability('Pradawne kły','zadaj dodatkowe 6 HP i oznacz cel na jedno trafienie.'),
 crocodile:ability('Zacisk szczęk','dwa następne ataki celu kosztują dodatkowe 10 kondycji; natychmiast odbierz mu do 6 kondycji.')
};
const extraNames={
 dragon:['Smoczy pazur','Pancerz czerwonego smoka','Żar serca','Ryk zagłady'],
 'chinese-dragon':['Szpon niebios','Jadeitowa bariera','Oddech chmur','Wiatr cesarza'],
 drake:['Skalny pazur','Bazaltowa tarcza','Ciepło skał','Grzmot smoka'],
 griffin:['Orli szpon','Straż skrzydeł','Oddech przestworzy','Podmuch gryfa'],
 sabretooth:['Szabla drapieżnika','Czujność pradawna','Siła epoki lodu','Ryk pradawnych'],
 horse:['Kopnięcie rumaka','Czaprak strażnika','Oddech w galopie','Tratujący rozpęd'],
 wolf:['Skok wilka','Czujność watahy','Wycie łowcy','Szarpnięcie ścięgna'],
 boar:['Uderzenie racicą','Twarda szczecina','Zawziętość dzika','Rozjuszający kwik'],
 bear:['Niedźwiedzia łapa','Osłona futra','Regeneracja niedźwiedzia','Przygniecenie łapą'],
 rhino:['Boczny taran','Skóra nosorożca','Drugi oddech kolosa','Wstrząs rogu'],
 tiger:['Skok tygrysa','Przyczajony drapieżnik','Tygrysia zaciekłość','Rozdarcie pazurem'],
 lion:['Królewski pazur','Straż grzywy','Duma króla sawanny','Przerażający pomruk'],
 elk:['Kopnięcie łosia','Leśna czujność','Siła mokradeł','Zaczep poroża'],
 mammoth:['Cios trąbą','Mur tundry','Mamucia wytrwałość','Tąpnięcie olbrzyma'],
 lizard:['Smagnięcie ogonem','Skóra warana','Ciepło drapieżnika','Paraliżujący chwyt'],
 ostrich:['Kopnięcie biegacza','Taniec piór','Oddech stepu','Piaskowy podmuch'],
 camel:['Kopnięcie karawany','Osłona wydm','Zapas pustyni','Dezorientujący plwacz'],
 bison:['Cios żubrzym rogiem','Straż puszczy','Hart żubra','Zwarcie rogów'],
 buffalo:['Bawole kopnięcie','Krąg stada','Wytrwałość sawanny','Napór rogów'],
 hyena:['Kąsanie hieny','Czujność łupieżcy','Żarłoczna odnowa','Szyderczy skowyt'],
 stag:['Cios królewskim porożem','Straż boru','Oddech jelenia','Splątanie rogami'],
 panther:['Nocny pazur','Zniknięcie w zaroślach','Instynkt pantery','Rozproszenie z cienia'],
 'polar-bear':['Cios polarnej łapy','Futrzany bastion','Hart Arktyki','Uścisk północy'],
 yak:['Kopnięcie jaka','Skalna postawa','Oddech przełęczy','Zepchnięcie ze szlaku'],
 crocodile:['Uderzenie krokodylego ogona','Tarcza łusek','Rzeczna regeneracja','Śmiertelny obrót']
};
const effectDescriptions={
 strike:n=>`dodatkowy cios za ${n} HP przez pancerz; osłony i kontry nadal działają.`,
 guard:n=>`przygotuj osłonę jednego trafienia do ${n} HP i odzyskaj do 4 kondycji.`,
 heal:n=>`odzyskaj do ${n} HP i do 6 kondycji, bez przekraczania maksimum.`,
 drain:n=>`odbierz celowi do ${n} kondycji i osłab procentowo jego następny atak.`,
 mark:n=>`oznacz cel na ${n} trafienia; każde z nich zadaje dodatkowe 3 obrażenia.`,
 barrier:n=>`ustaw pulę bariery na co najmniej ${n} HP; nie kumuluje się.`,
 focus:n=>`przygotuj +30 pkt proc. celności następnego ataku i odzyskaj do ${n} kondycji.`,
 slow:n=>`spowolnij cel o ${n}, do limitu 8, i odbierz mu do 5 kondycji.`
};
const abilityPools=Object.fromEntries(Object.keys(beastAbilities).map((beast,index)=>{
 const types=index%2===0?['strike','guard','heal','drain']:['mark','barrier','focus','slow'];
 const powers=index%2===0?[4+index%4,5+index%5,5+index%4,9+index%6]:[2,7+index%5,10+index%7,2+index%3];
 return [beast,[{id:beast,beast,...beastAbilities[beast]},...types.map((type,i)=>({id:`${beast}-skill-${i+2}`,beast,...ability(extraNames[beast][i],effectDescriptions[type](powers[i])),effect:type,power:powers[i]}))]];
}));
export function getBeastAbilities(beast){const pool=abilityPools[beast];if(!pool)throw Error('Nieznana bestia.');return pool;}
export function applyBeastAbility({f,state,actor,target,random,strike,heal,details}){
 const id=f[actor].picks.beastAbility;
 if(!f[actor].mounted||id==='none'||state.hp[actor]<=0||state.hp[target]<=0)return null;
 const rule=getBeastAbilities(f[actor].picks.beast).find(a=>a.id===id);if(!rule)throw Error('Nieznana umiejętność bestii.');
 if(!rollChance(rule.chance,random))return null;
 const {hp,energy}=state,s=f[actor].stats;
 const recover=n=>{energy[actor]=Math.min(s.stamina,energy[actor]+n);};
 const drain=n=>{const amount=Math.min(n,energy[target]);energy[target]-=amount;return amount;};
 const shield=n=>{state.shield[actor]=Math.max(state.shield[actor],n);};
 if(rule.effect){
  const n=rule.power;
  switch(rule.effect){
   case 'strike':strike(n);break;
   case 'guard':shield(n);recover(4);break;
   case 'heal':heal(n);recover(6);break;
   case 'drain':drain(n);state.staggered[target]=true;break;
   case 'mark':state.marked[target]=Math.max(n,state.marked[target]);break;
   case 'barrier':state.barrier[actor]=Math.max(n,state.barrier[actor]);break;
   case 'focus':state.focus[actor]=1;recover(n);break;
   case 'slow':state.slow[target]=Math.max(state.slow[target],Math.min(8,state.slow[target]+n));drain(5);break;
  }
 }else switch(id){
  case 'dragon':strike(18);shield(8);break;
  case 'chinese-dragon':strike(14);recover(8);break;
  case 'drake':strike(8);shield(4);break;
  case 'griffin':strike(7);drain(4);break;
  case 'sabretooth':strike(6);state.marked[target]=Math.max(1,state.marked[target]);break;
  case 'horse':recover(12);state.tempo[actor]=Math.max(1,state.tempo[actor]);break;
  case 'wolf':strike(hp[target]<f[target].stats.health*.5?6:3);break;
  case 'boar':state.armorDamage[target]=Math.max(state.armorDamage[target],Math.min(9,Math.max(0,f[target].stats.defense),state.armorDamage[target]+3));break;
  case 'bear':if(hp[actor]<s.health*.5)heal(8);shield(4);break;
  case 'rhino':strike(8);break;
  case 'tiger':strike(4);if(hp[actor]>0&&hp[target]>0)strike(4);break;
  case 'lion':drain(14);state.stunned[target]=Math.max(1,state.stunned[target]);break;
  case 'elk':state.exposureStrength[target]=Math.max(state.exposed[target]>0?state.exposureStrength[target]:0,8);state.exposed[target]=Math.max(1,state.exposed[target]);break;
  case 'mammoth':state.barrier[actor]=Math.max(10,state.barrier[actor]);energy[actor]=Math.max(0,energy[actor]-4);break;
  case 'lizard':state.venom[target]=2;break;
  case 'ostrich':state.blink[actor]=Math.max(1,state.blink[actor]);energy[actor]=Math.max(0,energy[actor]-5);break;
  case 'camel':recover(22);state.blind[actor]=0;break;
  case 'bison':shield(8);state.wrist[actor]=1;break;
  case 'buffalo':drain(8);strike(3);break;
  case 'hyena':recover(drain(9));heal(3);break;
  case 'stag':state.slow[actor]=Math.max(0,state.slow[actor]-4);state.focus[actor]=1;break;
  case 'panther':state.marked[target]=Math.max(2,state.marked[target]);strike(3);break;
  case 'polar-bear':state.staggered[target]=true;state.slow[target]=Math.max(state.slow[target],Math.min(8,state.slow[target]+2));break;
  case 'yak':state.frozen[actor]=0;state.rooted[actor]=0;shield(3);break;
  case 'crocodile':state.rooted[target]=Math.max(2,state.rooted[target]);drain(6);break;
 }
 details.push(`Bestia: ${f[actor].traits.beast.name} — ${rule.name}. ${rule.desc}`);
 return id;
}
