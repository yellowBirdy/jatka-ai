import {createMagazines,spendRound,tickMagazines,reloadMagazines} from './mech-ammo.js?v=mechs-68';
import {createMechModel} from './mech-models.js?v=mechs-68';
import {createOrbit,rotateOrbit,screenMotion,orbitPosition} from './mech-camera.js?v=mechs-68';
import {aimFromMount} from './mech-aim.js?v=mechs-68';
import {BODY,LEGS,GUN,MOD,PAL,ARENAS,DEFAULT_BUILD,costOf,stats,validBuild,randomBuild,segmentCircle} from './mech-data.js?v=mechs-68';
'use strict';
/* =====================================================================
 *  MECHY – zbuduj własnego mecha w 3D i wygraj battle royale z botami
 *  1 Dane części | 2 Modele 3D | 3 Garaż | 4 Arena i logika | 5 AI botów | 6 HUD
 *  Logika gry używa zwykłych liczb (x,z), a Three.js tylko rysuje.
 * ===================================================================== */
const $=s=>document.querySelector(s),clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),rnd=(a,b)=>a+Math.random()*(b-a),ri=n=>Math.floor(Math.random()*n);

/* ---------- 1. DANE CZĘŚCI ---------- */
const NAMES=['Złomek','Młot','Cyklon','Zgniatacz','Viper','Rdza','Burza','Tytan','Kafar','Szrapnel','Widmo','Iskra','Raptor','Echo','Kobalt','Onyks'];
const settings={budget:140,bots:7,difficulty:'normal',arena:'foundry',assist:false,sound:true,shadows:!matchMedia('(pointer:coarse)').matches};
let build={...DEFAULT_BUILD};
try{const saved=JSON.parse(localStorage.getItem('mechBuild'));if(validBuild(saved,180)){build={...saved};if(costOf(build)>settings.budget)settings.budget=180;}}catch{}
const randBuild=minCost=>randomBuild(minCost,Math.random,settings.budget);
/* ---------- 2. MODELE 3D ---------- */
const surface=document.createElement('canvas');surface.width=surface.height=128;const surfaceCtx=surface.getContext('2d'),surfaceImage=surfaceCtx.createImageData(128,128);let grainSeed=718;for(let i=0;i<surfaceImage.data.length;i+=4){grainSeed=(Math.imul(grainSeed,1664525)+1013904223)>>>0;const v=200+grainSeed%45;surfaceImage.data[i]=surfaceImage.data[i+1]=surfaceImage.data[i+2]=v;surfaceImage.data[i+3]=255;}surfaceCtx.putImageData(surfaceImage,0,0);surfaceCtx.strokeStyle='#abb7be';surfaceCtx.lineWidth=.5;for(let i=0;i<128;i+=16){surfaceCtx.beginPath();surfaceCtx.moveTo(0,i);surfaceCtx.lineTo(128,i);surfaceCtx.stroke();}const steelTexture=new THREE.CanvasTexture(surface);steelTexture.wrapS=steelTexture.wrapT=THREE.RepeatWrapping;steelTexture.repeat.set(2,2);steelTexture.encoding=THREE.sRGBEncoding;
const MAT={};const mat=c=>MAT[c]||(MAT[c]=new THREE.MeshStandardMaterial({color:c,metalness:.35,roughness:.5,map:steelTexture}));const glow=c=>MAT['glow'+c]||(MAT['glow'+c]=new THREE.MeshStandardMaterial({color:c,emissive:c,emissiveIntensity:.9,roughness:.3}));
const DARK=0x2b313a,LH=.9;
const mkMech=createMechModel;

/* ---------- renderer i sceny ---------- */
let renderer;try{renderer=new THREE.WebGLRenderer({canvas:$('#c'),antialias:true,powerPreference:'high-performance'});}catch(error){$('#load-error').classList.remove('hide');throw error;}renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.75));renderer.outputEncoding=THREE.sRGBEncoding;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.95;renderer.shadowMap.enabled=settings.shadows;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
const cam=new THREE.PerspectiveCamera(50,1,.1,200),FOV=50;
const gscene=new THREE.Scene(),scene=new THREE.Scene();
let orbit=createOrbit(),orbitDrag=null,orbitTouch=null;
let paused=false;let mode='garage',garMech=null,gyaw=.6,drag=false,W=innerWidth,H=innerHeight;
[gscene,scene].forEach(s=>{s.add(new THREE.HemisphereLight(0xb8eaff,0x192735,.65));const l=new THREE.DirectionalLight(0xffe4c1,1.1);l.position.set(12,25,16);l.castShadow=true;l.shadow.mapSize.set(1024,1024);Object.assign(l.shadow.camera,{left:-48,right:48,top:48,bottom:-48,near:1,far:100});l.shadow.bias=-.001;s.add(l);const rim=new THREE.DirectionalLight(0x42b8ff,.8);rim.position.set(-8,5,-9);s.add(rim)});
gscene.background=new THREE.Color(0x10161f);gscene.fog=new THREE.Fog(0x10161f,9,32);scene.background=new THREE.Color(0x0b1018);scene.fog=new THREE.Fog(0x0b1018,45,95);
const plat=new THREE.Mesh(new THREE.CylinderGeometry(3,3.3,.3,32),mat(0x1f2937));plat.position.y=-.15;plat.receiveShadow=true;gscene.add(plat);
const platformRing=new THREE.Mesh(new THREE.TorusGeometry(3,.035,8,80),new THREE.MeshBasicMaterial({color:0x49cce5}));platformRing.rotation.x=Math.PI/2;platformRing.position.y=.015;gscene.add(platformRing);
const garageGrid=new THREE.GridHelper(40,40,0x214553,0x142630);garageGrid.position.y=-.31;gscene.add(garageGrid);
function resize(){W=innerWidth;H=innerHeight;renderer.setSize(W,H,false);cam.aspect=W/H;cam.updateProjectionMatrix();const hc=$('#hc');hc.width=W;hc.height=H}
addEventListener('resize',()=>{resize();if(mode==='garage')garCam()});
function garCam(){cam.position.set(0,3.4,8.5);cam.lookAt(0,1.6,0);const n=W<760;cam.setViewOffset(W,H,n?0:-200,n?H*.27:0,W,H)}
function disposeTree(root){if(!root)return;const geometries=new Set(),materials=new Set();root.traverse(o=>{if(o.geometry)geometries.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:[o.material])if(m&&!Object.values(MAT).includes(m))materials.add(m);});geometries.forEach(g=>{if(![SHELL,BUL,ROC,FXG].includes(g))g.dispose();});materials.forEach(m=>m.dispose());}
function showGarMech(){if(garMech){gscene.remove(garMech.g);disposeTree(garMech.g);}garMech=mkMech(build,PAL[build.col]);gscene.add(garMech.g)}

