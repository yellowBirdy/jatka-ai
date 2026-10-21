const animalIds=['horse','wolf','boar','bear','rhino','tiger','lion','elk','mammoth','lizard','ostrich','camel','bison','buffalo','hyena','stag','panther','polar-bear','yak','crocodile','cheetah','eagle','scorpion','snake','gorilla'];
let sequence=0;
export function animalSprite(id,x,y,width,height,crop=null){
 const aspect=1374/1145,i=animalIds.indexOf(id);if(i<0)return '';
 return `<svg data-painted-animal="${id}" x="${x}" y="${y}" width="${width}" height="${height}" viewBox="${crop||`0 0 ${aspect} 1`}" preserveAspectRatio="xMidYMid meet" overflow="hidden"><image href="assets/choices/animal-sprites.webp" x="${(-i%5)*aspect}" y="${-Math.floor(i/5)}" width="${5*aspect}" height="5" preserveAspectRatio="none"/></svg>`;
}
export function paintMounted(svg,f){
 const armor=f.traits.beastArmor,type=armor.type||armor.id,id=`painted-tack-${++sequence}`;
 const texture={leather:'leather',mail:'chainmail',scale:'bronze',plate:'steel'}[type];
 const tack=texture?`<defs><pattern id="${id}" patternUnits="userSpaceOnUse" width="45" height="45"><image href="assets/textures/${texture}.svg" width="45" height="45"/></pattern></defs><path class="painted-beast-armor" d="M155 267Q223 244 296 270L302 309Q234 331 158 309Z" fill="url(#${id})" fill-opacity=".88" stroke="#b6c3ad" stroke-width="2"/><path d="M175 267l5 46M220 260v61M270 266l-4 49" stroke="#9d8058" stroke-width="5"/>`:'';
 const picture=animalSprite(f.traits.beast.id,65,170,370,232)+tack+'<path d="M203 255h62l10 20h-79Z" fill="#473326" stroke="#a1865d" stroke-width="2"/>';
 return svg.replace(/<g fill="(#[a-fA-F0-9]+)" stroke="#29312b"/,'<g opacity="0" fill="$1" stroke="#29312b"').replace('<svg class="rider-viewport"',picture+'<svg class="rider-viewport"');
}
