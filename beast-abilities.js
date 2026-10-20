import {rollChance} from './probability.js?v=chance-8';
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
 crocodile:ability('Zacisk szczęk','dwa następne ataki celu kosztują dodatkowe 10 kondycji; natychmiast odbierz mu do 6 kondycji.')
};
export function applyBeastAbility({f,state,actor,target,random,strike,heal,details}){
 const id=f[actor].picks.beastAbility;
 if(!f[actor].mounted||id==='none'||state.hp[actor]<=0||state.hp[target]<=0)return null;
 const rule=beastAbilities[id];if(!rule)throw Error('Nieznana umiejętność bestii.');
 if(!rollChance(rule.chance,random))return null;
 const {hp,energy}=state,s=f[actor].stats;
 const recover=n=>{energy[actor]=Math.min(s.stamina,energy[actor]+n);};
 const drain=n=>{const amount=Math.min(n,energy[target]);energy[target]-=amount;return amount;};
 const shield=n=>{state.shield[actor]=Math.max(state.shield[actor],n);};
 switch(id){
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