/* ---------- 3. GARAŻ ---------- */
const afford=(k,i)=>costOf({...build,[k]:i})<=settings.budget;
function opts(title,k,arr,fmt){return`<h4>${title}</h4><div class="opts">${arr.map((o,i)=>`<button class="opt ${build[k]===i?'sel':''}" data-k="${k}" data-i="${i}" ${afford(k,i)?'':'disabled'}><b>${o.n}</b><small>${fmt(o)}</small></button>`).join('')}</div>`}
const gunDescriptions={mg:'Szybki, równy ostrzał na średnim dystansie.',cannon:'Ciężkie pociski do precyzyjnych trafień.',laser:'Skupiona wiązka trafiająca natychmiast.',rocket:'Pociski wybuchowe, groźne także w pobliżu osłon.',shotgun:'Szeroka salwa do walki z bliska.',minigun:'Gęsty ostrzał z obrotowego zespołu luf.',plasma:'Wolniejsze kule energii eksplodujące przy trafieniu.',rail:'Precyzyjny strzał na daleki dystans.',flame:'Strumień płomieni do bardzo bliskich starć.',pulse:'Lodowe impulsy spowalniające trafiony cel.',thermal:'Gorąca wiązka przecinająca pole walki.',micro:'Salwa małych rakiet pokrywająca większy obszar.',heavymg:'Ciężkie serie z wyraźnym odrzutem.',flak:'Rozpraszająca się chmura odłamków.'};
const bodyDescriptions=['Smukły pancerz i lekka konstrukcja.','Uniwersalna rama do wielu zestawów.','Masywna osłona i szerokie barki.','Wąska sylwetka do szybkiego przemieszczania.','Ciężki pancerz do przyjmowania ostrzału.','Odsłonięty rdzeń i kompaktowa rama.','Wzmocniona rama do natarcia.','Szeroka platforma pod ciężkie uzbrojenie.'];
const legDescriptions={wheel:'Szybki przejazd na kołach.',bi:'Zwinny, kroczący chód.',quad:'Stabilna postawa na czterech podporach.',track:'Pancerny układ gąsienicowy.',hover:'Unoszenie nad ziemią i płynny ruch.',hex:'Szeroko rozstawione, mechaniczne kończyny.',digitigrade:'Odwrócone stawy i sprężysty krok.',heavy:'Mocne siłowniki i ciężkie stopy.'};
const moduleDescriptions={ '':'Pozostawia miejsce na inne części.',shield:'Odnawialna osłona energetyczna.',dash:'Krótki dopalacz do szybkiego uniku.',repair:'Stopniowo naprawia uszkodzenia.',armor:'Dodatkowe płyty osłaniające korpus.',turbo:'Ułatwia szybkie przemieszczanie.',vamp:'Odzyskuje energię z zadanych obrażeń.',energy:'Przyspiesza pracę obu broni.',stabilizer:'Pomaga utrzymać skupiony ostrzał.',patch:'Naprawa awaryjna po poważnym trafieniu.'};
const gfmt=o=>gunDescriptions[o.k];
function renderGarage(){const S=stats(build);
 $('#gp').innerHTML=`<a class="back-link" href="./">← Wróć do JATKI</a><span class="eyebrow">KONSTRUKTOR / 01</span><h1>Garaż mechów</h1><p class="garage-intro">Dwie bronie. Własne podwozie. Jedna szansa na zwycięstwo.</p><p class="build-signature">${S.B.n} · ${S.L.n}</p><p class="build-fit">Miejsce na wyposażenie: ${S.cost/settings.budget>.9?'prawie pełne':S.cost/settings.budget>.7?'zajęte w większości':'duży zapas'}</p>
 ${opts('Korpus','body',BODY,(o)=>bodyDescriptions[BODY.indexOf(o)])}${opts('Podwozie','legs',LEGS,o=>legDescriptions[o.k])}${opts('Broń lewa','gl',GUN,gfmt)}${opts('Broń prawa','gr',GUN,gfmt)}${opts('Moduł','mod',MOD,o=>moduleDescriptions[o.k])}
 <h4>Kolor</h4><div class="cols">${PAL.map((c,i)=>`<button type="button" aria-label="Kolor ${i+1}" aria-pressed="${build.col===i}" class="dot ${build.col===i?'sel':''}" data-col="${i}" style="background:#${c.toString(16).padStart(6,'0')}"></button>`).join('')}</div>
 <h4>Ustawienia starcia</h4><div class="match-options"><label>Limit wyposażenia<select id="mech-budget">${[110,140,180].map(n=>`<option value="${n}" ${settings.budget===n?'selected':''}>${({110:'Lekki zestaw',140:'Standard',180:'Rozbudowany'})[n]}</option>`).join('')}</select></label><label>Przeciwnicy<select id="mech-bots">${[3,7,11,15].map(n=>`<option value="${n}" ${settings.bots===n?'selected':''}>${n} botów</option>`).join('')}</select></label><label>Poziom botów<select id="mech-difficulty">${[['easy','Rekrut'],['normal','Weteran'],['hard','Elita']].map(([v,n])=>`<option value="${v}" ${settings.difficulty===v?'selected':''}>${n}</option>`).join('')}</select></label><label>Arena<select id="mech-arena">${ARENAS.map(a=>`<option value="${a.id}" ${settings.arena===a.id?'selected':''}>${a.n}</option>`).join('')}</select></label></div><label class="check"><input id="mech-assist" type="checkbox" ${settings.assist?'checked':''}> Wspomaganie celowania</label><label class="check"><input id="mech-sound" type="checkbox" ${settings.sound?'checked':''}> Dźwięk</label><label class="check"><input id="mech-shadows" type="checkbox" ${settings.shadows?'checked':''}> Cienie (wyłącz dla płynności)</label><button class="btn" id="go">Do areny → ${settings.bots} botów</button><button class="btn s" id="rn">🎲 Losowy mech</button>
 <p style="color:var(--mut);font-size:12px">WASD / strzałki — ruch · mysz — cel · lewy klik — ogień · przytrzymaj prawy i przeciągnij — obrót kamery · Q / E — osobne bronie · R — przeładuj · Spacja — dopalacze · P / Esc — pauza. Kółko myszy — przybliżenie. Telefon: dwa drążki; przeciągnij pusty teren, aby obrócić kamerę.</p>`;
 document.querySelectorAll('.opt').forEach(b=>b.onclick=()=>{build[b.dataset.k]=+b.dataset.i;saveB();renderGarage();showGarMech()});
 document.querySelectorAll('.dot').forEach(d=>d.onclick=()=>{build.col=+d.dataset.col;saveB();renderGarage();showGarMech()});
 for(const [id,key] of [['mech-budget','budget'],['mech-bots','bots'],['mech-difficulty','difficulty'],['mech-arena','arena']])$('#'+id).onchange=e=>{settings[key]=['budget','bots'].includes(key)?Number(e.target.value):e.target.value;if(!validBuild(build,settings.budget)){build=randBuild(65);saveB();showGarMech();}renderGarage();};for(const key of ['assist','sound','shadows'])$('#mech-'+key).onchange=e=>{settings[key]=e.target.checked;if(key==='shadows')renderer.shadowMap.enabled=settings.shadows;};$('#go').onclick=startMatch;$('#rn').onclick=()=>{build=randBuild(80);saveB();renderGarage();showGarMech()}}
