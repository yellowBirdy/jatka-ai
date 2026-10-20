import {createDuelBattle,takeDuelTurn,simulateTeamBattle} from './turns.js?v=playback-18';
import {tactics} from './tactics.js?v=playback-18';
import {animateBeastSkill,clearBeastEffects} from './beast-effects.js?v=playback-18';
import {getBeastAbilities} from './beast-abilities.js?v=playback-18';
import {drawMountOptions,getBeastArmors,normalizeMount,mountedPortrait} from './mounts.js?v=playback-18';
import {setupTutorial} from './tutorial.js?v=playback-18';
import {createTeamBattle,availableAttackers,availableTargets,takeTeamTurn,teamOf} from './teams.js?v=playback-18';
import {fantasySlots,drawFantasyOptions} from './fantasy.js?v=fantasy-pools-9';
import {weaponMaterials,getWeaponMaterials,normalizeMaterials,resolveMaterials} from './materials.js?v=weapon-families-6';
import {weaponSvg,weaponIcon} from './weapons.js?v=weapon-families-6';
import {categories,createFighter,simulate,describe,drawOptions,durations,abilityRules} from './engine.js?v=playback-18';
const $=id=>document.getElementById(id);
let player=0,picks={},fighters=[],names=['Ragnar','Akira'],timer,result,index=0;
let playback='auto',duelBattle=null;
let duelTactics=['balanced','balanced'];
let mode='classic',format='duel',teamBattle=null,mounted=false;
let mountOffers=[drawMountOptions(),drawMountOptions()];
const rosterSize=()=>format==='teams'?4:2;
const sideOf=i=>format==='teams'?teamOf(i):i;
function settingsLocked(locked){document.querySelectorAll('.combatants .duel-tactic select').forEach(n=>n.disabled=locked);for(const id of ['playback-settings','format-settings','mode-settings','duration-settings','modification-settings'])$(id).disabled=locked;}
let duration='medium',offers=[drawOptions(),drawOptions()];
let fantasyOffers=[drawFantasyOptions(),drawFantasyOptions()];
const defaults=()=>normalizeMaterials({beast:mountOffers[player][0].id,beastArmor:'none',beastAbility:mountOffers[player][0].id,...Object.fromEntries(fantasySlots.map(slot=>[slot.id,fantasyOffers[player][slot.id][0].id])),...Object.fromEntries(categories.map(c=>[c.id,offers[player][c.id][0].id]))});
const escape=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function chosenTextures(weapon=picks.weapon){const m=resolveMaterials(normalizeMaterials({...picks,weapon}));return {headTexture:m.headMaterial.texture,gripTexture:m.gripMaterial.texture};}
let materialNotice='';
function renderMaterials(){const groups=getWeaponMaterials(picks.weapon);return `<div class="weapon-materials"><p>Materiały: ${groups.headMaterial.family} <small>Opcje dopasowane do rodzaju broni.</small><small role="status">${materialNotice}</small></p>${Object.entries(groups).map(([key,group],i)=>`<fieldset class="material-group"><legend>${i+1}. ${group.name}</legend><div class="material-options">${group.options.map(m=>`<label class="option material-option"><input type="radio" name="${key}" value="${m.id}" ${picks[key]===m.id?'checked':''}><span class="material-swatch" style="background-image:url('assets/textures/${m.texture}.svg')"></span><span class="option-name">${m.name}</span><span class="option-desc">${m.desc}</span></label>`).join('')}</div></fieldset>`).join('')}</div>`;}
let portraitSequence=0;
function warrior(f,side=0){const rider=footWarrior(f,side);return f.mounted?mountedPortrait(rider,f):rider;}
function footWarrior(f,side=0){
const texturePrefix=`warrior-${++portraitSequence}`;
const material=['mail','reinforced-mail','ring','scale','lamellar'].includes(f.picks.armor)?'chainmail':['leather','hardened','studded','hide'].includes(f.picks.armor)?'leather':['cloth','linen','quilted','bamboo'].includes(f.picks.armor)?'cloth':'steel';
const textureDefs=`<defs>${['steel','leather','cloth','chainmail','wood','wrap','bronze','darksteel','ash','birch','walnut','tempered','damascus','flint','bone','granite','bamboo','ironwood','rattan'].map(type=>`<pattern id="${texturePrefix}-${type}" patternUnits="userSpaceOnUse" width="${type==='chainmail'?16:type==='cloth'?12:80}" height="${type==='chainmail'?16:type==='cloth'?12:80}"><image href="assets/textures/${type}.svg" width="${type==='chainmail'?16:type==='cloth'?12:80}" height="${type==='chainmail'?16:type==='cloth'?12:80}"/></pattern>`).join('')}</defs>`;
const armor=f.picks.armor;const color=side?'#b45d45':'#93a98a';
return `<svg viewBox="0 0 300 350" role="img" aria-label="Wojownik: ${escape(f.traits.weapon.name)}, zbroja ${escape(f.traits.armor.name)}, część bojowa ${escape(f.traits.headMaterial.name)}, chwyt ${escape(f.traits.gripMaterial.name)}">${textureDefs}<ellipse cx="148" cy="327" rx="90" ry="12" fill="#000" opacity=".22"/><path d="M111 141 Q65 179 74 289 L119 272 L150 170 L181 279 L213 290 Q213 185 177 142Z" fill="${color}" opacity=".85"/><path d="M111 141 Q65 179 74 289 L119 272 L150 170 L181 279 L213 290 Q213 185 177 142Z" fill="url(#${texturePrefix}-cloth)" opacity=".3"/><path d="${f.mounted?'M124 222 L109 250 L124 280 L144 280 L132 251 L151 236 L175 250 L163 281 L185 281 L196 248 L178 222':'M124 222 L116 303 L100 321 L139 321 L151 234 L163 304 L159 321 L197 321 L185 299 L178 222'}" fill="url(#${texturePrefix}-leather)" stroke="#171e1d" stroke-width="5"/><path d="M111 141 L178 141 L191 233 Q149 250 102 233Z" fill="url(#${texturePrefix}-${material})" stroke="#202725" stroke-width="5"/><path d="M122 145 L148 211 L177 146 M109 216 L183 216" fill="none" stroke="#d0b480" stroke-width="7"/><path d="M118 157 L111 227 M171 157 L182 227" stroke="#e9ddb5" stroke-width="1.5" opacity=".35" stroke-dasharray="2 5"/><circle cx="148" cy="104" r="32" fill="#c39672"/><path d="M115 104 Q108 62 148 61 Q187 63 181 108 L166 91 L119 92" fill="${armor==='plate'?'#9da9a5':'#403b30'}"/><path d="M124 110 L139 109 M155 109 L169 110" stroke="#282b28" stroke-width="5"/><path d="M132 127 L149 145 L168 125" fill="#4a3c30"/><path d="M111 156 L88 198 L62 173 M179 157 L198 195 L222 153" fill="none" stroke="url(#${texturePrefix}-${material})" stroke-width="23" stroke-linecap="round"/><circle cx="62" cy="173" r="12" fill="#c39672"/>${weaponSvg(f.picks.weapon,texturePrefix,false,{headTexture:f.traits.headMaterial.texture,gripTexture:f.traits.gripMaterial.texture})}${weaponSvg(f.picks.secondary,texturePrefix,true)}<circle cx="220" cy="160" r="10" fill="#c39672"/><circle cx="62" cy="173" r="10" fill="#c39672"/>${f.mode==='fantasy'?`<ellipse cx="148" cy="322" rx="78" ry="17" fill="none" stroke="#b8a0f1" stroke-width="2" opacity=".7"/><g class="special-item-badge"><circle cx="91" cy="215" r="14" fill="#433454" stroke="#cdb2fa" stroke-width="2"/><text x="91" y="220" text-anchor="middle" fill="#eee0ff" font-size="17">${f.traits.specialItem.icon}</text></g>`:''}</svg>`;}
function steps(n){for(let i=0;i<3;i++)$('step'+i).classList.toggle('active',i===(format==='teams'?(n>=4?2:teamOf(n)):n));$('step0').querySelector('b').textContent=format==='teams'?'Drużyna A':'Pierwszy wojownik';$('step1').querySelector('b').textContent=format==='teams'?'Drużyna B':'Drugi wojownik';}
function renderFantasy(){
 $('fantasy-choices').innerHTML=mode==='fantasy'?fantasySlots.map(slot=>`<fieldset class="fantasy-category"><legend>${slot.icon} ${slot.name} <small>5 z 20</small></legend><div class="option-grid">${fantasyOffers[player][slot.id].map(o=>`<label class="option fantasy-option"><input type="radio" name="${slot.id}" value="${o.id}" ${picks[slot.id]===o.id?'checked':''}><span class="option-icon">${o.icon}</span>${o.chance!==undefined?`<span class="chance-badge">${Math.round(o.chance*100)}%</span>`:''}<span class="option-name">${o.name}</span><span class="option-desc">${o.desc}</span></label>`).join('')}</div></fieldset>`).join(''):'';
 const count=(mode==='fantasy'?10:8)+(mounted?3:0);$('trait-count').textContent=`${count} / ${count} cech wybranych`;renderMounts();
 document.body.dataset.mode=mode;
}
function renderCreator(){clearBeastEffects();steps(player);$('creator').hidden=false;$('arena').hidden=true;$('player-label').textContent=format==='teams'?`DRUŻYNA ${teamOf(player)===0?'A':'B'} · WOJOWNIK ${player%2+1} / 2`:`GRACZ 0${player+1}`;$('fighter-name').value=names[player];$('error').textContent='';
$('categories').innerHTML=categories.map(c=>`<fieldset class="category" data-category="${c.id}"><legend><span>${c.icon}</span> ${c.name}</legend><div class="option-grid">${offers[player][c.id].map(o=>`<label class="option"><input type="radio" name="${c.id}" value="${o.id}" ${picks[c.id]===o.id?'checked':''}><span class="option-icon ${['weapon','secondary'].includes(c.id)?'equipment-preview':''}">${['weapon','secondary'].includes(c.id)?weaponIcon(o.id,c.id==='weapon'?chosenTextures(o.id):{}):o.icon}</span>${c.id==='ability'?`<span class="chance-badge">${Math.round(abilityRules[o.id].chance*100)}%</span>`:''}${o.chance!==undefined?`<span class="chance-badge">${Math.round(o.chance*100)}%</span>`:''}<span class="option-name">${o.name}</span><span class="option-desc">${o.desc}</span></label>`).join('')}</div>${c.id==='weapon'?renderMaterials():''}</fieldset>`).join('');renderFantasy();preview();}
function preview(){const f=createFighter($('fighter-name').value.trim()||'Wojownik',picks,duration,mode,mounted);$('portrait').innerHTML=warrior(f,sideOf(player));for(const card of document.querySelectorAll('[data-category="weapon"] > .option-grid .option'))card.querySelector('.option-icon').innerHTML=weaponIcon(card.querySelector('input').value,chosenTextures(card.querySelector('input').value));$('stats').innerHTML=[['Siła',f.stats.attack,40],['Ochrona',f.stats.defense,30],['Szybkość',f.stats.speed,35],['Zdrowie',f.stats.health,260],['Celność',f.stats.accuracy,120],['Przebicie',f.stats.pierce,25],['Kondycja',f.stats.stamina,150]].map(([label,value,max])=>`<div><span>${label}</span><b>${value}</b><i style="--value:${Math.max(0,value)/max*100}%"></i></div>`).join('');}
$('categories').addEventListener('change',e=>{if(e.target.matches('input')){const before={...picks};picks[e.target.name]=e.target.value;
if(e.target.name==='weapon'){
 picks=normalizeMaterials(picks);materialNotice=['headMaterial','gripMaterial'].some(key=>before[key]!==picks[key])?'Niepasujące materiały zastąpiono domyślnymi dla tej broni.':'';
 document.querySelector('.weapon-materials').outerHTML=renderMaterials();
}preview();}});
$('fantasy-choices').addEventListener('change',e=>{if(e.target.matches('input')){picks[e.target.name]=e.target.value;preview();}});
$('fighter-name').addEventListener('input',()=>{names[player]=$('fighter-name').value;preview();});
$('randomize').onclick=()=>{const materials=Object.fromEntries(Object.keys(weaponMaterials).map(key=>[key,picks[key]]));offers[player]=drawOptions();fantasyOffers[player]=drawFantasyOptions();mountOffers[player]=drawMountOptions();const candidate={...defaults(),...materials,beastArmor:picks.beastArmor||'none',beastAbility:picks.beastAbility==='none'?'none':mountOffers[player][0].id};picks=normalizeMount(normalizeMaterials(candidate));materialNotice=Object.keys(materials).some(key=>candidate[key]!==picks[key])?'Po losowaniu dopasowano materiały do nowej broni.':'';renderCreator();};
$('confirm').onclick=()=>{try{fighters[player]=createFighter($('fighter-name').value,picks,duration,mode,mounted);names[player]=fighters[player].name;if(player<rosterSize()-1){player++;materialNotice='';picks=fighters[player]?.picks?{...fighters[player].picks}:defaults();renderCreator();$('fighter-name').focus();}else showArena();}catch(e){$('error').textContent=e.message;$('fighter-name').focus();}};
function showArena(){clearBeastEffects();fighters=fighters.map(f=>createFighter(f.name,f.picks,duration,mode,mounted));settingsLocked(false);$('team-controls').hidden=true;$('duel-controls').hidden=true;steps(rosterSize());$('creator').hidden=true;$('arena').hidden=false;$('result').hidden=true;$('fight').hidden=false;$('skip').hidden=true;$('round').textContent='PRZED POJEDYNKIEM';$('commentary').textContent=format==='teams'?'Dwie drużyny. Czterech wojowników. Wybierz, kto zaatakuje którego przeciwnika.':'Dwaj wojownicy. Jedna arena. Czas sprawdzić swoje wybory.';
$('combatants').classList.toggle('team-grid',format==='teams');$('combatants').innerHTML=fighters.map((f,i)=>`<article id="combatant${i}" class="combatant side${sideOf(i)}"><div class="fighter-heading"><span>${format==='teams'?`DRUŻYNA ${teamOf(i)===0?'A':'B'} · ${i%2+1}`:`GRACZ 0${i+1}`}</span><h2>${escape(f.name)}</h2><p>${f.traits.origin.name} · ${f.traits.style.name}</p><div class="health" role="progressbar" aria-label="Zdrowie ${escape(f.name)}" aria-valuemin="0" aria-valuemax="${f.stats.health}" aria-valuenow="${f.stats.health}"><i></i></div><small id="hp${i}">${f.stats.health} / ${f.stats.health} HP</small><small class="combat-energy" id="energy${i}">Kondycja: ${f.stats.stamina} / ${f.stats.stamina}</small></div><div class="arena-warrior">${warrior(f,sideOf(i))}<span class="damage" id="damage${i}"></span></div><span class="loadout">${f.traits.weapon.icon} ${f.traits.weapon.name} / ${f.traits.armor.name}<small>${f.traits.headMaterial.name} / ${f.traits.gripMaterial.name}</small>${f.mounted?`<small class="mount-loadout">${f.traits.beast.icon} ${f.traits.beast.name} · ${f.traits.beastArmor.name}<br>✺ ${f.traits.beastAbility.name} (${Math.round(f.traits.beastAbility.chance*100)}%)</small>`:''}${f.mode==='fantasy'?`<small class="fantasy-loadout">${f.traits.specialItem.icon} ${f.traits.specialItem.name} · ${f.traits.magicPower.icon} ${f.traits.magicPower.name}</small>`:''}</span>${format==='duel'&&playback==='auto'?`<label class="duel-tactic">Taktyka ${escape(f.name)}<select data-tactic-player="${i}" aria-label="Taktyka ${escape(f.name)}">${tacticOptions(false,duelTactics[i])}</select><small id="duel-tactic-note${i}">${tactics[duelTactics[i]].desc}</small></label>`:''}${format==='teams'?`<button class="secondary fighter-select" data-fighter="${i}" hidden>Wybierz ${escape(f.name)}</button>`:''}</article>`).join('');$('arena').scrollIntoView({behavior:'smooth',block:'start'});}
function paint(e){clearBeastEffects();basePaint(e);animateBeastSkill(e,fighters);}
function basePaint(e){$('round').textContent=format==='teams'?`TURA ${playback==='auto'?index:teamBattle.events.length} / ${playback==='auto'?result.events.length:320}`:playback==='turns'?`TURA ${duelBattle.events.length} / 160`:`WYMIANA ${index} / ${result.events.length}`;$('commentary').textContent=(format==='teams'?`${fighters[e.actor].name} → ${fighters[e.target].name}: `:'')+e.text+(e.details?.length?' '+e.details.join(' '):'')+(e.weakened?' Osłabiony cios po rozbrojeniu.':'')+(e.ability?` ${fighters[e.actor].traits.ability.name}!`:'')+(e.healed?` +${e.healed} HP.`:'');for(let i=0;i<fighters.length;i++){const card=$('combatant'+i);card.className=`combatant side${sideOf(i)} ${i===e.actor?(e.kind==='defend'?'defending':e.kind==='rest'?'resting':e.magic?'attack casting':'attack'):i===e.target?(['rest','defend'].includes(e.kind)?'':e.kind==='dodge'?'dodge':'hit'):''} ${e.hp[i]===0?'defeated':''}`;const bar=card.querySelector('.health');bar.setAttribute('aria-valuenow',e.hp[i]);bar.querySelector('i').style.width=`${e.hp[i]/fighters[i].stats.health*100}%`;$('hp'+i).textContent=`${e.hp[i]} / ${fighters[i].stats.health} HP`;$('energy'+i).textContent=`Kondycja: ${e.energy[i]} / ${fighters[i].stats.stamina}`;$('damage'+i).textContent=i===e.target?(['rest','defend'].includes(e.kind)?'':(e.damage+(e.magicDamage||0))?`−${e.damage+(e.magicDamage||0)}`:e.kind==='dodge'?'UNIK':'BLOK'):i!==e.actor?'':(e.selfDamage||e.counterDamage)?`−${(e.selfDamage||0)+(e.counterDamage||0)}`:e.healed?`+${e.healed}`:'';}}
function finish(){clearTimeout(timer);$('duel-controls').hidden=true;if(format==='teams'){index=result.events.length;paint(result.events.at(-1));$('skip').hidden=true;finishTeams();return;}settingsLocked(false);index=result.events.length;paint(result.events.at(-1));$('skip').hidden=true;$('result').hidden=false;$('winner').textContent=`Zwycięża ${fighters[result.winner].name}`;$('summary').textContent=describe(result,fighters);$('round').textContent='KONIEC POJEDYNKU';$('combatant'+result.winner).classList.add('victor');$('history').replaceChildren(...result.events.map(e=>{const li=document.createElement('li');li.textContent=e.text+(e.details?.length?' '+e.details.join(' '):'')+(e.weakened?' Osłabiony cios po rozbrojeniu.':'')+(e.ability?` Umiejętność: ${fighters[e.actor].traits.ability.name}.`:'');return li;}));}
function tick(){if(index>=result.events.length){finish();return;}paint(result.events[index++]);timer=setTimeout(tick,650);}
function fight(){clearTimeout(timer);showArena();if(playback==='turns'){if(format==='teams')startTeams();else startDuelTurns();return;}if(format==='teams'){teamBattle=simulateTeamBattle(fighters);result=teamBattle;}else result=simulate(...fighters.map((f,i)=>({...f,picks:{...f.picks,tactic:duelTactics[i]}})));settingsLocked(true);index=0;$('fight').hidden=true;$('skip').hidden=false;if(matchMedia('(prefers-reduced-motion: reduce)').matches)finish();else tick();}
$('fight').onclick=fight;$('skip').onclick=finish;$('rematch').onclick=fight;
$('edit').onclick=()=>{clearTimeout(timer);player=0;materialNotice='';picks={...fighters[0].picks};renderCreator();};
function resetRoster(){clearTimeout(timer);teamBattle=null;duelBattle=null;duelTactics=['balanced','balanced'];player=0;materialNotice='';fighters=[];names=format==='teams'?['Ragnar','Bjorn','Akira','Yuna']:['Ragnar','Akira'];offers=names.map(()=>drawOptions());fantasyOffers=names.map(()=>drawFantasyOptions());mountOffers=names.map(()=>drawMountOptions());settingsLocked(false);picks=defaults();renderCreator();}
$('reset').onclick=resetRoster;
$('format-settings').addEventListener('change',e=>{if(!e.target.matches('input'))return;format=e.target.value;playback=format==='teams'?'turns':'auto';document.querySelector(`input[name="playback"][value="${playback}"]`).checked=true;resetRoster();});
$('mode-settings').addEventListener('change',e=>{if(!e.target.matches('input'))return;mode=e.target.value;fighters=fighters.map(f=>createFighter(f.name,f.picks,duration,mode,mounted));document.body.dataset.mode=mode;if($('creator').hidden)showArena();else{renderFantasy();preview();}});
$('duration-settings').addEventListener('change',e=>{if(!e.target.matches('input'))return;duration=e.target.value;fighters=fighters.map(f=>createFighter(f.name,f.picks,duration,mode,mounted));if($('creator').hidden)showArena();else preview();});
$('help').onclick=()=>$('instructions').showModal();
picks=defaults();renderCreator();

