export function isPowerfulHit(e,fighters){const damage=(e.damage||0)+(e.magicDamage||0);return damage>=30||(damage>=18&&damage>=fighters[e.target].stats.health*.25);}
export function combatLabels(e,fighters){
 const labels=[],add=(fighter,type,text)=>labels.push({fighter,type,text});
 const damage=(e.damage||0)+(e.magicDamage||0),own=(e.selfDamage||0)+(e.counterDamage||0);
 if(damage>0)add(e.target,'damage',`−${damage} HP`);
 else if(e.kind==='dodge')add(e.target,'dodge','UNIK');
 else if(e.kind==='block')add(e.target,'guard','BLOK');
 if(own>0)add(e.actor,'damage',`−${own} HP · efekt / kontra`);
 if(e.healed>0)add(e.actor,'heal',`+${e.healed} HP`);
 if(e.kind==='rest')add(e.actor,'energy',`+${e.restored||0} kondycji`);
 if(e.kind==='defend')add(e.actor,'guard','OBRONA · ½ obrażeń');
 if(e.ability)add(e.actor,'skill',fighters[e.actor].traits.ability.name);
 if(e.magic)add(e.actor,'magic',`MAGIA · ${fighters[e.actor].traits.magicPower.name}`);
 if(e.beastAbility)add(e.actor,'beast',`BESTIA · ${fighters[e.actor].traits.beastAbility.name}`);
 if(['venom','burn'].includes(e.kind))add(e.actor,'status',e.kind==='venom'?'JAD':'PODPALENIE');
 return labels;
}
export function clearCombatVisuals(){document.getElementById('commentary')?.removeAttribute('data-tone');document.getElementById('arena')?.classList.remove('power-hit');document.querySelectorAll('.combat-float,.combat-impact,.power-wave').forEach(n=>n.remove());document.getElementById('combat-callouts')?.replaceChildren();}
export function decorateCombat(e,fighters){
 const labels=combatLabels(e,fighters),rows={};
 const powerful=isPowerfulHit(e,fighters);if(powerful)labels.push({fighter:e.target,type:'power',text:'MOCNE TRAFIENIE'});
 const callouts=document.getElementById('combat-callouts');
 for(const item of labels){
  const chip=document.createElement('span');chip.className=`combat-chip tone-${item.type}`;chip.textContent=`${fighters[item.fighter].name}: ${item.text}`;callouts?.append(chip);
  const arena=document.querySelector(`#combatant${item.fighter} .arena-warrior`);if(!arena)continue;
  const float=document.createElement('span');float.className=`combat-float tone-${item.type}`;float.textContent=item.type==='skill'?'UMIEJĘTNOŚĆ':item.type==='magic'?'MAGIA':item.type==='beast'?'BESTIA':item.text;float.setAttribute('aria-hidden','true');float.style.setProperty('--row',rows[item.fighter]||0);rows[item.fighter]=(rows[item.fighter]||0)+1;arena.append(float);
 }
 if((e.damage||0)+(e.magicDamage||0)>0){const card=document.getElementById(`combatant${e.target}`);card?.classList.remove('dodge');card?.classList.add('hit');const arena=document.querySelector(`#combatant${e.target} .arena-warrior`);if(arena){const impact=document.createElement('span');impact.className='combat-impact';impact.setAttribute('aria-hidden','true');impact.innerHTML='<svg viewBox="0 0 100 100"><path d="M20 13L80 87M36 8L91 66M8 37L63 93"/><path class="impact-ring" d="M50 5L57 33 84 16 67 44 95 50 67 57 84 84 57 67 50 95 43 67 16 84 33 57 5 50 33 43 16 16 43 33Z"/></svg>';arena.append(impact);}}
 if(powerful){
  const stage=document.getElementById('arena');
  if(stage&&!matchMedia('(prefers-reduced-motion: reduce)').matches){void stage.offsetWidth;stage.classList.add('power-hit');}
  const target=document.querySelector(`#combatant${e.target} .arena-warrior`);
  if(target){const wave=document.createElement('span');wave.className='power-wave';wave.setAttribute('aria-hidden','true');wave.innerHTML='<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="28"/><circle cx="50" cy="50" r="42"/><path d="M50 2v14M50 84v14M2 50h14M84 50h14M15 15l10 10M75 75l10 10M15 85l10-10M75 25l10-10"/></svg>';target.append(wave);}
 }
 const commentary=document.getElementById('commentary');if(commentary){commentary.dataset.tone=e.kind==='rest'?'energy':e.kind==='defend'?'guard':e.magic?'magic':e.beastAbility?'beast':(e.damage||0)>0?'damage':'dodge';}
}
