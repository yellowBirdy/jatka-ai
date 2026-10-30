import {animeFruits,animeDials,drawAnimeOptions,createAnimeFighter,createAnimeBattle,advanceAnime} from './anime.js?v=anime-53';
export function setupAnime(drawWarrior){
 const $=id=>document.getElementById(id);let stage=0,offers=[],drafts=[],fighters=[],battle=null,timer=null,running=false,snapshot=[];
 const slots=[['fruit','Diabelski owoc',animeFruits.length],['weapon','Broń',20],['dial','Dial do broni',animeDials.length]];
 function stop(){running=false;clearTimeout(timer);$('anime-auto').textContent='Automatyczna walka ▷';}
 function fresh(){offers=[drawAnimeOptions(),drawAnimeOptions()];drafts=offers.map((offer,i)=>({name:i?'Pirat Wschodu':'Pirat Zachodu',picks:Object.fromEntries(slots.map(([key])=>[key,offer[key][0].id]))}));stage=0;fighters=[];battle=null;}
 function preview(){try{const f=createAnimeFighter(drafts[stage].name||'Pirat',drafts[stage].picks,$('anime-duration').value);$('anime-preview').innerHTML=drawWarrior(f,stage);$('anime-stats').textContent=`${f.stats.health} HP · ${f.stats.attack} siły · ${f.stats.defense} ochrony · ${f.stats.speed} szybkości`;}catch(e){$('anime-error').textContent=e.message;}}
 function renderDraft(){
  stop();$('anime-draft').hidden=false;$('anime-arena').hidden=true;$('anime-player').textContent=`WOJOWNIK ${stage+1} / 2`;$('anime-name').value=drafts[stage].name;$('anime-duration').disabled=stage===1;$('anime-back').hidden=stage===0;$('anime-confirm').textContent=stage?'Rozpocznij pojedynek →':'Zatwierdź pierwszego wojownika →';$('anime-error').textContent='';
  $('anime-slots').replaceChildren(...slots.map(([key,title,count])=>{
   const field=document.createElement('fieldset'),legend=document.createElement('legend');legend.textContent=`${title} · 5 z ${count}`;field.append(legend);const grid=document.createElement('div');grid.className='anime-options';
   for(const option of offers[stage][key]){const label=document.createElement('label'),input=document.createElement('input'),art=document.createElement('span'),name=document.createElement('b'),description=document.createElement('small');input.type='radio';input.name=`anime-${key}`;input.value=option.id;input.checked=drafts[stage].picks[key]===option.id;art.className=`anime-option-art anime-family-${option.family||key}`;art.textContent=option.icon;art.setAttribute('aria-hidden','true');name.textContent=option.name;description.textContent=option.desc;label.append(input,art,name,description);
    if(key!=='weapon'){const badge=document.createElement('span');badge.className='anime-chance';badge.textContent=`${Math.round(option.chance*100)}% na aktywację`;const source=document.createElement('small');source.textContent=option.source;label.append(badge,source);}
    input.onchange=()=>{drafts[stage].picks[key]=option.id;preview();};grid.append(label);
   }field.append(grid);return field;
  }));preview();
 }
 function refresh(event){
  for(let i=0;i<2;i++){const f=fighters[i],card=$(`anime-fighter-${i}`);card.querySelector('progress').value=battle.state.hp[i];card.querySelector('.anime-hp').textContent=`${battle.state.hp[i]} / ${f.stats.health} HP`;card.classList.toggle('anime-attacking',event?.actor===i);card.classList.toggle('anime-damaged',event?.target===i&&(event.damage+event.magicDamage)>0);card.classList.toggle('anime-powered',event?.actor===i&&!!(event.fruit||event.dial));}
  $('anime-round').textContent=`Ruch ${battle.events.length} · ${battle.finished?'Koniec walki':`Atakuje: ${fighters[battle.activeActor].name}`}`;
  if(event){const message=`${fighters[event.actor].name} → ${fighters[event.target].name}: ${event.text} ${event.details.join(' ')}`;const line=document.createElement('li');line.textContent=message;line.className=event.fruit?'anime-log-fruit':event.dial?'anime-log-dial':'';$('anime-log').append(line);$('anime-commentary').textContent=message;$('anime-commentary').dataset.power=event.fruit?'fruit':event.dial?'dial':'weapon';}
  for(const id of ['anime-step','anime-auto','anime-finish','anime-tactic'])$(id).disabled=battle.finished;
  $('anime-result').hidden=!battle.finished;
  if(battle.finished){stop();$('anime-winner').textContent=`Zwycięża ${fighters[battle.winner].name}!`;$('anime-summary').textContent=`${battle.events.length} ruchów. ${battle.reason==='decision'?'O wyniku zdecydował pozostały procent HP.':'Przeciwnik stracił wszystkie HP.'} Moce owoców aktywowano ${battle.events.filter(e=>e.fruit).length} razy, a diale ${battle.events.filter(e=>e.dial).length} razy.`;}
 }
 function showBattle(){stop();battle=createAnimeBattle(fighters);$('anime-draft').hidden=true;$('anime-arena').hidden=false;$('anime-log').replaceChildren();$('anime-commentary').textContent='Owoc, broń i dial. Rozpocznij walkę automatyczną lub wykonaj pojedynczy ruch.';
  $('anime-field').replaceChildren(...fighters.map((f,i)=>{const card=document.createElement('article');card.id=`anime-fighter-${i}`;card.className='anime-fighter';const name=document.createElement('h3'),art=document.createElement('div'),loadout=document.createElement('p'),hp=document.createElement('progress'),text=document.createElement('strong');name.textContent=f.name;art.className='anime-warrior';art.innerHTML=drawWarrior(f,i);loadout.textContent=`${f.anime.fruit.name} · ${f.traits.weapon.name} · ${f.anime.dial.name}`;hp.max=f.stats.health;hp.value=hp.max;hp.setAttribute('aria-label',`HP: ${f.name}`);text.className='anime-hp';card.append(name,art,loadout,hp,text);return card;}));refresh();$('anime-arena').scrollIntoView({block:'start'});
 }
 function step(){if(battle&&!battle.finished)refresh(advanceAnime(battle,$('anime-tactic').value));}
 function tick(){if(!running||battle.finished)return;step();if(running)timer=setTimeout(tick,1200/Number($('anime-speed').value));}
 $('anime-start').onclick=()=>{snapshot=[...document.querySelectorAll('.match-settings,.steps,#creator,#arena,#stat-guide,#profile-settings,#tutorial-start')].map(n=>[n,n.hidden]);snapshot.forEach(([n])=>n.hidden=true);$('anime-mode').hidden=false;fresh();renderDraft();$('anime-mode').scrollIntoView({block:'start'});};
 $('anime-exit').onclick=()=>{stop();$('anime-mode').hidden=true;snapshot.forEach(([n,hidden])=>n.hidden=hidden);$('anime-start').focus();};
 $('anime-name').oninput=e=>{drafts[stage].name=e.target.value;preview();};$('anime-duration').onchange=preview;
 $('anime-reroll').onclick=()=>{offers[stage]=drawAnimeOptions();drafts[stage].picks=Object.fromEntries(slots.map(([key])=>[key,offers[stage][key][0].id]));renderDraft();};
 $('anime-back').onclick=()=>{stage=0;renderDraft();};
 $('anime-confirm').onclick=()=>{try{for(const [key]of slots)if(!offers[stage][key].some(o=>o.id===drafts[stage].picks[key]))throw Error('Wybierz opcję z wylosowanej oferty.');fighters[stage]=createAnimeFighter(drafts[stage].name,drafts[stage].picks,$('anime-duration').value);if(!stage){stage=1;renderDraft();$('anime-name').focus();}else showBattle();}catch(e){$('anime-error').textContent=e.message;}};
 $('anime-step').onclick=()=>{stop();step();};$('anime-auto').onclick=()=>{if(running){stop();return;}running=true;$('anime-auto').textContent='Pauza ⏸';tick();};
 $('anime-finish').onclick=()=>{stop();while(!battle.finished)step();};$('anime-rematch').onclick=showBattle;$('anime-edit').onclick=()=>{stage=0;renderDraft();};
 $('anime-catalog-search').oninput=renderCatalog;
 function renderCatalog(){const query=$('anime-catalog-search').value.toLowerCase();$('anime-catalog-list').replaceChildren(...[...animeFruits,...animeDials].filter(o=>`${o.name} ${o.power} ${o.source}`.toLowerCase().includes(query)).map(o=>{const item=document.createElement('li');item.textContent=`${o.icon} ${o.name} — ${o.power}. ${o.source}. ${o.desc}`;return item;}));}
 renderCatalog();
}
