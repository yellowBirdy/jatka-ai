import {setupGunWorkshop} from './gun-ui.js?v=guns-59';
import {setupCrossover} from './crossover-ui.js?v=guns-59';
import {readProgress,saveProgress,buyBoxes,rewardProfiles,lootArmors,drawArmorOffer,redeemCode,claimGod} from './progression.js?v=guns-59';
import {readProfiles,writeProfiles} from './profiles.js?v=guns-59';
import {createBotFighter,chooseBotTactic,chooseBotTeamAction,simulateBotDuel,simulateBotTeams} from './bot.js?v=guns-59';
import {textureAnimalSvg} from './surface-textures.js?v=guns-59';
import {clearCombatVisuals,decorateCombat} from './combat-visuals.js?v=guns-59';
import {createDuelBattle,takeDuelTurn,simulateTeamBattle} from './turns.js?v=guns-59';
import {tactics} from './tactics.js?v=guns-59';
import {animateBeastSkill,clearBeastEffects} from './beast-effects.js?v=guns-59';
import {getBeastAbilities} from './beast-abilities.js?v=guns-59';
import {drawMountOptions,getBeastArmors,normalizeMount,mountedPortrait,beastSkins,beastLootArmors,allBeasts,lootBeasts} from './mounts.js?v=guns-59';
import {setupTutorial} from './tutorial.js?v=guns-59';
import {createTeamBattle,availableAttackers,availableTargets,takeTeamTurn,teamOf} from './teams.js?v=guns-59';
import {fantasySlots,drawFantasyOptions} from './fantasy.js?v=guns-59';
import {weaponMaterials,getWeaponMaterials,normalizeMaterials,resolveMaterials} from './materials.js?v=guns-59';
import {weaponSvg,weaponIcon} from './weapons.js?v=guns-59';
import {categories,createFighter,simulate,describe,drawOptions,durations,abilityRules} from './engine.js?v=guns-59';
const $=id=>document.getElementById(id);
let player=0,picks={},fighters=[],names=['Ragnar','Akira'],timer,result,index=0;
let opponent='local',botTimer=null,rematchBattle=false;
let playback='auto',duelBattle=null,duelSpeed=1;
const duelDelay=()=>1200/duelSpeed;
let duelTactics=['balanced','balanced'];
let mode='classic',format='duel',teamBattle=null,mounted=false;
let mountOffers=[drawMountOptions(),drawMountOptions()];
const rosterSize=()=>format==='teams'?4:2;
const sideOf=i=>format==='teams'?teamOf(i):i;
function settingsLocked(locked){document.querySelectorAll('.combatants .duel-tactic select').forEach(n=>n.disabled=locked);document.querySelectorAll('[data-preset],#enter-creator,#cross-start,#gun-start').forEach(n=>n.disabled=locked);for(const id of ['profile-settings','opponent-settings','playback-settings','format-settings','mode-settings','duration-settings','modification-settings'])$(id).disabled=locked;}
let duration='medium',offers=[drawOptions(),drawOptions()];
let fantasyOffers=[drawFantasyOptions(),drawFantasyOptions()];
const defaults=()=>normalizeMaterials({beast:mountOffers[player][0].id,beastArmor:'none',beastAbility:mountOffers[player][0].id,...Object.fromEntries(fantasySlots.map(slot=>[slot.id,fantasyOffers[player][slot.id][0].id])),...Object.fromEntries(categories.map(c=>[c.id,offers[player][c.id][0].id]))});
const escape=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function chosenTextures(weapon=picks.weapon){const m=resolveMaterials(normalizeMaterials({...picks,weapon}));return {headTexture:m.headMaterial.texture,gripTexture:m.gripMaterial.texture};}
let materialNotice='';
function renderMaterials(){const groups=getWeaponMaterials(picks.weapon);return `<div class="weapon-materials"><p>Materiały: ${groups.headMaterial.family} <small>Opcje dopasowane do rodzaju broni.</small><small role="status">${materialNotice}</small></p>${Object.entries(groups).map(([key,group],i)=>`<fieldset class="material-group"><legend>${i+1}. ${group.name}</legend><div class="material-options">${group.options.map(m=>`<label class="option material-option"><input type="radio" name="${key}" value="${m.id}" ${picks[key]===m.id?'checked':''}><span class="material-swatch" style="background-image:url('assets/textures/${m.texture}.svg')"></span><span class="option-name">${m.name}</span><span class="option-desc">${m.desc}</span></label>`).join('')}</div></fieldset>`).join('')}</div>`;}
let portraitSequence=0;
function warrior(f,side=0){const rider=footWarrior(f,side);return f.mounted?textureAnimalSvg(mountedPortrait(rider,f),[{id:f.traits.beast.id,color:f.traits.beastSkin?.color||f.traits.beast.color}]):rider;}
function footWarrior(f,side=0){
const texturePrefix=`warrior-${++portraitSequence}`;
const material=f.traits.armor.texture||(['mail','reinforced-mail','ring','scale','lamellar'].includes(f.picks.armor)?'chainmail':['leather','hardened','studded','hide'].includes(f.picks.armor)?'leather':['cloth','linen','quilted','bamboo'].includes(f.picks.armor)?'cloth':'steel');
const textureDefs=`<defs><radialGradient id="${texturePrefix}-skin" cx=".3" cy=".25" r=".8"><stop stop-color="#edc59d"/><stop offset=".5" stop-color="#c39672"/><stop offset="1" stop-color="#7e513b"/></radialGradient>${['steel','leather','cloth','chainmail','wood','wrap','bronze','darksteel','ash','birch','walnut','tempered','damascus','flint','bone','granite','bamboo','ironwood','rattan'].map(type=>`<pattern id="${texturePrefix}-${type}" patternUnits="userSpaceOnUse" width="${type==='chainmail'?16:type==='cloth'?12:80}" height="${type==='chainmail'?16:type==='cloth'?12:80}"><image href="assets/textures/${type}.svg?v=impact-22" width="${type==='chainmail'?16:type==='cloth'?12:80}" height="${type==='chainmail'?16:type==='cloth'?12:80}"/></pattern>`).join('')}</defs>`;
const armor=f.picks.armor;const color=side?'#b45d45':'#93a98a';
return `<svg viewBox="0 0 300 350" role="img" aria-label="Wojownik: ${escape(f.traits.weapon.name)}, zbroja ${escape(f.traits.armor.name)}, część bojowa ${escape(f.traits.headMaterial.name)}, chwyt ${escape(f.traits.gripMaterial.name)}">${textureDefs}<ellipse cx="148" cy="327" rx="90" ry="12" fill="#000" opacity=".22"/><path d="M111 141 Q65 179 74 289 L119 272 L150 170 L181 279 L213 290 Q213 185 177 142Z" fill="${color}" opacity=".85"/><path d="M111 141 Q65 179 74 289 L119 272 L150 170 L181 279 L213 290 Q213 185 177 142Z" fill="url(#${texturePrefix}-cloth)" opacity=".3"/><path d="${f.mounted?'M124 222 L109 250 L124 280 L144 280 L132 251 L151 236 L175 250 L163 281 L185 281 L196 248 L178 222':'M124 222 L116 303 L100 321 L139 321 L151 234 L163 304 L159 321 L197 321 L185 299 L178 222'}" fill="url(#${texturePrefix}-leather)" stroke="#171e1d" stroke-width="5"/><path d="M111 141 L178 141 L191 233 Q149 250 102 233Z" fill="url(#${texturePrefix}-${material})" stroke="#202725" stroke-width="5"/><path d="M122 145 L148 211 L177 146 M109 216 L183 216" fill="none" stroke="#d0b480" stroke-width="7"/><path d="M118 157 L111 227 M171 157 L182 227" stroke="#e9ddb5" stroke-width="1.5" opacity=".35" stroke-dasharray="2 5"/><circle cx="148" cy="104" r="32" fill="url(#${texturePrefix}-skin)"/><path d="M115 104 Q108 62 148 61 Q187 63 181 108 L166 91 L119 92" fill="${armor==='plate'?'#9da9a5':'#403b30'}"/><path d="M124 110 L139 109 M155 109 L169 110" stroke="#282b28" stroke-width="5"/><path d="M132 127 L149 145 L168 125" fill="#4a3c30"/><path d="M111 156 L88 198 L62 173 M179 157 L198 195 L222 153" fill="none" stroke="url(#${texturePrefix}-${material})" stroke-width="23" stroke-linecap="round"/><circle cx="62" cy="173" r="12" fill="url(#${texturePrefix}-skin)"/>${weaponSvg(f.picks.weapon,texturePrefix,false,{headTexture:f.traits.headMaterial.texture,gripTexture:f.traits.gripMaterial.texture})}${weaponSvg(f.picks.secondary,texturePrefix,true)}<circle cx="220" cy="160" r="10" fill="url(#${texturePrefix}-skin)"/><circle cx="62" cy="173" r="10" fill="url(#${texturePrefix}-skin)"/>${f.mode==='fantasy'?`<ellipse cx="148" cy="322" rx="78" ry="17" fill="none" stroke="#b8a0f1" stroke-width="2" opacity=".7"/><g class="special-item-badge"><circle cx="91" cy="215" r="14" fill="#433454" stroke="#cdb2fa" stroke-width="2"/><text x="91" y="220" text-anchor="middle" fill="#eee0ff" font-size="17">${f.traits.specialItem.icon}</text></g>`:''}</svg>`;}
function steps(n){for(let i=0;i<3;i++)$('step'+i).classList.toggle('active',i===(format==='teams'?(n>=4?2:teamOf(n)):n));$('step0').querySelector('b').textContent=format==='teams'?'Drużyna A':'Pierwszy wojownik';$('step1').querySelector('b').textContent=opponent==='bot'?(format==='teams'?'Drużyna bota':'Bot'):format==='teams'?'Drużyna B':'Drugi wojownik';}
function renderFantasy(){
 $('fantasy-choices').innerHTML=mode==='fantasy'?fantasySlots.map(slot=>`<fieldset class="fantasy-category"><legend>${slot.icon} ${slot.name} <small>5 z 20</small></legend><div class="option-grid">${fantasyOffers[player][slot.id].map(o=>`<label class="option fantasy-option"><input type="radio" name="${slot.id}" value="${o.id}" ${picks[slot.id]===o.id?'checked':''}><span class="option-icon">${o.icon}</span>${o.chance!==undefined?`<span class="chance-badge">${Math.round(o.chance*100)}%</span>`:''}<span class="option-name">${o.name}</span><span class="option-desc">${o.desc}</span></label>`).join('')}</div></fieldset>`).join(''):'';
 const count=8+(mode==='fantasy'?2:0)+(mounted?3:0);$('trait-count').textContent=`${count} / ${count} cech wybranych`;renderMounts();renderPveNote();
 document.body.dataset.mode=mode;
}
let profileStorage;
try{profileStorage=window.localStorage;}catch{}
let profiles=readProfiles(profileStorage),owners=['','','',''];
const progress=readProgress(profileStorage),rewarded=new WeakSet();
function ownerLabel(i){return opponent==='bot'&&sideOf(i)===1?'Komputer (bot)':profiles[owners[i]]?`Profil: ${profiles[owners[i]]}`:'Gość';}
function refreshProfiles(){
 const codeSelect=$('code-profile'),previous=codeSelect.value;
 codeSelect.replaceChildren(...profiles.flatMap((name,i)=>name?[new Option(`${i+1}. ${name}`,String(i))]:[]));
 if(!codeSelect.options.length)codeSelect.add(new Option('Najpierw dodaj profil',''));
 else if(profiles[previous])codeSelect.value=previous;

 for(let i=0;i<owners.length;i++)if(!profiles[owners[i]])owners[i]='';
 const select=$('fighter-profile');select.replaceChildren(new Option('Gość — bez profilu',''),...profiles.flatMap((name,i)=>name?[new Option(`${i+1}. ${name}`,String(i))]:[]));select.value=owners[player]||'';
 document.querySelectorAll('[data-owner]').forEach(node=>node.textContent=ownerLabel(Number(node.dataset.owner)));
 renderShop();
}
profiles.forEach((name,i)=>$('profile-'+i).value=name);
$('loot-catalog').innerHTML=lootArmors.map(a=>`<div class="loot-card rarity-${a.rarity==='Legendarna'?'legendary':a.rarity==='Epicka'?'epic':'common'}"><b>${a.name}</b><strong>${a.chance}% · ${a.rarity}</strong><span>Ochrona ${a.stats.defense} · HP +${a.stats.health} · Siła +${a.stats.attack} · Szybkość ${a.stats.speed>=0?'+':''}${a.stats.speed}</span>${a.skill?`<small class="armor-skill">✦ ${a.skill.name}: ${a.skill.description}</small>`:''}</div>`).join('');
$('profile-settings').addEventListener('input',e=>{
 if(!e.target.matches('[data-profile]'))return;
 profiles[Number(e.target.dataset.profile)]=e.target.value.trim();
 $('profile-status').textContent=writeProfiles(profileStorage,profiles)?'Zapisano na tym urządzeniu.':'Zapis jest niedostępny — profile działają do zamknięcia strony.';
 refreshProfiles();if(!$('creator').hidden)renderCreator();
});
$('fighter-profile').addEventListener('change',e=>{owners[player]=e.target.value;renderCreator();});
function renderShop(){
 $('profile-shop').replaceChildren(...profiles.flatMap((name,i)=>{
  if(!name)return [];const p=progress[i],card=document.createElement('div'),label=document.createElement('span'),button=document.createElement('button');
  label.textContent=`${name} · ${p.xp} EXP · Zdobyte zbroje: ${p.armors.length}/20 · ${p.armors.map(id=>lootArmors.find(a=>a.id===id).name).join(', ')||'brak'}`;
  button.type='button';button.className='quiet';button.textContent='Otwórz box · 100 EXP';button.dataset.box=i;
  const count=p.codes.includes('x10box')?Number(document.querySelector(`[data-box-count="${i}"]`)?.value||1):1;
  button.disabled=$('creator').hidden||p.xp<100*count;button.textContent=`Otwórz ${count===1?'box':count+' boxów'} · ${count*100} EXP`;
  card.append(label,button);
  if(p.codes.includes('god')&&!p.godClaimed){const reward=document.createElement('button');reward.type='button';reward.className='quiet';reward.dataset.godReward=i;reward.textContent='GOD · wybierz 2 zbroje i 2 skiny';reward.disabled=$('creator').hidden;card.append(reward);}
  if(p.codes.includes('x10box')){const countLabel=document.createElement('label');countLabel.textContent='Skrzynki naraz';const select=document.createElement('select');select.dataset.boxCount=i;select.setAttribute('aria-label',`Liczba skrzynek — ${name}`);select.replaceChildren(...Array.from({length:10},(_,n)=>new Option(`${n+1} · ${(n+1)*100} EXP`,String(n+1))));select.value=String(count);select.disabled=$('creator').hidden;countLabel.append(select);card.append(countLabel);}
  const species=document.createElement('select');species.dataset.boxSpecies=i;species.setAttribute('aria-label',`Gatunek dla skrzynki skinów — ${name}`);
  const previous=document.querySelector(`[data-box-species="${i}"]`)?.value;
  species.title='Gatunek dla skrzynki skinów';species.replaceChildren(...allBeasts.map(b=>new Option(b.name,b.id)));species.value=previous||'horse';species.disabled=$('creator').hidden;card.append(species);
  for(const [kind,title,field] of [['skin','Box skinów bestii','beastSkins']]){
   const extra=document.createElement('button');extra.type='button';extra.className='quiet';extra.dataset.beastBox=kind;extra.dataset.profile=i;
   extra.textContent=`${title} · ${count} × 100 EXP (${p[field].length}/${kind==='beast'?5:125})`;extra.disabled=$('creator').hidden||p.xp<100*count;card.append(extra);
  }return [card];
 }));
}
$('profile-shop').addEventListener('change',e=>{if(e.target.matches('[data-box-count]'))renderShop();});
$('profile-shop').addEventListener('click',e=>{
 const button=e.target.closest('[data-box],[data-beast-box]');if(!button||$('creator').hidden)return;
 const owner=button.dataset.profile??button.dataset.box,count=Number(document.querySelector(`[data-box-count="${owner}"]`)?.value||1);
 const drops=buyBoxes(progress,Number(owner),button.dataset.beastBox||'warrior',count,Math.random,document.querySelector(`[data-box-species="${owner}"]`).value);if(!drops)return;
 const saved=saveProgress(profileStorage,progress),drop=drops[0];
 $('profile-status').textContent=drops.length>1?`Otwarto ${drops.length} skrzynek. Nowe: ${drops.filter(d=>!d.duplicate).length}, duplikaty: ${drops.filter(d=>d.duplicate).length}. Zwrot: ${drops.filter(d=>d.duplicate).length*25} EXP.${saved?' Zapisano.':' Zapis niedostępny.'}`:`${drop.armor.rarity}: ${drop.armor.name} (${drop.armor.chance}%). ${drop.duplicate?'Duplikat — zwrot 25 EXP.':drop.kind?'Odblokowano w wyposażeniu bestii tego profilu!':'Dodano do puli zbroi tego profilu!'}${saved?' Zapisano.':' Zapis niedostępny.'}`;
 renderCreator();openBox(drops,owner);
});
function grantRewards(battle){
 if(rewarded.has(battle))return;rewarded.add(battle);
 const ids=fighters.map((_,i)=>opponent==='bot'&&sideOf(i)===1?'':owners[i]);
 const rewards=rewardProfiles(progress,ids,fighters.map((_,i)=>battle.winner===null?null:sideOf(i)===battle.winner),rematchBattle?30:60);
 const saved=saveProgress(profileStorage,progress);
 $('reward-note').textContent=rewards.map(([id,amount])=>`${profiles[id]}: ${amount>0?'+':''}${amount} EXP`).join(' · ')+(rewards.length&&!saved?' (zapis niedostępny)':'');renderShop();
}

