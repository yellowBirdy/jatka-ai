import {optionArt} from './option-art-manifest.js?v=unique-art-33';
import {getBeastAbilities} from './beast-abilities.js?v=playback-18';
const animals=['horse','wolf','boar','bear','rhino','tiger','lion','elk','mammoth','lizard','ostrich','camel','bison','buffalo','hyena','stag','panther','polar-bear','yak','crocodile','cheetah','eagle','scorpion','snake','gorilla'];
const categories=['weapon','origin','style','armor','secondary','weakness','advantage','ability'];
export function animalArtwork(id){const index=animals.indexOf(id);return index<0?null:{image:'assets/portraits/creatures.webp',position:`${index%5*25}% ${Math.floor(index/5)*25}%`,size:'500% 500%'};}
export function optionArtwork(name,id){return optionArt[`${name==='armor'&&id.startsWith('box-armor-')?'boxArmor':name}:${id}`]||null;}
const effects={
 strike:'<path d="M54 48l-18 55 25-17-7 38 39-68-26 20 13-42Z"/>',
 guard:'<path d="M64 38l35 13v30q-4 30-35 42-30-12-35-42V51Z"/><path d="M64 51v54M44 74h40" fill="none" stroke="#e6fff3" stroke-width="4"/>',
 heal:'<path d="M53 44h23v24h24v23H76v24H53V91H29V68h24Z"/>',
 drain:'<path d="M64 36q-36 48-29 68 29 34 58 0 7-20-29-68Z"/><path d="M50 85l14 17 15-20" fill="none" stroke="#d6fff2" stroke-width="4"/>',
 mark:'<circle cx="64" cy="80" r="30" fill="none" stroke-width="5"/><circle cx="64" cy="80" r="12"/><path d="M64 34v25M64 101v25M18 80h25M85 80h25" fill="none" stroke-width="4"/>',
 barrier:'<path d="M21 114V72q43-67 86 0v42M36 114V77q28-45 56 0v37M53 114V84q11-22 22 0v30" fill="none" stroke-width="6"/>',
 focus:'<path d="M17 81q47-52 94 0-47 52-94 0Z"/><ellipse cx="64" cy="81" rx="11" ry="22" fill="#09291f" stroke="#dcffef" stroke-width="3"/>',
 slow:'<path d="M35 40h58L47 117h35L35 40M35 117h58" fill="none" stroke-width="7"/>',
 primary:'<path d="M30 39l5 47 20 25 12-20 10 26 20-40-5-41-20 42-9-36-11 34Z"/>'
};
function effectArtwork(type){return `<svg class="choice-effect" viewBox="0 0 128 150" aria-hidden="true"><g fill="currentColor" stroke="currentColor" stroke-linejoin="round">${effects[type]||effects.primary}</g></svg>`;}
function armorArtwork(type){if(type==='none')return '<svg class="choice-effect armor-emblem" viewBox="0 0 128 150" aria-hidden="true"><circle cx="64" cy="78" r="36" fill="none" stroke="currentColor" stroke-width="4"/><path d="M39 103l50-50" stroke="currentColor" stroke-width="5"/></svg>';return `<svg class="choice-effect armor-emblem" viewBox="0 0 128 150" aria-hidden="true"><path d="M39 33l25 8 25-8 18 31-18 12 4 44q-29 16-58 0l4-44-18-12Z" fill="${{leather:'#8b6548',mail:'#b4c7c3',scale:'#b7a35d',plate:'#b9d6d8'}[type]||'#13372b'}" stroke="#d6eee1" stroke-width="2"/>${type==='mail'?'<path d="M43 63h42M41 76h46M40 89h48M40 102h48" stroke="#2a4340" stroke-width="7" stroke-dasharray="3 4"/>':type==='scale'?'<path d="M42 62l10 13 12-13 12 13 10-13M40 83l12 13 12-13 12 13 12-13M40 103l12 13 12-13 12 13 12-13" fill="none" stroke="#4f654f" stroke-width="4"/>':type==='plate'?'<path d="M64 43v80M41 76l23 13 23-13M39 106l25 11 25-11" fill="none" stroke="#506b6a" stroke-width="5"/>':'<path d="M41 59l45 48M86 59l-45 48" stroke="#33291d" stroke-width="7"/>'}</svg>`;}
export function decorateChoices(root){
 for(const card of root.querySelectorAll('.option')){
  if(card.dataset.illustrated)continue;
  const input=card.querySelector('input');if(!input||['headMaterial','gripMaterial'].includes(input.name))continue;
  let art;
  if(input.name==='beast'||input.name.startsWith('hybrid'))art=animalArtwork(input.value);
  else if(input.name==='beastAbility')art=optionArtwork(input.name,input.value);
  else if(input.name==='beastArmor')art=animalArtwork(root.querySelector('input[name="beast"]:checked')?.value);
  else art=optionArtwork(input.name,input.value);
  if(!art)continue;
  const image=document.createElement('span');image.className='choice-illustration';image.setAttribute('aria-hidden','true');image.style.backgroundImage=`url('${art.image}')`;image.style.backgroundPosition=art.position;image.style.backgroundSize=art.size;
  card.prepend(image);card.dataset.illustrated='true';card.dataset.artKey=`${input.name}:${input.value}`;
  if(input.name==='beastAbility'){
   const beast=root.querySelector('input[name="beast"]:checked')?.value;
   const rule=getBeastAbilities(beast).find(a=>a.id===input.value);
   image.insertAdjacentHTML('afterend',effectArtwork(rule?.effect||'primary'));card.classList.add('skill-choice');
  }
  if(input.name==='beastArmor')image.insertAdjacentHTML('afterend',armorArtwork(input.value.split('-').at(-1)));
if(input.name==='beast'||input.name.startsWith('hybrid'))card.classList.add('animal-choice');
 }
}
