import {fruitStyles,fruitTier,animeTactics} from './anime-styles.js?v=anime-55';
import {animeWeapons,animeHaki,combineHaki} from './anime-equipment.js?v=anime-55';
import {armoredFruits} from './anime-fruit-powers.js?v=anime-55';
import {powerInteraction,isLogia} from './anime-lore.js?v=anime-55';
import {animeFruits,animeDials} from './anime-catalog.js?v=anime-55';
import {categories,createFighter} from './engine.js?v=anime-55';
import {createCombatState,resolveTurn} from './combat.js?v=anime-55';
export {animeFruits,animeDials};
export {animeWeapons,animeHaki,fruitStyles};
function draw(source,random){const pool=[...source];for(let i=pool.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}return pool.slice(0,5);}
export function drawAnimeOptions(random=Math.random){return {fruit:draw(animeFruits,random),weapon:draw(animeWeapons,random),dial:draw(animeDials,random),haki:draw(animeHaki,random),haki2:draw(animeHaki,random)};}
export function createAnimeFighter(name,picks,duration='medium'){
 const fruit=animeFruits.find(o=>o.id===picks.fruit),dial=animeDials.find(o=>o.id===picks.dial),haki=(picks.haki===undefined||picks.haki==='none')?{id:'none',name:'Bez Haki'}:animeHaki.find(o=>o.id===picks.haki),weapon=animeWeapons.find(o=>o.id===picks.weapon);
 if(!haki)throw Error('Wybierz Haki.');
 const combatStyle=picks.combatStyle??'weapon';if(!['weapon','fists'].includes(combatStyle))throw Error('Wybierz broń lub pięści.');const fists=combatStyle==='fists';
 const second=fists?animeHaki.find(h=>h.id===picks.haki2):null;if(fists&&(!second||second.id===haki.id))throw Error('Wybierz dwa różne Haki do walki pięściami.');
 const activeHaki=combineHaki(haki,second);
 if(!fruit||!dial)throw Error('Wybierz owoc i dial z katalogu.');
 if(!fists&&!animeWeapons.some(o=>o.id===picks.weapon))throw Error('Wybierz broń z katalogu.');
 const defaults=Object.fromEntries(categories.map(c=>[c.id,c.options[0].id]));
 const f=createFighter(name,{...defaults,weapon:fists?'sword':picks.weapon,armor:'leather',origin:'nomad',style:'balanced',ability:'precise',weakness:'predictable',advantage:'endurance'},duration);
 const styles=fruitStyles(fruit,combatStyle),style=styles.find(s=>s.id===(picks.fruitStyle??styles[0].id));if(!style)throw Error('Wybierz styl pasujący do owocu.');
 const chosenFruit={...fruit,rule:style.rule,move:style.name,desc:`${fruit.desc} ${style.desc}`};
 const activeWeapon=fists?{id:'fists',name:'Pięści',kind:'blunt',attack:0}:weapon;
 f.anime={fruit:chosenFruit,baseFruit:fruit,dial,haki:activeHaki,hakis:[haki,...(second?[second]:[])],weapon:activeWeapon,style,combatStyle};f.traits.fruit=fruit;f.traits.dial=dial;f.traits.weapon={...f.traits.weapon,name:activeWeapon.name};
 if(fists){for(const source of [categories[0].options[0],f.traits.secondary,f.traits.headMaterial,f.traits.gripMaterial])for(const [key,value]of Object.entries(source.stats||{}))f.stats[key]-=value;}
 f.stats.attack+=activeWeapon.attack;for(const key of ['attack','defense','speed','accuracy','pierce'])f.stats[key]+=activeHaki[key]||0;
 const tier=fruitTier(fruit);f.stats.health+=tier*11;f.stats.attack+=tier*2;f.stats.defense+=tier;
 if(armoredFruits.has(fruit.id))f.stats.defense+=5;return f;
}
export function createAnimeBattle(fighters,random=Math.random){
 if(fighters.length!==2||fighters.some(f=>!f.anime))throw Error('Potrzebni są dwaj wojownicy anime.');
 const first=random()<(0.5+(fighters[0].stats.speed-fighters[1].stats.speed)/100)?0:1;
 return {fighters,state:createCombatState(fighters),activeActor:first,first,random,exposed:[0,0],events:[],finished:false,winner:null,reason:null};
}
function applyPower(battle,event,power){
 const {state,fighters}=battle,{actor,target}=event,rule=power.rule,interaction=powerInteraction(power,fighters[target].anime.fruit);let dealt=0,healed=0;
 const physical=(['beast','cut','energy'].includes(power.family)&&!['ope-ope','kama-kama','gomu-gomu'].includes(power.id))||['impact','reject','axe'].includes(power.id);
 if(physical&&isLogia(fighters[target].anime.fruit)&&battle.exposed[target]===0&&!fighters[actor].anime.haki.touch&&!interaction.seal){interaction.multiplier=0;interaction.text='Materialny atak przenika przez żywiołowe ciało. Bez Haki lub naturalnej kontry nie dosięgnie Logii.';}
 if(rule.cost&&state.energy[actor]<rule.cost){event.details.push(`${power.move||power.name}: brakuje oddechu na pełną technikę.`);return false;}
 if(rule.cost)state.energy[actor]-=rule.cost;
 if(interaction.text)event.details.push(interaction.text);
 if(interaction.seal){battle.exposed[target]=Math.max(battle.exposed[target],interaction.seal);for(const key of ['blink','mist','barrier'])state[key][target]=0;}
 if(interaction.multiplier===0)return true;
 if(rule.damage){let amount=Math.round(rule.damage*interaction.multiplier);const absorbed=Math.min(state.barrier[target],amount);state.barrier[target]-=absorbed;amount-=absorbed;dealt=Math.min(state.hp[target],amount);state.hp[target]-=dealt;event.magicDamage=(event.magicDamage||0)+dealt;}
 if(rule.heal||rule.drain){healed=Math.min((rule.heal||0)+(rule.drain?dealt:0),fighters[actor].stats.health-state.hp[actor]);state.hp[actor]+=healed;event.healed+=healed;}
 if(rule.shield)state.barrier[actor]=Math.max(state.barrier[actor],rule.shield);
 if(rule.status)state[rule.status][rule.self?actor:target]=Math.max(state[rule.status][rule.self?actor:target],rule.turns);
 for(const [status,turns]of Object.entries(rule.statuses||{})){const who=status==='mist'?actor:target;state[status][who]=Math.max(state[status][who],turns);}
 if(rule.steal)state.energy[target]=Math.max(0,state.energy[target]-rule.steal);
 if(rule.cleanse)for(const key of ['venom','burn','frozen','blind','silenced','rooted','stunned'])state[key][actor]=0;
 if(rule.seal)battle.exposed[target]=Math.max(battle.exposed[target],rule.seal);
 if(rule.armor)state.armorDamage[target]=Math.min(9,state.armorDamage[target]+rule.armor);
 if(rule.energy)state.energy[actor]=Math.min(fighters[actor].stats.stamina,state.energy[actor]+rule.energy);
 if(rule.boost)state.battlecry[actor]=Math.max(state.battlecry[actor],rule.boost);
 if(rule.evade)state.blink[actor]=Math.max(state.blink[actor],rule.evade);
 if(rule.recoil){const protection=(armoredFruits.has(fighters[actor].anime.fruit.id)&&!event.fruitSuppressed?(power.id==='impact'?0:.2):1)*(fighters[actor].anime.haki.recoil??1);const recoil=Math.min(Math.ceil(rule.recoil*protection),Math.max(0,state.hp[actor]-1));state.hp[actor]-=recoil;event.selfDamage+=recoil;if(protection===0)event.details.push('Pancerna moc całkowicie pochłania odrzut Impact Dialu.');if(recoil>0)event.details.push(protection<1?'Utwardzona osłona łagodzi odrzut, ale ciało nadal odczuwa uderzenie.':'Odrzut dialu lub techniki wstrząsa także ciałem użytkownika.');}
 event.details.push(`${power.name}${power.move?` — ${power.move}`:''}: ${power.desc}`);return true;
}
export function advanceAnime(battle,tactic='balanced',random=battle.random){
 if(battle.finished)throw Error('Walka zakończona.');
 const actor=battle.activeActor,target=1-actor;
 const choices=animeTactics(battle.fighters[actor]),chosen=choices.find(t=>t.id===tactic);
 if(!chosen&&!['balanced','aggressive','cautious','rest','defend'].includes(tactic))throw Error('Wybierz taktykę swojego owocu.');
 const action=tactic;tactic=chosen?chosen.plan:tactic;
 const turnFruit=chosen?{...battle.fighters[actor].anime.baseFruit,rule:chosen.rule,move:chosen.name,desc:chosen.desc}:battle.fighters[actor].anime.fruit;
 const suppressed=battle.state.stunned[actor]>0||(battle.state.silenced[actor]>0&&['oto-oto','goe-goe','uta-uta'].includes(battle.fighters[actor].anime.fruit.id)),sealed=battle.exposed[actor]>0;
 if(sealed)battle.exposed[actor]--;
 const user=battle.fighters[actor].anime,enemy=battle.fighters[target].anime;
 const intangible=isLogia(enemy.fruit)&&battle.exposed[target]===0&&!user.haki.touch&&user.weapon.kind!=='seastone';
 if(!['rest','defend'].includes(tactic)&&enemy.haki.dodge&&random()<.2)battle.state.blink[target]=Math.max(1,battle.state.blink[target]);
 if(intangible&&!['rest','defend'].includes(tactic))battle.state.blink[target]=Math.max(1,battle.state.blink[target]);
 const cutting=['cut','pierce'].includes(user.weapon.kind);
 const naturalDodge=!user.haki.touch&&((enemy.fruit.id==='bara-bara'&&cutting)||(enemy.fruit.id==='sube-sube'&&random()<.3));
 if(naturalDodge)battle.state.blink[target]=Math.max(1,battle.state.blink[target]);
 if(enemy.fruit.id==='gomu-gomu'&&user.weapon.kind==='blunt'&&!user.haki.touch)battle.state.guard[target]=1;
 const event=resolveTurn(battle.fighters,battle.state,actor,random,target,tactic);event.action=action;event.fruitMove=turnFruit.move;event.fruitSuppressed=sealed;event.fruit=null;event.dial=null;event.details=[];
 event.text=tactic==='rest'?`${battle.fighters[actor].name} odzyskuje oddech i szuka nowego otwarcia.`:tactic==='defend'?`${battle.fighters[actor].name} przyjmuje postawę obronną.`:intangible?`Broń przechodzi przez żywiołowe ciało ${battle.fighters[target].name}. Potrzebna jest odpowiednia kontra!`:event.damage>0?`${battle.fighters[actor].name} przebija się przez gardę rywala.`:`${battle.fighters[target].name} wymyka się z zasięgu broni.`;
 if(event.damage>0&&user.haki.touch&&isLogia(enemy.fruit))event.details.push('Haki uzbrojenia sięga prawdziwego ciała Logii!');
 if(event.damage>0&&user.weapon.kind==='seastone'){battle.exposed[target]=Math.max(battle.exposed[target],1);event.details.push('Kamień morski w Jitte osłabia dotkniętego użytkownika owocu.');}
 if(!['rest','defend'].includes(tactic)&&!suppressed&&battle.state.hp[actor]>0&&user.weapon.kind==='wind'&&random()<.4){const gust=powerInteraction({id:'breath'},enemy.fruit);if(gust.seal){battle.exposed[target]=Math.max(battle.exposed[target],gust.seal);event.details.push(gust.text);}}
 if(battle.state.hp[actor]>0&&!['rest','defend'].includes(tactic)&&!suppressed&&user.haki.pressure&&random()<.2){battle.state.stunned[target]=1;event.details.push('Królewska wola przerywa koncentrację przeciwnika!');}
 if(sealed)event.details.push('Właściwości owocu zostały przełamane — trzeba najpierw odzyskać kontrolę nad ciałem.');
 if(!['rest','defend'].includes(tactic)&&!suppressed&&battle.state.hp[actor]>0&&battle.state.hp[target]>0){
  for(const key of ['fruit','dial']){if(key==='fruit'&&sealed)continue;const power=key==='fruit'?turnFruit:battle.fighters[actor].anime[key];if(battle.state.hp[target]>0&&random()<power.chance){if(applyPower(battle,event,power)!==false)event[key]=power.id;}}
 }
 event.hp=[...battle.state.hp];event.energy=[...battle.state.energy];battle.events.push(event);
 if(event.hp.some(h=>h===0)){battle.finished=true;battle.reason='knockout';battle.winner=event.hp[0]>0?0:1;}
 else if(battle.events.length>=160){battle.finished=true;battle.reason='decision';const scores=event.hp.map((hp,i)=>hp/battle.fighters[i].stats.health);battle.winner=scores[0]===scores[1]?battle.first:scores[0]>scores[1]?0:1;}
 battle.activeActor=target;return event;
}