function teamName(team){return `Drużyna ${team===0?'A':'B'}`;}
function updateTeamChoices(){$('team-tactic').value='balanced';$('team-tactic-note').textContent=tactics.balanced.desc;
 const actors=availableAttackers(teamBattle),targets=availableTargets(teamBattle);
 for(const [id,indices] of [['team-actor',actors],['team-target',targets]]){
  const previous=Number($(id).value);$(id).replaceChildren(...indices.map(i=>new Option(fighters[i].name,String(i))));
  if(indices.includes(previous))$(id).value=String(previous);
 }
 $('team-turn').textContent=`${teamName(teamBattle.activeTeam)} — wybierz atakującego i cel`;
 $('team-error').textContent='';highlightTeamChoices();
}
function highlightTeamChoices(){
 const actor=Number($('team-actor').value),target=Number($('team-target').value);
 $('team-selection').textContent=`${fighters[actor].name} → ${fighters[target].name}`;
 const legal=[...availableAttackers(teamBattle),...availableTargets(teamBattle)];
 fighters.forEach((f,i)=>{const card=$('combatant'+i);card.classList.toggle('selected-attacker',i===actor);card.classList.toggle('selected-target',i===target);const button=card.querySelector('.fighter-select');button.hidden=false;button.disabled=!legal.includes(i);button.textContent=teamBattle.state.hp[i]===0?'Pokonany':legal.includes(i)?`Wybierz ${f.name}`:'Już atakował';});
}
function startTeams(){
 teamBattle=createTeamBattle(fighters);settingsLocked(true);$('fight').hidden=true;$('skip').hidden=true;$('team-controls').hidden=false;
 $('round').textContent='WALKA DRUŻYNOWA 2 NA 2';$('commentary').textContent='Drużyny atakują na zmianę. Każdy żywy sojusznik wykonuje ruch przed kolejnym atakiem tej samej postaci.';
 updateTeamChoices();
}
$('team-actor').onchange=highlightTeamChoices;$('team-target').onchange=highlightTeamChoices;
$('combatants').addEventListener('click',e=>{const button=e.target.closest('[data-fighter]');if(!button||button.disabled||!teamBattle||teamBattle.finished)return;const i=Number(button.dataset.fighter);$(teamOf(i)===teamBattle.activeTeam?'team-actor':'team-target').value=String(i);highlightTeamChoices();});
$('team-attack').onclick=()=>{
 if(!teamBattle||teamBattle.finished)return;
 try{const event=takeTeamTurn(teamBattle,Number($('team-actor').value),Number($('team-target').value),Math.random,$('team-tactic').value);paint(event);if(teamBattle.finished)finishTeams();else updateTeamChoices();}catch(error){$('team-error').textContent=error.message;}
};
function finishTeams(){
 settingsLocked(false);$('team-controls').hidden=true;$('result').hidden=false;$('round').textContent='KONIEC WALKI DRUŻYNOWEJ';
 const winner=teamBattle.winner;
 $('winner').textContent=winner===null?'Remis':`Zwycięża ${teamName(winner)}`;
 $('summary').textContent=teamBattle.reason==='knockout'?'Obaj przeciwnicy zostali pokonani.':`Po 320 turach decyduje suma pozostałych procentów zdrowia drużyny.${winner===null?' Obie drużyny uzyskały ten sam wynik.':''}`;
 fighters.forEach((_,i)=>{const card=$('combatant'+i);card.classList.remove('selected-attacker','selected-target');card.classList.toggle('victor',winner!==null&&teamOf(i)===winner);card.querySelector('.fighter-select').hidden=true;});
 $('history').replaceChildren(...teamBattle.events.map(e=>{const li=document.createElement('li');li.textContent=`${fighters[e.actor].name} → ${fighters[e.target].name}: ${e.text} ${e.details.join(' ')}`;return li;}));
}

