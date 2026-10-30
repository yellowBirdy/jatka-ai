import {animeFruits,animeDials} from './anime-catalog.js?v=anime-53';
import {categories,createFighter} from './engine.js?v=anime-53';
import {createCombatState,resolveTurn} from './combat.js?v=anime-53';
export {animeFruits,animeDials};
export const animeWeapons=categories.find(c=>c.id==='weapon').options;
function draw(source,random){const pool=[...source];for(let i=pool.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}return pool.slice(0,5);}
export function drawAnimeOptions(random=Math.random){return {fruit:draw(animeFruits,random),weapon:draw(animeWeapons,random),dial:draw(animeDials,random)};}
export function createAnimeFighter(name,picks,duration='medium'){
 const fruit=animeFruits.find(o=>o.id===picks.fruit),dial=animeDials.find(o=>o.id===picks.dial);
 if(!fruit||!dial)throw Error('Wybierz owoc i dial z katalogu.');
 if(!animeWeapons.some(o=>o.id===picks.weapon))throw Error('Wybierz broń z katalogu.');
 const defaults=Object.fromEntries(categories.map(c=>[c.id,c.options[0].id]));
 const f=createFighter(name,{...defaults,weapon:picks.weapon,armor:'leather',origin:'nomad',style:'balanced',ability:'precise',weakness:'predictable',advantage:'endurance'},duration);
 f.anime={fruit,dial};f.traits.fruit=fruit;f.traits.dial=dial;return f;
}
export function createAnimeBattle(fighters,random=Math.random){
 if(fighters.length!==2||fighters.some(f=>!f.anime))throw Error('Potrzebni są dwaj wojownicy anime.');
 const first=random()<(0.5+(fighters[0].stats.speed-fighters[1].stats.speed)/100)?0:1;
 return {fighters,state:createCombatState(fighters),activeActor:first,first,random,events:[],finished:false,winner:null,reason:null};
}
function applyPower(battle,event,power){
 const {state,fighters}=battle,{actor,target}=event,rule=power.rule;let dealt=0,healed=0;
 if(rule.damage){let amount=rule.damage;const absorbed=Math.min(state.barrier[target],amount);state.barrier[target]-=absorbed;amount-=absorbed;dealt=Math.min(state.hp[target],amount);state.hp[target]-=dealt;event.magicDamage=(event.magicDamage||0)+dealt;}
 if(rule.heal||rule.drain){healed=Math.min((rule.heal||0)+(rule.drain?dealt:0),fighters[actor].stats.health-state.hp[actor]);state.hp[actor]+=healed;event.healed+=healed;}
 if(rule.shield)state.barrier[actor]=Math.max(state.barrier[actor],rule.shield);
 if(rule.status)state[rule.status][rule.self?actor:target]=Math.max(state[rule.status][rule.self?actor:target],rule.turns);
 if(rule.armor)state.armorDamage[target]=Math.min(9,state.armorDamage[target]+rule.armor);
 if(rule.energy)state.energy[actor]=Math.min(fighters[actor].stats.stamina,state.energy[actor]+rule.energy);
 if(rule.boost)state.battlecry[actor]=Math.max(state.battlecry[actor],rule.boost);
 if(rule.evade)state.blink[actor]=Math.max(state.blink[actor],rule.evade);
 if(rule.recoil){const recoil=Math.min(rule.recoil,Math.max(0,state.hp[actor]-1));state.hp[actor]-=recoil;event.selfDamage+=recoil;}
 event.details.push(`${power.name}: ${power.desc}${rule.damage?` Zadano ${dealt} HP.`:''}${rule.heal||rule.drain?` Przywrócono ${healed} HP.`:''}`);
}
export function advanceAnime(battle,tactic='balanced',random=battle.random){
 if(battle.finished)throw Error('Walka zakończona.');
 const actor=battle.activeActor,target=1-actor,suppressed=battle.state.stunned[actor]>0;
 const event=resolveTurn(battle.fighters,battle.state,actor,random,target,tactic);event.fruit=null;event.dial=null;
 if(!['rest','defend'].includes(tactic)&&!suppressed&&battle.state.hp[actor]>0&&battle.state.hp[target]>0){
  for(const key of ['fruit','dial']){const power=battle.fighters[actor].anime[key];if(battle.state.hp[target]>0&&random()<power.chance){applyPower(battle,event,power);event[key]=power.id;}}
 }
 event.hp=[...battle.state.hp];event.energy=[...battle.state.energy];battle.events.push(event);
 if(event.hp.some(h=>h===0)){battle.finished=true;battle.reason='knockout';battle.winner=event.hp[0]>0?0:1;}
 else if(battle.events.length>=160){battle.finished=true;battle.reason='decision';const scores=event.hp.map((hp,i)=>hp/battle.fighters[i].stats.health);battle.winner=scores[0]===scores[1]?battle.first:scores[0]>scores[1]?0:1;}
 battle.activeActor=target;return event;
}
