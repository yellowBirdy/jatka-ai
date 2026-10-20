// Local SVG equipment: all materials share the warrior's unique pattern namespace.
export function weaponSvg(id, prefix, secondary = false) {
 const fill = material => `url(#${prefix}-${material})`;
 const part = (d, material='steel', extra='') => `<path d="${d}" fill="${fill(material)}" stroke="#25332d" stroke-width="1.6" stroke-linejoin="round" ${extra}/>`;
 const rod = (top=-95,bottom=65) => part(`M-4 ${top}H4V${bottom}H-4Z`,'wood');
 const grip = part('M-5 -12H5V27H-5Z','wrap') + part('M-7 25H7V32H-7Z','bronze');
 const guard = part('M-20 -21Q0 -14 20 -21L21 -14Q0 -6 -21 -14Z','bronze');
 const blade = d => part(d) + '<path d="M0 -65V-27" stroke="#f0f3d4" opacity=".6" stroke-width="1"/>';
 let shape;
 if(['spear','glaive','pike','javelin','dart'].includes(id))shape=rod(-110,110)+part(id==='glaive'?'M-4 -100Q32 -128 13 -157L5 -136 -5 -117Z':'M0 -158 10 -124 0 -112 -10 -124Z')+grip;
 else if(id==='trident')shape=rod(-100,105)+part('M-3 -101H3V-135H-3ZM-3 -105Q-26 -105 -22 -141L-16 -132V-116H16V-132L22 -141Q26 -105 3 -105Z')+grip;
 else if(['axe','halberd','hatchet','sickle'].includes(id))shape=rod(-100,id==='halberd'?110:65)+part('M-6 -101Q24 -125 34 -91L33 -72Q17 -81 1 -77L-6 -80Z')+(id==='halberd'?part('M0 -148 8 -110 -8 -110Z'):'')+grip;
 else if(id==='hammer')shape=rod(-85)+part('M-29 -106H28V-77H-29Z','darksteel')+part('M-31 -107H-23V-76H-31Z')+grip;
 else if(id==='warpick'||id==='hook')shape=rod(-85)+part('M-22 -98Q16 -112 34 -82L7 -92 -18 -83Z','darksteel')+grip;
 else if(id==='mace')shape=rod(-90)+part('M-12 -111 0 -124 14 -110 20 -90 8 -77 -9 -79 -20 -94Z','darksteel')+part('M-3 -121H3V-78H-3Z')+grip;
 else if(id==='flail'||id==='chain')shape=rod(-65,50)+'<path d="M0 -63Q36 -104 46 -57" fill="none" stroke="#a8b6a7" stroke-width="5" stroke-dasharray="5 3"/>'+part('M39 -64 52 -66 61 -54 55 -38 38 -39 30 -52Z','darksteel')+grip;
 else if(['staff','club','baton','tonfa'].includes(id))shape=part(id==='club'?'M-6 70 -8 -48 -17 -108Q-20 -127 0 -133Q20 -127 17 -108L8 -48 6 70Z':'M-6 -142Q0 -148 6 -142L5 100H-5Z','wood')+(id==='tonfa'?part('M-4 -24H38V-13H-4Z','wood'):'')+grip;
 else if(id==='buckler')shape=part('M0 -60A53 53 0 1 1 -1 -60Z','wood')+'<circle cy="-7" r="50" fill="none" stroke="'+fill('steel')+'" stroke-width="8"/><circle cy="-7" r="17" fill="'+fill('bronze')+'"/>';
 else if(id==='net')shape='<path d="M0 0-35 99H43Z" fill="none" stroke="#bea36c" stroke-width="3"/><path d="M-10 28 30 99M-20 55 5 99M13 28-20 99M25 55 5 99M-15 42H18M-25 70H31" stroke="'+fill('wrap')+'" stroke-width="3"/>';
 else if(id==='whip'||id==='bolas')shape=grip+'<path d="M0 -12Q-45 -75 -31 -110Q16 -150 35 -100Q50 -40 10 -55" fill="none" stroke="'+fill('wrap')+'" stroke-width="5"/>'+(id==='bolas'?'<circle cx="10" cy="-55" r="12" fill="'+fill('darksteel')+'"/>':'');
 else if(id==='cestus')shape=part('M-20 -22Q0 -36 20 -22L18 13H-18Z','wrap')+part('M-22 -25H22V-13H-22Z','bronze');
 else if(id==='sai')shape=blade('M0 -106 4 -93 3 -18H-3L-4 -93Z')+part('M-3 -22Q-24 -19 -19 -57L-13 -47V-31H13V-47L19 -57Q24 -19 3 -22Z','darksteel')+grip;
 else {
  const curved=['sabre','scimitar','falchion','kukri'].includes(id);
  const short=['dagger','knife','dirk','stiletto','shortsword','throwknife','kukri'].includes(id);
  const tip=short?-90:id==='greatsword'?-155:-135;
  shape=blade(curved?`M-5 -20Q-2 -85 25 ${tip}Q33 -62 6 -20Z`:id==='rapier'||id==='estoc'?`M0 ${tip} 4 -115 3 -20H-3L-4 -115Z`:`M0 ${tip} 11 ${tip+23} 7 -20H-7L-11 ${tip+23}Z`)+guard+grip;
 }
 return `<g data-weapon="${id}" transform="${secondary?'translate(62 173) rotate(-18) scale(.52)':'translate(219 160)'}">${shape}</g>`;
}
