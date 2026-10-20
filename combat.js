import {abilityRules as rules} from './abilities.js?v=unique-abilities-4';
const clamp=(x,min,max)=>Math.max(min,Math.min(max,x));
export function createCombatState(fighters){
 const state={hp:fighters.map(f=>f.stats.health),energy:fighters.map(f=>f.stats.stamina)};
 for(const key of ['turns','wrist','blind','exposed','armorDamage','slow','shield','tempo','focus','exposureStrength','burn','frozen','magicShield'])state[key]=[0,0];
 state.disarmed=[false,false];state.staggered=[false,false];return state;
}
export function resolveTurn(f,state,actor,random=Math.random){
 const target=1-actor,s=f[actor].stats,d=f[target].stats;
 const {hp,energy}=state;state.turns[actor]++;
 let selfDamage=0;
 const burnDetails=[];
 if(state.burn[actor]>0){
  state.burn[actor]--;selfDamage=Math.min(3,hp[actor]);hp[actor]-=selfDamage;burnDetails.push(`Podpalenie: ${f[actor].name} traci ${selfDamage} HP.`);
  if(hp[actor]===0)return {actor,target,damage:0,kind:'burn',ability:null,magic:null,magicDamage:0,selfDamage,healed:0,hp:[...hp],energy:[...energy],text:`${f[actor].name} nie może kontynuować walki po podpaleniu.`,exhausted:false,weakened:false,strikes:[0],details:burnDetails,counterDamage:0};
 }
 const ability=state.turns[actor]%4===0?f[actor].picks.ability:null;
 const rule=ability?rules[ability]:null;
 if(ability&&!rule)throw Error(`Nieznana umiejętność: ${ability}`);
 const details=[...burnDetails],strikes=[];let healed=0,counterDamage=0;
 const heal=amount=>{const actual=Math.min(amount,s.health-hp[actor]);hp[actor]+=actual;healed+=actual;};
 if(ability==='breathing'){energy[actor]=Math.min(s.stamina,energy[actor]+rule.energy);details.push(`Odzyskano kondycję: +${rule.energy} (do limitu).`);}
 const exhausted=energy[actor]<=0;
 const tempo=state.tempo[actor]>0;
 if(!tempo)energy[actor]=Math.max(0,energy[actor]-7);
 else state.tempo[actor]--;
 const speed=s.speed-state.slow[actor]-(state.frozen[actor]>0?8:0),enemySpeed=d.speed-state.slow[target]-(state.frozen[target]>0?8:0);
 if(state.frozen[actor]>0){state.frozen[actor]--;details.push('Lód ogranicza szybkość ruchów.');}
 let chance=clamp((s.accuracy+(speed-enemySpeed)*.65)/100,.35,.95);
 if(state.blind[actor]>0){chance-=rules.sand.accuracy;state.blind[actor]--;details.push('Piasek utrudnia widzenie.');}
 if(state.focus[actor]>0){chance+=rules['feint-strike'].focus;state.focus[actor]--;}
 if(tempo)chance+=rules.pace.accuracy;
 if(ability==='overhead')chance+=rule.accuracy;
 chance=clamp(chance,.1,.99);
 const weakened=state.disarmed[actor],staggered=state.staggered[actor];
 state.disarmed[actor]=false;state.staggered[actor]=false;
 const exposure=state.exposed[target]>0?state.exposureStrength[target]:0;
 if(state.exposed[target]>0)state.exposed[target]--;
 let bonus=ability==='rage'?rule.power:ability==='charge'?rule.power:ability==='shoulder'?rule.power:ability==='overhead'?rule.power:ability==='breathing'?rule.power:ability==='low-cut'?rule.power:ability==='lunge'?Math.min(rule.cap,rule.power+Math.max(0,speed-enemySpeed)*rule.speedRatio):0;
 if(tempo)bonus+=rules.pace.power;
 let defense=ability==='overhead'?0:Math.max(0,d.defense-state.armorDamage[target]-s.pierce-exposure-(ability==='gap'?rule.break:0)-(ability==='precise'?rule.pierce:0));
 const strength=s.attack+(random()*8-4)+bonus-(weakened?rules.disarm.penalty:0);
 const scale=(exhausted?.65:1)*(staggered?rules.pommel.ratio:1);
 const raw=(power,protection=defense)=>Math.max(2,Math.round((power-protection*.6)*scale));
 function strike(amount){let dealt=amount;
  if(state.shield[target]>0&&amount>0){const absorbed=Math.min(amount,state.shield[target]);dealt-=absorbed;state.shield[target]=0;details.push(`Osłona pochłania ${absorbed} obrażeń.`);}
  if(state.magicShield[target]>0&&dealt>0){const absorbed=Math.min(dealt,state.magicShield[target]);dealt-=absorbed;state.magicShield[target]=0;details.push(`Magiczna osłona pochłania ${absorbed} obrażeń.`);}
  const actual=Math.min(hp[target],dealt);hp[target]-=actual;strikes.push(actual);
  if(actual>0&&hp[target]>0&&state.wrist[target]>0){
   state.wrist[target]=0;counterDamage=Math.min(hp[actor],rules['wrist-lock'].counter);hp[actor]-=counterDamage;
   details.push(`${f[target].name} kontruje za ${counterDamage} HP.`);
  }
 }
 const hit=ability==='precise'||random()<chance;
 strike(hit?raw(strength):0);
 if(ability==='combo'&&hp[target]>0&&hp[actor]>0){strike(random()<chance?raw(strength*rule.ratio):0);details.push(`Seria dwóch ciosów: ${strikes.join(' + ')} HP.`);}
 if(ability==='feint-strike'&&hp[actor]>0){
  if(!hit)strike(Math.max(2,Math.round(raw(strength)*rule.ratio)));
  else state.focus[actor]=1;
 }
 if(ability==='charge'){
  state.exposureStrength[actor]=Math.max(state.exposed[actor]>0?state.exposureStrength[actor]:0,rule.exposure);
  state.exposed[actor]=Math.max(state.exposed[actor],1);
  details.push('Szarża odsłania gardę.');
 }
 if(hit&&hp[actor]>0)switch(ability){
  case 'disarm':state.disarmed[target]=true;details.push('Rozbrojenie: następny atak rywala ma −12 siły.');break;
  case 'shoulder':{const drain=Math.min(energy[target],rule.drain);energy[target]-=drain;details.push(`Uderzenie barkiem: −${drain} kondycji rywala.`);break;}
  case 'wrist-lock':if(hp[actor]>0)state.wrist[actor]=1;details.push('Blokada nadgarstka: przygotowana jednorazowa kontra.');break;
  case 'weapon-hook':state.exposed[target]=rule.duration;state.exposureStrength[target]=rule.pierce;details.push('Zaczepienie broni odsłania gardę na dwa ataki.');break;
  case 'sand':state.blind[target]=rule.duration;details.push('Piasek w oczy: dwa ataki z mniejszą celnością.');break;
  case 'pommel':state.staggered[target]=true;details.push('Cios głowicą: następny atak rywala jest osłabiony procentowo.');break;
  case 'gap':{const old=state.armorDamage[target];state.armorDamage[target]=Math.min(rule.cap,Math.max(0,d.defense),old+rule.break);details.push(`Pancerz trwale osłabiony o ${state.armorDamage[target]-old}.`);break;}
  case 'low-cut':{const old=state.slow[target];state.slow[target]=Math.min(rule.cap,old+rule.slow);details.push(`Szybkość rywala spada o ${state.slow[target]-old}.`);break;}
 }
 if(ability==='breath'&&hp[actor]>0){heal(rule.heal);energy[actor]=Math.min(s.stamina,energy[actor]+rule.energy);}
 if(ability==='rally'&&hp[actor]>0&&hp[actor]<s.health*rule.threshold)heal(rule.heal);
 if(ability==='reset-stance'){state.shield[actor]=rule.shield;details.push(`Osłona następnego trafienia: ${rule.shield} HP.`);}
 if(ability==='pace'){state.tempo[actor]=rule.duration;details.push('Dwa kolejne ataki w oszczędnym tempie.');}
 let magic=null,magicDamage=0;
 if(f[actor].mode==='fantasy'&&state.turns[actor]%5===0&&hp[actor]>0&&hp[target]>0){
  magic=f[actor].picks.magicPower;
  switch(magic){
   case 'fire':state.burn[target]=2;details.push('Płomień: podpalenie rywala na dwa jego ataki.');break;
   case 'frost':state.frozen[target]=2;details.push('Uścisk lodu: −8 szybkości rywala na dwa jego ataki.');break;
   case 'lightning':{let power=8;
    if(state.magicShield[target]>0){const absorbed=Math.min(power,state.magicShield[target]);power-=absorbed;state.magicShield[target]=0;details.push(`Magiczna osłona pochłania ${absorbed} obrażeń błyskawicy.`);}
    magicDamage=Math.min(hp[target],power);hp[target]-=magicDamage;details.push(`Błyskawica: −${magicDamage} HP przez pancerz.`);break;
   }
   case 'healing':heal(12);details.push('Odnowa przywraca zdrowie do jego maksymalnego poziomu.');break;
   case 'earth':state.magicShield[actor]=8;details.push('Kamienna aura: osłona jednego trafienia do 8 HP.');break;
   default:throw Error(`Nieznana moc: ${magic}`);
  }
 }
 const damage=strikes.reduce((sum,n)=>sum+n,0);
 const kind=damage>0?(damage<8?'block':'hit'):hit?'block':'dodge';
 const text=damage>0?`${f[actor].name}: ${kind==='block'?'cios częściowo zablokowany':'trafienie'} −${damage} HP.`:hit?`${f[target].name} blokuje atak ${f[actor].name}.`:`${f[target].name} unika ataku ${f[actor].name}.`;
 return {actor,target,damage,kind,ability,healed,hp:[...hp],energy:[...energy],text,exhausted,weakened,strikes,details,counterDamage,magic,magicDamage,selfDamage};
}
