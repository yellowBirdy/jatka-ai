import {additions} from './catalog.js';
const option=(id,name,icon,desc,stats={})=>({id,name,icon,desc,stats});
export const categories=[
{id:'weapon',name:'Broń',icon:'⚔',options:[option('sword','Miecz','⚔','Wszechstronny i celny.',{attack:4,accuracy:8}),option('axe','Topór','🪓','Silne, lecz wolniejsze ciosy.',{attack:9,speed:-3}),option('spear','Włócznia','↗','Zasięg i pierwszeństwo.',{attack:3,speed:5,accuracy:4}),option('hammer','Młot','🔨','Przełamuje ciężką ochronę.',{attack:7,pierce:7,speed:-5})]},
{id:'origin',name:'Pochodzenie',icon:'◈',options:[option('viking','Wiking','❄','Hart i siła północy.',{health:12,attack:2}),option('samurai','Samuraj','☀','Dyscyplina i precyzja.',{accuracy:9,speed:2}),option('gladiator','Gladiator','♜','Doświadczenie na arenie.',{health:8,defense:3}),option('nomad','Koczownik','➶','Mobilność i kondycja.',{speed:6,stamina:15})]},
{id:'style',name:'Styl walki',icon:'✦',options:[option('offensive','Ofensywny','⚡','Presja kosztem ochrony.',{attack:6,defense:-3}),option('defensive','Defensywny','⬡','Ochrona kosztem siły.',{defense:6,attack:-3}),option('counter','Kontratak','↩','Uniki i precyzyjne odpowiedzi.',{speed:3,accuracy:6}),option('balanced','Zrównoważony','⚖','Bezpieczna równowaga.',{attack:2,defense:2,stamina:8})]},
{id:'armor',name:'Zbroja',icon:'⬡',options:[option('cloth','Przeszywanica','◇','Lekka i swobodna.',{defense:1,speed:5}),option('leather','Skórzana','◈','Mobilność i osłona.',{defense:4,speed:2}),option('mail','Kolczuga','▦','Solidna ochrona.',{defense:8,speed:-2}),option('plate','Płytowa','⬢','Maksymalna ochrona, duży ciężar.',{defense:13,speed:-7,stamina:-10})]},
{id:'secondary',name:'Dodatkowa broń',icon:'†',options:[option('dagger','Sztylet','†','Celne pchnięcia z bliska.',{attack:2,accuracy:4}),option('hatchet','Toporek','🪓','Dodatkowa siła uderzenia.',{attack:4}),option('net','Sieć','▧','Ogranicza ruch przeciwnika.',{accuracy:7}),option('javelin','Oszczep','➶','Przewaga zasięgu.',{attack:2,speed:3})]},
{id:'weakness',name:'Największa słabość',icon:'↘',options:[option('slow','Powolność','⌛','Trudniej unikać ciosów.',{speed:-7}),option('fragile','Kruchość','♡','Mniejsza odporność na rany.',{health:-18}),option('reckless','Porywczość','♨','Odsłonięta garda.',{defense:-5}),option('tired','Słaba kondycja','◔','Szybsze zmęczenie.',{stamina:-25})]},
{id:'advantage',name:'Największa przewaga',icon:'↗',options:[option('strength','Siła','◆','Mocniejsze uderzenia.',{attack:6}),option('reflex','Refleks','ϟ','Szybsza reakcja.',{speed:7}),option('precision','Precyzja','◎','Więcej celnych trafień.',{accuracy:12}),option('endurance','Wytrzymałość','♥','Dłuższa walka.',{health:15,stamina:20})]},
{id:'ability',name:'Specjalna umiejętność',icon:'✺',options:[option('rage','Szał berserkerski','♨','Co czwarty atak: +9 siły.'),option('disarm','Rozbrojenie','✕','Co czwarty atak osłabia następny cios rywala.'),option('precise','Precyzyjny cios','⊕','Co czwarty atak trafia i omija część zbroi.'),option('breath','Drugi oddech','≋','Co czwarty atak przywraca 8 zdrowia.')]}];
// Keep the original four entries and add sixteen named alternatives per slot.
for(const category of categories){
 for(const [id,name,desc,stats,effect] of additions[category.id]){
  const labels={speed:'szybkości',pierce:'przebicia',health:'HP',accuracy:'celności',defense:'obrony',attack:'siły',stamina:'kondycji'};
  const passive=effect?Object.entries(stats).map(([key,value])=>` +${value} ${labels[key]}.`).join(''):'';
  const item=option(id,name,category.icon,desc+passive,stats);
  if(effect)item.effect=effect;
  category.options.push(item);
 }
}
export const durations={
 short:{name:'Krótka',multiplier:0.65},
 medium:{name:'Średnia',multiplier:1},
 long:{name:'Długa',multiplier:1.6}
};
export function drawOptions(random=Math.random){
 return Object.fromEntries(categories.map(category=>{
  const pool=[...category.options];
  for(let i=pool.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}
  return [category.id,pool.slice(0,5)];
 }));
}
export function createFighter(name,picks,duration='medium'){
 if(!Object.hasOwn(durations,duration))throw Error('Wybierz poprawną długość gry.');
 if(typeof name!=='string'||!name.trim()||name.trim().length>24)throw Error('Imię musi mieć od 1 do 24 znaków.');
 const stats={health:100,attack:17,defense:5,speed:15,accuracy:75,stamina:90,pierce:0};const traits={};
 for(const c of categories){const o=c.options.find(o=>o.id===picks[c.id]);if(!o)throw Error(`Wybierz: ${c.name}`);traits[c.id]=o;for(const [k,v]of Object.entries(o.stats))stats[k]+=v;}
 stats.health=Math.max(1,Math.round(stats.health*durations[duration].multiplier));
 return {name:name.trim(),picks:{...picks},traits,stats,duration};
}
export function seededRandom(seed){let s=seed>>>0;return ()=>{s+=0x6D2B79F5;let t=s;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return ((t^t>>>14)>>>0)/4294967296;};}
export function simulate(a,b,random=Math.random){
 const f=[a,b],hp=f.map(x=>x.stats.health),energy=f.map(x=>x.stats.stamina),turns=[0,0],disarmed=[false,false],events=[];
 let first=random()<(0.5+(a.stats.speed-b.stats.speed)/100)?0:1;
 for(let turn=0;turn<160&&hp.every(h=>h>0);turn++){
 const actor=(first+turn)%2,target=1-actor,s=f[actor].stats,d=f[target].stats;turns[actor]++;
 const ability=turns[actor]%4===0?f[actor].picks.ability:null;
 const effect=ability?(f[actor].traits.ability.effect||ability):null;
 const exhausted=energy[actor]<=0;energy[actor]=Math.max(0,energy[actor]-7);
 const chance=Math.max(.35,Math.min(.95,(s.accuracy+(s.speed-d.speed)*.65)/100));
 const hit=effect==='precise'||random()<chance;
 let damage=0,kind='dodge';
 if(hit){const power=s.attack+(random()*8-4)+(effect==='rage'?9:0)-(disarmed[actor]?7:0);const protection=Math.max(0,d.defense-s.pierce-(effect==='precise'?10:0));damage=Math.max(2,Math.round((power-protection*.6)*(exhausted?.65:1)));kind=damage<8?'block':'hit';hp[target]=Math.max(0,hp[target]-damage);}
 disarmed[actor]=false;if(effect==='disarm'&&hit)disarmed[target]=true;
 let healed=0;if(effect==='breath'){healed=Math.min(8,s.health-hp[actor]);hp[actor]+=healed;energy[actor]+=15;}
 const text=hit?`${f[actor].name}: ${kind==='block'?'cios częściowo zablokowany':'trafienie'} −${damage} HP.`:`${f[target].name} unika ataku ${f[actor].name}.`;
 events.push({actor,target,damage,kind,ability,healed,hp:[...hp],text,exhausted});
 }
 const reason=hp.every(h=>h>0)?'decision':'knockout';
 const scores=hp.map((h,i)=>h/f[i].stats.health);
 const winner=reason==='decision'?(scores[0]===scores[1]?first:scores[0]>scores[1]?0:1):(hp[0]>0?0:1);
 return {winner,reason,events};
}
export function describe(result,fighters){const w=fighters[result.winner],l=fighters[1-result.winner];const hits=result.events.filter(e=>e.actor===result.winner&&e.damage>0);const best=hits.reduce((a,b)=>b.damage>(a?.damage??-1)?b:a,null);const special=hits.find(e=>e.ability);return `Zwycięża ${w.name}! ${w.traits.weapon.name} przyniósł ${hits.length} celnych trafień${best?`, a najmocniejszy cios odebrał ${best.damage} punktów zdrowia`:''}. ${special?`${w.traits.ability.name} znalazł zastosowanie w starciu.`:`${l.name} walczył do końca, ale nie zdołał przechylić szali.`} ${result.reason==='decision'?'Po limicie wymian o wyniku zdecydował pozostały procent zdrowia.':'Pojedynek zakończył się wyczerpaniem zdrowia przeciwnika.'}`;}