const saveB=()=>{try{localStorage.mechBuild=JSON.stringify(build)}catch(e){}};

/* ---------- 4. ARENA I LOGIKA ---------- */
const R_ARENA=42;let G=null,keys={},mdown=false,mouse={x:W/2,y:H/2},touch={mx:0,mz:0,fire:false,dash:false},camP={x:0,z:0},AC=null;
function sfx(f,d,type='square',v=.03){if(!settings.sound)return;try{AC=AC||new AudioContext();if(AC.state==='suspended')AC.resume();const o=AC.createOperator?0:AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.value=f;g.gain.value=v;o.connect(g);g.connect(AC.destination);o.start();g.gain.exponentialRampToValueAtTime(.0001,AC.currentTime+d);o.stop(AC.currentTime+d)}catch(e){}}
const SHELL=new THREE.SphereGeometry(.22,8,6),BUL=new THREE.BoxGeometry(.12,.12,.7),ROC=new THREE.CylinderGeometry(.14,.14,.8,6),FXG=new THREE.SphereGeometry(1,12,8);
function startMatch(){
 document.activeElement?.blur();resetInput();mouse={x:W/2,y:H/2};paused=false;$('#pause').classList.add('hide');$('#garage-hint').classList.add('hide');if(G)clearArena();mode='arena';$('#gp').classList.add('hide');$('#hud').classList.remove('hide');$('#end').classList.add('hide');
 $('#touch').classList.toggle('hide',!matchMedia('(pointer:coarse)').matches);$('#bd').classList.toggle('hide',stats(build).M.k!=='dash');const arena=ARENAS.find(a=>a.id===settings.arena);scene.background=new THREE.Color(arena.fog);scene.fog.color.setHex(arena.fog);
 const ground=new THREE.Mesh(new THREE.CircleGeometry(R_ARENA+4,48),mat(arena.ground));ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;scene.add(ground);
 const grid=new THREE.GridHelper(R_ARENA*2,28,0x3d4658,0x2f3646);grid.position.y=.02;scene.add(grid);
 const zone=new THREE.Mesh(new THREE.CylinderGeometry(R_ARENA,R_ARENA,7,48,1,true),new THREE.MeshBasicMaterial({color:0xef4444,transparent:true,opacity:.22,side:THREE.DoubleSide}));zone.position.y=3.5;scene.add(zone);
 G={ents:[],obst:[],proj:[],beams:[],fx:[],kits:[],feed:[],t:0,cd:3.2,over:false,shown:false,zr:40,stage:0,phase:'wait',timer:18,r0:40,r1:40,ground,grid,zone,stages:[{w:18,s:14,r:27},{w:14,s:12,r:16},{w:12,s:10,r:8},{w:10,s:8,r:3}]};
 for(let i=0;i<arena.cover;i++){const r=rnd(1.2,2.8),a=rnd(0,6.283),d=rnd(6,36),o={x:Math.cos(a)*d,z:Math.sin(a)*d,r};
  if(G.obst.some(q=>Math.hypot(q.x-o.x,q.z-o.z)<q.r+o.r+3))continue;
  const m=i%2?new THREE.Mesh(new THREE.BoxGeometry(r*1.7,r*2,r*1.7),mat(0x475569)):new THREE.Mesh(new THREE.CylinderGeometry(r,r,r*2.2,10),mat(0x52627a));m.position.set(o.x,r,o.z);m.castShadow=true;m.receiveShadow=true;const trim=new THREE.Mesh(new THREE.BoxGeometry(r*1.8,.08,r*1.8),new THREE.MeshBasicMaterial({color:arena.accent}));trim.position.y=r*.7;m.add(trim);scene.add(m);o.mesh=m;G.obst.push(o)}
 for(let i=0;i<10;i++){const a=rnd(0,6.283),d=rnd(4,34),m=new THREE.Mesh(new THREE.BoxGeometry(.8,.8,.8),new THREE.MeshBasicMaterial({color:0x22c55e}));m.position.set(Math.cos(a)*d,.7,Math.sin(a)*d);scene.add(m);G.kits.push({x:m.position.x,z:m.position.z,m})}
 for(let i=0;i<settings.bots+1;i++){const a=i/(settings.bots+1)*6.283+.3,p=i===0,b=p?build:randBuild(85),col=p?PAL[b.col]:PAL[ri(8)],e=mkEnt(b,col,p?'Ty':NAMES[i%NAMES.length],p);e.x=Math.cos(a)*31;e.z=Math.sin(a)*31;e.aim=Math.atan2(-e.x,-e.z);e.face=e.aim;G.ents.push(e);scene.add(e.model.g)}
 G.player=G.ents[0];G.ents.forEach(e=>{e.ai.err=settings.difficulty==='easy'?.35:settings.difficulty==='hard'?.035:.13;});camP.x=G.player.x;camP.z=G.player.z;orbit=createOrbit(G.player.aim);updateCamera(G.player,1);}
function mkEnt(b,col,name,isP){const S=stats(b);return{name,isP,b,S,col,magazines:createMagazines(S.G),x:0,z:0,vx:0,vz:0,aim:0,face:0,hp:S.hp,max:S.hp,shield:S.M.k==='shield'?60:0,shMax:S.M.k==='shield'?60:0,shT:0,cd:[0,0],dashCd:0,dashT:0,dx:0,dz:0,alive:true,kills:0,place:0,rad:Math.max(.95,S.B.s[0]/2+.25),
  model:mkMech(b,col),ai:{tgt:null,tt:0,str:1,st:rnd(1,3),err:rnd(.04,.14),hit:0},walk:0,lastHit:0,slow:0}}
