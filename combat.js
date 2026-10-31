import {applyArmorSkill} from './armor-skills.js?v=guns-60';
import {resolveTactic} from './tactics.js?v=guns-60';
import {applyBeastAbility} from './beast-abilities.js?v=guns-60';
import {rollChance} from './probability.js?v=guns-60';
import {magicRules} from './fantasy.js?v=guns-60';
import {abilityRules as rules} from './abilities.js?v=guns-60';
const clamp=(x,min,max)=>Math.max(min,Math.min(max,x));
export function attackVariation(attack,random=Math.random){return (random()*2-1)*Math.max(8,attack*.25);}
export function createCombatState(fighters){
 const state={hp:fighters.map(f=>f.stats.health),energy:fighters.map(f=>f.stats.stamina)};
 for(const key of ['armorTurns','armorRescue','guard','tacticDefense','venom','turns','wrist','blind','exposed','armorDamage','slow','shield','tempo','focus','exposureStrength','burn','frozen','magicShield','silenced','rooted','thorns','barrier','marked','blink','battlecry','stunned','mist'])state[key]=fighters.map(()=>0);
 state.disarmed=fighters.map(()=>false);state.staggered=fighters.map(()=>false);return state;
}
export function resolveTurn(f,state,actor,random=Math.random,target=1-actor,tactic='balanced'){
 const plan=resolveTactic(tactic);
 const s=f[actor].stats,d=f[target].stats;
 const {hp,energy}=state;state.turns[actor]++;state.tacticDefense[actor]=0;state.guard[actor]=0;
 let selfDamage=0;
 const burnDetails=[];
 for(const [status,label] of [['burn','Podpalenie'],['venom','Jad']])if(state[status][actor]>0){
  state[status][actor]--;const amount=Math.min(3,hp[actor]);selfDamage+=amount;hp[actor]-=amount;burnDetails.push(`${label}: ${f[actor].name} traci ${amount} HP.`);
  if(hp[actor]===0)return {actor,target,damage:0,kind:status,ability:null,beastAbility:null,magic:null,magicDamage:0,selfDamage,healed:0,hp:[...hp],energy:[...energy],text:`${f[actor].name} nie może kontynuować walki.`,exhausted:false,weakened:false,strikes:[0],details:burnDetails,counterDamage:0};
 }
 state.tacticDefense[actor]=plan.defense;
 if(tactic==='rest'||tactic==='defend'){
  if(tactic==='defend')state.guard[actor]=1;
  const restored=tactic==='rest'?Math.min(21,Math.max(0,s.stamina-energy[actor])):0;energy[actor]+=restored;
  return {actor,target,tactic,restored,damage:0,kind:tactic,ability:null,beastAbility:null,magic:null,magicDamage:0,selfDamage,healed:0,hp:[...hp],energy:[...energy],text:tactic==='rest'?`${f[actor].name} odpoczywa i odzyskuje ${restored} kondycji.`:`${f[actor].name} broni się: następne trafienie bronią zada o połowę mniej obrażeń.`,exhausted:false,weakened:false,strikes:[0],details:burnDetails,counterDamage:0};
 }
 const selectedAbility=f[actor].picks.ability;
 if(!rules[selectedAbility])throw Error(`Nieznana umiejętność: ${selectedAbility}`);
 const stunned=state.stunned[actor]>0;if(stunned)state.stunned[actor]--;
 const silenced=state.silenced[actor]>0;if(silenced)state.silenced[actor]--;
 const ability=!stunned&&rollChance(rules[selectedAbility].chance,random)?selectedAbility:null;
 const rule=ability?rules[ability]:null;
 if(ability&&!rule)throw Error(`Nieznana umiejętność: ${ability}`);
 const details=[...burnDetails,...(tactic==='balanced'?[]:[`Taktyka: ${plan.name}. ${plan.desc}`])],strikes=[];let healed=0,counterDamage=0;
 const heal=amount=>{const actual=Math.min(amount,s.health-hp[actor]);hp[actor]+=actual;healed+=actual;};
 const armorSkill=applyArmorSkill({fighters:f,state,actor,target,heal,details});
 if(ability==='breathing'){energy[actor]=Math.min(s.stamina,energy[actor]+rule.energy);details.push(`Odzyskano kondycję: +${rule.energy} (do limitu).`);}
 if(state.rooted[actor]>0){state.rooted[actor]--;energy[actor]=Math.max(0,energy[actor]-10);details.push('Korzenie: dodatkowy koszt 10 kondycji.');}
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
 if(state.mist[target]>0){state.mist[target]--;chance-=.2;details.push('Mgła utrudnia trafienie.');}
 if(ability==='overhead')chance+=rule.accuracy;
 chance=clamp(chance+plan.accuracy,.1,.99);
 const weakened=state.disarmed[actor],staggered=state.staggered[actor];
 state.disarmed[actor]=false;state.staggered[actor]=false;
 const exposure=state.exposed[target]>0?state.exposureStrength[target]:0;
 if(state.exposed[target]>0)state.exposed[target]--;
 let bonus=ability==='rage'?rule.power:ability==='charge'?rule.power:ability==='shoulder'?rule.power:ability==='overhead'?rule.power:ability==='breathing'?rule.power:ability==='low-cut'?rule.power:ability==='lunge'?Math.min(rule.cap,rule.power+Math.max(0,speed-enemySpeed)*rule.speedRatio):0;
 if(tempo)bonus+=rules.pace.power;
 if(state.battlecry[actor]>0){state.battlecry[actor]--;bonus+=4;details.push('Runiczny okrzyk: +4 siły.');}
 let defense=ability==='overhead'?0:Math.max(0,d.defense+state.tacticDefense[target]-state.armorDamage[target]-s.pierce-exposure-(ability==='gap'?rule.break:0)-(ability==='precise'?rule.pierce:0));
 const strength=s.attack+plan.attack+(armorSkill?.id==='emperor'?5:0)+attackVariation(s.attack,random)+bonus-(weakened?rules.disarm.penalty:0);
 const scale=(exhausted?.65:1)*(staggered?rules.pommel.ratio:1);
 const raw=(power,protection=defense)=>Math.max(2,Math.round((power-protection*.6)*scale));
 function strike(amount){let dealt=amount;
  if(amount>0&&state.marked[target]>0){state.marked[target]--;dealt+=3;details.push('Piętno słabości: +3 obrażenia.');}
  if(state.guard[target]>0&&dealt>0){state.guard[target]=0;dealt=Math.ceil(dealt/2);details.push('Obrona zmniejsza obrażenia tego trafienia o połowę.');}
  if(state.barrier[target]>0&&dealt>0){const absorbed=Math.min(dealt,state.barrier[target]);dealt-=absorbed;state.barrier[target]-=absorbed;details.push(`Bariera pochłania ${absorbed} obrażeń.`);}
  if(state.shield[target]>0&&dealt>0){const absorbed=Math.min(dealt,state.shield[target]);dealt-=absorbed;state.shield[target]=0;details.push(`Osłona pochłania ${absorbed} obrażeń.`);}
  if(state.magicShield[target]>0&&dealt>0){const absorbed=Math.min(dealt,state.magicShield[target]);dealt-=absorbed;state.magicShield[target]=0;details.push(`Magiczna osłona pochłania ${absorbed} obrażeń.`);}
  const actual=Math.min(hp[target],dealt);hp[target]-=actual;strikes.push(actual);
  if(actual>0&&hp[target]>0&&state.wrist[target]>0){
   state.wrist[target]=0;counterDamage=Math.min(hp[actor],rules['wrist-lock'].counter);hp[actor]-=counterDamage;
   details.push(`${f[target].name} kontruje za ${counterDamage} HP.`);
  }
  if(actual>0&&hp[target]>0&&hp[actor]>0&&state.thorns[target]>0){state.thorns[target]--;const reflected=Math.min(4,hp[actor]);hp[actor]-=reflected;counterDamage+=reflected;details.push(`Ciernie odbijają ${reflected} HP.`);}
 }
 const evaded=state.blink[target]>0;if(evaded){state.blink[target]--;details.push('Migotanie: unik całego ataku bronią.');}
 const hit=!evaded&&(ability==='precise'||random()<chance);
 const weaponStrike=amount=>strike(amount>0?amount+(f[actor].mounted?10:0):0);
 weaponStrike(hit?raw(strength):0);
 if(armorSkill?.id==='wargod'&&hp[actor]>0&&hp[target]>0)strike(10);
 if(ability==='combo'&&!evaded&&hp[target]>0&&hp[actor]>0){weaponStrike(random()<chance?raw(strength*rule.ratio):0);details.push(`Seria dwóch ciosów: ${strikes.join(' + ')} HP.`);}
 if(ability==='feint-strike'&&!evaded&&hp[actor]>0){
  if(!hit)weaponStrike(Math.max(2,Math.round(raw(strength)*rule.ratio)));
  else state.focus[actor]=Math.max(state.focus[actor],1);
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
 if(ability==='reset-stance'){state.shield[actor]=Math.max(state.shield[actor],rule.shield);details.push(`Osłona następnego trafienia: ${rule.shield} HP.`);}
 if(ability==='pace'){state.tempo[actor]=rule.duration;details.push('Dwa kolejne ataki w oszczędnym tempie.');}
 const beastAbility=applyBeastAbility({f,state,actor,target,random,strike,heal,details});
 let magic=null,magicDamage=0;
 if(f[actor].mode==='fantasy'&&!silenced&&hp[actor]>0&&hp[target]>0&&rollChance(magicRules[f[actor].picks.magicPower].chance,random)){
  magic=f[actor].picks.magicPower;
  details.push(`Magia: ${magicRules[magic].name}.`);
  const magicHit=power=>{
   let amount=power;
   if(state.magicShield[target]>0){const absorbed=Math.min(amount,state.magicShield[target]);amount-=absorbed;state.magicShield[target]=0;details.push(`Magiczna osłona pochłania ${absorbed} obrażeń.`);}
   const dealt=Math.min(hp[target],amount);hp[target]-=dealt;magicDamage+=dealt;return dealt;
  };
  switch(magic){
   case 'fire':state.burn[target]=2;details.push('Płomień: podpalenie rywala na dwa jego ataki.');break;
   case 'frost':state.frozen[target]=2;details.push('Uścisk lodu: −8 szybkości rywala na dwa jego ataki.');break;
   case 'lightning':{let power=8;
    if(state.magicShield[target]>0){const absorbed=Math.min(power,state.magicShield[target]);power-=absorbed;state.magicShield[target]=0;details.push(`Magiczna osłona pochłania ${absorbed} obrażeń błyskawicy.`);}
    magicDamage=Math.min(hp[target],power);hp[target]-=magicDamage;details.push(`Błyskawica: −${magicDamage} HP przez pancerz.`);break;
   }
   case 'healing':heal(12);details.push('Odnowa przywraca zdrowie do jego maksymalnego poziomu.');break;
   case 'earth':state.magicShield[actor]=8;details.push('Kamienna aura: osłona jednego trafienia do 8 HP.');break;
   case 'life-drain':{const stolen=magicHit(6);heal(stolen);details.push(`Kradzież życia: ${stolen} HP.`);break;}
   case 'silence':magicHit(3);state.silenced[target]=2;details.push('Cisza blokuje dwa kolejne losowania magii rywala.');break;
   case 'cleanse':for(const key of ['venom','burn','frozen','blind','silenced','rooted','disarmed','staggered','stunned'])state[key][actor]=typeof state[key][actor]==='boolean'?false:0;heal(4);details.push('Usunięto negatywne efekty; oczyszczenie leczy do 4 HP.');break;
   case 'mana':{const amount=Math.min(32,s.stamina-energy[actor]);energy[actor]+=amount;details.push(`Przypływ energii: +${amount} kondycji.`);break;}
   case 'meteor':magicHit(16);{const recoil=Math.min(4,hp[actor]-1);hp[actor]-=recoil;selfDamage+=recoil;details.push(`Meteor: odrzut odbiera ${recoil} HP rzucającemu.`);}break;
   case 'roots':state.rooted[target]=2;state.magicShield[actor]=Math.max(state.magicShield[actor],4);details.push('Korzenie zwiększają koszt dwóch ataków; osłona do 4 HP.');break;
   case 'thorns':state.thorns[actor]=2;details.push('Ciernie przygotowane na dwa trafienia.');break;
   case 'barrier':state.barrier[actor]=12;details.push('Bariera: pula 12 punktów ochrony przed bronią.');break;
   case 'mark':state.marked[target]=2;details.push('Dwa kolejne trafienia w rywala mają +3 obrażenia.');break;
   case 'blink':state.blink[actor]=1;details.push('Migotanie przygotowuje unik następnego ataku.');break;
   case 'battlecry':state.battlecry[actor]=2;details.push('Runiczny okrzyk wzmacnia dwa kolejne ataki.');break;
   case 'dispel':for(const key of ['shield','magicShield','barrier','thorns','wrist'])state[key][target]=0;magicHit(4);details.push('Osłony i przygotowane kontry rywala rozproszone.');break;
   case 'entropy':{const stolen=Math.min(20,energy[target]);energy[target]-=stolen;const recovered=Math.min(stolen,s.stamina-energy[actor]);energy[actor]+=recovered;details.push(`Kondycja rywala −${stolen}, własna +${recovered}.`);break;}
   case 'thunder':magicHit(3);state.stunned[target]=1;details.push('Grom blokuje następną specjalną umiejętność rywala.');break;
   case 'mist':state.mist[actor]=2;details.push('Mgła chroni przed dwoma kolejnymi atakami.');break;
   default:throw Error(`Nieznana moc: ${magic}`);
  }
 }
 const damage=strikes.reduce((sum,n)=>sum+n,0);
 const kind=damage>0?(damage<8?'block':'hit'):hit?'block':'dodge';
 const text=damage>0?`${f[actor].name}: ${kind==='block'?'cios częściowo zablokowany':'trafienie'} −${damage} HP.`:hit?`${f[target].name} blokuje atak ${f[actor].name}.`:`${f[target].name} unika ataku ${f[actor].name}.`;
 return {actor,target,tactic,damage,kind,ability,armorAbility:armorSkill?.id||null,beastAbility,healed,hp:[...hp],energy:[...energy],text,exhausted,weakened,strikes,details,counterDamage,magic,magicDamage,selfDamage};
}