const armorPools=[];
function syncArmorOffer(){
 const ids=profiles[owners[player]]?progress[owners[player]].armors:[];
 const signature=owners[player]+':'+ids.join(',');
 if(armorPools[player]!==signature||!offers[player].armor.some(a=>a.id===picks.armor)){
  offers[player].armor=drawArmorOffer(categories.find(c=>c.id==='armor').options,ids);armorPools[player]=signature;
  if(!offers[player].armor.some(a=>a.id===picks.armor))picks.armor=offers[player].armor[0].id;
 }
}
function renderCreator(){if(mounted){const owned=profiles[owners[player]]?progress[owners[player]]:null;if(lootBeasts.some(b=>b.id===picks.beast)&&!owned?.beasts.includes(picks.beast)){picks=normalizeMount({...picks,beast:mountOffers[player][0].id});}if(picks.beastSkin!=='natural'&&!owned?.beastSkins.includes(picks.beastSkin))picks.beastSkin='natural';if(picks.beastArmor?.includes('-relic-')&&!owned?.beastArmors.some(id=>picks.beastArmor===id))picks.beastArmor='none';}syncArmorOffer();refreshProfiles();cancelBotMove();clearCombatVisuals();clearBeastEffects();steps(player);$('creator').hidden=false;renderShop();$('arena').hidden=true;$('player-label').textContent=format==='teams'?`DRUŻYNA ${teamOf(player)===0?'A':'B'} · WOJOWNIK ${player%2+1} / 2`:`GRACZ 0${player+1}`;$('fighter-name').value=names[player];$('error').textContent='';
$('categories').innerHTML=categories.map(c=>`<fieldset class="category" data-category="${c.id}"><legend><span>${c.icon}</span> ${c.name}${c.id==='armor'?` <small>5 z ${20+(profiles[owners[player]]?progress[owners[player]].armors.length:0)}</small>`:''}</legend><div class="option-grid">${offers[player][c.id].map(o=>`<label class="option"><input type="radio" name="${c.id}" value="${o.id}" ${picks[c.id]===o.id?'checked':''}><span class="option-icon ${['weapon','secondary'].includes(c.id)?'equipment-preview':''}">${['weapon','secondary'].includes(c.id)?weaponIcon(o.id,c.id==='weapon'?chosenTextures(o.id):{}):o.icon}</span>${c.id==='ability'?`<span class="chance-badge">${Math.round(abilityRules[o.id].chance*100)}%</span>`:''}${o.chance!==undefined?`<span class="chance-badge">${Math.round(o.chance*100)}%</span>`:''}<span class="option-name">${o.name}</span><span class="option-desc">${o.desc}${c.id==='armor'&&o.chance!==undefined?` · ${o.chance}% w boxie · ${o.rarity}`:''}</span></label>`).join('')}</div>${c.id==='weapon'?renderMaterials():''}</fieldset>`).join('');renderFantasy();preview();}
function preview(){const f=createFighter($('fighter-name').value.trim()||'Wojownik',picks,duration,mode,mounted);$('portrait').innerHTML=warrior(f,sideOf(player));for(const card of document.querySelectorAll('[data-category="weapon"] > .option-grid .option'))card.querySelector('.option-icon').innerHTML=weaponIcon(card.querySelector('input').value,chosenTextures(card.querySelector('input').value));$('armor-stats').textContent=`${f.traits.armor.name}: ochrona +${f.traits.armor.stats?.defense||0}, Szybkość ${(f.traits.armor.stats?.speed||0)>=0?'+':''}${f.traits.armor.stats?.speed||0}, HP ${(f.traits.armor.stats?.health||0)>=0?'+':''}${f.traits.armor.stats?.health||0}. Zastępuje premie poprzedniej zbroi.${f.traits.armor.skill?` ✦ ${f.traits.armor.skill.name}: ${f.traits.armor.skill.description}`:''}`;$('stats').innerHTML=[['Siła',f.stats.attack,40],['Ochrona',f.stats.defense,30],['Szybkość',f.stats.speed,35],['Zdrowie',f.stats.health,260],['Celność',f.stats.accuracy,120],['Przebicie',f.stats.pierce,25],['Kondycja',f.stats.stamina,150]].map(([label,value,max])=>`<div><span>${label}</span><b>${value}</b><i style="--value:${Math.max(0,value)/max*100}%"></i></div>`).join('');}
$('categories').addEventListener('change',e=>{if(e.target.matches('input')){const before={...picks};picks[e.target.name]=e.target.value;
if(e.target.name==='weapon'){
 picks=normalizeMaterials(picks);materialNotice=['headMaterial','gripMaterial'].some(key=>before[key]!==picks[key])?'Niepasujące materiały zastąpiono domyślnymi dla tej broni.':'';
 document.querySelector('.weapon-materials').outerHTML=renderMaterials();
}preview();}});
let magicPreviewTimer;
function animateMagicPreview(){clearTimeout(magicPreviewTimer);const portrait=$('portrait');portrait.classList.remove('magic-preview');void portrait.offsetWidth;portrait.classList.add('magic-preview');magicPreviewTimer=setTimeout(()=>portrait.classList.remove('magic-preview'),650);}
$('fantasy-choices').addEventListener('change',e=>{if(e.target.matches('input')){picks[e.target.name]=e.target.value;preview();animateMagicPreview();}});
$('fighter-name').addEventListener('input',()=>{names[player]=$('fighter-name').value;preview();});
$('randomize').onclick=()=>{const materials=Object.fromEntries(Object.keys(weaponMaterials).map(key=>[key,picks[key]]));offers[player]=drawOptions();armorPools[player]=null;fantasyOffers[player]=drawFantasyOptions();mountOffers[player]=drawMountOptions();const candidate={...defaults(),...materials,beastArmor:picks.beastArmor||'none',beastAbility:picks.beastAbility==='none'?'none':mountOffers[player][0].id};picks=normalizeMount(normalizeMaterials(candidate));materialNotice=Object.keys(materials).some(key=>candidate[key]!==picks[key])?'Po losowaniu dopasowano materiały do nowej broni.':'';renderCreator();};
$('confirm').onclick=()=>{try{fighters[player]=createFighter($('fighter-name').value,picks,duration,mode,mounted);names[player]=fighters[player].name;if(opponent==='bot'&&player===(format==='teams'?1:0)){prepareBotRoster();showArena();return;}if(player<rosterSize()-1){player++;materialNotice='';picks=fighters[player]?.picks?{...fighters[player].picks}:defaults();renderCreator();$('fighter-name').focus();}else showArena();}catch(e){$('error').textContent=e.message;$('fighter-name').focus();}};
function showArena(){$('arena').dataset.opponent=opponent;cancelBotMove();$('speed-controls').hidden=!(format==='duel'&&playback==='auto');clearCombatVisuals();clearBeastEffects();fighters=fighters.map(f=>createFighter(f.name,f.picks,duration,mode,mounted));settingsLocked(false);$('team-controls').hidden=true;$('duel-controls').hidden=true;steps(rosterSize());$('creator').hidden=true;renderShop();$('reward-note').textContent='';$('arena').hidden=false;$('result').hidden=true;$('fight').hidden=false;$('skip').hidden=true;$('round').textContent='PRZED POJEDYNKIEM';$('commentary').textContent=format==='teams'?'Dwie drużyny. Czterech wojowników. Wybierz, kto zaatakuje którego przeciwnika.':'Dwaj wojownicy. Jedna arena. Czas sprawdzić swoje wybory.';
$('combatants').classList.toggle('team-grid',format==='teams');$('combatants').innerHTML=fighters.map((f,i)=>`<article id="combatant${i}" class="combatant side${sideOf(i)}"><div class="fighter-heading"><span>${opponent==='bot'&&sideOf(i)===1?'BOT · ':''}${format==='teams'?`DRUŻYNA ${teamOf(i)===0?'A':'B'} · ${i%2+1}`:`GRACZ 0${i+1}`}</span><h2>${escape(f.name)}</h2><small class="owner-badge" data-owner="${i}">${escape(ownerLabel(i))}</small><p>${f.traits.origin.name} · ${f.traits.style.name}</p><div class="health" role="progressbar" aria-label="Zdrowie ${escape(f.name)}" aria-valuemin="0" aria-valuemax="${f.stats.health}" aria-valuenow="${f.stats.health}"><i></i></div><small id="hp${i}">${f.stats.health} / ${f.stats.health} HP</small><small class="combat-energy" id="energy${i}">Kondycja: ${f.stats.stamina} / ${f.stats.stamina}</small></div><div class="arena-warrior">${warrior(f,sideOf(i))}<span class="damage" id="damage${i}"></span></div><span class="loadout">${`${f.traits.weapon.icon} ${f.traits.weapon.name} / ${f.traits.armor.name}${f.traits.armor.skill?`<small class="armor-skill">✦ ${f.traits.armor.skill.name}</small>`:''}<small>${f.traits.headMaterial.name} / ${f.traits.gripMaterial.name}</small>`}${f.mounted?`<small class="mount-loadout">${f.traits.beast.icon} ${f.traits.beast.name} · ${f.traits.beastArmor.name}<br>✺ ${f.traits.beastAbility.name} (${Math.round(f.traits.beastAbility.chance*100)}%)</small>`:''}${f.mode==='fantasy'?`<small class="fantasy-loadout">${f.traits.specialItem.icon} ${f.traits.specialItem.name} · ${f.traits.magicPower.icon} ${f.traits.magicPower.name}</small>`:''}</span>${format==='duel'&&playback==='auto'&&!(opponent==='bot'&&i===1)?`<label class="duel-tactic">Taktyka ${escape(f.name)}<select data-tactic-player="${i}" aria-label="Taktyka ${escape(f.name)}">${tacticOptions(false,duelTactics[i])}</select><small id="duel-tactic-note${i}">${tactics[duelTactics[i]].desc}</small></label>`:''}${format==='teams'?`<button class="secondary fighter-select" data-fighter="${i}" hidden>Wybierz ${escape(f.name)}</button>`:''}</article>`).join('');$('arena').scrollIntoView({behavior:'smooth',block:'start'});}
function paint(e){clearCombatVisuals();clearBeastEffects();basePaint(e);animateBeastSkill(e,fighters);decorateCombat(e,fighters);}
function basePaint(e){$('round').textContent=format==='teams'?`TURA ${playback==='auto'?index:teamBattle.events.length} / ${playback==='auto'?result.events.length:320}`:playback==='turns'?`TURA ${duelBattle.events.length} / 160`:`WYMIANA ${index} / ${result.events.length}`;$('commentary').textContent=(format==='teams'?`${fighters[e.actor].name} → ${fighters[e.target].name}: `:'')+e.text+(e.details?.length?' '+e.details.join(' '):'')+(e.weakened?' Osłabiony cios po rozbrojeniu.':'')+(e.ability?` ${fighters[e.actor].traits.ability.name}!`:'')+(e.healed?` +${e.healed} HP.`:'');for(let i=0;i<fighters.length;i++){const card=$('combatant'+i);card.className=`combatant side${sideOf(i)} ${i===e.actor?(e.kind==='defend'?'defending':e.kind==='rest'?'resting':e.magic?'attack casting':'attack'):i===e.target?(['rest','defend'].includes(e.kind)?'':e.kind==='dodge'?'dodge':'hit'):''} ${e.hp[i]===0?'defeated':''}`;const bar=card.querySelector('.health');bar.setAttribute('aria-valuenow',e.hp[i]);bar.querySelector('i').style.width=`${e.hp[i]/fighters[i].stats.health*100}%`;$('hp'+i).textContent=`${e.hp[i]} / ${fighters[i].stats.health} HP`;$('energy'+i).textContent=`Kondycja: ${e.energy[i]} / ${fighters[i].stats.stamina}`;$('damage'+i).textContent=i===e.target?(['rest','defend'].includes(e.kind)?'':(e.damage+(e.magicDamage||0))?`−${e.damage+(e.magicDamage||0)}`:e.kind==='dodge'?'UNIK':'BLOK'):i!==e.actor?'':(e.selfDamage||e.counterDamage)?`−${(e.selfDamage||0)+(e.counterDamage||0)}`:e.healed?`+${e.healed}`:'';}}
function finish(){cancelBotMove();clearTimeout(timer);$('duel-controls').hidden=true;if(format==='teams'){index=result.events.length;paint(result.events.at(-1));$('skip').hidden=true;finishTeams();return;}settingsLocked(false);grantRewards(result);index=result.events.length;paint(result.events.at(-1));$('skip').hidden=true;$('result').hidden=false;$('winner').textContent=`Zwycięża ${fighters[result.winner].name}`;$('summary').textContent=describe(result,fighters);$('round').textContent='KONIEC POJEDYNKU';$('combatant'+result.winner).classList.add('victor');$('history').replaceChildren(...result.events.map(e=>{const li=document.createElement('li');li.textContent=e.text+(e.details?.length?' '+e.details.join(' '):'')+(e.weakened?' Osłabiony cios po rozbrojeniu.':'')+(e.ability?` Umiejętność: ${fighters[e.actor].traits.ability.name}.`:'');return li;}));}
function tick(){if(index>=result.events.length){finish();return;}paint(result.events[index++]);timer=setTimeout(tick,format==='duel'?duelDelay():650);}
function fight(replay=false){rematchBattle=replay===true;cancelBotMove();clearTimeout(timer);showArena();if(playback==='turns'){if(format==='teams')startTeams();else startDuelTurns();return;}if(format==='teams'){teamBattle=opponent==='bot'?simulateBotTeams(fighters):simulateTeamBattle(fighters);result=teamBattle;}else if(opponent==='bot')result=simulateBotDuel(fighters,duelTactics[0]);else result=simulate(...fighters.map((f,i)=>({...f,picks:{...f.picks,tactic:duelTactics[i]}})));settingsLocked(true);index=0;$('fight').hidden=true;$('skip').hidden=false;if(matchMedia('(prefers-reduced-motion: reduce)').matches)finish();else tick();}
$('fight').onclick=()=>fight();$('skip').onclick=finish;$('rematch').onclick=()=>fight(true);
$('edit').onclick=()=>{clearTimeout(timer);player=0;materialNotice='';picks={...fighters[0].picks};renderCreator();};
function resetRoster(){cancelBotMove();clearTimeout(timer);teamBattle=null;duelBattle=null;duelTactics=['balanced','balanced'];player=0;materialNotice='';fighters=[];armorPools.length=0;owners=['','','',''];names=format==='teams'?['Ragnar','Bjorn','Akira','Yuna']:['Ragnar','Akira'];offers=names.map(()=>drawOptions());fantasyOffers=names.map(()=>drawFantasyOptions());mountOffers=names.map(()=>drawMountOptions());settingsLocked(false);picks=defaults();renderCreator();}
$('reset').onclick=resetRoster;
$('format-settings').addEventListener('change',e=>{if(!e.target.matches('input'))return;format=e.target.value;playback=opponent==='bot'?'turns':format==='teams'?'turns':'auto';document.querySelector(`input[name="playback"][value="${playback}"]`).checked=true;resetRoster();});
$('mode-settings').addEventListener('change',e=>{if(!e.target.matches('input'))return;mode=e.target.value;fighters=fighters.map(f=>createFighter(f.name,f.picks,duration,mode,mounted));document.body.dataset.mode=mode;if($('creator').hidden)showArena();else{renderFantasy();preview();}});
$('duration-settings').addEventListener('change',e=>{if(!e.target.matches('input'))return;duration=e.target.value;fighters=fighters.map(f=>createFighter(f.name,f.picks,duration,mode,mounted));if($('creator').hidden)showArena();else preview();});
$('help').onclick=()=>$('instructions').showModal();
picks=defaults();renderCreator();

