let sequence=0;
const surfaces={
 fur:'<path d="M1 2l4 7M9 0l4 8M17 3l3 6M3 14l3 7M12 12l4 8M21 13l2 7" stroke="#171b18" stroke-opacity=".26" stroke-width="1.2"/><path d="M5 0l3 6M10 10l3 6M20 0l3 6" stroke="#fff0d1" stroke-opacity=".24"/>',
 spots:'<g fill="#332d22" opacity=".72"><ellipse cx="5" cy="6" rx="2.8" ry="2"/><ellipse cx="18" cy="16" rx="3" ry="2.4"/><circle cx="21" cy="3" r="1.8"/><circle cx="7" cy="22" r="1.8"/></g>',
 scales:'<path d="M-6 0Q0 14 6 0M6 0Q12 14 18 0M18 0Q24 14 30 0M-12 12Q-6 26 0 12M0 12Q6 26 12 12M12 12Q18 26 24 12M24 12Q30 26 36 12" fill="none" stroke="#172e22" stroke-opacity=".55" stroke-width="1.4"/><path d="M2 14l3 5M14 14l3 5" stroke="#dae2ad" stroke-opacity=".4"/>',
 feathers:'<path d="M0 0Q12 2 12 24Q0 22 0 0M12 0Q24 2 24 24Q12 22 12 0" fill="none" stroke="#4a4536" stroke-opacity=".6"/><path d="M1 3L10 21M13 3L22 21M4 7l5 1M15 9l5 1M6 14l4 1" stroke="#f2e4bc" stroke-opacity=".5"/>',
 hide:'<path d="M0 6L8 2 15 7 24 4M8 2L9 15 2 24M15 7L17 20 24 24M9 15L17 20" fill="none" stroke="#28332e" stroke-opacity=".32" stroke-width="1.5"/><circle cx="4" cy="11" r="1" fill="#e6e7cf" opacity=".5"/>'
};
function kind(id){return id==='cheetah'?'spots':id==='eagle'||id==='ostrich'?'feathers':['crocodile','lizard','snake','scorpion'].includes(id)?'scales':['rhino','buffalo'].includes(id)?'hide':'fur';}
export function textureAnimalSvg(svg,animals){
 const prefix=`surface-${++sequence}`;let defs='';
 for(const animal of animals){if(!svg.includes(`fill="${animal.color}"`))continue;const type=kind(animal.id),id=`${prefix}-${animal.id}`;svg=svg.replaceAll(`fill="${animal.color}"`,`fill="url(#${id})"`);defs+=`<pattern id="${id}" data-surface="${type}" patternUnits="userSpaceOnUse" width="24" height="24"><rect width="24" height="24" fill="${animal.color}"/>${surfaces[type]}</pattern>`;}
 return svg.replace(/(<svg\b[^>]*>)/,`$1<defs>${defs}</defs>`);
}
