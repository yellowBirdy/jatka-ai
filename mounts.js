import {getBeastAbilities} from './beast-abilities.js?v=tactics-17';
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
export function getBeastArmors(id){
 const index=beasts.findIndex(b=>b.id===id);if(index<0)throw Error('Nieznana bestia.');
 return beastArmors.map((a,i)=>i===0?a:{...a,id:`${id}-${a.id}`,type:a.id,name:armorThemes[id][i-1],stats:{...a.stats,health:index+1},desc:describeStats({...a.stats,health:index+1}),ornament:index});
}
export function normalizeMount(picks){
 const beast=beasts.find(b=>b.id===(picks.beast??beasts[0].id));if(!beast)throw Error('Nieznana bestia.');
 const type=picks.beastArmor?.split('-').at(-1)||'none',pool=getBeastArmors(beast.id);
 return {...picks,beast:beast.id,beastArmor:(pool.find(a=>a.id===picks.beastArmor)||pool.find(a=>(a.type||a.id)===type)||pool[0]).id,beastAbility:picks.beastAbility==='none'?'none':getBeastAbilities(beast.id).some(a=>a.id===picks.beastAbility)?picks.beastAbility:beast.id};
}
export function drawMountOptions(random=Math.random){const pool=[...beasts];for(let i=pool.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}return pool.slice(0,5);}
export function resolveMount(picks){
 const beast=beasts.find(b=>b.id===(picks.beast??beasts[0].id));if(!beast)throw Error('Wybierz poprawną bestię.');
 const pool=getBeastArmors(beast.id),armorId=picks.beastArmor??'none';
 const armor=pool.find(a=>a.id===armorId)||pool.find(a=>a.type===armorId);
 if(!armor)throw Error('Wybierz zbroję pasującą do bestii.');
 const ability=picks.beastAbility??beast.id;
 const selected=getBeastAbilities(beast.id).find(a=>a.id===ability);
 if(ability!=='none'&&!selected)throw Error('Wybierz umiejętność swojej bestii.');
 return {beast,beastArmor:armor,beastAbility:ability==='none'?{id:'none',name:'Bez umiejętności',desc:'Wyłączona',stats:{},chance:0}:selected};
}
export function mountedPortrait(rider,f){
 const b=f.traits.beast,a=f.traits.beastArmor;
 const long=['lizard','wolf','cat'].includes(b.shape),heavy=['mammoth','bear','bison','rhino'].includes(b.shape),bird=b.shape==='bird';
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
 return `<svg class="mounted-portrait" data-beast="${b.id}" data-beast-armor="${a.id}" viewBox="0 0 500 420" role="img" aria-label="Wierzchowiec: ${b.name}, ${a.name}"><ellipse cx="245" cy="399" rx="185" ry="13" fill="#000" opacity=".2"/><g fill="${b.color}" stroke="#29312b" stroke-width="5" stroke-linejoin="round"><g transform="translate(${(1-b.size)*245} ${(1-b.size)*300}) scale(${b.size})"><path d="M150 287Q92 242 100 311" fill="none" stroke-width="14"/>${!bird?'<path d="M164 309L157 383 177 387 192 313M205 312L215 385 234 385 232 309M281 312L278 383 300 385 310 307M310 303L333 379 351 380 339 297"/>':''}<ellipse cx="232" cy="${bird?290:heavy?291:287}" rx="${long?115:heavy?110:92}" ry="${heavy?57:bird?46:43}"/><path d="M298 293Q308 264 320 239Q348 217 378 240L392 259 368 279 342 270 328 307Z"/>${extras[b.shape]||''}<circle cx="369" cy="247" r="4" fill="#f3e7a6" stroke="none"/>${a.color?`<path d="M153 270Q225 246 302 271L310 313Q224 343 150 311Z" fill="${a.color}"/><path d="M166 275L170 309M190 267L196 319M217 264L222 323M248 265L248 323M278 270L277 315" fill="none" stroke="#35413d" stroke-width="${(a.type||a.id)==='plate'?4:2}" ${(a.type||a.id)==='mail'?'stroke-dasharray="3 4"':''}/><path d="M332 235L368 232 382 250 361 257 339 252Z" fill="${a.color}"/><g class="beast-armor-ornament" fill="${b.color}" stroke="#e4d3a1" stroke-width="2">${Array.from({length:3+(a.ornament??0)%4},(_,i)=>`<path d="M${169+i*24} 284 l${5+(a.ornament??0)%5} -9 7 10 -6 9Z"/>`).join('')}<circle cx="${204+(a.ornament??0)*3}" cy="302" r="${4+(a.ornament??0)%5}"/></g>`:''}<path d="M204 257L261 257 272 282 199 282Z" fill="#554538"/><path d="M328 251L346 270 378 259" fill="none" stroke="#c9b180" stroke-width="4"/></g></g><svg x="105" y="28" width="255" height="307" viewBox="0 0 300 350">${rider.replace(/^<svg[^>]*>/,'').replace(/<\/svg>$/,'')}</svg></svg>`;
}
