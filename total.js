import {totalAiEndpoint} from './ai-config.js?v=ai-43';
export function validateDuelResult(value){
 if(!value||![0,1,null].includes(value.winner)||!Array.isArray(value.names)||value.names.length!==2||value.names.some(n=>typeof n!=='string'||!n.trim())||typeof value.short!=='string'||!value.short.trim()||typeof value.reasoning!=='string'||!value.reasoning.trim()||!Array.isArray(value.long)||value.long.length<3||value.long.some(p=>typeof p!=='string'||!p.trim()))throw Error('AI zwróciło niepełny opis walki. Spróbuj ponownie.');
 return value;
}
export async function requestTotalDuel(descriptions,{fetcher=fetch,endpoint=totalAiEndpoint||new URL('./api/total-duel',import.meta.url).href,signal}={}){
 if(!Array.isArray(descriptions)||descriptions.length!==2||descriptions.some(d=>typeof d!=='string'||!d.trim()))throw Error('Opisz obie postacie.');
 let response;try{response=await fetcher(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({descriptions}),signal});}catch(error){if(error.name==='AbortError')throw error;throw Error('Nie udało się połączyć z AI. Opisy zostały zachowane.');}
 let data;try{data=await response.json();}catch{throw Error('AI nie jest jeszcze podłączone do tej strony. Potrzebny jest działający backend AI.');}
 if(!response.ok)throw Error(typeof data?.error==='string'?data.error:'AI nie mogło rozstrzygnąć walki. Spróbuj ponownie.');
 return validateDuelResult(data);
}
export function setupTotal(){
 const $=id=>document.getElementById(id);let stage=0,drafts=['',''],snapshot=[],controller=null;
 try{const stored=JSON.parse(localStorage.getItem('jatka.total.ai.v1'));if(Array.isArray(stored)&&stored.length===2&&stored.every(s=>typeof s==='string'))drafts=stored;
 else{const legacy=JSON.parse(localStorage.getItem('jatka.total.v1'));if(Array.isArray(legacy)&&legacy.length===2)drafts=legacy.map(f=>Object.entries(f||{}).filter(([,v])=>typeof v==='string'&&v.trim()).map(([k,v])=>`${({name:'Postać',weapon:'Broń',armor:'Ochrona',origin:'Pochodzenie',style:'Styl',advantage:'Przewaga',weakness:'Słabość',power:'Inne'})[k]||k}: ${v}`).join('\n'));}}catch{}
 const save=()=>{try{localStorage.setItem('jatka.total.ai.v1',JSON.stringify(drafts));}catch{}};
 function read(){drafts[stage]=$('total-description').value;save();}
 function render(){
  $('total-result').hidden=true;$('total-review').hidden=true;$('total-form').hidden=false;$('total-step').textContent=`GRACZ ${stage+1} / 2`;$('total-description').value=drafts[stage];
  $('total-next').textContent=stage===0?'Zapisz postać · gracz 2 →':'Zatwierdź postacie →';$('total-error').textContent='';
 }
 function review(){
  $('total-form').hidden=true;$('total-review').hidden=false;$('total-result').hidden=true;$('total-step').textContent='GOTOWI DO TOTALNEJ JATKI';
  $('total-roster').replaceChildren(...drafts.map((description,i)=>{const card=document.createElement('article'),title=document.createElement('h3'),icon=document.createElement('span'),text=document.createElement('p'),edit=document.createElement('button');icon.className='total-emblem';icon.textContent=i?'♜':'♞';icon.setAttribute('aria-hidden','true');title.textContent=`Postać gracza ${i+1}`;text.textContent=description;text.style.whiteSpace='pre-wrap';edit.type='button';edit.className='quiet';edit.textContent='Edytuj opis';edit.onclick=()=>{stage=i;render();};card.append(icon,title,text,edit);return card;}));
 }
 function cancel(){controller?.abort();controller=null;$('total-battle').disabled=false;$('total-battle').textContent='Niech AI rozstrzygnie walkę ⚔';$('total-loading').hidden=true;for(const button of $('total-roster').querySelectorAll('button'))button.disabled=false;}
 $('total-start').onclick=()=>{snapshot=[...document.querySelectorAll('.match-settings,.steps,#creator,#arena,#stat-guide,#profile-settings,#tutorial-start')].map(node=>[node,node.hidden]);snapshot.forEach(([node])=>node.hidden=true);$('total-mode').hidden=false;stage=0;render();$('total-mode').scrollIntoView({block:'start'});};
 $('total-exit').onclick=()=>{cancel();if(!$('total-form').hidden)read();$('total-mode').hidden=true;snapshot.forEach(([node,hidden])=>node.hidden=hidden);$('total-start').focus();};
 $('total-form').addEventListener('input',read);
 $('total-form').onsubmit=e=>{e.preventDefault();read();if(!drafts[stage].trim()){$('total-error').textContent='Opisz swoją postać.';return;}if(stage===0){stage=1;render();$('total-description').focus();}else review();};
 $('total-battle').onclick=async()=>{
  if(controller)return;controller=new AbortController();const active=controller;$('total-battle').disabled=true;$('total-battle').textContent='AI ocenia postacie…';$('total-loading').hidden=false;$('total-error').textContent='';for(const button of $('total-roster').querySelectorAll('button'))button.disabled=true;
  try{const result=await requestTotalDuel([...drafts],{signal:active.signal});if(controller!==active||active.signal.aborted)return;
   $('total-result').hidden=false;$('total-review').hidden=true;$('total-step').textContent='WERDYKT AI';$('total-winner').textContent=result.winner===null?'Remis':`Wygrywa ${result.names[result.winner]}`;$('total-short').textContent=result.short;$('total-long').replaceChildren(...result.long.map(text=>{const p=document.createElement('p');p.textContent=text;return p;}));$('total-analysis').replaceChildren();const reason=document.createElement('p');reason.textContent=result.reasoning;$('total-analysis').append(reason);$('total-result').scrollIntoView({block:'start'});
  }catch(error){if(error.name!=='AbortError'&&controller===active)$('total-error').textContent=error.message;}finally{if(controller===active)cancel();}
 };
 $('total-cancel').onclick=()=>{cancel();$('total-error').textContent='Przerwano ocenę. Możesz ponowić walkę lub poprawić opisy.';};
 $('total-edit').onclick=review;
 $('total-new').onclick=()=>{cancel();drafts=['',''];save();stage=0;render();};
}