setupTutorial(()=>({format,mode,mounted,player,activeTeam:teamBattle?.activeTeam,phase:!$('creator').hidden?'creator':!$('result').hidden?'result':!$('duel-controls').hidden?'duel-turns':!$('team-controls').hidden?'teams':$('fight').hidden?'watching':'arena'}));

function renderMounts(){
 $('mount-choices').hidden=!mounted;
 $('mount-choices').innerHTML=mounted?`<fieldset class="mount-category"><legend>♞ Wierzchowiec <small>5 z 20</small></legend><p>Bestia i jeździec walczą jako jedna postać ze wspólnym HP. Premie sumują się ze statystykami. Wierzchowiec dodaje +10 obrażeń do każdego trafienia bronią (przed osłonami).</p><div class="option-grid">${mountOffers[player].map(o=>`<label class="option"><input type="radio" name="beast" value="${o.id}" ${picks.beast===o.id?'checked':''}><span class="option-icon">${o.icon}</span><span class="option-name">${o.name}</span><span class="option-desc">${o.desc}</span></label>`).join('')}</div><fieldset class="beast-armor-group"><legend>1. Zbroja bestii — ${createFighter('Podgląd',picks,duration,mode,mounted).traits.beast.name}</legend><div class="option-grid">${getBeastArmors(picks.beast).map(o=>`<label class="option"><input type="radio" name="beastArmor" value="${o.id}" ${picks.beastArmor===o.id?'checked':''}><span class="option-icon">${o.icon}</span><span class="option-name">${o.name}</span><span class="option-desc">${o.desc}</span></label>`).join('')}</div></fieldset><fieldset class="beast-ability-group"><legend>2. Umiejętność bestii — wybierz 1 z 5</legend><div class="option-grid">${getBeastAbilities(picks.beast).map(o=>`<label class="option"><input type="radio" name="beastAbility" value="${o.id}" ${picks.beastAbility===o.id?'checked':''}><span class="option-icon">✺</span><span class="chance-badge">${Math.round(o.chance*100)}%</span><span class="option-name">${o.name}</span><span class="option-desc">${o.desc}</span></label>`).join('')}</div></fieldset></fieldset>`:'';
}
$('mount-choices').addEventListener('change',e=>{if(e.target.matches('input')){picks[e.target.name]=e.target.value;if(e.target.name==='beast'){picks=normalizeMount(picks);renderMounts();}preview();}});
$('mounts-enabled').addEventListener('change',e=>{
 mounted=e.target.checked;fighters=fighters.map(f=>createFighter(f.name,f.picks,duration,mode,mounted));
 if($('creator').hidden)showArena();else{renderFantasy();preview();}
});

