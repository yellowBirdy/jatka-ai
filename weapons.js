import {weaponSprites} from './weapon-sprite-manifest.js?v=unique-art-33';
let equipmentSequence=0;
// Local SVG equipment: all materials share the warrior's unique pattern namespace.
export function weaponSvg(id, prefix, secondary = false, materials = {}) {
 const fill = material => {
  let texture=material;
  if(!secondary){
   if(material==='steel'||material==='darksteel')texture=materials.headTexture||material;
   if(material==='wood')texture=['staff','club','baton','tonfa'].includes(id)?materials.headTexture||material:materials.gripTexture||material;
   if(material==='wrap')texture=materials.gripTexture||material;
  }
  return `url(#${prefix}-${texture})`;
 };
 const part = (d, material='steel', extra='') => `<path d="${d}" fill="${fill(material)}" stroke="#25332d" stroke-width="1.6" stroke-linejoin="round" ${extra}/>`;
 const rod = (top=-95,bottom=65) => part(`M-4 ${top}H4V${bottom}H-4Z`,'wood');
 const grip = part('M-5 -12H5V27H-5Z','wrap') + part('M-7 25H7V32H-7Z','bronze');
 const guard = part('M-20 -21Q0 -14 20 -21L21 -14Q0 -6 -21 -14Z','bronze');
 const blade = d => part(d) + '<path d="M0 -65V-27" stroke="#f0f3d4" opacity=".6" stroke-width="1"/>';
 const tips={spear:'M0 -158 13 -123 0 -106 -13 -123Z',glaive:'M-4 -100Q40 -126 17 -157L6 -134 -6 -117Z',pike:'M0 -160 7 -142 5 -111H-5L-7 -142Z',javelin:'M0 -137 14 -112 0 -98 -14 -112Z',dart:'M0 -110 18 -88 0 -77 -18 -88Z'};
 let shape;
 if(['spear','glaive','pike','javelin','dart'].includes(id))shape=rod(id==='dart'?-90:-110,id==='dart'?35:id==='javelin'?85:110)+part(tips[id])+grip;
 else if(id==='trident')shape=rod(-100,105)+part('M-3 -101H3V-135H-3ZM-3 -105Q-26 -105 -22 -141L-16 -132V-116H16V-132L22 -141Q26 -105 3 -105Z')+grip;
 else if(['axe','halberd','hatchet','sickle'].includes(id))shape=rod(-100,id==='halberd'?110:65)+part(id==='sickle'?'M-5 -102Q46 -145 41 -80Q29 -115 6 -81Z':id==='hatchet'?'M-5 -99 23 -113 29 -85 4 -80Z':'M-6 -101Q40 -130 43 -91L41 -67Q18 -82 1 -77L-6 -80Z')+(id==='halberd'?part('M0 -148 8 -110 -8 -110Z'):'')+grip;
 else if(id==='hammer')shape=rod(-85)+part('M-29 -106H28V-77H-29Z','darksteel')+part('M-31 -107H-23V-76H-31Z')+grip;
 else if(id==='warpick'||id==='hook')shape=rod(-85)+part(id==='hook'?'M-5 -94Q34 -131 35 -81L22 -79Q29 -110 3 -82Z':'M-22 -98Q16 -112 34 -82L7 -92 -18 -83Z','darksteel')+grip;
 else if(id==='mace')shape=rod(-90)+part('M-12 -111 0 -124 14 -110 20 -90 8 -77 -9 -79 -20 -94Z','darksteel')+part('M-3 -121H3V-78H-3Z')+grip;
 else if(id==='flail'||id==='chain')shape=rod(id==='chain'?-35:-65,id==='chain'?30:50)+'<path d="M0 -63Q36 -104 46 -57" fill="none" stroke="#a8b6a7" stroke-width="5" stroke-dasharray="5 3"/>'+part('M39 -64 52 -66 61 -54 55 -38 38 -39 30 -52Z','darksteel')+grip;
 else if(['staff','club','baton','tonfa'].includes(id))shape=part(id==='club'?'M-6 70 -8 -48 -17 -108Q-20 -127 0 -133Q20 -127 17 -108L8 -48 6 70Z':id==='baton'?'M-8 -88Q0 -98 8 -88L6 42H-6Z':'M-6 -142Q0 -148 6 -142L5 100H-5Z','wood')+(id==='tonfa'?part('M-4 -24H38V-13H-4Z','wood'):'')+grip;
 else if(id==='buckler')shape=part('M0 -60A53 53 0 1 1 -1 -60Z','wood')+'<circle cy="-7" r="50" fill="none" stroke="'+fill('steel')+'" stroke-width="8"/><circle cy="-7" r="17" fill="'+fill('bronze')+'"/>';
 else if(id==='net')shape='<path d="M0 0-35 99H43Z" fill="none" stroke="#bea36c" stroke-width="3"/><path d="M-10 28 30 99M-20 55 5 99M13 28-20 99M25 55 5 99M-15 42H18M-25 70H31" stroke="'+fill('wrap')+'" stroke-width="3"/>';
 else if(id==='whip'||id==='bolas')shape=grip+'<path d="M0 -12Q-45 -75 -31 -110Q16 -150 35 -100Q50 -40 10 -55" fill="none" stroke="'+fill('wrap')+'" stroke-width="5"/>'+(id==='bolas'?'<circle cx="10" cy="-55" r="12" fill="'+fill('darksteel')+'"/>':'');
 else if(id==='cestus')shape=part('M-20 -22Q0 -36 20 -22L18 13H-18Z','wrap')+part('M-22 -25H22V-13H-22Z','bronze');
 else if(id==='sai')shape=blade('M0 -106 4 -93 3 -18H-3L-4 -93Z')+part('M-3 -22Q-24 -19 -19 -57L-13 -47V-31H13V-47L19 -57Q24 -19 3 -22Z','darksteel')+grip;
 else {
  const profiles={
   sword:'M0 -135 13 -112 8 -20H-8L-13 -112Z',
   sabre:'M-5 -20Q-6 -83 25 -139Q19 -67 6 -20Z',
   rapier:'M0 -147 4 -125 3 -20H-3L-4 -125Z',
   greatsword:'M0 -158 18 -134 13 -53 18 -43 9 -37 9 -20H-9L-9 -37 -18 -43 -13 -53 -18 -134Z',
   falchion:'M-6 -20 -10 -94 25 -135Q39 -63 9 -20Z',
   scimitar:'M-5 -20Q1 -91 37 -140Q53 -122 36 -87L8 -20Z',
   estoc:'M0 -152 8 -123 5 -20H-5L-8 -123Z',
   dagger:'M0 -88 12 -63 6 -20H-6L-12 -63Z',
   knife:'M-6 -20V-92Q18 -79 10 -55L6 -20Z',
   dirk:'M0 -109 8 -84 4 -20H-4L-8 -84Z',
   stiletto:'M0 -112 3 -84 2 -20H-2L-3 -84Z',
   shortsword:'M0 -108 16 -88 12 -20H-12L-16 -88Z',
   throwknife:'M0 -78 17 -56 6 -20H-6L-17 -56Z',
   kukri:'M-5 -20 -20 -53Q-24 -81 5 -100L20 -93 -4 -61 6 -20Z'
  };
  if(!profiles[id])throw Error(`Brak rysunku broni: ${id}`);
  shape=blade(profiles[id])+guard+grip;
  if(id==='rapier')shape+='<ellipse cy="-16" rx="25" ry="11" fill="none" stroke="'+fill('bronze')+'" stroke-width="4"/>';

 }
 const index=weaponSprites[`${secondary?'secondary':'weapon'}:${id}`]??weaponSprites[`secondary:${id}`];
 const short=['dagger','hatchet','stiletto','dart','baton','tonfa','knuckles','cestus','buckler'].includes(id),height=short?115:210,width=short?55:76;
 const col=index%5,row=Math.floor(index/5),paintId=`${prefix}-${id}-${secondary?'off':'main'}-paint`;
 const textureOverlay=index===undefined||secondary||!materials.headTexture?'':`<defs><mask id="${paintId}-alpha" maskUnits="userSpaceOnUse" x="${col}" y="${row}" width="1" height="1" style="mask-type:alpha"><image href="assets/choices/weapon-sprites.webp" width="5" height="8" preserveAspectRatio="none"/></mask>${[['head',materials.headTexture],['grip',materials.gripTexture||'wood']].map(([part,texture])=>`<pattern id="${paintId}-${part}" patternUnits="userSpaceOnUse" width=".2" height=".2"><image href="assets/textures/${texture}.svg" width=".2" height=".2" preserveAspectRatio="none"/></pattern>`).join('')}</defs><g mask="url(#${paintId}-alpha)" opacity=".28"><rect x="${col}" y="${row}" width="1" height=".7" fill="url(#${paintId}-head)"/><rect x="${col}" y="${row+.7}" width="1" height=".3" fill="url(#${paintId}-grip)"/></g>`;
 const picture=index===undefined?'':`<svg data-painted-weapon="${id}" x="${-width/2}" y="${-height*.8}" width="${width}" height="${height}" viewBox="${col} ${row} 1 1" preserveAspectRatio="none"><image href="assets/choices/weapon-sprites.webp" width="5" height="8" preserveAspectRatio="none"/>${textureOverlay}</svg>`;
 return `<g data-weapon="${id}" transform="${secondary?'translate(62 173) rotate(-18) scale(.52)':'translate(219 160)'}"><g ${picture?'opacity="0"':''}>${shape}</g>${picture}</g>`;

}

export function weaponIcon(id,materials={}){
 const prefix=`equipment-${id}-${++equipmentSequence}`;
 const defs=['steel','darksteel','bronze','wood','wrap','ash','birch','walnut','tempered','damascus','flint','bone','granite','bamboo','ironwood','rattan'].map(material=>`<pattern id="${prefix}-${material}" patternUnits="userSpaceOnUse" width="80" height="80"><image href="assets/textures/${material}.svg" width="80" height="80"/></pattern>`).join('');
 return `<svg class="weapon-icon" viewBox="145 -5 150 310" aria-hidden="true" focusable="false"><defs>${defs}</defs>${weaponSvg(id,prefix,false,materials)}</svg>`;
}