function clearArena(){[G.ground,G.grid,G.zone,...G.obst.map(o=>o.mesh),...G.kits.map(k=>k.m),...G.ents.map(e=>e.model.g),...G.proj.map(p=>p.m),...G.beams.map(b=>b.m),...G.fx.map(f=>f.m)].forEach(o=>{if(o){scene.remove(o);disposeTree(o);}});G=null}
const alive=()=>G.ents.filter(e=>e.alive);
function feed(t){G.feed.push({t,l:5});if(G.feed.length>5)G.feed.shift()}
function boom(x,z,r,col=0xfbbf24){if(G.fx.length>40)return;const m=new THREE.Mesh(FXG,new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.8}));m.position.set(x,1.2,z);scene.add(m);G.fx.push({m,r,l:.4,t:.4})}
function hurt(e,d,src){if(!e.alive||G.cd>0)return;
 if(e.shield>0){const a=Math.min(e.shield,d);e.shield-=a;d-=a}e.shT=5;const actual=Math.min(e.hp,d);e.hp-=d;if(src&&src!==e&&src.alive&&src.S.M.k==='vamp')src.hp=Math.min(src.max,src.hp+actual*.1);e.lastHit=.6;if(e.isP){$('#flash').style.opacity=.9;setTimeout(()=>$('#flash').style.opacity=0,120)}
 if(e.hp<=0){e.alive=false;e.hp=0;e.place=alive().length+1;scene.remove(e.model.g);boom(e.x,e.z,3.2,0xf97316);if(src&&src!==e)src.kills++;feed(`${src&&src!==e?src.name+' ✕ ':'💀 '}${e.name}`);if(e.isP)sfx(80,.5,'sawtooth',.06);else if(Math.hypot(e.x-G.player.x,e.z-G.player.z)<30)sfx(120,.3,'sawtooth',.04)}}
function explode(x,z,r,d,own){boom(x,z,r);G.ents.forEach(e=>{if(!e.alive)return;const dd=Math.hypot(e.x-x,e.z-z);if(dd<r+e.rad)hurt(e,d*(1-.6*dd/(r+e.rad)),own)})}
function muzzle(e,i){const result=aimFromMount({x:e.x,z:e.z+e.model.top.position.z,aim:e.aim},e.model.muzzleSlots[i],e.target||{x:e.x+Math.sin(e.aim)*30,z:e.z+Math.cos(e.aim)*30});result.y+=e.model.g.position.y;const distance=Math.hypot((e.target?.x??result.x)-result.x,(e.target?.z??result.z)-result.z);result.slope=distance>.01?((e.target?.y??result.y)-result.y)/distance:0;return result;}
function shoot(e,i){if(!spendRound(e.magazines[i]))return;e.shots=(e.shots||0)+1;G.shots=(G.shots||0)+1;const g=e.S.G[i],m=muzzle(e,i);e.recoil=.12;if(G.beams.length<35){const flash=new THREE.Mesh(FXG,new THREE.MeshBasicMaterial({color:g.k==='pulse'?0x77eeff:0xffdb85,transparent:true,opacity:.9}));flash.position.set(m.x,m.y,m.z);flash.scale.setScalar(.22);scene.add(flash);G.beams.push({m:flash,l:.05});}
 if(['laser','rail','thermal'].includes(g.k)){const dx=Math.sin(m.angle),dz=Math.cos(m.angle);let best=g.range,hit=null;
  G.obst.forEach(o=>{const ex=o.x-m.x,ez=o.z-m.z,t=ex*dx+ez*dz;if(t>0&&t<best&&ex*ex+ez*ez-t*t<o.r*o.r)best=t});
  G.ents.forEach(t2=>{if(t2===e||!t2.alive)return;const ex=t2.x-m.x,ez=t2.z-m.z,t=ex*dx+ez*dz;if(t>0&&t<best&&ex*ex+ez*ez-t*t<t2.rad*t2.rad){best=t;hit=t2}});
  if(hit)hurt(hit,g.d,e);const b=new THREE.Mesh(new THREE.BoxGeometry(.1,.1,1),new THREE.MeshBasicMaterial({color:g.k==='rail'?0xe9b7ff:g.k==='thermal'?0xff9f52:0x22d3ee}));const beamDirection=new THREE.Vector3(dx,m.slope,dz);b.position.set(m.x+dx*best/2,m.y+m.slope*best/2,m.z+dz*best/2);b.scale.z=best*beamDirection.length();b.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),beamDirection.normalize());scene.add(b);G.beams.push({m:b,l:.07});if(e.isP)sfx(900,.06,'sine',.02);return}
 const n=g.pellets||1;for(let k=0;k<n;k++){const a=m.angle+rnd(-g.sp,g.sp)*(e.S.M.k==='stabilizer'?.45:1),mesh=new THREE.Mesh(['rocket','micro'].includes(g.k)?ROC:['cannon','plasma','pulse','flame'].includes(g.k)?SHELL:BUL,new THREE.MeshBasicMaterial({color:g.k==='plasma'?0xc084fc:g.k==='pulse'?0x7deaff:g.k==='flame'?0xff6b23:g.k==='rocket'?0xf97316:g.k==='cannon'?0xfde047:0xfbbf24}));
  mesh.position.set(m.x,m.y,m.z);if(g.k==='plasma')mesh.scale.setScalar(1.8);if(g.k==='flame')mesh.scale.set(1.5,1.5,2);mesh.rotation.y=a;if(['rocket','micro'].includes(g.k))mesh.rotation.x=Math.PI/2;scene.add(mesh);
  G.proj.push({x:m.x,z:m.z,vx:Math.sin(a)*g.v,vz:Math.cos(a)*g.v,vy:m.slope*g.v,d:g.d,own:e,life:g.range/g.v,sp:g.splash||0,slow:g.slow||0,m:mesh})}
 if(e.isP||Math.hypot(e.x-G.player.x,e.z-G.player.z)<22)sfx(g.k==='cannon'||g.k==='rocket'?150:g.k==='shotgun'?110:380,.07,'square',.02)}