function tacticOptions(rest=true,selected='balanced'){return Object.entries(tactics).filter(([id])=>rest||!['rest','defend'].includes(id)).map(([id,t])=>`<option value="${id}" ${id===selected?'selected':''}>${t.name}</option>`).join('');}
$('team-tactic').innerHTML=tacticOptions();
$('combatants').addEventListener('change',e=>{if(e.target.matches('[data-tactic-player]')){const i=Number(e.target.dataset.tacticPlayer);duelTactics[i]=e.target.value;$('duel-tactic-note'+i).textContent=tactics[e.target.value].desc;}});

$('team-tactic').onchange=()=>{$('team-tactic-note').textContent=tactics[$('team-tactic').value].desc;};

$('playback-settings').addEventListener('change',e=>{if(!e.target.matches('input'))return;playback=e.target.value;if($('creator').hidden)showArena();});
function updateDuelTurn(){
 const actor=duelBattle.activeActor;$('duel-turn').textContent=`Tura: ${fighters[actor].name}`;
 fighters.forEach((_,i)=>$('combatant'+i).classList.toggle('selected-attacker',i===actor));
}
function startDuelTurns(){
 duelBattle=createDuelBattle(fighters);settingsLocked(true);$('fight').hidden=true;$('duel-controls').hidden=false;
 $('duel-tactic').innerHTML=tacticOptions(false);$('duel-action-note').textContent=tactics.balanced.desc;$('duel-error').textContent='';updateDuelTurn();
 $('commentary').textContent='Wybierz atak, odpoczynek albo obronę. Po akcji kolej przechodzi na przeciwnika.';
}
$('duel-controls').addEventListener('click',e=>{
 const action=e.target.closest('[data-duel-action]');if(!action||!duelBattle||duelBattle.finished)return;
 try{
  const tactic=action.dataset.duelAction==='attack'?$('duel-tactic').value:action.dataset.duelAction;
  const event=takeDuelTurn(duelBattle,tactic);paint(event);
  if(duelBattle.finished){result=duelBattle;finish();}else updateDuelTurn();
 }catch(error){$('duel-error').textContent=error.message;}
});

$('duel-tactic').onchange=()=>{$('duel-action-note').textContent=tactics[$('duel-tactic').value].desc;};
