import {buildArmyRoster} from './army-roster.js?v=anime-54';
import {resolveArmyTraits} from './army-traits.js?v=anime-54';
import {categories,createFighter} from './engine.js?v=anime-54';
import {createCombatState,resolveTurn} from './combat.js?v=anime-54';
export const armyBudgets=[500,800,1200,10000];
const baseArmyUnits=[
 {id:'infantry',name:'Piechur',icon:'⚔',cost:80,role:'front',desc:'Tania, uniwersalna pierwsza linia.',picks:{weapon:'sword',armor:'mail',origin:'legionary',style:'balanced',ability:'breath',advantage:'endurance',weakness:'predictable'}},
 {id:'spearman',name:'Włócznik',icon:'♜',cost:100,role:'front',desc:'Zasięg włóczni i przebijające pchnięcia.',picks:{weapon:'spear',armor:'leather',origin:'spartan',style:'thrusting',ability:'precise',advantage:'reach',weakness:'fragile'}},
 {id:'guard',name:'Gwardzista',icon:'⬢',cost:120,role:'front',desc:'Ciężki pancerz chroni tylną linię.',picks:{weapon:'hammer',armor:'plate',origin:'guard',style:'fortress',ability:'wrist-lock',advantage:'iron-body',weakness:'slow'}},
 {id:'berserker',name:'Berserker',icon:'✹',cost:110,role:'front',desc:'Potężne ciosy, ale słabsza ochrona.',picks:{weapon:'axe',armor:'hide',origin:'viking',style:'brutal',ability:'rage',advantage:'strength',weakness:'reckless'}},
 {id:'rider',name:'Kawalerzysta',icon:'♞',cost:160,role:'flank',desc:'Koń bojowy. Omija front i atakuje wsparcie.',beast:'horse',picks:{weapon:'sabre',armor:'brigandine',origin:'knight',style:'mobile',ability:'charge',advantage:'quick-feet',weakness:'poor-guard'}},
 {id:'wolf-rider',name:'Wilczy jeździec',icon:'🐺',cost:170,role:'flank',desc:'Mobilny oddział na wilku. Osacza tylną linię.',beast:'wolf',picks:{weapon:'spear',armor:'leather',origin:'nomad',style:'ambush',ability:'lunge',advantage:'reflex',weakness:'fragile'}},
 {id:'mage',name:'Mag bitewny',icon:'✦',cost:180,role:'support',desc:'Błyskawice zza pierwszej linii. Chroń go piechotą.',picks:{weapon:'staff',armor:'cloth',origin:'monk',style:'distance',ability:'precise',advantage:'precision',weakness:'fragile',specialItem:'focus-charm',magicPower:'lightning'},mode:'fantasy'},
 {id:'halberdier',name:'Halabardnik',icon:'⚒',cost:115,role:'front',desc:'Długie ostrze i szerokie zamachy na pierwszej linii.',picks:{weapon:'halberd',armor:'lamellar',origin:'mercenary',style:'sweeping',ability:'overhead',advantage:'reach',weakness:'tired'}},
 {id:'duelist',name:'Szermierz',icon:'✧',cost:105,role:'flank',desc:'Lekki rapier i rozbrojenie. Omija pierwszą linię.',picks:{weapon:'rapier',armor:'leather',origin:'duelist',style:'fencing',ability:'disarm',advantage:'timing',weakness:'fragile'}},
 {id:'gladiator',name:'Gladiator',icon:'♆',cost:115,role:'front',desc:'Trójząb, sieć i doświadczenie walk na arenie.',picks:{weapon:'trident',armor:'brigandine',origin:'gladiator',style:'counter',secondary:'net',ability:'wrist-lock',advantage:'resolve',weakness:'old-wound'}},
 {id:'monk',name:'Mnich bojowy',icon:'☯',cost:95,role:'flank',desc:'Techniczna walka kosturem i kontrola oddechu.',picks:{weapon:'staff',armor:'quilted',origin:'monk',style:'technical',ability:'breathing',advantage:'balance',weakness:'poor-eye'}},
 {id:'samurai',name:'Samuraj',icon:'◇',cost:130,role:'front',desc:'Miecz, precyzyjne cięcia i pancerz lamelkowy.',picks:{weapon:'sword',armor:'lamellar',origin:'samurai',style:'measured',ability:'gap',advantage:'precision',weakness:'old-wound'}},
 {id:'knight',name:'Rycerz pancerny',icon:'⬟',cost:135,role:'front',desc:'Ciężki młot, półzbroja i niezłomna postawa.',picks:{weapon:'hammer',armor:'halfplate',origin:'knight',style:'pressure',ability:'shoulder',advantage:'iron-body',weakness:'heavy-feet'}},
 {id:'pikeman',name:'Pikinier',icon:'↑',cost:100,role:'front',desc:'Długa pika, trzymanie dystansu i zahaczanie broni.',picks:{weapon:'pike',armor:'leather',origin:'guard',style:'thrusting',ability:'weapon-hook',advantage:'reach',weakness:'tired'}},
 {id:'scout',name:'Zwiadowca',icon:'◈',cost:85,role:'flank',desc:'Tani, zwinny flankier z fałszywym atakiem.',picks:{weapon:'falchion',armor:'leather',origin:'hunter',style:'ambush',ability:'feint-strike',advantage:'awareness',weakness:'fragile'}},
 {id:'lancer',name:'Kopijnik',icon:'♘',cost:175,role:'flank',desc:'Opancerzony jeździec z włócznią i szarżą.',beast:'horse',picks:{weapon:'spear',armor:'plate',origin:'knight',style:'offensive',ability:'charge',advantage:'strength',weakness:'slow'}},
 {id:'boar-rider',name:'Jeździec dzika',icon:'🐗',cost:180,role:'flank',desc:'Kły bestii uszkadzają pancerz. Atakuje tylną linię.',beast:'boar',picks:{weapon:'axe',armor:'hardened',origin:'highlander',style:'brutal',ability:'overhead',advantage:'toughness',weakness:'reckless'}},
 {id:'frost-mage',name:'Mag lodu',icon:'❄',cost:180,role:'support',desc:'Spowalnia przeciwnika lodową magią.',mode:'fantasy',picks:{weapon:'staff',armor:'linen',origin:'monk',style:'distance',ability:'precise',advantage:'precision',weakness:'fragile',specialItem:'focus-charm',magicPower:'frost'}},
 {id:'healer',name:'Uzdrowiciel',icon:'✚',cost:170,role:'support',desc:'Magiczna odnowa leczy jego własne rany.',mode:'fantasy',picks:{weapon:'staff',armor:'cloth',origin:'monk',style:'defensive',ability:'breathing',advantage:'endurance',weakness:'fragile',specialItem:'vitality',magicPower:'healing'}},
 {id:'fire-mage',name:'Mag ognia',icon:'♨',cost:180,role:'support',desc:'Podpala cel, zadając obrażenia przez osłony.',mode:'fantasy',picks:{weapon:'staff',armor:'linen',origin:'desert',style:'pressure',ability:'precise',advantage:'precision',weakness:'fragile',specialItem:'strength-belt',magicPower:'fire'}}

];
export const armyUnitGroups=buildArmyRoster(baseArmyUnits);
export const armyUnits=armyUnitGroups.flatMap(group=>group.options);
export const armyUnitLimit=budget=>budget===10000?Infinity:12;
export function drawArmyRecruitment(random=Math.random){return Object.fromEntries(armyUnitGroups.map(group=>[group.id,drawArmyOffer(random,group.options)]));}
const unitFor=id=>armyUnits.find(u=>u.id===id);
export function armyCost(units){return units.reduce((sum,id)=>{const unit=unitFor(id);if(!unit)throw Error('Nieznana jednostka.');return sum+unit.cost;},0);}
export function validateArmy(army,budget){
 if(!armyBudgets.includes(budget))throw Error('Wybierz budżet rekrutacji.');
 if(!army||typeof army.name!=='string'||!army.name.trim()||army.name.trim().length>40)throw Error('Nazwa armii musi mieć od 1 do 40 znaków.');
 if(!Array.isArray(army.units)||army.units.length<1||army.units.length>armyUnitLimit(budget))throw Error(budget===10000?'Zrekrutuj przynajmniej jedną jednostkę.':'Armia musi liczyć od 1 do 12 jednostek.');
 if(!['balanced','aggressive','cautious'].includes(army.tactic))throw Error('Wybierz taktykę armii.');
 if(army.offer&&(!Array.isArray(army.offer)||army.units.some(id=>!army.offer.includes(id))))throw Error('Rekrutuj tylko jednostki z wylosowanej oferty.');
 resolveArmyTraits(army);
 if(armyCost(army.units)>budget)throw Error('Armia przekracza budżet rekrutacji.');return true;
}
export function createArmySoldier(id,index=0){
 const unit=unitFor(id);if(!unit)throw Error('Nieznana jednostka.');
 const defaults=Object.fromEntries(categories.map(c=>[c.id,c.options[0].id]));
 const picks={...defaults,...unit.picks,...(unit.beast?{beast:unit.beast,beastArmor:'none',beastAbility:unit.beast}:{})};
 const fighter=createFighter(`${unit.name.slice(0,19)} ${index+1}`,picks,'short',unit.mode||'classic',!!unit.beast);
 fighter.armyUnitId=unit.id;fighter.armyRanged=unit.ranged||null;
 if(unit.ranged)fighter.traits.weapon={...fighter.traits.weapon,name:unit.ranged==='crossbow'?'Kusza':'Łuk'};
 for(const [key,n]of Object.entries(unit.bonus||{}))fighter.stats[key]=Math.max(1,fighter.stats[key]+n);
 return fighter;
}
export function armyLiving(battle,side){return battle.sides.flatMap((s,i)=>s===side&&battle.state.hp[i]>0?[i]:[]);}
export function armyInitiativeBonus(battle,side){
 const own=armyLiving(battle,side).length,enemy=armyLiving(battle,1-side).length;
 return own>0&&enemy>own?Math.min(6,6*(enemy-own)/enemy):0;
}
function initiative(battle){battle.initiativeBonuses=[armyInitiativeBonus(battle,0),armyInitiativeBonus(battle,1)];return battle.fighters.map((f,i)=>({i,score:f.stats.speed+battle.initiativeBonuses[battle.sides[i]]+(battle.round===1&&f.armyRanged?8:0)+battle.random()*10})).filter(({i})=>battle.state.hp[i]>0).sort((a,b)=>b.score-a.score||a.i-b.i).map(({i})=>i);}
export function createArmyBattle(armies,budget=800,random=Math.random){
 if(!Array.isArray(armies)||armies.length!==2)throw Error('Potrzebne są dwie armie.');armies.forEach(a=>validateArmy(a,budget));
 const fighters=[],sides=[],roles=[],traits=armies.map(resolveArmyTraits);
 const defaults=Object.fromEntries(categories.map(c=>[c.id,c.options[0].id]));
 for(let side=0;side<2;side++){for(const [index,id]of armies[side].units.entries()){
  const unit=unitFor(id);
  const fighter=createArmySoldier(id,index);
  fighters.push(fighter);sides.push(side);roles.push(unit.role);
 }
 const magic=traits[side].magicalBeast;
 if(magic){const f=createFighter(magic.name,{...defaults,weapon:'staff',armor:'cloth',origin:'monk',style:'balanced',ability:'precise',weakness:'predictable',advantage:'endurance',beast:magic.beast,beastArmor:'none',beastAbility:magic.beast,specialItem:'vitality',magicPower:magic.power},'short','fantasy',true);f.armyMagicBeast=true;f.traits.weapon={...f.traits.weapon,name:'Naturalna broń bestii'};fighters.push(f);sides.push(side);roles.push('beast');}
 }
 for(const [i,f]of fighters.entries())for(const source of [traits[sides[i]].strategy,traits[sides[i]].origin])for(const [key,value]of Object.entries(source?.stats||{}))f.stats[key]=Math.max(1,f.stats[key]+value);
 const battle={fighters,sides,roles,armies:armies.map(a=>({...a,name:a.name.trim(),units:[...a.units]})),budget,random,traits,state:createCombatState(fighters),queue:[],events:[],finished:false,winner:null,reason:null,round:1,limit:160*fighters.length};
 battle.queue=initiative(battle);return battle;
}
export function advanceArmy(battle){
 if(battle.finished)throw Error('Bitwa jest już zakończona.');
 battle.queue=battle.queue.filter(i=>battle.state.hp[i]>0);
 if(!battle.queue.length){battle.round++;battle.queue=initiative(battle);}
 const actor=battle.queue.shift(),side=battle.sides[actor],enemies=armyLiving(battle,1-side);
 if(actor===undefined||!enemies.length)throw Error('Brak dostępnego przeciwnika.');
 const fronts=enemies.filter(i=>battle.roles[i]==='front'),support=enemies.filter(i=>['support','ranged'].includes(battle.roles[i]));
 const pool=battle.roles[actor]==='flank'&&support.length?support:fronts.length?fronts:enemies;
 const priority=battle.traits[side].strategy?.target;
 const target=priority==='random'?pool[Math.floor(battle.random()*pool.length)]:pool.reduce((best,i)=>(priority==='strongest'?battle.state.hp[i]>battle.state.hp[best]:battle.state.hp[i]<battle.state.hp[best])?i:best,pool[0]);
 const tactic=battle.state.energy[actor]<7?'rest':battle.traits[side].strategy?.plan||battle.armies[side].tactic;
 const event=resolveTurn(battle.fighters,battle.state,actor,battle.random,target,tactic);event.round=battle.round;battle.events.push(event);
 const alive=[armyLiving(battle,0).length,armyLiving(battle,1).length];
 if(!alive[0]||!alive[1]){battle.finished=true;battle.winner=alive[0]?0:alive[1]?1:null;battle.reason=battle.winner===null?'draw':'knockout';}
 else if(battle.events.length>=battle.limit){const score=s=>battle.sides.reduce((n,side,i)=>n+(side===s?battle.state.hp[i]/battle.fighters[i].stats.health:0),0)/battle.sides.filter(side=>side===s).length;const delta=score(0)-score(1);battle.finished=true;battle.winner=Math.abs(delta)<1e-10?null:delta>0?0:1;battle.reason=battle.winner===null?'draw':'decision';}
 return event;
}
export function finishArmy(battle){while(!battle.finished)advanceArmy(battle);return battle;}
export function draftArmy(budget=800,random=Math.random,offer=armyUnits){
 if(!armyBudgets.includes(budget))throw Error('Nieznany budżet.');
 if(!Array.isArray(offer)||!offer.length||offer.some(u=>!unitFor(u.id)))throw Error('Niepoprawna oferta jednostek.');const units=[];
 // Mixed automatic recruitment, always constrained by the same budget as a human.
 while(units.length<armyUnitLimit(budget)){const remaining=budget-armyCost(units),pool=offer.filter(u=>u.cost<=remaining);if(!pool.length)break;units.push(pool[Math.min(pool.length-1,Math.floor(random()*pool.length))].id);}
 return units;
}

export function drawArmyOffer(random=Math.random,source=armyUnits){
 const pool=[...source];for(let i=pool.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}return pool.slice(0,5);
}
