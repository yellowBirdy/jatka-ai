import {createCombatState,resolveTurn} from './combat.js?v=god-41';
import {createTeamBattle,availableAttackers,availableTargets,takeTeamTurn} from './teams.js?v=god-41';
import {resolveTactic} from './tactics.js?v=god-41';
export function createDuelBattle(fighters,random=Math.random){
 if(fighters.length!==2)throw Error('Pojedynek wymaga dwóch wojowników.');
 const first=random()<(0.5+(fighters[0].stats.speed-fighters[1].stats.speed)/100)?0:1;
 return {fighters,state:createCombatState(fighters),first,activeActor:first,events:[],finished:false,winner:null,reason:null};
}
export function takeDuelTurn(battle,tactic='balanced',random=Math.random){
 resolveTactic(tactic);if(battle.finished)throw Error('Pojedynek został zakończony.');
 const actor=battle.activeActor,event=resolveTurn(battle.fighters,battle.state,actor,random,1-actor,tactic);battle.events.push(event);
 if(battle.state.hp.some(h=>h<=0)){battle.finished=true;battle.reason='knockout';battle.winner=battle.state.hp[0]>0?0:1;}
 else if(battle.events.length>=160){const scores=battle.state.hp.map((hp,i)=>hp/battle.fighters[i].stats.health);battle.finished=true;battle.reason='decision';battle.winner=scores[0]===scores[1]?battle.first:scores[0]>scores[1]?0:1;}
 battle.activeActor=1-actor;return event;
}
export function simulateTeamBattle(fighters,random=Math.random){
 const battle=createTeamBattle(fighters,random);
 while(!battle.finished){const actors=availableAttackers(battle),targets=availableTargets(battle);takeTeamTurn(battle,actors[Math.floor(random()*actors.length)],targets[Math.floor(random()*targets.length)],random);}
 return battle;
}