const lerpA=(a,b,t)=>{let d=((b-a+Math.PI)%(2*Math.PI)+2*Math.PI)%(2*Math.PI)-Math.PI;return a+d*clamp(t,0,1)};
const aimRay=new THREE.Raycaster(),aimPlane=new THREE.Plane(new THREE.Vector3(0,1,0),0),aimPoint=new THREE.Vector3();
function aimWorld(center=false){const height=(G?.player.model.aimHeight||2)+(G?.player.model.g.position.y||0);aimPlane.constant=-height;aimRay.setFromCamera(new THREE.Vector2(center?0:mouse.x/W*2-1,center?0:1-mouse.y/H*2),cam);const objects=G?[...G.ents.filter(e=>e.alive&&!e.isP).map(e=>e.model.g),...G.obst.map(o=>o.mesh)]:[];const hit=aimRay.intersectObjects(objects,true)[0];if(hit)return {x:hit.point.x,y:hit.point.y,z:hit.point.z};if(!center&&aimRay.ray.intersectPlane(aimPlane,aimPoint))return {x:aimPoint.x,y:aimPoint.y,z:aimPoint.z};return {x:camP.x+Math.sin(orbit.yaw)*30,y:height,z:camP.z+Math.cos(orbit.yaw)*30};}
function toScreen(x,y,z){const v=new THREE.Vector3(x,y,z).project(cam);return v.z>1?null:{x:(v.x+1)*W/2,y:(1-v.y)*H/2};}
const cameraRay=new THREE.Raycaster();
function updateCamera(player,dt){cam.clearViewOffset();const desired=orbitPosition(camP,orbit),target=new THREE.Vector3(camP.x,1.7,camP.z),delta=new THREE.Vector3(desired.x,desired.y,desired.z).sub(target),length=delta.length();cameraRay.set(target,delta.clone().normalize());cameraRay.far=length;const wall=cameraRay.intersectObjects(G?.obst.map(o=>o.mesh)||[],true)[0];if(wall){delta.setLength(Math.max(.65,wall.distance-.35));}cam.position.copy(target).add(delta);cam.lookAt(camP.x+Math.sin(orbit.yaw)*5,1.9,camP.z+Math.cos(orbit.yaw)*5);cam.updateMatrixWorld();}
function nearestEnemy(e){let b=null,bd=1e9;G.ents.forEach(o=>{if(o===e||!o.alive)return;const d=Math.hypot(o.x-e.x,o.z-e.z);if(d<bd){bd=d;b=o}});return{e:b,d:bd}}

/* ---------- 5. AI BOTÓW ---------- */
function ai(e,dt){const A=e.ai,out={ix:0,iz:0,aim:e.aim,fire:false,dash:false};A.tt-=dt;
 if(A.tt<=0||!A.tgt||!A.tgt.alive){A.tgt=nearestEnemy(e).e;A.tt=1.2}
 A.st-=dt;if(A.st<=0){A.str*=-1;A.st=rnd(1.2,3)}
 const dc=Math.hypot(e.x,e.z);let mx=0,mz=0;
 if(dc>G.zr-5){mx=-e.x/dc;mz=-e.z/dc;if(e.S.M.k==='dash'&&e.dashCd<=0&&dc>G.zr+1)out.dash=true}
 else if(e.hp<e.max*.45){let k=null,kd=40;G.kits.filter(q=>q.m.visible!==false).forEach(q=>{const d=Math.hypot(q.x-e.x,q.z-e.z);if(d<kd){kd=d;k=q}});if(k){mx=(k.x-e.x)/kd;mz=(k.z-e.z)/kd}}
 const t=A.tgt;if(t){const dx=t.x-e.x,dz=t.z-e.z,d=Math.hypot(dx,dz)||1,want=e.S.rng*.65,g0=e.S.G[0];
  if(!mx&&!mz){const k=d>want?1:d<want*.55?-1:0;mx=dx/d*k-dz/d*A.str*.8;mz=dz/d*k+dx/d*A.str*.8}
  const sp=Math.max(g0.v||60,g1v(e));const lead=d/sp;out.aim=Math.atan2(dx+t.vx*lead+rnd(-1,1)*A.err*d*.3,dz+t.vz*lead+rnd(-1,1)*A.err*d*.3);
  out.target={x:e.x+Math.sin(out.aim)*d,z:e.z+Math.cos(out.aim)*d};
  out.fire=d<e.S.rng*1.05&&Math.abs(((out.aim-e.aim+Math.PI)%(2*Math.PI)+2*Math.PI)%(2*Math.PI)-Math.PI)<.25&&G.cd<=0;
  if(e.lastHit>0&&e.S.M.k==='dash'&&e.dashCd<=0&&Math.random()<.02){out.dash=true}}
 else{const l=Math.hypot(mx,mz);if(!l){mx=-e.x/(dc||1);mz=-e.z/(dc||1)}}
 // omijanie przeszkód
 G.obst.forEach(o=>{const dx=e.x-o.x,dz=e.z-o.z,d=Math.hypot(dx,dz);if(d>0&&d<o.r+3.2){mx+=dx/d*1.5;mz+=dz/d*1.5}});
 out.ix=mx;out.iz=mz;return out}
const g1v=e=>Math.max(e.S.G[1].v||60);

