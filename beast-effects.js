import {getBeastAbilities} from './beast-abilities.js?v=arena-57';
const baseTypes={dragon:'venom','chinese-dragon':'energy',drake:'claw',griffin:'claw',sabretooth:'claw',horse:'energy',wolf:'claw',boar:'claw',bear:'heal',rhino:'claw',tiger:'claw',lion:'control',elk:'control',mammoth:'guard',lizard:'venom',ostrich:'guard',camel:'energy',bison:'guard',buffalo:'claw',hyena:'heal',stag:'energy',panther:'claw','polar-bear':'control',yak:'guard',crocodile:'control'};
export function beastEffectFor(beast,id){const rule=getBeastAbilities(beast).find(a=>a.id===id);if(!rule)return null;return {name:rule.name,type:rule.effect?({strike:'claw',guard:'guard',heal:'heal',drain:'control',mark:'control',barrier:'guard',focus:'energy',slow:'control'})[rule.effect]:baseTypes[beast]};}
const drawings={
 claw:'<path d="M20 20L74 81M39 13L88 67M12 43L55 89"/>',
 guard:'<path d="M50 8L85 22 79 62Q67 83 50 94Q25 79 21 62L15 22Z"/><path d="M31 49L45 63 70 35"/>',
 heal:'<path d="M50 16V84M16 50H84"/><circle cx="50" cy="50" r="42"/>',
 energy:'<path d="M58 8L25 56H48L40 92 78 40H53Z"/><circle cx="50" cy="50" r="44"/>',
 control:'<circle cx="50" cy="50" r="20"/><circle cx="50" cy="50" r="36"/><path d="M50 4V19M50 81V96M4 50H19M81 50H96"/>',
 venom:'<path d="M50 8Q13 50 20 70Q30 96 58 89Q92 80 79 54Z"/><circle cx="38" cy="59" r="5"/><circle cx="61" cy="69" r="6"/>'
};
export function clearBeastEffects(){document.querySelectorAll('.beast-fx,.beast-skill-banner').forEach(n=>n.remove());}
export function animateBeastSkill(event,fighters){
 if(!event.beastAbility)return;
 const effect=beastEffectFor(fighters[event.actor].picks.beast,event.beastAbility);if(!effect)return;
 const defensive=['guard','heal','energy'].includes(effect.type),target=defensive?event.actor:event.target;
 const arena=document.querySelector(`#combatant${target} .arena-warrior`),actor=document.getElementById(`combatant${event.actor}`);if(!arena||!actor)return;
 const overlay=document.createElement('div');overlay.className=`beast-fx beast-fx-${effect.type}`;overlay.dataset.effect=effect.type;overlay.setAttribute('aria-hidden','true');overlay.innerHTML=`<svg viewBox="0 0 100 100"><circle class="skill-ring" cx="50" cy="50" r="46"/>${drawings[effect.type]}</svg><span class="skill-particles">${Array.from({length:8},(_,i)=>`<i style="--angle:${i*45}deg"></i>`).join('')}</span>`;arena.append(overlay);
 const badge=document.createElement('p');badge.className='beast-skill-banner';badge.textContent=`✺ ${fighters[event.actor].traits.beast.name}: ${effect.name}`;actor.append(badge);
}