function teamName(team){return opponent==='bot'&&team===1?'Drużyna bota':`Drużyna ${team===0?'A':'B'}`;}
function updateTeamChoices(){$('team-tactic').value='balanced';$('team-tactic-note').textContent=tactics.balanced.desc;
 const actors=availableAttackers(teamBattle),targets=availableTargets(teamBattle);
 for(const [id,indices] of [['team-actor',actors],['team-target',targets]]){
  const previous=Number($(id).value);$(id).replaceChildren(...indices.map(i=>new Option(fighters[i].name,String(i))));
  if(indices.includes(previous))$(id).value=String(previous);
 }
 $('team-turn').textContent=`${teamName(teamBattle.activeTeam)} — wybierz atakującego i cel`;
 $('team-error').textContent='';highlightTeamChoices();queueBotMove();
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
 if(!teamBattle||teamBattle.finished||isBotTurn())return;
 try{const event=takeTeamTurn(teamBattle,Number($('team-actor').value),Number($('team-target').value),Math.random,$('team-tactic').value);paint(event);if(teamBattle.finished)finishTeams();else updateTeamChoices();}catch(error){$('team-error').textContent=error.message;}
};
function finishTeams(){
 cancelBotMove(); settingsLocked(false);$('team-controls').hidden=true;$('result').hidden=false;$('round').textContent='KONIEC WALKI DRUŻYNOWEJ';
 const winner=teamBattle.winner;grantRewards(teamBattle);
 $('winner').textContent=winner===null?'Remis':`Zwycięża ${teamName(winner)}`;
 $('summary').textContent=teamBattle.reason==='knockout'?'Obaj przeciwnicy zostali pokonani.':`Po 320 turach decyduje suma pozostałych procentów zdrowia drużyny.${winner===null?' Obie drużyny uzyskały ten sam wynik.':''}`;
 fighters.forEach((_,i)=>{const card=$('combatant'+i);card.classList.remove('selected-attacker','selected-target');card.classList.toggle('victor',winner!==null&&teamOf(i)===winner);card.querySelector('.fighter-select').hidden=true;});
 $('history').replaceChildren(...teamBattle.events.map(e=>{const li=document.createElement('li');li.textContent=`${fighters[e.actor].name} → ${fighters[e.target].name}: ${e.text} ${e.details.join(' ')}`;return li;}));
}