/* ---------- aktualizacja gry ---------- */
function update(dt){const g=G;if(paused||g.over)return;g.t+=dt;
 if(g.cd>0){g.cd-=dt;$('#cd').classList.toggle('hide',g.cd<=0);$('#cd').textContent=g.cd>2.2?'3':g.cd>1.2?'2':g.cd>.2?'1':'WALKA!';if(g.cd<=0)$('#cd').classList.add('hide')}
 // strefa
 if(g.cd<=0&&g.stage<g.stages.length){g.timer-=dt;const s=g.stages[g.stage];
  if(g.phase==='wait'&&g.timer<=0){g.phase='shrink';g.timer=s.s;g.r0=g.zr;g.r1=s.r}
  else if(g.phase==='shrink'){g.zr=g.r0+(g.r1-g.r0)*(1-Math.max(0,g.timer)/s.s);if(g.timer<=0){g.zr=g.r1;g.stage++;g.phase='wait';g.timer=g.stages[g.stage]?g.stages[g.stage].w:0}}}
 g.zone.scale.set(g.zr/R_ARENA,1,g.zr/R_ARENA);
 const zdps=3+g.stage*3;
 g.ents.forEach(e=>{if(!e.alive)return;tickMagazines(e.magazines,dt);
  let c;if(e.isP){const k=keys;let ix=(k.d||k.arrowright?1:0)-(k.a||k.arrowleft?1:0)+touch.mx,iz=(k.s||k.arrowdown?1:0)-(k.w||k.arrowup?1:0)+touch.mz;c={ix,iz,fire:mdown||touch.fire||touch.aiming||!!k.q,fireRight:!!k.e,dash:!!(k[' ']||touch.dash)};
   const movement=screenMotion(c.ix,c.iz,orbit.yaw);c.ix=movement.x;c.iz=movement.z;
   if(touch.aiming){const direction=screenMotion(touch.ax,touch.az,orbit.yaw);c.aim=Math.atan2(direction.x,direction.z);c.target={x:e.x+direction.x*30,z:e.z+direction.z*30};}else if((touch.fire&&!mdown)||settings.assist){const n=nearestEnemy(e);if(n.e){c.target={x:n.e.x,y:n.e.model.aimHeight+n.e.model.g.position.y,z:n.e.z};c.aim=Math.atan2(n.e.x-e.x,n.e.z-e.z);}}else{c.target=aimWorld(rightDown);c.aim=Math.atan2(c.target.x-e.x,c.target.z-e.z);}
   if(c.aim===undefined)c.aim=e.aim}
  else c=ai(e,dt);
  if(g.cd>0){c.fire=false;c.fireRight=false;c.dash=false;c.ix=c.iz=0}
  const L=Math.hypot(c.ix,c.iz);if(L>1){c.ix/=L;c.iz/=L}
  e.target=c.target||{x:e.x+Math.sin(c.aim)*30,z:e.z+Math.cos(c.aim)*30};e.aim=lerpA(e.aim,c.aim,dt*(e.isP?18:8));
  e.dashCd-=dt;if(c.dash&&e.S.M.k==='dash'&&e.dashCd<=0){e.dashCd=3;e.dashT=.25;e.dx=L>.1?c.ix:Math.sin(e.aim);e.dz=L>.1?c.iz:Math.cos(e.aim);if(e.isP)sfx(220,.2,'sawtooth',.04)}
  if(e.dashT>0){e.dashT-=dt;e.vx=e.dx*e.S.spd*3.2;e.vz=e.dz*e.S.spd*3.2}else{e.vx+=(c.ix*e.S.spd*(e.slow>0?.55:1)-e.vx)*Math.min(1,dt*7);e.vz+=(c.iz*e.S.spd*(e.slow>0?.55:1)-e.vz)*Math.min(1,dt*7)}
  e.x+=e.vx*dt;e.z+=e.vz*dt;
  g.obst.forEach(o=>{const dx=e.x-o.x,dz=e.z-o.z,d=Math.hypot(dx,dz),m=o.r+e.rad;if(d<m&&d>0){e.x=o.x+dx/d*m;e.z=o.z+dz/d*m}});
  g.ents.forEach(o=>{if(o===e||!o.alive)return;const dx=e.x-o.x,dz=e.z-o.z,d=Math.hypot(dx,dz),m=e.rad+o.rad;if(d<m&&d>0){const p=(m-d)/2;e.x+=dx/d*p;e.z+=dz/d*p;o.x-=dx/d*p;o.z-=dz/d*p}});
  const dd=Math.hypot(e.x,e.z);if(dd>R_ARENA-1){e.x*=(R_ARENA-1)/dd;e.z*=(R_ARENA-1)/dd}
  e.cd[0]-=dt;e.cd[1]-=dt;for(let i=0;i<2;i++)if((c.fire||(i===1&&c.fireRight))&&e.cd[i]<=0){if(e.isP&&keys.q&&!mdown&&!touch.fire&&!touch.aiming&&i===1&&!c.fireRight)continue;shoot(e,i);e.cd[i]=1/(e.S.G[i].r*e.S.rate);}e.slow=Math.max(0,e.slow-dt);
  e.lastHit-=dt;e.shT-=dt;if(e.shMax&&e.shT<=0)e.shield=Math.min(e.shMax,e.shield+12*dt);if(e.S.M.k==='repair')e.hp=Math.min(e.max,e.hp+2*dt);if(e.S.M.k==='patch'&&!e.patched&&e.hp>0&&e.hp<e.max*.3){e.hp=Math.min(e.max,e.hp+e.max*.22);e.patched=true;boom(e.x,e.z,1.4,0x79d8b5);}
  if(Math.hypot(e.x,e.z)>g.zr&&g.cd<=0){e.hp-=zdps*dt;if(e.isP)$('#flash').style.opacity=.5;if(e.hp<=0){e.hp=0;e.alive=false;e.place=alive().length+1;scene.remove(e.model.g);boom(e.x,e.z,3,0xef4444);feed(`🔴 Strefa ✕ ${e.name}`)}}
  g.kits.forEach(k=>{if(e.alive&&k.m.visible!==false&&e.hp<e.max&&Math.hypot(k.x-e.x,k.z-e.z)<1.8){e.hp=Math.min(e.max,e.hp+45);k.m.visible=false;k.m.position.y=-9;if(e.isP)sfx(660,.15,'sine',.04)}});
  // modele
  const m=e.model;m.g.position.set(e.x,e.S.L.k==='hover'?.14+Math.sin(g.t*4)*.06:0,e.z);m.top.rotation.y=e.aim;e.recoil=Math.max(0,(e.recoil||0)-dt);m.top.position.z=-e.recoil*.5;const sp=Math.hypot(e.vx,e.vz);if(sp>.6)e.face=lerpA(e.face,Math.atan2(e.vx,e.vz),dt*8);m.lg.rotation.y=e.face;e.walk+=sp*dt*1.6;
  m.animate(e.walk,sp,e.magazines);m.weaponPivots.forEach((pivot,i)=>{pivot.rotation.x=e.magazines[i].reload>0?-.2:0;});m.weaponPivots.forEach((pivot,i)=>{pivot.rotation.y=muzzle(e,i).angle-e.aim;});
  if(m.sh)m.sh.visible=e.shield>1});
 // pociski
 for(let i=g.proj.length-1;i>=0;i--){const p=g.proj[i];const oldX=p.x,oldZ=p.z;p.x+=p.vx*dt;p.z+=p.vz*dt;p.life-=dt;p.m.position.x=p.x;p.m.position.z=p.z;p.m.position.y+=(p.vy||0)*dt;let dead=p.m.position.y<.05||p.life<=0||Math.hypot(p.x,p.z)>R_ARENA+3;
  if(!dead)dead=g.obst.some(o=>segmentCircle(oldX,oldZ,p.x,p.z,o.x,o.z,o.r));
  if(!dead)for(const e of g.ents){if(e===p.own||!e.alive)continue;if(segmentCircle(oldX,oldZ,p.x,p.z,e.x,e.z,e.rad)){dead=true;if(!p.sp)hurt(e,p.d,p.own);if(p.slow)e.slow=p.slow;break}}
  if(dead){if(p.sp)explode(p.x,p.z,p.sp,p.d,p.own);scene.remove(p.m);p.m.material.dispose();g.proj.splice(i,1)}}
 for(let i=g.beams.length-1;i>=0;i--){g.beams[i].l-=dt;if(g.beams[i].l<=0){scene.remove(g.beams[i].m);disposeTree(g.beams[i].m);g.beams.splice(i,1)}}
 for(let i=g.fx.length-1;i>=0;i--){const f=g.fx[i];f.l-=dt;const k=1-f.l/f.t;f.m.scale.setScalar(.4+f.r*k);f.m.material.opacity=.8*(1-k);if(f.l<=0){scene.remove(f.m);f.m.material.dispose();g.fx.splice(i,1)}}
 g.feed.forEach(f=>f.l-=dt);g.feed=g.feed.filter(f=>f.l>0);
 // koniec gry
 const al=alive();if(!g.over&&(al.length<=1||!g.player.alive)){if(al.length<=1){g.over=true;finish()}else if(!g.shown){g.shown=true;g.endDelay=1.6}}
 if(g.endDelay!==undefined){g.endDelay-=dt;if(g.endDelay<=0){g.over=true;finish();}}
 // kamera
 const pl=g.player.alive?g.player:(al[0]||g.player);camP.x+=(pl.x-camP.x)*Math.min(1,dt*6);camP.z+=(pl.z-camP.z)*Math.min(1,dt*6);updateCamera(pl,dt)}
