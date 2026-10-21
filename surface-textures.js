let sequence=0;
function shade(hex,amount){return '#'+hex.slice(1).match(/../g).map(v=>Math.max(0,Math.min(255,parseInt(v,16)+amount)).toString(16).padStart(2,'0')).join('');}
const surfaces={
 stripes:'<path d="M0 0L12 4 3 9 0 14M24 10L12 14 21 19 24 24" fill="#31291e" opacity=".8"/><path d="M9 0l5 3M12 21l5 3" stroke="#fff1c9" stroke-opacity=".35"/>',
 fur:'<path d="M1 9l2 4M7 2l2 3M14 4l2 4M20 8l2 4M4 18l2 4M11 17l2 4M17 19l2 3M0 21l2 3M13 0l2 2M22 20l1 3" stroke="#14231a" stroke-opacity=".24" stroke-width=".7"/><path d="M1 2l4 7M9 0l4 8M17 3l3 6M3 14l3 7M12 12l4 8M21 13l2 7" stroke="#171b18" stroke-opacity=".4" stroke-width="1.3"/><path d="M5 0l3 6M10 10l3 6M20 0l3 6" stroke="#fff0d1" stroke-opacity=".4"/>',
 spots:'<g fill="#332d22" opacity=".72"><ellipse cx="5" cy="6" rx="2.8" ry="2"/><ellipse cx="18" cy="16" rx="3" ry="2.4"/><circle cx="21" cy="3" r="1.8"/><circle cx="7" cy="22" r="1.8"/></g>',
 scales:'<path d="M-6 0Q0 14 6 0M6 0Q12 14 18 0M18 0Q24 14 30 0M-12 12Q-6 26 0 12M0 12Q6 26 12 12M12 12Q18 26 24 12M24 12Q30 26 36 12" fill="none" stroke="#172e22" stroke-opacity=".55" stroke-width="1.4"/><path d="M2 14l3 5M14 14l3 5" stroke="#dae2ad" stroke-opacity=".4"/>',
 feathers:'<path d="M0 0Q12 2 12 24Q0 22 0 0M12 0Q24 2 24 24Q12 22 12 0" fill="none" stroke="#4a4536" stroke-opacity=".6"/><path d="M1 3L10 21M13 3L22 21M4 7l5 1M15 9l5 1M6 14l4 1" stroke="#f2e4bc" stroke-opacity=".5"/>',
 hide:'<path d="M0 6L8 2 15 7 24 4M8 2L9 15 2 24M15 7L17 20 24 24M9 15L17 20" fill="none" stroke="#28332e" stroke-opacity=".32" stroke-width="1.5"/><circle cx="4" cy="11" r="1" fill="#e6e7cf" opacity=".5"/>'
};
function kind(id){return id==='tiger'?'stripes':['cheetah','hyena'].includes(id)?'spots':id==='eagle'||id==='ostrich'?'feathers':['crocodile','lizard','snake','scorpion'].includes(id)?'scales':['rhino','buffalo'].includes(id)?'hide':'fur';}
export function textureAnimalSvg(svg,animals){
 const prefix=`surface-${++sequence}`;let defs='';
 for(const animal of animals){if(!svg.includes(`fill="${animal.color}"`))continue;const type=kind(animal.id),id=`${prefix}-${animal.id}`;svg=svg.replaceAll(`fill="${animal.color}"`,`fill="url(#${id})"`);defs+=`<linearGradient id="${id}-depth" x2=".8" y2="1"><stop stop-color="${shade(animal.color,23)}"/><stop offset=".42" stop-color="${animal.color}"/><stop offset="1" stop-color="${shade(animal.color,-28)}"/></linearGradient><pattern id="${id}" data-surface="${type}" patternUnits="userSpaceOnUse" width="24" height="24" patternTransform="scale(.55)"><rect width="24" height="24" fill="url(#${id}-depth)"/>${surfaces[type]}<path d="M1 23h22" stroke="#050b07" stroke-opacity=".08"/></pattern>`;}
 return svg.replace(/(<svg\b[^>]*>)/,`$1<defs>${defs}</defs>`);
}