setupTutorial(()=>({format,mode,mounted,player,activeTeam:teamBattle?.activeTeam,phase:!$('creator').hidden?'creator':!$('result').hidden?'result':!$('duel-controls').hidden?'duel-turns':!$('team-controls').hidden?'teams':$('fight').hidden?'watching':'arena'}));

function renderMounts(){
 const owned=profiles[owners[player]]?progress[owners[player]]:null;
 $('mount-choices').hidden=!mounted;
 $('mount-choices').innerHTML=mounted?`<fieldset class="mount-category"><legend>♞ Wierzchowiec <small>5 z 20</small></legend><p>Bestia i jeździec walczą jako jedna postać ze wspólnym HP. Premie sumują się ze statystykami. Wierzchowiec dodaje +10 obrażeń do każdego trafienia bronią (przed osłonami).</p><div class="option-grid">${[...mountOffers[player],...lootBeasts.filter(b=>owned?.beasts.includes(b.id))].map(o=>`<label class="option"><input type="radio" name="beast" value="${o.id}" ${picks.beast===o.id?'checked':''}><span class="option-icon">${o.icon}</span><span class="option-name">${o.name}</span><span class="option-desc">${o.desc}</span></label>`).join('')}</div><fieldset class="beast-armor-group"><legend>1. Zbroja bestii — ${createFighter('Podgląd',picks,duration,mode,mounted).traits.beast.name}</legend><div class="option-grid">${getBeastArmors(picks.beast,profiles[owners[player]]?progress[owners[player]].beastArmors:[]).map(o=>`<label class="option"><input type="radio" name="beastArmor" value="${o.id}" ${picks.beastArmor===o.id?'checked':''}><span class="option-icon">${o.icon}</span><span class="option-name">${o.name}</span><span class="option-desc">${o.desc}</span></label>`).join('')}</div></fieldset><fieldset class="beast-skin-group"><legend>Skin bestii — wygląd bez premii</legend><p>Skrzynka skinów losuje wygląd dla wybranego gatunku. Wybierz gatunek przy profilu. Koszt: 100 EXP; duplikat zwraca 25 EXP.</p><div class="option-grid">${[{id:'natural',name:'Naturalna',desc:'Oryginalne umaszczenie',color:null},...beastSkins.filter(s=>s.beast===picks.beast&&profiles[owners[player]]&&progress[owners[player]].beastSkins.includes(s.id))].map(s=>`<label class="option"><input type="radio" name="beastSkin" value="${s.id}" ${(picks.beastSkin||'natural')===s.id?'checked':''}><span class="animal-swatch" style="--animal-color:${s.color||'#8d7964'}"></span><span class="option-name">${s.name}</span><span class="option-desc">${s.desc}</span></label>`).join('')}</div></fieldset><fieldset class="beast-ability-group"><legend>2. Umiejętność bestii — wybierz 1 z 5</legend><div class="option-grid">${getBeastAbilities(picks.beast).map(o=>`<label class="option"><input type="radio" name="beastAbility" value="${o.id}" ${picks.beastAbility===o.id?'checked':''}><span class="option-icon">✺</span><span class="chance-badge">${Math.round(o.chance*100)}%</span><span class="option-name">${o.name}</span><span class="option-desc">${o.desc}</span></label>`).join('')}</div></fieldset></fieldset>`:'';
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
 fighters.forEach((_,i)=>$('combatant'+i).classList.toggle('selected-attacker',i===actor));queueBotMove();
}
function startDuelTurns(){
 duelBattle=createDuelBattle(fighters);settingsLocked(true);$('fight').hidden=true;$('duel-controls').hidden=false;
 $('duel-tactic').innerHTML=tacticOptions(false);$('duel-action-note').textContent=tactics.balanced.desc;$('duel-error').textContent='';updateDuelTurn();
 $('commentary').textContent='Wybierz atak, odpoczynek albo obronę. Po akcji kolej przechodzi na przeciwnika.';
}
$('duel-controls').addEventListener('click',e=>{
 const action=e.target.closest('[data-duel-action]');if(!action||!duelBattle||duelBattle.finished||isBotTurn())return;
 try{
  const tactic=action.dataset.duelAction==='attack'?$('duel-tactic').value:action.dataset.duelAction;
  const event=takeDuelTurn(duelBattle,tactic);paint(event);
  if(duelBattle.finished){result=duelBattle;finish();}else updateDuelTurn();
 }catch(error){$('duel-error').textContent=error.message;}
});

