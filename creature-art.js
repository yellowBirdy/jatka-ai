const animals=['horse','wolf','boar','bear','rhino','tiger','lion','elk','mammoth','lizard','ostrich','camel','bison','buffalo','hyena','stag','panther','polar-bear','yak','crocodile','cheetah','eagle','scorpion','snake','gorilla'];
const categories=['weapon','origin','style','armor','secondary','weakness','advantage','ability'];
export function animalArtwork(id){const index=animals.indexOf(id);return index<0?null:{image:'assets/portraits/creatures.webp',position:`${index%5*25}% ${Math.floor(index/5)*25}%`,size:'500% 500%'};}
function categoryArtwork(name){const index=Math.max(0,categories.indexOf(name));return {image:'assets/portraits/traits.webp',position:`${index%4*100/3}% ${Math.floor(index/4)*100}%`,size:'400% 200%'};}
export function decorateChoices(root){
 for(const card of root.querySelectorAll('.option')){
  if(card.dataset.illustrated)continue;
  const input=card.querySelector('input');if(!input||['headMaterial','gripMaterial'].includes(input.name))continue;
  let art;
  if(input.name==='beast'||input.name.startsWith('hybrid'))art=animalArtwork(input.value);
  else if(input.name==='beastAbility')art=animalArtwork(root.querySelector('input[name="beast"]:checked')?.value);
  else art=categoryArtwork(input.name==='beastArmor'?'armor':input.name==='specialItem'||input.name==='magicPower'?'ability':input.name);
  if(!art)continue;
  const image=document.createElement('span');image.className='choice-illustration';image.setAttribute('aria-hidden','true');image.style.backgroundImage=`url('${art.image}')`;image.style.backgroundPosition=art.position;image.style.backgroundSize=art.size;
  card.prepend(image);card.dataset.illustrated='true';if(input.name==='beast'||input.name.startsWith('hybrid'))card.classList.add('animal-choice');
 }
}
