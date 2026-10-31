import {gunSlots,gunDials} from './gun-catalog.js?v=guns-59';
export {gunSlots,gunDials};
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
export const gunDefaults=()=>Object.fromEntries(gunSlots.map(slot=>[slot.id,slot.options[0].id]));
export const gunCombinationCount=()=>gunSlots.reduce((count,slot)=>count*BigInt(slot.options.length),1n);
export const randomGun=(random=Math.random)=>Object.fromEntries(gunSlots.map(slot=>[slot.id,slot.options[Math.floor(random()*slot.options.length)].id]));
export function buildGun(name,picks){
 if(typeof name!=='string'||!name.trim()||name.trim().length>28)throw Error('Nazwa broni musi mieć od 1 do 28 znaków.');
 const parts={},stats={damage:24,accuracy:77,capacity:6,cooling:32,armor:4,health:190,pierce:0,heat:16,burst:3};
 for(const slot of gunSlots){const item=slot.options.find(x=>x.id===picks[slot.id]);if(!item)throw Error(`Wybierz: ${slot.name}`);parts[slot.id]=item;for(const [key,value]of Object.entries(item.stats||{}))stats[key]+=value;}
 stats.damage=clamp(stats.damage,10,48);stats.accuracy=clamp(stats.accuracy,40,97);stats.capacity=clamp(stats.capacity,2,18);stats.cooling=clamp(stats.cooling,20,50);stats.armor=clamp(stats.armor,0,22);stats.health=clamp(stats.health,150,260);stats.heat=clamp(stats.heat,6,30);stats.burst=clamp(stats.burst,2,4);
 return {name:name.trim(),picks:{...picks},parts,stats,dials:[parts.dial1,parts.dial2,parts.dial3]};
}
export function createGunBattle(guns,random=Math.random){
 if(!Array.isArray(guns)||guns.length!==2)throw Error('Potrzebne są dwie bronie.');const actor=random()<.5?0:1;
 return {guns,actor,random,events:[],finished:false,winner:null,reason:null,state:{hp:guns.map(g=>g.stats.health),ammo:guns.map(g=>g.stats.capacity),heat:[0,0],shield:[0,0],guard:[false,false],focus:[0,0],boost:[0,0],evade:[0,0],charges:guns.map(g=>g.dials.map(d=>d.id==='none'?0:3)),cooldowns:guns.map(()=>[0,0,0]),status:guns.map(()=>({burn:0,poison:0,slow:0,blind:0,jam:0,silence:0,marked:0})),armorDamage:[0,0]}};
}
export function gunActions(b){if(b.finished)return [];const i=b.actor,s=b.state,list=['reload','cool','guard','aim'];if(s.ammo[i]>0&&s.heat[i]<85&&!s.status[i].jam)list.push('shoot');if(s.ammo[i]>=2&&s.heat[i]<75&&!s.status[i].jam)list.push('burst');for(let n=0;n<3;n++)if(s.charges[i][n]>0&&!s.cooldowns[i][n]&&!s.status[i].silence)list.push(`dial${n+1}`);return list;}
export function advanceGun(b,action){
 if(!gunActions(b).includes(action))throw Error(b.finished?'Walka jest zakończona.':'Ta akcja jest teraz niedostępna.');
 const actor=b.actor,target=1-actor,g=b.guns[actor],enemy=b.guns[target],s=b.state,old={...s.status[actor]},e={actor,target,action,damage:0,selfDamage:0,shots:[],dial:null,details:[],text:''};
 s.guard[actor]=false;for(let n=0;n<3;n++)s.cooldowns[actor][n]=Math.max(0,s.cooldowns[actor][n]-1);
 for(const key of ['burn','poison'])if(old[key]){const n=Math.min(s.hp[actor],key==='burn'?4:3);s.hp[actor]-=n;e.selfDamage+=n;e.details.push(key==='burn'?'Ogień nadal uszkadza konstrukcję.':'Trująca energia nadal osłabia konstrukcję.');}
 for(const key of Object.keys(old))s.status[actor][key]=Math.max(0,s.status[actor][key]-1);
 function hit(amount,pierce=0,projectile=false){let damage=Math.max(0,Math.round(amount-Math.max(0,enemy.stats.armor-s.armorDamage[target]-pierce)*.6));if(s.evade[target]){s.evade[target]=0;e.details.push('Zasłona myli kierunek trafienia.');return 0;}if(s.guard[target]&&damage>0){damage=Math.ceil(damage/2);s.guard[target]=false;}if(projectile&&g.parts.ammo.effect==='shield-break'&&damage>0)s.shield[target]=Math.max(0,s.shield[target]-12);const absorbed=Math.min(s.shield[target],damage);s.shield[target]-=absorbed;damage-=absorbed;const actual=Math.min(s.hp[target],damage);s.hp[target]-=actual;e.damage+=actual;return actual;}
 if(s.hp[actor]>0){
  if(action==='reload'){s.ammo[actor]=g.stats.capacity;s.heat[actor]=Math.max(0,s.heat[actor]-20);s.status[actor].jam=0;for(let n=0;n<3;n++)if(g.dials[n].id!=='none')s.charges[actor][n]=Math.min(3,s.charges[actor][n]+1);e.text=`${g.name}: przeładowanie i odzyskanie ładunków diali.`;}
  else if(action==='cool'){s.heat[actor]=Math.max(0,s.heat[actor]-g.stats.cooling);e.text=`${g.name}: chłodzenie mechanizmu.`;}
  else if(action==='guard'){s.guard[actor]=true;s.heat[actor]=Math.max(0,s.heat[actor]-8);e.text=`${g.name}: osłona przed następnym trafieniem.`;}
  else if(action==='aim'){s.focus[actor]=Math.min(2,s.focus[actor]+1);s.heat[actor]=Math.max(0,s.heat[actor]-6);e.text=`${g.name}: namierzanie słabego punktu.`;}
  else if(action.startsWith('dial')){
   const n=Number(action.slice(-1))-1,d=g.dials[n];s.charges[actor][n]--;s.cooldowns[actor][n]=2;e.dial=d.id;e.text=`${g.name}: ${d.name}!`;
   if(d.power&& !['shield'].includes(d.effect))hit(d.power,d.effect==='pierce'?14:0);
   switch(d.effect){case 'impact':case 'reject':{const recoil=Math.min(Math.max(1,Math.round((d.effect==='reject'?15:7)-g.stats.armor*.25)),Math.max(0,s.hp[actor]-1));s.hp[actor]-=recoil;e.selfDamage+=recoil;e.details.push('Odrzut dialu odczuwa również własna konstrukcja.');break;}case 'burn':s.status[target].burn=2;break;case 'heat':s.heat[target]=Math.min(100,s.heat[target]+35);break;case 'push':s.focus[target]=0;s.status[target].slow=2;break;case 'boost':s.boost[actor]=2;s.heat[actor]=Math.max(0,s.heat[actor]-15);break;case 'shield':s.shield[actor]=Math.max(s.shield[actor],d.power);break;case 'evade':s.evade[actor]=1;break;case 'jam':s.status[target].jam=1;break;case 'slow':s.status[target].slow=2;s.armorDamage[target]=Math.min(10,s.armorDamage[target]+2);break;case 'blind':s.status[target].blind=2;break;case 'mark':s.focus[actor]=2;s.status[target].marked=2;break;case 'silence':s.status[target].silence=1;s.focus[target]=0;break;case 'focus':s.status[actor].blind=0;s.focus[actor]=1;break;case 'cool':s.heat[actor]=Math.max(0,s.heat[actor]-60);s.status[actor].burn=0;break;case 'decoy':s.evade[actor]=1;s.status[target].blind=1;break;case 'shock':s.status[target].jam=1;s.heat[actor]=Math.min(100,s.heat[actor]+8);break;}
   e.details.push(d.desc);
  }else {
   const count=action==='burst'?Math.min(g.stats.burst,s.ammo[actor]):1,focused=s.focus[actor],boost=s.boost[actor];s.focus[actor]=0;if(boost)s.boost[actor]--;
   const chance=clamp((g.stats.accuracy+focused*12+(s.status[target].marked?10:0)-(old.blind?25:0)-(old.slow?8:0)-(action==='burst'?10:0))/100,.15,.99);
   for(let n=0;n<count&&s.hp[target]>0;n++){s.ammo[actor]--;s.heat[actor]=Math.min(100,s.heat[actor]+g.stats.heat);const dealt=b.random()<chance?hit((g.stats.damage+(b.random()*10-5)+(boost?6:0))*(action==='burst'?.75:1),g.stats.pierce+(g.parts.ammo.effect==='pierce'?6:0),true):0;e.shots.push(dealt);if(s.heat[actor]>=100)break;}
   if(e.damage>0){switch(g.parts.ammo.effect){case 'burn':s.status[target].burn=2;break;case 'slow':s.status[target].slow=2;break;case 'shock':s.status[target].jam=1;break;case 'blind':s.status[target].blind=1;break;case 'poison':s.status[target].poison=2;break;case 'mark':s.status[target].marked=2;break;case 'focus':s.focus[actor]=1;break;case 'silence':s.status[target].silence=1;break;case 'push':s.focus[target]=0;break;case 'bounce':s.shield[actor]=Math.max(4,s.shield[actor]);break;}}
   e.text=`${g.name}: ${action==='burst'?'seria':'strzał'} — ${e.damage>0?'trafienie!':'pudło lub skuteczna osłona.'}`;
   if(s.heat[actor]>=85)e.details.push('Broń jest przegrzana — schłodź ją lub przeładuj.');
  }
 }else e.text=`${g.name} nie może kontynuować pojedynku.`;
 e.hp=[...s.hp];e.ammo=[...s.ammo];e.heat=[...s.heat];b.events.push(e);
 if(s.hp.some(x=>x<=0)){b.finished=true;b.reason='knockout';b.winner=s.hp[0]>0?0:1;}
 else if(b.events.length>=180){b.finished=true;b.reason='decision';const scores=s.hp.map((hp,i)=>hp/b.guns[i].stats.health);b.winner=Math.abs(scores[0]-scores[1])<1e-8?null:scores[0]>scores[1]?0:1;}
 b.actor=target;return e;
}
export function chooseGunAction(b){const a=gunActions(b),i=b.actor;if(b.state.ammo[i]===0||b.state.status[i].jam)return 'reload';if(b.state.heat[i]>=75)return 'cool';const d=a.filter(x=>x.startsWith('dial'));if(d.length&&b.random()<.45)return d[Math.floor(b.random()*d.length)];if(a.includes('burst')&&b.random()<.5)return 'burst';return a.includes('shoot')?'shoot':'cool';}