$('duel-tactic').onchange=()=>{$('duel-action-note').textContent=tactics[$('duel-tactic').value].desc;};

function renderPveNote(){$('pve-note').hidden=opponent!=='bot';$('pve-note').textContent=format==='teams'?'PvE: tworzysz dwóch sojuszników. Bot sam stworzy drużynę przeciwną i wykona jej tury.':'PvE: tworzysz swoją postać. Bot sam stworzy przeciwnika i wykona jego tury.';
}

$('speed-controls').addEventListener('change',e=>{
 if(!e.target.matches('input[name="duel-speed"]'))return;
 const speed=Number(e.target.value);if(![1,2,3].includes(speed))return;duelSpeed=speed;
 $('speed-note').textContent=`Odstęp między akcjami: ${(duelDelay()/1000).toLocaleString('pl-PL',{maximumFractionDigits:2})} s.`;
 if(format==='duel'&&playback==='auto'&&$('fight').hidden&&$('result').hidden&&!$('arena').hidden){clearTimeout(timer);timer=setTimeout(tick,duelDelay());}
});

function prepareBotRoster(){
 for(let i=format==='teams'?2:1;i<rosterSize();i++){
  if(!fighters[i])fighters[i]=createBotFighter({index:i-(format==='teams'?2:1),offers:offers[i],fantasyOffers:fantasyOffers[i],mountOffers:mountOffers[i],duration,mode,mounted});
  names[i]=fighters[i].name;
 }
}
function isBotTurn(){return opponent==='bot'&&playback==='turns'&&(format==='teams'?teamBattle&&!teamBattle.finished&&teamBattle.activeTeam===1:duelBattle&&!duelBattle.finished&&duelBattle.activeActor===1);}
function cancelBotMove(){clearTimeout(botTimer);botTimer=null;$('bot-status').hidden=true;}
function queueBotMove(){
 cancelBotMove();const busy=Boolean(isBotTurn());
 document.querySelectorAll('#duel-controls button,#duel-controls select,#team-controls button,#team-controls select').forEach(n=>n.disabled=busy);
 if(!busy)return;
 document.querySelectorAll('.fighter-select').forEach(n=>n.disabled=true);
 const battle=format==='teams'?teamBattle:duelBattle;
 $('bot-status').hidden=false;$('bot-status').textContent='Bot wybiera ruch…';
 botTimer=setTimeout(()=>{
  botTimer=null;if(battle!==(format==='teams'?teamBattle:duelBattle)||battle.finished||!isBotTurn()||$('arena').hidden)return;
  let event;
  if(format==='teams'){const move=chooseBotTeamAction(battle);event=takeTeamTurn(battle,move.actor,move.target,Math.random,move.tactic);}
  else{const actor=battle.activeActor;event=takeDuelTurn(battle,chooseBotTactic(battle,actor,1-actor));}
  paint(event);
  if(battle.finished){if(format==='teams')finishTeams();else{result=battle;finish();}}
  else if(format==='teams')updateTeamChoices();else updateDuelTurn();
 },700);
}
$('opponent-settings').addEventListener('change',e=>{
 if(!e.target.matches('input'))return;opponent=e.target.value;
 if(opponent==='bot'){playback='turns';document.querySelector('input[name="playback"][value="turns"]').checked=true;}
 resetRoster();
});

