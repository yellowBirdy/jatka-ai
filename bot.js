import {createFighter} from './engine.js?v=crossover-58';
import {normalizeMaterials,getWeaponMaterials} from './materials.js?v=crossover-58';
import {getBeastArmors} from './mounts.js?v=crossover-58';
import {getBeastAbilities} from './beast-abilities.js?v=crossover-58';
import {createDuelBattle,takeDuelTurn} from './turns.js?v=crossover-58';
import {createTeamBattle,availableAttackers,availableTargets,takeTeamTurn} from './teams.js?v=crossover-58';
const pick=(pool,random)=>pool[Math.floor(random()*pool.length)];
export function createBotFighter(config,random=Math.random){
 let picks=Object.fromEntries(Object.entries(config.offers).map(([key,pool])=>[key,pick(pool,random).id]));
 for(const [key,pool]of Object.entries(config.fantasyOffers))picks[key]=pick(pool,random).id;
 for(const [key,group]of Object.entries(getWeaponMaterials(picks.weapon)))picks[key]=pick(group.options,random).id;
 picks=normalizeMaterials(picks);
 const beast=pick(config.mountOffers,random);picks.beast=beast.id;picks.beastArmor=pick(getBeastArmors(beast.id),random).id;picks.beastAbility=pick(getBeastAbilities(beast.id),random).id;
 const name=`Bot ${['Kruk','Ryś'][config.index%2||0]}`;
 return createFighter(name,picks,config.duration,config.mode,config.mounted);
}
export function chooseBotTactic(battle,actor,target,random=Math.random){
 const {hp,energy}=battle.state,s=battle.fighters[actor].stats;
 if(energy[actor]<7&&hp[actor]>s.health*.2)return 'rest';
 if(hp[target]<=Math.max(8,s.attack*.65))return 'aggressive';
 if(hp[actor]<s.health*.25&&random()<.3)return 'defend';
 if(s.accuracy<75&&random()<.55)return 'cautious';
 return random()<.4?'aggressive':'balanced';
}
export function chooseBotTeamAction(battle,random=Math.random){
 const actors=availableAttackers(battle),targets=availableTargets(battle);if(!actors.length||!targets.length)throw Error('Brak dostępnego ruchu.');
 const actor=actors.reduce((best,i)=>{const score=j=>(battle.state.energy[j]>=7?30:0)+battle.fighters[j].stats.attack+battle.state.hp[j]/battle.fighters[j].stats.health*5;return score(i)>score(best)?i:best;});
 const target=targets.reduce((best,i)=>battle.state.hp[i]<battle.state.hp[best]?i:best);
 return {actor,target,tactic:chooseBotTactic(battle,actor,target,random)};
}
export function simulateBotDuel(fighters,humanTactic='balanced',random=Math.random){
 const battle=createDuelBattle(fighters,random);while(!battle.finished){const actor=battle.activeActor;takeDuelTurn(battle,actor===1?chooseBotTactic(battle,actor,1-actor,random):humanTactic,random);}return battle;
}
export function simulateBotTeams(fighters,random=Math.random){
 const battle=createTeamBattle(fighters,random);while(!battle.finished){const a=chooseBotTeamAction(battle,random);takeTeamTurn(battle,a.actor,a.target,random,a.tactic);}return battle;
}
