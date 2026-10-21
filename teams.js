import {resolveTactic} from './tactics.js?v=shop-40';
import {createCombatState,resolveTurn} from './combat.js?v=shop-40';
export const teamOf=index=>Math.floor(index/2);
const living=(battle,team)=>battle.fighters.map((_,i)=>i).filter(i=>teamOf(i)===team&&battle.state.hp[i]>0);
export function createTeamBattle(fighters,random=Math.random){
 if(fighters.length!==4)throw Error('Tryb 2 na 2 wymaga czterech wojowników.');
 const speed=team=>fighters.slice(team*2,team*2+2).reduce((sum,f)=>sum+f.stats.speed,0);
 return {fighters,state:createCombatState(fighters),activeTeam:random()<speed(0)/(speed(0)+speed(1))?0:1,acted:[[],[]],events:[],finished:false,winner:null,reason:null};
}
export function availableAttackers(battle){
 if(battle.finished)return [];
 const alive=living(battle,battle.activeTeam),unused=alive.filter(i=>!battle.acted[battle.activeTeam].includes(i));
 return unused.length?unused:alive;
}
export const availableTargets=battle=>battle.finished?[]:living(battle,1-battle.activeTeam);
export function takeTeamTurn(battle,actor,target,random=Math.random,tactic='balanced'){
 resolveTactic(tactic);
 if(!Number.isInteger(actor)||!Number.isInteger(target)||!availableAttackers(battle).includes(actor)||!availableTargets(battle).includes(target))throw Error('Wybierz dostępnego wojownika i żywego przeciwnika.');
 const team=battle.activeTeam;
 if(!living(battle,team).some(i=>!battle.acted[team].includes(i)))battle.acted[team]=[];
 const event=resolveTurn(battle.fighters,battle.state,actor,random,target,tactic);
 battle.acted[team].push(actor);battle.events.push(event);
 const alive=[living(battle,0).length,living(battle,1).length];
 if(!alive[0]||!alive[1]){battle.finished=true;battle.winner=alive[0]?0:alive[1]?1:null;battle.reason=battle.winner===null?'draw':'knockout';}
 else if(battle.events.length>=320){
  const score=t=>living(battle,t).reduce((sum,i)=>sum+battle.state.hp[i]/battle.fighters[i].stats.health,0);
  const difference=score(0)-score(1);battle.finished=true;battle.winner=Math.abs(difference)<1e-10?null:difference>0?0:1;battle.reason=battle.winner===null?'draw':'decision';
 }
 battle.activeTeam=1-team;
 return event;
}