// Settings summary reads the actual controls, including automatic mode changes.
function updateSettingsSummary(){
 document.querySelectorAll('[data-preset]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.preset===`${format}:${opponent}`)));
 const label=name=>document.querySelector(`input[name="${name}"]:checked`)?.parentElement.querySelector('b').textContent;
 $('settings-summary').textContent=[opponent==='bot'?'Bot PvE':'Lokalnie',label('format'),label('playback'),label('mode'),label('duration')].join(' · ');
}
document.querySelector('.match-settings').addEventListener('change',updateSettingsSummary);updateSettingsSummary();
let boxTimer=null,boxReveal=null,boxOwner=null;
function openBox(drops,owner){
 const drop=drops[0];
 clearTimeout(boxTimer);boxOwner=owner;
 const dialog=$('box-dialog'),armor=drop.armor;
 dialog.dataset.phase='opening';dialog.dataset.rarity=armor.rarity==='Legendarna'?'legendary':armor.rarity==='Epicka'?'epic':armor.rarity==='Rzadka'?'rare':'common';
 $('box-result').replaceChildren();$('box-title').textContent=drops.length>1?`Otwieranie ${drops.length} skrzynek…`:'Otwieranie skrzyni…';$('box-close').hidden=true;$('box-skip').hidden=false;
 boxReveal=()=>{
  if(dialog.dataset.phase==='revealed')return;clearTimeout(boxTimer);dialog.dataset.phase='revealed';$('box-title').textContent=drop.kind?(drop.duplicate?'Duplikat — zwrot EXP!':drop.kind==='beast'?'Nowa bestia w kolekcji!':drop.kind==='skin'?'Nowy skin bestii!':'Nowa zbroja bestii!'):(drop.duplicate?'Znana zbroja, nowa nagroda!':'Nowa zbroja w Twojej puli!');
  const rarity=document.createElement('span'),name=document.createElement('h3'),stats=document.createElement('p'),note=document.createElement('p');
  rarity.className='box-rarity';rarity.textContent=`${armor.rarity} · ${armor.chance}% szansy`;
  name.textContent=armor.name;stats.textContent=armor.desc;note.textContent=drop.kind&&!drop.duplicate?'Odblokowano dla tego profilu. Włącz Wierzchowce i wybierz przedmiot pod bestią.':drop.duplicate?'Duplikat — zwrot 25 EXP.':'Dodano do puli zbroi tego profilu. Wylosuj ją w zwykłym slocie Zbroja!';
  $('box-result').append(rarity,name,stats,note);
  if(drops.length>1){$('box-title').textContent=`Otwarto ${drops.length} skrzynek!`;$('box-result').replaceChildren();for(const item of drops){const card=document.createElement('div');card.className='bulk-drop';const heading=document.createElement('h3'),info=document.createElement('p');heading.textContent=item.armor.name;info.textContent=`${item.armor.rarity} · ${item.armor.chance}% · ${item.duplicate?'Duplikat — zwrot 25 EXP':'Nowy przedmiot'} · ${item.armor.desc}`;card.append(heading,info);$('box-result').append(card);}}$('box-skip').hidden=true;$('box-close').hidden=false;$('box-close').focus();
 };
 dialog.showModal();if(matchMedia('(prefers-reduced-motion: reduce)').matches)boxReveal();else boxTimer=setTimeout(boxReveal,1500);
}
$('box-skip').onclick=()=>boxReveal?.();$('box-close').onclick=()=>$('box-dialog').close();
$('box-dialog').addEventListener('cancel',()=>{boxReveal?.();});
$('box-dialog').addEventListener('close',()=>{clearTimeout(boxTimer);boxReveal=null;document.querySelector(`[data-box="${boxOwner}"]`)?.focus();});

$('enter-creator').onclick=()=>{if($('creator').hidden){$('arena').scrollIntoView({behavior:'smooth',block:'start'});return;}$('creator').scrollIntoView({behavior:'smooth',block:'start'});$('fighter-name').focus({preventScroll:true});};
document.querySelector('.arena-mode-tabs').addEventListener('click',e=>{
 const button=e.target.closest('[data-preset]');if(!button||button.disabled)return;
 const [nextFormat,nextOpponent]=button.dataset.preset.split(':');
 for(const [name,value]of [['opponent',nextOpponent],['format',nextFormat]]){
  const input=document.querySelector(`input[name="${name}"][value="${value}"]`);
  if(!input.checked){input.checked=true;input.dispatchEvent(new Event('change',{bubbles:true}));}
 }
 updateSettingsSummary();
});

$('code-form').addEventListener('submit',e=>{
 e.preventDefault();const id=$('code-profile').value;
 const outcome=redeemCode(progress,profiles[id]?id:'',$('redeem-code').value);
 const saved=outcome.ok?saveProgress(profileStorage,progress):true;
 $('code-status').textContent=outcome.message+(saved?'':' Zapis niedostępny — nagroda pozostanie do zamknięcia strony.');
 $('code-status').dataset.success=String(outcome.ok);
 if(outcome.ok){$('redeem-code').value='';renderShop();if(outcome.reward==='god'&&!$('creator').hidden)openGod(id);}
});

let godOwner=null;
function openGod(id){
 if(!profiles[id]||!progress[id].codes.includes('god')||progress[id].godClaimed||$('creator').hidden)return;
 godOwner=id;$('god-profile').textContent=profiles[id];$('god-error').textContent='';
 for(const [target,pool,owned] of [['god-armors',lootArmors,progress[id].armors],['god-skins',beastSkins.filter(s=>!lootBeasts.some(b=>b.id===s.beast)||progress[id].beasts.includes(s.beast)),progress[id].beastSkins]]){
  $(target).replaceChildren(...pool.filter(a=>a.rarity==='Legendarna').map(item=>{const card=document.createElement('label');card.className='god-choice';const input=document.createElement('input'),name=document.createElement('b'),desc=document.createElement('span');input.type='checkbox';input.name=target;input.value=item.id;name.textContent=item.name+(owned.includes(item.id)?' (już posiadasz)':'');desc.textContent=item.desc;if(item.color)card.style.setProperty('--skin-color',item.color);card.append(input,name,desc);return card;}));
 }
 updateGodCounts();$('god-dialog').showModal();
}
function updateGodCounts(){for(const category of ['armors','skins']){const count=$('god-'+category).querySelectorAll(':checked').length;$('god-'+category+'-count').textContent=`${count} / 2`;for(const input of $('god-'+category).querySelectorAll('input'))input.disabled=count>=2&&!input.checked;}}
$('profile-shop').addEventListener('click',e=>{const button=e.target.closest('[data-god-reward]');if(button&&!button.disabled)openGod(button.dataset.godReward);});
$('god-form').addEventListener('change',updateGodCounts);
$('god-form').addEventListener('submit',e=>{
 e.preventDefault();if($('creator').hidden)return;
 const ids=target=>[...$(target).querySelectorAll(':checked')].map(input=>input.value);
 const result=claimGod(progress,godOwner,ids('god-armors'),ids('god-skins'));$('god-error').textContent=result.message;if(!result.ok)return;
 const saved=saveProgress(profileStorage,progress);$('profile-status').textContent=result.message+(saved?' Zapisano.':' Zapis niedostępny.');$('god-dialog').close();renderCreator();
});
$('god-later').onclick=()=>$('god-dialog').close();

setupCrossover();

setupGunWorkshop();