function finish(){resetInput();$('#cd').classList.add('hide');const p=G.player,win=p.alive;if(win)p.place=1;
 $('#eb').innerHTML=`<h1>${win?'🏆 ZWYCIĘSTWO!':'💥 Mech zniszczony'}</h1><p style="font-size:18px">Miejsce: <b>#${p.place||'?'}</b> z ${settings.bots+1}<br>Zniszczeni przeciwnicy: <b>${p.kills}</b><br>Czas: <b>${Math.round(G.t)} s</b></p><button class="btn" id="ag">🔁 Jeszcze raz</button><button class="btn s" id="gr">🔧 Wróć do garażu</button>`;
 $('#end').classList.remove('hide');$('#ag').onclick=startMatch;$('#gr').onclick=toGarage}
function toGarage(){resetInput();paused=false;$('#pause').classList.add('hide');$('#garage-hint').classList.remove('hide');if(G)clearArena();mode='garage';$('#end').classList.add('hide');$('#hud').classList.add('hide');$('#cd').classList.add('hide');$('#gp').classList.remove('hide');garCam();renderGarage();showGarMech()}

/* ---------- 6. HUD, wejście, pętla ---------- */
function hud(){const g=G,p=g.player,al=alive().length,s=g.stages[g.stage];
 $('#top').textContent=`Żywych: ${al}/${settings.bots+1} · ${g.cd>0?'przygotuj się…':!s?'Ostatnia strefa!':g.phase==='wait'?`Strefa zwęża się za ${Math.ceil(Math.max(0,g.timer))} s`:'⚠️ Strefa się zwęża!'}`;
 $('#me').innerHTML=`<b>${p.alive?'Twój mech':'Obserwujesz'}</b>`+bar('HP',p.hp,p.max,'#3fb950')+(p.shMax?bar('Tarcza',p.shield,p.shMax,'#38bdf8'):'')+`<div>🔫 ${p.S.G[0].n} / ${p.S.G[1].n}${p.S.M.k==='dash'?' · dopalacze '+(p.dashCd>0?'odnawiają się':'gotowe'):''}</div>`;
 $('#ammo-state').textContent=p.magazines.map((m,i)=>`${i?'Prawa':'Lewa'} broń: ${m.reload>0?'przeładowanie…':m.remaining===m.capacity?'gotowa':m.remaining/m.capacity<.3?'kończy się amunicja':'amunicja dostępna'}`).join(' · ');$('#reload-btn').disabled=g.over||paused||g.cd>0||p.magazines.every(m=>m.reload>0||m.remaining===m.capacity);
 $('#feed').innerHTML=g.feed.map(f=>`<div>${f.t}</div>`).join('');
 const hc=$('#hc').getContext('2d');hc.clearRect(0,0,W,H);hc.font='bold 12px system-ui';hc.textAlign='center';
 g.ents.forEach(e=>{if(!e.alive||e===p)return;const s2=toScreen(e.x,e.model.height+.25,e.z);if(!s2)return;hc.fillStyle='#000a';hc.fillRect(s2.x-24,s2.y-4,48,7);hc.fillStyle='#ef4444';hc.fillRect(s2.x-23,s2.y-3,46*e.hp/e.max,5);hc.fillStyle='#fff';hc.fillText(e.name,s2.x,s2.y-9)});
 if(p.alive&&!matchMedia('(pointer:coarse)').matches){const x=rightDown?W/2:mouse.x,y=rightDown?H/2:mouse.y;hc.strokeStyle='#e6fbff';hc.beginPath();hc.arc(x,y,9,0,7);hc.moveTo(x-14,y);hc.lineTo(x-5,y);hc.moveTo(x+5,y);hc.lineTo(x+14,y);hc.moveTo(x,y-14);hc.lineTo(x,y-5);hc.moveTo(x,y+5);hc.lineTo(x,y+14);hc.stroke();}
 const m=$('#mm').getContext('2d'),k=140/R_ARENA;m.clearRect(0,0,300,300);m.save();m.translate(150,150);m.scale(1,1);m.strokeStyle='#ef4444';m.lineWidth=3;m.beginPath();m.arc(0,0,g.zr*k,0,7);m.stroke();m.fillStyle='#64748b';g.obst.forEach(o=>{m.beginPath();m.arc(o.x*k,o.z*k,o.r*k,0,7);m.fill()});
 m.fillStyle='#22c55e';g.kits.forEach(q=>{if(q.m.visible!==false)m.fillRect(q.x*k-3,q.z*k-3,6,6)});
 g.ents.forEach(e=>{if(!e.alive)return;m.fillStyle=e.isP?'#fff':'#ef4444';m.beginPath();m.arc(e.x*k,e.z*k,e.isP?8:6,0,7);m.fill()});m.restore()}
