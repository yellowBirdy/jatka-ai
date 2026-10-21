export const hybridAnimals=[
 {id:'cheetah',name:'Gepard',color:'#d6aa57',stats:{speed:8,accuracy:8,attack:2,health:-6}},
 {id:'wolf',name:'Wilk',color:'#9babae',stats:{attack:4,speed:4,stamina:14}},
 {id:'bear',name:'Niedźwiedź',color:'#896041',stats:{health:26,attack:6,defense:3,speed:-4}},
 {id:'lion',name:'Lew',color:'#c69c52',stats:{attack:7,health:12,accuracy:3}},
 {id:'rhino',name:'Nosorożec',color:'#929c95',stats:{health:24,defense:9,pierce:5,speed:-6}},
 {id:'crocodile',name:'Krokodyl',color:'#739267',stats:{defense:6,pierce:6,attack:4,speed:-3}},
 {id:'eagle',name:'Orzeł',color:'#c4b498',stats:{accuracy:12,speed:6,health:-8,pierce:3}},
 {id:'scorpion',name:'Skorpion',color:'#b3926c',stats:{pierce:8,defense:5,speed:-2}},
 {id:'snake',name:'Wąż',color:'#91aa58',stats:{speed:4,pierce:5,accuracy:5,health:-4}},
 {id:'gorilla',name:'Goryl',color:'#656d69',stats:{attack:8,health:18,stamina:16,speed:-3}}
];
export const hybridParts=[
 {id:'hybridHead',name:'Głowa',weights:{attack:.8,accuracy:.7,speed:.2,health:.2,defense:.2,pierce:.5,stamina:.2}},
 {id:'hybridTorso',name:'Tułów',weights:{attack:.3,accuracy:.1,speed:.2,health:1,defense:1,pierce:.1,stamina:.6}},
 {id:'hybridFront',name:'Przednie kończyny',weights:{attack:.7,accuracy:.1,speed:.4,health:.2,defense:.3,pierce:.5,stamina:.3}},
 {id:'hybridHind',name:'Tylne kończyny',weights:{attack:.2,accuracy:.1,speed:1,health:.2,defense:.3,pierce:.1,stamina:.5}},
 {id:'hybridTail',name:'Ogon',weights:{attack:.3,accuracy:.3,speed:.3,health:.1,defense:.2,pierce:.6,stamina:.3}}
];
export const hybridDefaults={hybridHead:'cheetah',hybridTorso:'bear',hybridFront:'lion',hybridHind:'cheetah',hybridTail:'wolf'};
const labels={health:'HP',attack:'siły',defense:'ochrony',speed:'szybkości',accuracy:'celności',stamina:'kondycji',pierce:'przebicia'};
export function hybridOption(part,animal){const stats=Object.fromEntries(Object.entries(animal.stats).map(([key,n])=>[key,Math.round(n*part.weights[key])]).filter(([,n])=>n!==0));return {id:animal.id,animal:animal.id,name:animal.name,color:animal.color,stats,desc:Object.entries(stats).map(([key,n])=>`${n>0?'+':''}${n} ${labels[key]}`).join(' · ')};}
export function resolveHybrid(picks){return Object.fromEntries(hybridParts.map(part=>{const animal=hybridAnimals.find(a=>a.id===(picks[part.id]??hybridDefaults[part.id]));if(!animal)throw Error(`Wybierz zwierzę: ${part.name}.`);return [part.id,hybridOption(part,animal)];}));}
const headShapes={
 cheetah:'<path d="M337 171L331 148 351 159 374 156 385 142 388 169 402 187 383 208 348 205Z"/><path d="M355 181L362 201M380 180L376 199" stroke="#403a2b" stroke-width="4"/><g fill="#4c402d" stroke="none"><circle cx="348" cy="169" r="3"/><circle cx="362" cy="163" r="3"/><circle cx="381" cy="165" r="3"/><circle cx="353" cy="192" r="2"/></g>',
 wolf:'<path d="M334 177L331 139 354 162 379 155 386 133 397 174 424 190 395 209 349 211Z"/>',
 bear:'<circle cx="343" cy="156" r="14"/><circle cx="386" cy="155" r="14"/><ellipse cx="365" cy="186" rx="36" ry="32"/><ellipse cx="389" cy="195" rx="21" ry="14" fill="#bea07b"/>',
 lion:'<path d="M330 150L353 139 387 145 412 176 401 211 368 230 338 214 320 181Z" fill="#745239"/><ellipse cx="370" cy="185" rx="30" ry="29"/>',
 rhino:'<path d="M332 164L370 157 402 176 414 203 381 215 340 207Z"/><path d="M393 184L416 140 418 197Z" fill="#d8d8bc"/>',
 crocodile:'<path d="M327 168L371 158 427 181 440 195 422 207 340 211Z"/><path d="M386 200L396 209 403 201 413 209 420 202" fill="#f0e3bd"/>',
 eagle:'<path d="M332 163L360 146 389 160 401 183 384 211 347 210Z" fill="#e4e0cd"/><path d="M390 180L426 190 407 210 404 194 386 196Z" fill="#d3ad56"/>',
 scorpion:'<path d="M331 174L356 153 391 158 410 184 393 209 344 210Z"/><path d="M349 202L342 222 360 216M381 204L395 223 395 204"/>',
 snake:'<path d="M326 179L352 159 393 165 420 188 401 207 345 208Z"/><path d="M416 196L440 204 448 199M440 204L447 213" fill="none" stroke="#c97d7b"/>',
 gorilla:'<path d="M334 165Q359 142 387 166L402 194 384 218 344 214 329 191Z"/><path d="M342 182L388 180 394 202 347 205Z" fill="#b9aaa0"/>'
};
const tailShapes={
 cheetah:'<path d="M145 226Q63 191 68 135Q76 102 94 127" fill="none" stroke-width="16"/><path d="M73 139L69 150M80 168L73 180" stroke="#454039" stroke-width="9"/>',
 wolf:'<path d="M151 224Q90 213 57 263L78 270 61 281 96 283 91 295Q141 286 155 244Z"/>',
 bear:'<circle cx="139" cy="232" r="19"/>',
 lion:'<path d="M147 225Q82 206 69 255" fill="none" stroke-width="12"/><ellipse cx="68" cy="263" rx="16" ry="22" fill="#6d4d37"/>',
 rhino:'<path d="M145 225L90 247 81 266 97 261 158 241Z"/>',
 crocodile:'<path d="M154 218L27 289 69 294 164 251Z"/><path d="M62 275L64 260 78 265 87 250 101 253 111 237 128 240" fill="#bdc396"/>',
 eagle:'<path d="M151 218L63 194 84 219 59 225 90 238 72 254 152 246Z"/>',
 scorpion:'<path d="M146 227Q67 232 56 179Q43 119 82 97Q117 76 119 118" fill="none" stroke-width="20"/><path d="M105 113L130 112 119 146Z" fill="#e1c39a"/><path d="M57 171L74 170M64 141L50 136M67 112L80 126M91 95L97 112" stroke="#594c3d"/>',
 snake:'<path d="M145 233Q65 213 66 260Q65 293 27 273" fill="none" stroke-width="20"/>',
 gorilla:'<path d="M143 221L128 231 139 241 154 235Z"/>'
};
function limbs(animal,front){const x=front?305:178,wide=['bear','rhino','gorilla'].includes(animal.id),avian=animal.id==='eagle',segmented=['scorpion','snake'].includes(animal.id);const details={cheetah:`<path d="M${x} 277h1M${x+5} 296h1M${x-3} 319h1" stroke="#4d4432" stroke-width="6" stroke-linecap="round"/>`,wolf:`<path d="M${x-14} 333l-8 8 12-1-4 8 15-5" fill="#d1d8cd"/>`,bear:`<ellipse cx="${x+3}" cy="337" rx="23" ry="14"/><path d="M${x-12} 340v10M${x} 341v10M${x+13} 340v10" stroke="#e8d7b3" stroke-width="3"/>`,lion:`<path d="M${x-15} 324l-9 5 11 4-7 6 14-3 8 9 3-13 13 3-8-12Z" fill="#957047"/>`,crocodile:`<path d="M${x-2} 271l13 4-14 12 13 5-17 12" fill="none" stroke="#b7c591" stroke-width="3"/>`,scorpion:`<path d="M${x+1} 326l-22 8 4 21 16-10-2-12 10 12 17-16-10-11Z"/>`,snake:`<path d="M${x} 264Q${x-35} 284 ${x+2} 313Q${x+30} 338 ${x-9} 344" fill="none" stroke="${animal.color}" stroke-width="17"/>`,gorilla:`<ellipse cx="${x+1}" cy="338" rx="25" ry="16"/><path d="M${x-13} 334v14M${x} 334v15M${x+13} 334v14" fill="none" stroke="#b5b4a2" stroke-width="3"/>`};return `<g fill="${animal.color}">${segmented?`<path d="M${x} 251l-24 42 21 41 28 6 12-9-24-12-8-26 30-38Z"/>`:`<path d="M${x-19} 245L${x-8} 303 ${x-19} 348 ${x+23} 348 ${x+28} 335 ${x+7} 333 ${x+(wide?22:8)} 290 ${x+20} 244Z"/>`}${avian?`<path d="M${x-5} 334l-17 25 25-11 12 11 1-17 16 10-12-22" fill="#d0aa63"/>`:animal.id==='rhino'?`<path d="M${x-18} 337h42v13h-42Z" fill="#454d49"/>`:`<path d="M${x-14} 342l3 10 7-10 7 10 7-11 7 9" fill="#eee1bb"/>`}${details[animal.id]||''}</g>`;}
export function hybridSvg(f){const parts=f.traits,head=parts.hybridHead,torso=parts.hybridTorso,front=parts.hybridFront,hind=parts.hybridHind,tail=parts.hybridTail;const bulky=['bear','rhino','gorilla'].includes(torso.animal);return `<svg class="hybrid-portrait" viewBox="0 0 480 390" role="img" aria-label="Hybryda: ${hybridParts.map(p=>p.name+' '+parts[p.id].name).join(', ')}"><ellipse cx="237" cy="361" rx="184" ry="13" fill="#000" opacity=".2"/><g stroke="#29352d" stroke-width="5" stroke-linejoin="round"><g data-part="hybridTail" data-animal="${tail.animal}" fill="${tail.color}">${tailShapes[tail.animal]}</g><g data-part="hybridHind" data-animal="${hind.animal}">${limbs({...hind,id:hind.animal},false)}</g><g data-part="hybridTorso" data-animal="${torso.animal}" fill="${torso.color}"><ellipse cx="237" cy="229" rx="${bulky?109:96}" ry="${bulky?66:49}"/><g class="creature-muscles" fill="none"><path d="M161 216Q205 179 269 197M284 207Q308 224 291 253" stroke="#fff0cb" stroke-opacity=".35" stroke-width="7"/><path d="M162 249Q223 284 283 255M197 212Q179 240 203 260" stroke="#162720" stroke-opacity=".35" stroke-width="8"/><path d="M216 219Q244 231 269 217" stroke="#fff4d4" stroke-opacity=".2" stroke-width="3"/></g>${['crocodile','scorpion','snake'].includes(torso.animal)?'<path d="M158 210L180 225 198 204 218 226 239 204 260 225 282 205 303 224" fill="none" stroke="#c5cd9b"/>':torso.animal==='cheetah'?'<path d="M180 215h2M203 243h2M230 206h2M258 245h2M284 218h2" stroke="#514635" stroke-width="12" stroke-linecap="round"/>':torso.animal==='eagle'?'<path d="M170 210Q228 282 301 213M182 221Q238 290 287 232" fill="none" stroke="#e9dfb6"/>':''}</g><g data-part="hybridFront" data-animal="${front.animal}">${limbs({...front,id:front.animal},true)}</g><g data-part="hybridHead" data-animal="${head.animal}" fill="${head.color}"><path d="M302 244L324 184 359 188 345 255Z"/>${headShapes[head.animal]}<g class="creature-face" fill="none" stroke-width="2"><path d="M346 173Q358 161 373 166" stroke="#fff0c1" opacity=".55"/><path d="M380 193Q390 201 401 192M348 204L355 211M357 207L362 213" stroke="#1c2421"/><path d="M386 200l3 7 4-7" fill="#fff0d0" stroke="none"/></g><path d="M363 177L377 175" stroke="#191e17" stroke-width="5"/><circle cx="374" cy="176" r="2" fill="#f4da86" stroke="none"/></g></g></svg>`;}
