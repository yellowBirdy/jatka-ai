import {getBeastAbilities} from './beast-abilities.js?v=randomness-52';
const beast=(id,name,icon,stats,shape,color,size=1)=>({id,name,icon,stats,shape,color,size,desc:describeStats(stats)});
function describeStats(stats){const names={health:'bazowego HP',attack:'siły',defense:'ochrony',speed:'szybkości',accuracy:'celności',stamina:'kondycji',pierce:'przebicia'};return Object.entries(stats).map(([key,n])=>`${n>0?'+':''}${n} ${names[key]}`).join(' · ')||'Bez dodatkowych premii i kosztów.';}
export const beasts=[
 beast('horse','Koń bojowy','♞',{health:12,speed:4,stamina:8},'horse','#9b714f'),
 beast('wolf','Wielki wilk','🐺',{attack:3,speed:6,defense:-2},'wolf','#929c9d',.9),
 beast('boar','Dzik szarżujący','🐗',{attack:5,pierce:3,speed:-3},'boar','#796554',.9),
 beast('bear','Niedźwiedź brunatny','🐻',{health:24,attack:3,speed:-4},'bear','#785338',1.1),
 beast('rhino','Nosorożec','◆',{health:28,defense:4,speed:-6,accuracy:-3},'rhino','#89918b',1.15),
 beast('tiger','Tygrys','🐅',{attack:4,speed:4,stamina:-8},'cat','#c58b48'),
 beast('lion','Lew grzywiasty','🦁',{attack:5,accuracy:3,defense:-2},'lion','#c4a05c'),
 beast('elk','Łoś olbrzymi','♜',{health:16,pierce:3,speed:2,accuracy:-3},'antlers','#8c7760',1.1),
 beast('mammoth','Mamut','❄',{health:32,attack:4,speed:-7,stamina:-8},'mammoth','#8a6a50',1.2),
 beast('lizard','Waran olbrzymi','▰',{defense:4,pierce:3,speed:-2},'lizard','#708d58',.9),
 beast('ostrich','Struś stepowy','➶',{speed:8,accuracy:3,health:-10},'bird','#858b91',.85),
 beast('camel','Wielbłąd pustynny','☀',{stamina:24,health:8,speed:-1},'camel','#c6aa77',1.05),
 beast('bison','Żubr','⬢',{health:22,defense:3,speed:-4},'bison','#69503d',1.1),
 beast('buffalo','Bawół','♉',{attack:4,stamina:14,speed:-3},'horns','#555e59',1.05),
 beast('hyena','Hiena olbrzymia','✦',{attack:2,accuracy:5,speed:3,health:-6},'wolf','#b09b73',.82),
 beast('stag','Jeleń królewski','♧',{speed:5,pierce:4,defense:-2},'antlers','#ae8150',.95),
 beast('panther','Czarna pantera','☾',{speed:7,accuracy:4,health:-8},'cat','#424b50',.9),
 beast('polar-bear','Niedźwiedź polarny','❆',{health:26,attack:4,speed:-5,accuracy:-2},'bear','#d2d3c5',1.16),
 beast('yak','Jak górski','▲',{stamina:20,defense:3,speed:-3},'bison','#6a6156'),
 beast('crocodile','Krokodyl olbrzymi','≋',{pierce:6,defense:4,speed:-5},'lizard','#5d8170',1.08)
];
export const lootBeasts=[
 {...beast('sabretooth','Tygrys szablozębny','🐅',{health:16,attack:5,defense:2,speed:5,pierce:3},'cat','#b98c4c'),chance:45,rarity:'Rzadka'},
 {...beast('griffin','Gryf','🦅',{health:18,attack:5,defense:3,speed:5,pierce:4},'griffin','#bda06c'),chance:30,rarity:'Epicka'},
 {...beast('drake','Smok skalny','◆',{health:22,attack:5,defense:4,pierce:4,stamina:-10},'drake','#687e72',1.1),chance:17,rarity:'Epicka'},
 {...beast('chinese-dragon','Smok chiński','🐉',{health:58,attack:20,defense:14,speed:14,pierce:14},'eastern','#397f76',1.1),chance:6,rarity:'Legendarna'},
 {...beast('dragon','Smok','🐲',{health:74,attack:26,defense:18,speed:17,pierce:18},'dragon','#934d42',1.15),chance:2,rarity:'Legendarna'}
];
export const allBeasts=[...beasts,...lootBeasts];
export const beastArmors=[
 {id:'none',name:'Bez zbroi',icon:'◇',stats:{},color:null},
 {id:'leather',name:'Skórzana zbroja bestii',icon:'◈',stats:{defense:3,speed:-1},color:'#8d6040'},
 {id:'mail',name:'Kolczuga bestii',icon:'▦',stats:{defense:5,speed:-2,stamina:-5},color:'#a0aaa6'},
 {id:'scale',name:'Zbroja łuskowa bestii',icon:'⬡',stats:{defense:7,speed:-3,stamina:-8},color:'#a69a6b'},
 {id:'plate',name:'Zbroja płytowa bestii',icon:'⬢',stats:{defense:10,speed:-5,stamina:-14},color:'#aab9bf'}
].map(a=>({...a,desc:describeStats(a.stats)}));
const armorThemes={
 horse:['Koński czaprak bojowy','Końska kolczuga turniejowa','Koński pancerz łuskowy','Końskie płyty kopijnicze'],
 wolf:['Wilcza uprząż tropiciela','Wilcza plecionka','Wilcze łuski łowcy','Wilczy kirys kłowy'],
 boar:['Dzikie pasy taranujące','Dzikie ogniwa karkowe','Dzikie łuski grzbietowe','Dzikie płyty na ryj'],
 bear:['Niedźwiedzia skóra strażnika','Niedźwiedzi kołnierz kolczy','Niedźwiedzie łuski barkowe','Niedźwiedzi kirys łap'],
 rhino:['Nosorożcowe pasy rogowe','Nosorożcowa siatka','Nosorożcowe łuski czołowe','Nosorożcowy taran płytowy'],
 tiger:['Tygrysie pasy skoczka','Tygrysia siatka myśliwska','Tygrysie łuski pręgowe','Tygrysie płyty pazurzaste'],
 lion:['Lwi kołnierz skórzany','Lwia kolczuga królewska','Lwie łuski grzywiaste','Lwi pancerz korony'],
 elk:['Łosi czaprak leśny','Łosia plecionka poroża','Łosie łuski straży','Łosie płyty karkowe'],
 mammoth:['Mamucie pasy futrzane','Mamucia kolczuga słoniowa','Mamucie łuski tundry','Mamucia forteca płytowa'],
 lizard:['Warani kaftan bagienny','Warania siatka elastyczna','Waranie łuski jadowe','Warani pancerz grzbietowy'],
 ostrich:['Strusie pasy biegacza','Strusia siatka piórowa','Strusie łuski skrzydłowe','Strusie płyty piersiowe'],
 camel:['Wielbłądzi czaprak pustynny','Wielbłądzia kolczuga karawany','Wielbłądzie łuski wydm','Wielbłądzie płyty garbowe'],
 bison:['Żubrza uprząż puszczy','Żubrza kolczuga karkowa','Żubrze łuski bastionu','Żubrze płyty czołowe'],
 buffalo:['Bawole pasy stada','Bawola kolczuga naporu','Bawole łuski stepowe','Bawoli pancerz rogowy'],
 hyena:['Hienie pasy padlinożercy','Hienia plecionka łupieżcy','Hienie łuski grzbietowe','Hienie płyty szczękowe'],
 stag:['Jeleni czaprak królewski','Jelenia plecionka leśna','Jelenie łuski poroża','Jeleni kirys korony'],
 panther:['Panterza uprząż cienia','Panterza kolczuga cicha','Panterze łuski nocne','Panterzy pancerz zasadzki'],
 'polar-bear':['Polarny kaftan futrzany','Polarna kolczuga lodowa','Polarne łuski północy','Polarny kirys arktyczny'],
 yak:['Jaka kaftan górski','Jaka kolczuga przełęczy','Jaka łuski skalne','Jaka płyty szczytowe'],
 crocodile:['Krokodyli pas rzeczny','Krokodyla siatka szczękowa','Krokodyle łuski pancerne','Krokodyli kirys ogonowy']
};
const armorTemplates=[
 {id:'relic-tracker',name:'Uprząż tropiciela',chance:45,rarity:'Zwykła',color:'#78543e',stats:{defense:2,speed:2}},
 {id:'relic-warden',name:'Pancerz strażnika',chance:30,rarity:'Rzadka',color:'#869b93',stats:{defense:6,health:10,speed:-2}},
 {id:'relic-sun',name:'Łuski słońca',chance:15,rarity:'Rzadka',color:'#b99350',stats:{defense:5,stamina:12,speed:-1}},
 {id:'relic-night',name:'Karmazynowe płyty',chance:8,rarity:'Epicka',color:'#803d44',stats:{defense:8,attack:2,speed:-3}},
 {id:'relic-crown',name:'Kirys króla bestii',chance:2,rarity:'Legendarna',color:'#b6a77a',stats:{defense:10,health:18,speed:-4}}
].map(a=>({...a,type:'plate',icon:'⬢',desc:describeStats(a.stats)}));
const skinTemplates=[
 {id:'skin-ash',name:'Popielata',color:'#8b9090',chance:35,rarity:'Zwykła'},
 {id:'skin-sand',name:'Piaskowa',color:'#bd9a64',chance:30,rarity:'Zwykła'},
 {id:'skin-copper',name:'Miedziana',color:'#a26444',chance:20,rarity:'Rzadka'},
 {id:'skin-snow',name:'Śnieżna',color:'#d7d8ce',chance:10,rarity:'Epicka'},
 {id:'skin-midnight',name:'Nocna',color:'#414b5b',chance:5,rarity:'Legendarna'}
].map(a=>({...a,icon:'◈',stats:{},desc:'Wygląd dla każdej bestii. Nie zmienia statystyk.'}));
const speciesThemes=['Turniejowy','Księżycowy','Ciernisty','Puszczański','Bazaltowy','Pręgowany','Królewski','Bagienny','Tundrowy','Jadowy','Stepowy','Wydmowy','Dębowy','Rogaty','Łupieżczy','Bursztynowy','Cienisty','Polarny','Granitowy','Rzeczny','Szablasty','Podniebny','Skalny','Jadeitowy','Piekielny'];
function speciesColor(base,tint){return '#'+[1,3,5].map(i=>Math.round(parseInt(base.slice(i,i+2),16)*.3+parseInt(tint.slice(i,i+2),16)*.7).toString(16).padStart(2,'0')).join('');}
export const beastLootArmors=allBeasts.flatMap((b,index)=>armorTemplates.map((a,tier)=>({...a,color:speciesColor(b.color,a.color),beast:b.id,id:`${b.id}-${a.id}`,name:`${speciesThemes[index]} ${['rzemienny czaprak','kirys wartownika','pancerz łuskowy','bastion','diadem wojenny'][tier]} — ${b.name}`,ornament:index,variant:tier,stats:{...a.stats,health:(a.stats.health||0)+index%4},desc:describeStats({...a.stats,health:(a.stats.health||0)+index%4})})));
export const beastSkins=allBeasts.flatMap((b,index)=>skinTemplates.map((skin,tier)=>({...skin,color:speciesColor(b.color,skin.color),beast:b.id,id:`${b.id}-${skin.id}`,name:`${speciesThemes[index]} ${['popiół','piasek','miedź','szron','mrok'][tier]} — ${b.name}`,mark:index*5+tier,desc:`Unikalne umaszczenie: ${b.name}. Bez premii do statystyk.`})));
// Keep the existing ID so previously unlocked legendary skins upgrade in place.
const obsidianSkin=beastSkins.find(s=>s.id==='drake-skin-midnight');
Object.assign(obsidianSkin,{name:'Obsydianowy Kolos — Smok skalny',color:'#303544',desc:'Nowa masywna sylwetka, korona rogów, kryształowe płetwy grzbietowe, kolczasty ogon i pulsujące szczeliny magmy. Wyłącznie wygląd — bez premii do statystyk.'});
export function getBeastArmors(id,owned=[]){
 const index=allBeasts.findIndex(b=>b.id===id);if(index<0)throw Error('Nieznana bestia.');
 const armorHealth=({sabretooth:12,griffin:14,drake:16})[id]??index+1;
 return beastArmors.map((a,i)=>i===0?a:{...a,id:`${id}-${a.id}`,type:a.id,name:(armorThemes[id]||['Łączona uprząż','Kolczuga skrzydeł','Smocze łuski','Smocze płyty'])[i-1],stats:{...a.stats,health:armorHealth},desc:describeStats({...a.stats,health:armorHealth}),ornament:index}).concat(beastLootArmors.filter(a=>a.beast===id&&owned.includes(a.id)));
}
export function normalizeMount(picks){
 const beast=allBeasts.find(b=>b.id===(picks.beast??beasts[0].id));if(!beast)throw Error('Nieznana bestia.');
 const type=picks.beastArmor?.split('-').at(-1)||'none',pool=getBeastArmors(beast.id,beastLootArmors.map(a=>a.id));
 return {...picks,beast:beast.id,beastArmor:(pool.find(a=>a.id===picks.beastArmor)||pool.find(a=>(a.type||a.id)===type)||pool[0]).id,beastSkin:beastSkins.some(s=>s.beast===beast.id&&s.id===picks.beastSkin)?picks.beastSkin:'natural',beastAbility:picks.beastAbility==='none'?'none':getBeastAbilities(beast.id).some(a=>a.id===picks.beastAbility)?picks.beastAbility:beast.id};
}
export function drawMountOptions(random=Math.random){const pool=[...beasts];for(let i=pool.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}return pool.slice(0,5);}
export function resolveMount(picks){
 const beast=allBeasts.find(b=>b.id===(picks.beast??beasts[0].id));if(!beast)throw Error('Wybierz poprawną bestię.');
 const pool=getBeastArmors(beast.id,beastLootArmors.map(a=>a.id)),armorId=picks.beastArmor??'none';
 const armor=pool.find(a=>a.id===armorId)||pool.find(a=>a.type===armorId);
 if(!armor)throw Error('Wybierz zbroję pasującą do bestii.');
 const ability=picks.beastAbility??beast.id;
 const selected=getBeastAbilities(beast.id).find(a=>a.id===ability);
 if(ability!=='none'&&!selected)throw Error('Wybierz umiejętność swojej bestii.');
 if(picks.beastSkin&&picks.beastSkin!=='natural'&&!beastSkins.some(s=>s.id===picks.beastSkin&&s.beast===beast.id))throw Error('Ten skin należy do innej bestii.');
 return {beast,beastArmor:armor,beastSkin:beastSkins.find(s=>s.id===picks.beastSkin)||{id:'natural',name:'Naturalna',stats:{}},beastAbility:ability==='none'?{id:'none',name:'Bez umiejętności',desc:'Wyłączona',stats:{},chance:0}:selected};
}
// Side-view anatomy, with distinct backs, necks and joints for each family.
const anatomy={
 horse:{body:'M139 277C147 251 172 254 191 260C219 267 248 254 278 261C292 258 300 245 306 220L315 191 332 185 352 198 365 216 387 232 384 246 365 251 346 234 336 226C333 247 333 273 315 294L300 316C263 327 199 322 166 310Z',head:'M310 212Q315 184 332 183L338 163 345 185 354 182 359 164 362 193 381 218 396 232 391 245 375 246 356 229 337 224Z'},
 wolf:{body:'M127 282L145 267 170 264C209 257 247 273 275 259L307 239 326 225 345 225 358 239 389 251 409 255 407 265 380 273 351 269 325 284 302 314C257 326 201 319 167 309Z',head:'M323 241L326 216 341 228 358 209 362 235 383 246 411 252 406 264 383 271 357 267 341 257Z'},
 cat:{body:'M125 286C144 262 175 264 205 268C243 274 264 253 290 258Q310 257 326 239L351 231 374 246 389 263 373 278 345 273 318 295 300 315C256 322 218 311 190 316L157 311Z',head:'M327 244L331 225 345 235 362 230 373 219 375 243Q396 261 381 273L360 280 339 269Z'},
 lion:{body:'M131 281Q156 258 190 264L263 264Q291 251 321 240L357 235 381 257 373 279 340 281 307 313Q234 332 167 310Z',head:'M323 239Q341 218 361 231L375 218 378 241Q401 257 384 275L360 285 337 271Z'},
 bear:{body:'M126 286C129 259 150 251 179 251Q220 232 261 255L295 249Q316 231 341 236L368 248 394 264 391 277 372 285 346 279 315 304Q241 348 170 316Z',head:'M325 250Q315 225 331 226L341 237Q359 227 372 241Q385 238 384 251L405 263 401 277 380 283 355 273 340 274Z'},
 rhino:{body:'M119 283Q128 249 170 246L235 242Q276 241 305 262L331 253 366 260 393 279 391 294 360 304 324 295 299 320Q205 342 149 313Z',head:'M311 269L331 250 340 252 341 268 366 270 387 286 404 290 401 304 366 311 335 297Z'},
 boar:{body:'M126 283Q132 258 167 255Q211 241 265 258L307 265 328 255 355 263 387 279 403 283 400 296 379 301 348 294 316 311Q227 335 160 312Z',head:'M310 274L324 250 336 244 337 266 356 263 381 279 402 281 406 295 382 304 354 294 337 295Z'},
 antlers:{body:'M140 278Q158 262 189 270L264 266Q289 265 301 239L310 203 325 195 342 214 349 235 376 248 377 261 359 270 337 253 326 284 305 311Q228 327 161 304Z',head:'M308 218L307 199 325 208 335 195 341 220 357 235 384 247 380 261 363 264 344 245 324 238Z'},
 mammoth:{body:'M119 285Q119 241 165 239Q205 220 257 239L292 248Q310 218 339 220L366 235 386 269 379 298 347 313 314 310Q239 348 154 319Z',head:'M308 250Q305 218 335 217Q372 216 382 251L382 273 365 283 337 272 321 281Z'},
 lizard:{body:'M75 310L122 283Q155 267 191 276L263 277Q292 274 316 266L353 258 384 266 424 281 421 290 383 297 344 292 309 305Q235 330 161 310L121 318Z',head:'M316 274L349 258 376 262 429 280 431 288 403 298 367 291 335 294Z'},
 bird:{body:'M128 288Q138 258 178 262Q223 244 264 269L292 285Q308 283 315 257L322 221 327 190 342 190 342 225 337 265Q335 304 307 321Q218 348 158 315Z',head:'M322 201Q319 180 337 180Q353 181 354 198L376 206 355 213 338 213 333 228Z'},
 camel:{body:'M138 281L160 267Q171 217 196 258Q216 211 242 258L278 267 296 247 305 204 314 183 331 186 339 211 346 237 372 247 379 258 362 268 338 254 321 282 304 314Q232 328 160 310Z',head:'M305 207L308 181 319 177 327 183 340 176 344 188 342 208 361 228 382 241 380 254 362 258 341 243 328 224Z'},
 bison:{body:'M122 282Q125 258 157 262L222 257Q249 216 292 224Q317 223 336 248L361 253 383 276 377 293 348 304 319 300 294 318Q221 333 157 309Z',head:'M309 254Q318 233 340 242L361 249 380 271 379 292 361 308 337 293 318 286Z'},
 horns:{body:'M126 281Q145 250 188 259L259 254Q288 244 314 259L344 254 372 269 386 288 376 302 347 305 320 296 301 319Q219 338 156 310Z',head:'M315 267Q327 249 348 256L365 266 384 285 380 303 357 312 335 300 323 286Z'}
};
anatomy.dragon={body:'M115 286Q145 245 194 259L258 265 294 239 311 205 336 199 358 224 384 237 413 252 407 268 375 271 354 258 337 282 307 317Q222 341 151 311Z',head:'M307 225L305 202 326 214 345 191 347 218 366 229 402 241 423 256 415 267 382 271 356 253 332 251Z'};
anatomy.drake=anatomy.dragon;
anatomy.griffin={...anatomy.lion,head:'M312 240Q321 213 345 219L363 233 383 247 408 254 397 271 387 257 364 263 344 271 325 262Z'};
anatomy.eastern={body:'M81 305Q89 259 151 269Q190 274 211 253Q244 221 281 244Q308 250 324 227L339 211 360 225 376 245 408 255 407 270 380 280 357 268Q330 277 309 291Q270 315 237 284Q216 274 195 295Q139 335 81 305Z',head:'M322 238L320 209 340 224 350 202 357 225 380 237 412 245 431 260 423 273 391 276 367 259 342 264Z'};
function animalLegs(shape,color){
 if(shape==='bird')return '<path d="M205 316L197 351 203 383 182 391M203 383L216 390M266 316L277 352 269 384 252 392M269 384L285 391" fill="none" stroke="#bba17b" stroke-width="7"/>';
 if(shape==='lizard')return '<path d="M164 298L139 319 153 342 128 348 165 350 173 338 163 323 190 310M298 296L324 315 312 338 338 344 304 349 297 334 302 320 277 311"/>';
 const thick=['bear','rhino','mammoth','bison','horns'].includes(shape),hoof=['horse','antlers','camel','boar','bison','horns'].includes(shape);
 return `<g class="anatomical-legs" fill="${color}"><path d="M180 298Q198 309 185 335L176 356 185 379 177 388 156 388 158 379 162 354 163 325Z" opacity=".65"/><path d="M284 298L304 311 298 339 314 378 307 387 288 387 285 377 279 349 270 328Z" opacity=".65"/><path d="M155 291Q${thick?197:181} 298 177 325L165 350 168 377 180 384 178 391 149 391 146 381 149 349 144 322Z"/><path d="M299 285Q329 289 326 316L317 344 328 376 342 383 340 391 311 391 307 381 300 347 301 326 285 309Z"/><g fill="${hoof?'#302b26':'#272f29'}" stroke-width="1"><path d="M149 381L170 380 180 385 178 391 149 391ZM311 381L330 380 342 385 340 391 311 391Z"/></g><path d="M156 323L158 347M312 321L308 342" stroke="#f2e4c2" stroke-opacity=".25" stroke-width="3" fill="none"/></g>`;
}
function armorContour(shape,tier){
 if(tier===0)return 'M168 267L180 266 187 317 174 318ZM238 263L250 265 251 323 238 323ZM285 268L296 273 288 314 277 314Z';
 if(shape==='bird')return 'M146 281Q202 258 269 278L292 306 266 322 235 306 214 328 181 311 155 319Z';
 if(shape==='lizard')return 'M141 286L175 275 203 287 235 276 268 288 306 277 322 298 291 314 261 306 232 320 202 309 175 320 147 307Z';
 if(['bear','bison','mammoth','rhino','horns'].includes(shape))return 'M144 272Q213 243 291 260L313 279 308 314 282 333 258 315 228 335 200 318 171 329 147 309Z';
 if(['wolf','cat','lion'].includes(shape))return 'M155 275Q219 263 284 270L307 285 293 309 269 313 254 299 219 311 189 301 168 314 151 296Z';
 return 'M151 270Q218 248 290 266L306 288 298 318 274 331 251 315 223 336 196 316 168 327 148 306Z';
}
export function mountedPortrait(rider,f){
 const original=f.traits.beast,skin=f.traits.beastSkin;const b=skin?.color?{...original,color:skin.color}:original,a=f.traits.beastArmor;
 const long=['lizard','wolf','cat'].includes(b.shape),heavy=['mammoth','bear','bison','rhino'].includes(b.shape),bird=b.shape==='bird';
 const obsidian=b.id==='drake'&&skin?.id==='drake-skin-midnight';
 const form=obsidian?{body:'M109 282L137 254 170 247 194 257 225 251 262 259 288 243 306 213 329 207 353 222 380 240 411 250 418 271 387 284 358 277 334 301 305 325 264 338 220 327 175 330 139 309Z',head:'M303 235L308 205 328 207 344 196 359 220 380 230 407 237 431 252 429 268 407 277 379 272 355 260 334 265Z'}:anatomy[b.shape];
 const wings=obsidian?`<g class="obsidian-crystal-wings" fill="#3e4159" stroke="#aaa0d3" stroke-width="2"><path d="M245 282L270 202 325 136 305 212 364 165 333 235 404 208 354 265 305 290Z"/><path d="M165 269L132 209 142 255 108 238 143 285Z"/><path d="M282 241L301 155 308 202 298 235Z" fill="#8874a8"/><path d="M317 256L359 182 345 226 334 252Z" fill="#655e8d"/><path d="M270 267L302 212M306 278L346 235" stroke="#f1b480"/></g>`:['dragon','griffin'].includes(b.shape)?'<g class="beast-wings"><path d="M238 277Q207 219 162 169L186 227 143 207 181 248 153 250 207 288Z" fill="#5f514d"/><path d="M263 275Q251 196 318 127L297 199 333 173 315 222 350 211 299 265Z" fill="'+b.color+'"/><path d="M263 275L318 127M263 275L333 173M263 275L350 211" fill="none" stroke="#d4b997" stroke-width="2"/></g>':'';
 const extras={
  horse:'<path d="M333 229L336 200 347 224M353 223L367 202 365 234"/><path d="M315 230Q297 245 310 270" stroke="#333b32" stroke-width="10"/>',
  wolf:'<path d="M334 227L330 207 351 225M359 227L366 206 374 236"/><path d="M385 252L414 256 384 269Z"/>',
  boar:'<path d="M386 260Q410 266 402 244M362 267Q378 282 384 260" fill="none" stroke="#e9d8ad" stroke-width="7"/>',
  bear:'<circle cx="335" cy="231" r="13"/><circle cx="369" cy="229" r="12"/>',
  rhino:'<path d="M384 248L406 210 407 256Z" fill="#d0ccb5"/>',
  cat:'<path d="M336 229L334 211 351 227M361 228L373 210 375 239"/><path d="M150 279L176 305M181 270L205 307M228 269L247 308M276 271L292 307" fill="none" stroke="#343e36" stroke-width="6"/>',
  lion:'<ellipse cx="344" cy="251" rx="39" ry="40" fill="#6a5035"/><circle cx="354" cy="250" r="25"/>',
  antlers:'<path d="M345 233L330 200 312 192M330 200L337 179M330 200L314 173M365 233L379 198 398 189M379 198L375 177M379 198L392 170" fill="none" stroke="#cfba87" stroke-width="7"/>',
  mammoth:'<path d="M381 249Q425 278 409 318Q398 331 389 315" fill="none" stroke-width="20"/><path d="M370 267Q399 313 413 280" fill="none" stroke="#e9dfc4" stroke-width="7"/><ellipse cx="337" cy="250" rx="22" ry="33"/>',
  lizard:'<path d="M139 273L67 300 116 307 150 299M379 247L426 259 389 276Z"/><path d="M156 254L164 240 180 254 194 238 211 255 230 240 245 256 267 244 280 259" fill="#b6bc89"/>',
  bird:'<path d="M371 242L412 255 378 265Z" fill="#d2ad65"/><path d="M142 263L110 239 102 263 133 288"/><path d="M205 335L204 390M259 335L268 390" fill="none" stroke="#c8a777" stroke-width="10"/>',
  camel:'<path d="M166 268Q174 224 204 256Q230 224 250 267Z"/>',
  bison:'<path d="M277 266Q283 215 330 237L340 274Z"/><path d="M335 238Q311 210 325 202M371 240Q398 216 389 204" fill="none" stroke="#c6c6b1" stroke-width="7"/>',
  horns:'<path d="M335 236Q309 234 313 208M372 239Q402 233 399 208" fill="none" stroke="#d8d3b5" stroke-width="8"/>'
 };
 return `<svg class="mounted-portrait" data-beast="${b.id}" data-skin="${skin?.id||'natural'}" data-beast-armor="${a.id}" viewBox="0 0 500 420" role="img" aria-label="Wierzchowiec: ${b.name}, ${a.name}"><ellipse cx="245" cy="399" rx="185" ry="13" fill="#000" opacity=".2"/><g fill="${b.color}" stroke="#29312b" stroke-width="2.4" stroke-linejoin="round"><g transform="translate(${(1-b.size)*245} ${(1-b.size)*300}) scale(${b.size})"><path d="M150 287Q92 242 100 311" fill="none" stroke-width="14"/>${wings}${animalLegs(obsidian?'rhino':b.shape,b.color)}<path class="beast-anatomy" data-anatomy="${b.shape}" d="${form.body}"/><path class="beast-head" d="${form.head}"/>${extras[b.shape]||''}${obsidian?`<g class="obsidian-stone-plates" fill="#42495a" stroke="#151e27" stroke-width="3"><path d="M128 267L160 252 189 265 182 292 147 303 128 285ZM201 260L231 256 262 266 252 293 218 300 195 281ZM280 259L304 242 326 257 319 283 296 301 276 280Z"/><path d="M148 314L159 341 169 333 173 308ZM302 315L309 343 322 330 327 304Z"/></g>`:''}${['dragon','drake','eastern'].includes(b.shape)?'<path d="M152 289Q82 251 48 290Q80 267 113 307M313 218L299 189 321 202M349 217L372 188 365 225"/><path d="M381 264l6 10 7-11M399 262l5 9 5-10" fill="#efe2bd"/>':''}${b.shape==='eastern'?'<path d="M394 266Q446 287 457 246M397 264Q443 246 441 223" fill="none" stroke="#dbc597" stroke-width="3"/>':''}${skin?.mark!==undefined?`<g class="species-skin-markings" data-mark="${skin.mark}" stroke="#f0ddaa" stroke-opacity=".55" stroke-width="${2+skin.mark%3}" fill="none">${Array.from({length:4+skin.mark%4},(_,i)=>`<path d="M${163+i*18} ${275+(skin.mark%5)}q${8+skin.mark%7} 12 2 27"/>`).join('')}</g>`:''}<g class="creature-muscles" fill="none"><path d="M153 278Q207 249 276 272M310 280Q317 250 338 239" stroke="#fff1cd" stroke-width="6" stroke-opacity=".4"/><path d="M163 310Q231 334 292 304M301 279Q281 299 301 313" stroke="#14211c" stroke-width="8" stroke-opacity=".4"/></g><g class="creature-face" stroke-width="2"><path d="M350 240Q363 232 375 241" stroke="#fff1d0" stroke-opacity=".65" fill="none"/><path d="M376 263L388 260M350 258Q358 267 369 264" fill="none"/><ellipse cx="386" cy="254" rx="3" ry="2" fill="#16221d" stroke="none"/></g>${obsidian?`<g class="magma-fissures" fill="none" stroke="#ffaf66" stroke-width="2.4" stroke-linecap="round"><path d="M133 278L151 270 158 284 174 289M209 269L222 278 218 289 236 297M286 268L303 274 299 291M316 318L313 333 321 345M160 324L154 339 160 350M344 236L358 244 367 240 381 254 401 257"/><path d="M54 292L73 284 94 293 116 282"/></g>`:''}<g class="realistic-eye"><path d="M358 244Q364 239 370 243" fill="none" stroke="#141c18" stroke-width="2"/><ellipse cx="365" cy="244" rx="3" ry="2.2" fill="#977b43" stroke="#171c17" stroke-width="1"/><circle cx="366" cy="243" r=".8" fill="#fff4d4" stroke="none"/></g>${a.color?`<path class="species-barding" data-armor-shape="${b.shape}" d="${armorContour(b.shape,a.variant)}" fill="${a.color}"/><path d="M${155+(a.ornament??0)%5*4} 281Q220 269 294 282" stroke="#ead9ab" stroke-width="2" fill="none"/><path d="M166 275L170 309M190 267L196 319M217 264L222 323M248 265L248 323M278 270L277 315" fill="none" stroke="#35413d" stroke-width="${(a.type||a.id)==='plate'?4:2}" ${(a.type||a.id)==='mail'?'stroke-dasharray="3 4"':''}/><path d="M332 235L368 232 382 250 361 257 339 252Z" fill="${a.color}"/>${a.variant>=2?`<g class="loot-armor-detail" fill="${a.color}" stroke="#e8d1a0" stroke-width="1.5">${Array.from({length:4},(_,i)=>`<path d="M${174+i*28} 288l14 -8 12 10 -12 18Z"/>`).join('')}${a.variant===4?'<path d="M298 272L302 248 314 271 328 256 325 283Z"/>':''}</g>`:''}<g class="beast-armor-ornament" fill="${b.color}" stroke="#e4d3a1" stroke-width="2">${Array.from({length:3+(a.ornament??0)%4},(_,i)=>`<path d="M${169+i*24} 284 l${5+(a.ornament??0)%5} -9 7 10 -6 9Z"/>`).join('')}<circle cx="${204+(a.ornament??0)*3}" cy="302" r="${4+(a.ornament??0)%5}"/></g>`:''}${obsidian?`<g class="obsidian-crown" fill="#4e5067" stroke="#bbb1dc" stroke-width="2"><path d="M312 220L298 181 306 152 321 185 333 215ZM342 214L358 182 388 161 374 198 361 225ZM383 239L398 215 418 203 408 233Z"/><path d="M395 253L405 246 417 253 405 257Z" fill="#ffd17f" stroke="#f38950"/><path d="M393 269L399 282 405 269M411 265L416 276 421 263" fill="#eddaca"/></g><g class="obsidian-tail" fill="#363d4e" stroke="#9194b5" stroke-width="2"><path d="M143 289L117 272 97 278 78 269 54 279 27 278 47 295 77 302 101 295 131 313Z"/><path d="M63 279L59 260 79 274M94 278L100 256 115 273M41 283L27 265 29 288"/><path d="M56 287L78 284 93 289 112 284" fill="none" stroke="#ffac62"/></g><g class="obsidian-embers" fill="#ffc98b" stroke="none"><circle cx="293" cy="190" r="2"/><circle cx="339" cy="184" r="2.5"/><circle cx="376" cy="200" r="1.7"/><circle cx="94" cy="257" r="2"/></g>`:''}<path d="M204 257L261 257 272 282 199 282Z" fill="#554538"/><path d="M328 251L346 270 378 259" fill="none" stroke="#c9b180" stroke-width="4"/></g></g><svg x="105" y="28" width="255" height="307" viewBox="0 0 300 350">${rider.replace(/^<svg[^>]*>/,'').replace(/<\/svg>$/,'')}</svg></svg>`;
}