const bar=(l,v,m,c)=>`<div>${l==='HP'?(v/m>.7?'Pancerz sprawny':v/m>.3?'Widoczne uszkodzenia':'Krytyczne uszkodzenia'):(v/m>.7?'Osłona pełna':v>0?'Osłona osłabiona':'Osłona wyczerpana')}</div><div class="bar"><i style="width:${v/m*100}%;background:${c}"></i></div>`;
let rightDown=false;const clearSticks=[];
function resetInput(){for(const clear of clearSticks)clear();keys={};mdown=false;rightDown=false;orbitDrag=null;orbitTouch=null;drag=false;Object.assign(touch,{mx:0,mz:0,fire:false,dash:false,aiming:false,ax:0,az:1});document.querySelectorAll('#knob,#aim-knob').forEach(n=>n.style.transform='');}
function setPaused(value){if(mode!=='arena'||!G||G.over)return;paused=value;resetInput();$('#pause').classList.toggle('hide',!paused);if(paused)$('#resume').focus();else document.activeElement?.blur();}
$('#reload-btn').onclick=()=>{document.activeElement?.blur();if(G&&!paused&&!G.over&&G.cd<=0)reloadMagazines(G.player.magazines);};
$('#pause-btn').onclick=()=>setPaused(true);$('#resume').onclick=()=>setPaused(false);$('#back-garage').onclick=toGarage;
addEventListener('keydown',e=>{if(e.target.matches('input,select,textarea,button')){if(!['Escape','KeyP'].includes(e.code))return;}if(mode!=='arena')return;if(e.code==='KeyR'&&!e.repeat&&!paused&&G&&!G.over&&G.cd<=0){reloadMagazines(G.player.magazines);e.preventDefault();return;}const key=({KeyW:'w',KeyA:'a',KeyS:'s',KeyD:'d',KeyQ:'q',KeyE:'e',Space:' '})[e.code]||e.key.toLowerCase();if([' ','arrowup','arrowdown','arrowleft','arrowright'].includes(key))e.preventDefault();if(['Escape','KeyP'].includes(e.code)){if(!e.repeat)setPaused(!paused);return;}if(!paused)keys[key]=true;});
addEventListener('keyup',e=>{keys[({KeyW:'w',KeyA:'a',KeyS:'s',KeyD:'d',KeyQ:'q',KeyE:'e',Space:' '})[e.code]||e.key.toLowerCase()]=false;});
addEventListener('blur',()=>{resetInput();setPaused(true);});document.addEventListener('visibilitychange',()=>{if(document.hidden){resetInput();setPaused(true);}});
const cv=$('#c');cv.addEventListener('contextmenu',e=>e.preventDefault());
cv.addEventListener('pointerdown',e=>{if(mode==='arena'&&!paused&&!G.over){if(e.pointerType==='touch')orbitTouch={id:e.pointerId,x:e.clientX,y:e.clientY};cv.setPointerCapture(e.pointerId);}else if(mode==='garage'){drag=e.clientX;cv.setPointerCapture(e.pointerId);}});
cv.addEventListener('mousedown',e=>{if(e.sourceCapabilities?.firesTouchEvents||mode!=='arena'||paused||G.over)return;if(e.button===2){rightDown=true;orbitDrag={x:e.clientX,y:e.clientY};}else if(e.button===0){mdown=true;mouse.x=e.clientX;mouse.y=e.clientY;}});
addEventListener('mouseup',e=>{if(e.button===0)mdown=false;if(e.button===2){rightDown=false;orbitDrag=null;}});
function releasePointer(e){if(orbitTouch?.id===e.pointerId)orbitTouch=null;mdown=false;rightDown=false;orbitDrag=null;drag=false;}
addEventListener('pointerup',releasePointer);cv.addEventListener('pointercancel',releasePointer);cv.addEventListener('lostpointercapture',releasePointer);
addEventListener('pointermove',e=>{if(mode==='arena'&&!paused&&!G.over){const active=e.pointerType==='touch'&&orbitTouch?.id===e.pointerId?orbitTouch:rightDown?orbitDrag:null;if(active){rotateOrbit(orbit,e.clientX-active.x,e.clientY-active.y);active.x=e.clientX;active.y=e.clientY;return;}}if(e.pointerType!=='touch'){mouse.x=e.clientX;mouse.y=e.clientY;}if(mode==='garage'&&drag!==false){gyaw+=(e.clientX-drag)*.01;drag=e.clientX;}});
cv.addEventListener('wheel',e=>{if(mode==='arena'&&!paused&&!G.over){e.preventDefault();orbit.distance=clamp(orbit.distance+e.deltaY*.01,6,16);}},{passive:false});
function stick(id,knobId,aim){const el=$(id),knob=$(knobId);let pointer=null;function move(e){if(paused||mode!=='arena'||!G||G.over)return;const r=el.getBoundingClientRect(),dx=e.clientX-r.left-r.width/2,dz=e.clientY-r.top-r.height/2,l=Math.hypot(dx,dz),amount=Math.min(1,l/(r.width*.36)),x=l?dx/l*amount:0,z=l?dz/l*amount:0;knob.style.transform=`translate(${x*r.width*.3}px,${z*r.width*.3}px)`;if(aim){touch.aiming=amount>.15;touch.ax=x;touch.az=z;}else{touch.mx=Math.abs(x)<.1?0:x;touch.mz=Math.abs(z)<.1?0:z;}}function end(e){if(e.pointerId!==pointer)return;pointer=null;knob.style.transform='';if(aim)touch.aiming=false;else touch.mx=touch.mz=0;}clearSticks.push(()=>{pointer=null;});el.addEventListener('pointerdown',e=>{if(paused||!G||G.over)return;pointer=e.pointerId;el.setPointerCapture(pointer);move(e);});el.addEventListener('pointermove',e=>{if(e.pointerId===pointer)move(e);});for(const event of ['pointerup','pointercancel','lostpointercapture'])el.addEventListener(event,end);}
stick('#joy','#knob',false);stick('#aim-joy','#aim-knob',true);
for(const [id,key]of [['#bf','fire'],['#bd','dash']]){const el=$(id);el.addEventListener('pointerdown',e=>{if(paused||!G||G.over)return;touch[key]=true;el.setPointerCapture(e.pointerId);});for(const event of ['pointerup','pointercancel','lostpointercapture'])el.addEventListener(event,()=>touch[key]=false);}
export const projectArenaPoint=(x,y,z)=>toScreen(x,y,z);
export function mechSnapshot(){return {mode,paused,camera:{...orbit,x:cam.position.x,y:cam.position.y,z:cam.position.z,dragging:!!orbitDrag},aim:G?.player.target?{...G.player.target}:null,guns:G?G.player.model.muzzleSlots.map((_,i)=>({...muzzle(G.player,i),kind:G.player.S.G[i].k})):[],settings:{...settings},build:{...build},cost:costOf(build),time:G?.t||0,countdown:G?.cd||0,projectiles:G?.proj.length||0,shots:G?.shots||0,playerShots:G?.player.shots||0,magazines:G?.player.magazines.map(m=>({...m}))||[],alive:G?alive().length:0,over:!!G?.over,entities:G?.ents.map(e=>({name:e.name,hp:e.hp,alive:e.alive,x:e.x,z:e.z}))||[],input:{...touch,mdown,keys:{...keys}}};}
let last=performance.now(),lastHud=0;
function loop(now){requestAnimationFrame(loop);const dt=Math.min(.05,(now-last)/1000);last=now;
 if(mode==='garage'){if(garMech){gyaw+=dt*.35*(drag===false&&!matchMedia('(prefers-reduced-motion: reduce)').matches?1:0);garMech.g.rotation.y=gyaw}renderer.render(gscene,cam)}
 else if(G){if(!paused&&!G.over)update(dt);if(now-lastHud>80){hud();lastHud=now;}renderer.render(scene,cam)}}
resize();garCam();renderGarage();showGarMech();requestAnimationFrame(loop);
