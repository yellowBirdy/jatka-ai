import {damageStage,damageBarrel,interactionSurface,BODY_ABILITIES,activateBody,tickBody,canFireWeapon,tickWeapons,boxHitTime,coverBeamDistance,paintFor,steerRocket,liftHeight} from './mechy2-upgrades.js?v=mechs-73';
import {createAuraPlayer} from './mechy2-music.js?v=mechs-73';
import {createMech} from './mechy2-models.js?v=mechs-73';
import {MAPS,createArena,terrainHeight} from './mechy2-maps.js?v=mechs-73';
import {createAmmo,spendRound,tickAmmo,reloadAmmo} from './mechy2-ammo.js?v=mechs-73';
import {createView,rotateView,moveRelative,cameraPosition} from './mechy2-camera.js?v=mechs-73';
import {weaponAim,segmentHitTime,beamHitDistance} from './mechy2-aim.js?v=mechs-73';
import {createFullscreenController} from './mechy2-fullscreen.js?v=mechs-73';
import {RAR,LEGS,BODY,HEAD,WPN,SP,MAGE,CAT,CRATES,MAGE_PRICE,WIN_GOLD,CODES,PAL,ACC,NAMES,hex} from './mechy2-data.js?v=mechs-73';
import {fresh,validState,buyCrate,redeemCode,completeMatch} from './mechy2-state.js?v=mechs-73';
'use strict';
/* =====================================================================
 *  MECHY – losuj części, zdobywaj złoto, otwieraj skrzynki i wygrywaj Battle Royale
 *  1 Dane | 2 Zapis i ekonomia | 3 Statystyki | 4 Modele 3D | 5 Garaż i sklep | 6 Arena | 7 AI | 8 HUD
 * ===================================================================== */
const $=s=>document.querySelector(s),clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),rnd=(a,b)=>a+Math.random()*(b-a),ri=n=>Math.floor(Math.random()*n);

/* ---------- 1. DANE ---------- */
let SV;try{const raw=localStorage.getItem('mechy2');const parsed=raw?JSON.parse(raw):null;if(validState(parsed))SV=parsed;else{if(raw)localStorage.setItem('mechy2.invalid-backup',raw);SV=fresh();}}catch{SV=fresh();}
const save=()=>{try{localStorage.setItem('mechy2',JSON.stringify(SV));$('#save-status').textContent='';}catch{$('#save-status').textContent='Zapis niedostępny — postęp pozostanie tylko w tej karcie.';}};
const part=id=>SV.inv.find(p=>p.id===id);
const equipped=()=>({legs:part(SV.eq.legs),body:part(SV.eq.body),head:part(SV.eq.head),gl:part(SV.eq.gl),gr:part(SV.eq.gr),sp:part(SV.eq.sp),mage:SV.mage});
const isEq=p=>Object.values(SV.eq).includes(p.id);
function openCrate(ci){const p=buyCrate(SV,ci);if(p)save();return p;}
/* ---------- 3. STATYSTYKI ---------- */
const mm=p=>RAR[p.r].m;
function stats(R){const L=LEGS[R.legs.t],B=BODY[R.body.t],Hd=HEAD[R.head.t],mL=mm(R.legs),mB=mm(R.body),mH=mm(R.head),MG=MAGE[R.mage],z=MG.k==='zie';
 const hd={dmg:Hd.dmg*mH||0,rng:Hd.range*mH||0,rate:Hd.rate*mH||0,spd:Hd.spd*mH||0};
 const hp=(B.hp*mB+L.hp*mL+(Hd.hp?Hd.hp*mH:0))*(z?1.15:1),spd=Math.max(2.8,L.spd*Math.pow(mL,.4)-B.m)*(1+hd.spd);
 const G=[R.gl,R.gr].map(p=>{const w=WPN[p.t],m=mm(p);return{...w,d:w.d*m*(1+hd.dmg),r:w.r*(1+hd.rate)*Math.pow(m,.25),range:w.range*Math.pow(m,.25)*(1+hd.rng)}});
 const sp=SP[R.sp.t],spm=mm(R.sp);
 return{hp,spd,arm:clamp(B.arm*mB+(z?.12:0),0,.55),G,rng:Math.min(G[0].range,G[1].range),dps:G.reduce((a,g)=>a+g.d*g.r*(g.pellets||1),0),sp,spm,spCd:sp.cd/Math.sqrt(spm),mage:MG,B,L,H:Hd,s:B.s,R}}
const avgR=R=>['legs','body','head','gl','gr','sp'].reduce((a,k)=>a+R[k].r,0)/6;
const rp=(slot,r)=>({id:0,slot,t:ri(CAT[slot].length),r});
function botR(avg){const r=()=>clamp(Math.round(avg+rnd(-1.4,1)),0,5);return{legs:rp('legs',r()),body:rp('body',r()),head:rp('head',r()),gl:rp('wpn',r()),gr:rp('wpn',r()),sp:rp('sp',r()),mage:ri(MAGE.length)}}
const descriptions={legs:['Szybki przejazd i lekka konstrukcja.','Uniwersalny, kroczący układ.','Stabilna postawa na czterech podporach.','Ciężki, odporny układ gąsienicowy.'],body:['Lekka, zwrotna rama.','Zrównoważony pancerz do wielu zestawów.','Grube osłony i masywna konstrukcja.','Wzmocniona rama do natarcia.'],head:['Osłania kokpit.','Ułatwia precyzyjny ostrzał.','Przyspiesza pracę uzbrojenia.','Wspiera mobilność i rozpoznanie.'],wpn:['Równe serie na średnim dystansie.','Przytrzymaj ogień, aby naładować ciężki strzał.','Precyzyjna wiązka; przegrzany laser wymaga schłodzenia.','Eksplodujące rakiety naprowadzane na widoczny cel.','Rozproszony ostrzał z bliska.','Strumień ognia do bliskiej walki.'],sp:['Krótki unik z dopalaczem.','Tymczasowa osłona energetyczna.','Stopniowa naprawa uszkodzeń.','Chwilowe wzmocnienie ostrzału.','Impuls zatrzymujący pobliskich rywali.']};
const mageDescriptions=['Trafienia podpalają przeciwników.','Trafienia spowalniają przeciwników.','Część trafień wywołuje dodatkowy łuk energii.','Odzyskuje energię z zadanych obrażeń.','Czasami unika nadchodzącego trafienia.','Wzmacnia pancerz i wytrzymałość.'];
function pinfo(p){return descriptions[p.slot][p.t]+(p.slot==='body'?(p.r>=4?' '+BODY_ABILITIES[p.t].name+': '+BODY_ABILITIES[p.t].description:' Zdolność korpusu dostępna od rzadkości legendarnej.'):'');}
/* ---------- 4. MODELE 3D ---------- */
const MATS={};const mat=(c,e)=>MATS[c+'_'+(e||0)]||(MATS[c+'_'+(e||0)]=new THREE.MeshLambertMaterial({color:new THREE.Color(c).convertSRGBToLinear(),emissive:e||0}));
const glow=c=>MATS['g'+c]||(MATS['g'+c]=new THREE.MeshBasicMaterial({color:c}));
const LH=1.1,DK=0x2b313a,GLASS=0x1e6f82;
function mkMech(R,colHex,accHex,custom=true){return createMech(stats(R),colHex,accHex,parseInt(RAR[R.body.r].c.slice(1),16),custom?Object.fromEntries(['body','legs','gl','gr'].map(k=>[k,PAL[paintFor(SV,k)]])):{});}

/* ---------- renderer ---------- */
let renderer;try{renderer=new THREE.WebGLRenderer({canvas:$('#c'),antialias:true});}catch(error){$('#load-error').classList.remove('hide');throw error;}renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));renderer.outputEncoding=THREE.sRGBEncoding;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;renderer.shadowMap.enabled=!matchMedia('(pointer:coarse)').matches;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
const cam=new THREE.PerspectiveCamera(50,1,.1,200),FOV=50,gscene=new THREE.Scene(),scene=new THREE.Scene();
const music=createAuraPlayer();
const fullscreen=createFullscreenController(document);let view=createView(),viewDrag=null,viewTouch=null;const matchSettings={bots:3,map:'foundry'};
let paused=false;let mode='garage',garMech=null,gyaw=.7,drag=false,W=innerWidth,H=innerHeight;
[gscene,scene].forEach(s=>{s.add(new THREE.AmbientLight(0xffffff,.7));const l=new THREE.DirectionalLight(0xfff1dd,.95);l.position.set(8,20,7);l.castShadow=true;l.shadow.mapSize.set(1024,1024);Object.assign(l.shadow.camera,{left:-48,right:48,top:48,bottom:-48,near:1,far:110});l.shadow.bias=-.001;s.add(l);const l2=new THREE.DirectionalLight(0x5eead4,.45);l2.position.set(-9,6,-8);s.add(l2)});
gscene.background=new THREE.Color(0x06130f);scene.background=new THREE.Color(0x07120f);scene.fog=new THREE.Fog(0x07120f,45,95);
{const gg=new THREE.GridHelper(40,40,0x1c6b57,0x12382f);gg.position.y=-.3;gscene.add(gg);const pl=new THREE.Mesh(new THREE.BoxGeometry(6.4,.2,6.4),mat(0x0f2a25));pl.position.y=-.2;gscene.add(pl);const fr=new THREE.Mesh(new THREE.BoxGeometry(6.6,.1,6.6),glow(0xffffff));fr.position.y=-.32;gscene.add(fr)}
function resize(){W=innerWidth;H=innerHeight;renderer.setSize(W,H,false);cam.aspect=W/H;cam.updateProjectionMatrix();const hc=$('#hc');hc.width=W;hc.height=H}
addEventListener('resize',()=>{resize();if(mode==='garage')garCam()});
function garCam(){cam.position.set(0,3.8,10);cam.lookAt(0,1.8,0);const n=W<760,r=W>1000;cam.setViewOffset(W,H,n?0:-(r?70:215),n?H*.3:0,W,H)}
function disposeTree(root){const geos=new Set(),mats=new Set();root.traverse(o=>{if(o.geometry)geos.add(o.geometry);if(o.material&&!Object.values(MATS).includes(o.material))mats.add(o.material);});geos.forEach(g=>{if(![SHELL,BUL,ROC,FXG].includes(g))g.dispose();});mats.forEach(m=>m.dispose());for(const texture of root.userData.ownedTextures||[])texture.dispose();}
function showGarMech(){if(garMech){gscene.remove(garMech.g);disposeTree(garMech.g);}garMech=mkMech(equipped(),PAL[SV.col],ACC[SV.acc]);gscene.add(garMech.g)}

/* ---------- 5. GARAŻ I SKLEP ---------- */
let tab='legs',side='gl',codeMsg='';
const TABS=[['legs','Nogi'],['body','Korpus'],['head','Głowa'],['wpn','Broń'],['sp','Moc'],['shop','Sklep'],['mech','Mech']];
function bar(l,v,m){return`<div class="st"><span>${l}</span><div class="bar"><i style="width:${clamp(v/m*100,3,100)}%"></i></div><b>${Math.round(v)}</b></div>`}
function statBlock(){const S=stats(equipped()),ability=BODY_ABILITIES[S.R.body.t];return `<p><b>${S.R.body.r>=4?ability.name:'Zdolność korpusu zablokowana'}</b><br><span class="mut">${S.R.body.r>=4?ability.description+' · Q':'Wymaga legendarnego lub mitycznego korpusu.'}</span></p><p>${S.mage.ic} <b>${S.mage.n}</b><br><span class="mut">${mageDescriptions[SV.mage]}</span></p><p>${S.sp.ic} <b>${S.sp.n}</b><br><span class="mut">${pinfo(equipped().sp)} · Spacja / E</span></p>`;}
function card(p){const r=RAR[p.r],t=CAT[p.slot][p.t],eq=isEq(p);return`<div role="button" tabindex="0" class="cd ${eq?'eq':''}" style="--rc:${r.c}" data-id="${p.id}"><div class="ic">${t.ic}</div><b>${t.n}</b><div class="rr">${r.n}</div><small>${pinfo(p)}</small>${eq?'<small>✓ założone</small>':`<span role="button" tabindex="0" class="sl" data-sell="${p.id}">sprzedaj ${r.sell}💰</span>`}</div>`}
function colors(){return ['body','legs','gl','gr'].map((slot,j)=>`<h3>${['Korpus','Nogi','Lewa broń','Prawa broń'][j]}</h3><div class="row">${PAL.map((c,i)=>`<button type="button" aria-label="${slot}: kolor ${i+1}" class="dot ${paintFor(SV,slot)===i?'sel':''}" data-paint="${slot}" data-color="${i}" style="background:${hex(c)}"></button>`).join('')}</div>`).join('')+`<h3>Ujednolić kolor wszystkich części</h3>${PAL.map((c,i)=>`<span class="dot ${SV.col===i?'sel':''}" data-col="${i}" style="background:${hex(c)}"></span>`).join('')}<h3>Kolor dodatkowy</h3>${ACC.map((c,i)=>`<span class="dot ${SV.acc===i?'sel':''}" data-acc="${i}" style="background:${hex(c)}"></span>`).join('')}`}
function codeBox(){return`<h3>Kod</h3><div class="row"><input type="text" id="code" placeholder="Wpisz kod" autocomplete="off"><button class="btn s" id="cok" style="margin:0;flex:0 0 70px">OK</button></div><p class="mut" id="cmsg">${codeMsg}</p>`}
function renderGarage(){
 $('#gold').textContent=`💰 ${SV.gold.toLocaleString('pl-PL')} · wygrane: ${SV.wins}/${SV.games}`;
 $('#tabs').innerHTML=TABS.map(([k,n])=>`<button class="tab ${tab===k?'sel':''}" data-tab="${k}">${n}</button>`).join('');
 let h='';
 if(tab==='shop'){h=CRATES.map((c,i)=>`<div class="crate" style="--rc:${c.c}"><b style="color:${c.c}">📦 ${c.n}</b><p class="mut">Losowa część. Szanse: ${c.w.map((w,j)=>w?`${RAR[j].n} ${w}%`:'').filter(Boolean).join(', ')}</p><button class="btn" data-crate="${i}" ${SV.gold<c.p?'disabled':''}>Kup i otwórz · ${c.p.toLocaleString('pl-PL')} 💰</button></div>`).join('')+`<div class="crate" style="--rc:#a855f7"><b>🔮 Nowy mag</b><p class="mut">Teraz: ${MAGE[SV.mage].ic} ${MAGE[SV.mage].n}. Losuje nową moc dla Twojego mecha.</p><button class="btn" id="mg" ${SV.gold<MAGE_PRICE?'disabled':''}>Losuj maga · ${MAGE_PRICE.toLocaleString('pl-PL')} 💰</button></div>`+codeBox()}
 else if(tab==='mech'){h=statBlock()+colors()+codeBox()}
 else{const items=SV.inv.filter(p=>p.slot===tab).sort((a,b)=>b.r-a.r);
  h=(tab==='wpn'?`<div class="row" style="margin-bottom:8px"><button class="tg ${side==='gl'?'sel':''}" data-side="gl">Lewa ręka</button><button class="tg ${side==='gr'?'sel':''}" data-side="gr">Prawa ręka</button></div>`:'')+`<div class="grid">${items.map(card).join('')}</div><p class="mut">Zdobywaj złoto za wygrane (${WIN_GOLD} 💰) i kupuj skrzynki w sklepie.</p>`}
 $('#gc').innerHTML=h;
 $('#rp').innerHTML=`<h1>${MAGE[SV.mage].ic} Twój mech</h1>${statBlock()}<button class="btn" id="go2">▶ Do areny!</button>`;
 document.querySelectorAll('.tab').forEach(b=>b.onclick=()=>{tab=b.dataset.tab;renderGarage()});
 document.querySelectorAll('[data-side]').forEach(b=>b.onclick=()=>{side=b.dataset.side;renderGarage()});
 document.querySelectorAll('.cd').forEach(c=>{c.onkeydown=e=>{if(['Enter',' '].includes(e.key)){e.preventDefault();e.target.click();}};c.onclick=e=>{const id=+c.dataset.id,p=part(id);if(e.target.dataset.sell){const s=part(+e.target.dataset.sell);if(!s||isEq(s))return;SV.inv=SV.inv.filter(x=>x!==s);SV.gold+=RAR[s.r].sell;save();renderGarage();return}
  if(p.slot==='wpn'){const o=side==='gl'?'gr':'gl';if(SV.eq[o]===id)SV.eq[o]=SV.eq[side];SV.eq[side]=id}else SV.eq[p.slot]=id;save();renderGarage();showGarMech()};});
 document.querySelectorAll('[data-crate]').forEach(b=>b.onclick=()=>{const p=openCrate(+b.dataset.crate);if(p){renderGarage();modalPart(p)}});
 document.querySelectorAll('[data-paint]').forEach(d=>d.onclick=()=>{SV.paint={...SV.paint,[d.dataset.paint]:+d.dataset.color};save();renderGarage();showGarMech()});
 document.querySelectorAll('[data-col]').forEach(d=>d.onclick=()=>{SV.col=+d.dataset.col;SV.paint={};save();renderGarage();showGarMech()});
 document.querySelectorAll('[data-acc]').forEach(d=>d.onclick=()=>{SV.acc=+d.dataset.acc;save();renderGarage();showGarMech()});
 const mg=$('#mg');if(mg)mg.onclick=()=>{if(SV.gold<MAGE_PRICE)return;SV.gold-=MAGE_PRICE;SV.mage=ri(MAGE.length);save();renderGarage();showGarMech();const m=MAGE[SV.mage];modal(`<div style="font-size:60px">${m.ic}</div><h2>${m.n}</h2><p>${mageDescriptions[SV.mage]}</p>`,'#a855f7')};
 const ck=$('#cok');if(ck)ck.onclick=redeem;const ci=$('#code');if(ci)ci.onkeydown=e=>{e.stopPropagation();if(e.key==='Enter')redeem()};
 $('#go2')&&($('#go2').onclick=startMatch)}
function redeem(){const input=$('#code').value||'',before=SV.gold,result=redeemCode(SV,input);codeMsg=result==='ok'?`✅ Kod przyjęty! +${(SV.gold-before).toLocaleString('pl-PL')} 💰`:result==='used'?'⚠️ Ten kod został już użyty.':'❌ Nieznany kod.';if(result==='ok')save();renderGarage();}
function modal(html,rc){const m=$('#modal');m.style.setProperty('--rc',rc);m.innerHTML=`<div class="box">${html}<button class="btn" id="mok">OK</button></div>`;m.classList.remove('hide');$('#mok').onclick=()=>m.classList.add('hide')}
function modalPart(p){const r=RAR[p.r],t=CAT[p.slot][p.t];modal(`<div class="rr" style="color:${r.c};font-weight:900;font-size:20px;text-transform:uppercase">${r.n}</div><div style="font-size:64px">${t.ic}</div><h2>${t.n}</h2><p class="mut">${pinfo(p)}</p>`,r.c)}

/* ---------- 6. ARENA ---------- */
const R_ARENA=42;let G=null,keys={},mdown=false,mouse={x:W/2,y:H/2},touch={mx:0,mz:0,fire:false,dash:false},camP={x:0,z:0},AC=null;
function sfx(f,d,type='square',v=.03){try{AC=AC||new AudioContext();const o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.value=f;g.gain.value=v;o.connect(g);g.connect(AC.destination);o.start();g.gain.exponentialRampToValueAtTime(.0001,AC.currentTime+d);o.stop(AC.currentTime+d)}catch(e){}}
const SHELL=new THREE.SphereGeometry(.22,8,6),BUL=new THREE.BoxGeometry(.12,.12,.7),ROC=new THREE.CylinderGeometry(.14,.14,.8,6),FXG=new THREE.SphereGeometry(1,12,8);
function startMatch(){
 void music.start();void fullscreen.enter();mouse={x:W/2,y:H/2};
 document.activeElement?.blur();resetInput();paused=false;$('#pause').classList.add('hide');if(G)clearArena();mode='arena';$('#gp').classList.add('hide');$('#rp').classList.add('hide');$('#hud').classList.remove('hide');$('#end').classList.add('hide');if(matchMedia('(pointer:coarse)').matches)$('#touch').classList.remove('hide');
 const map=MAPS.find(m=>m.id===matchSettings.map),art=createArena(THREE,map);scene.background=new THREE.Color(map.fog).convertSRGBToLinear();scene.fog.color.copy(scene.background);scene.add(art.root);
 const zone=new THREE.Mesh(new THREE.CylinderGeometry(R_ARENA,R_ARENA,7,48,1,true),new THREE.MeshBasicMaterial({color:0xef4444,transparent:true,opacity:.16,side:THREE.DoubleSide}));zone.position.y=3.5;scene.add(zone);
 G={map,total:matchSettings.bots+1,ents:[],obst:art.obstacles,proj:[],beams:[],fx:[],kits:[],feed:[],t:0,cd:3.2,over:false,shown:false,zr:40,stage:0,phase:'wait',timer:18,r0:40,r1:40,ground:art.root,surfaces:art.surfaces,interactions:art.interactions,grid:null,zone,stages:[{w:18,s:14,r:27},{w:14,s:12,r:16},{w:12,s:10,r:8},{w:10,s:8,r:3}]};
 for(let i=0;i<10;i++){const a=rnd(0,6.283),d=rnd(4,34),m=new THREE.Mesh(new THREE.BoxGeometry(.8,.8,.8),glow(0x22c55e));m.position.set(Math.cos(a)*d,.7+terrainHeight(map,Math.cos(a)*d,Math.sin(a)*d),Math.sin(a)*d);scene.add(m);G.kits.push({x:m.position.x,z:m.position.z,m})}
 const mine=equipped(),avg=avgR(mine);
 for(let i=0;i<G.total;i++){const a=i/G.total*6.283+.3,p=i===0,R=p?mine:botR(avg),e=mkEnt(R,p?'Ty':NAMES[i],p,p?PAL[SV.col]:PAL[ri(8)],p?ACC[SV.acc]:ACC[ri(6)]);e.x=Math.cos(a)*31;e.z=Math.sin(a)*31;e.aim=Math.atan2(-e.x,-e.z);e.face=e.aim;e.torso=e.aim;e.wa=[e.aim,e.aim];G.ents.push(e);scene.add(e.model.g)}
 G.player=G.ents[0];camP.x=G.player.x;camP.z=G.player.z;view=createView(G.player.aim);updateCamera();}
function mkEnt(R,name,isP,col,acc){const S=stats(R);return{name,isP,S,ammo:createAmmo(S.G),x:0,z:0,vx:0,vz:0,ix:0,iz:0,aim:0,face:0,torso:0,wa:[0,0],hp:S.hp,max:S.hp,shield:0,shT:0,bsT:0,cd:[0,0],spCd:3,dashT:0,dx:0,dz:0,alive:true,kills:0,place:0,rad:Math.max(1,S.s[0]/2+.3),
  bodyCd:0,bodyT:0,air:0,jumpT:0,jumpCd:0,weaponState:[{},{}],damageFx:0,burnT:0,burnDps:0,burnSrc:null,slowT:0,stunT:0,healT:0,overT:0,model:mkMech(R,col,acc,isP),ai:{tgt:null,tt:0,str:1,st:rnd(1,3),err:rnd(.04,.14)},walk:0,lastHit:0}}
function clearArena(){[G.ground,G.grid,G.zone,...G.obst.filter(o=>o.mesh.parent===scene).map(o=>o.mesh),...G.kits.map(k=>k.m),...G.ents.map(e=>e.model.g),...G.proj.map(p=>p.m),...G.beams.map(b=>b.m),...G.fx.map(f=>f.m)].forEach(o=>{if(o){scene.remove(o);disposeTree(o);}});G=null}
const alive=()=>G.ents.filter(e=>e.alive);
function feed(t){G.feed.push({t,l:5});if(G.feed.length>5)G.feed.shift()}
function boom(x,z,r,col=0xfbbf24,vx=0,vz=0,l=.4){if(G.fx.length>50)return;const m=new THREE.Mesh(FXG,new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.8}));m.position.set(x,terrainHeight(G.map,x,z)+1.4,z);scene.add(m);G.fx.push({m,r,l,t:l,vx,vz,x,z})}
function nearestTo(e,ex,rng){let b=null,bd=rng;G.ents.forEach(o=>{if(o===e||o===ex||!o.alive||(o.bodyT>0&&o.bodyKind==='cloak'))return;const d=Math.hypot(o.x-e.x,o.z-e.z);if(d<bd){bd=d;b=o}});return b}
function beamFx(a,b){const dx=b.x-a.x,dz=b.z-a.z,L=Math.hypot(dx,dz),m=new THREE.Mesh(new THREE.BoxGeometry(.12,.12,1),glow(0xfde047));m.position.set((a.x+b.x)/2,1.6,(a.z+b.z)/2);m.scale.z=L;m.rotation.y=Math.atan2(dx,dz);scene.add(m);G.beams.push({m,l:.12})}
function hurt(e,d,src,o){o=o||{};if(!e.alive||G.cd>0)return;
 if(e.bodyT>0&&e.bodyKind==='shield'&&src&&src!==e&&Math.abs(angd(e.torso,Math.atan2(src.x-e.x,src.z-e.z)))<1.25){boom(e.x,e.z,.65,0x52cfff);return;}
 if(!o.quiet){boom(e.x,e.z,.3,0xffdd75);e.damageFx=.15;}
 if(e.S.mage.k==='cie'&&!o.noProc&&Math.random()<.12)return;
 d*=1-e.S.arm;if(e.shield>0){const a=Math.min(e.shield,d);e.shield-=a;d-=a}e.hp-=d;e.shT=5;e.lastHit=.6;
 if(e.isP&&!o.quiet){$('#flash').style.opacity=.9;setTimeout(()=>$('#flash').style.opacity=0,120)}
 const mg=src&&src!==e&&src.alive?src.S.mage:null;
 if(mg&&!o.noProc){if(mg.k==='pyr'){e.burnT=3;e.burnDps=3;e.burnSrc=src}else if(mg.k==='kri')e.slowT=2;else if(mg.k==='bur'&&Math.random()<.18){const n=nearestTo(e,src,10);if(n){hurt(n,14,src,{noProc:1});beamFx(e,n)}}else if(mg.k==='wam')src.hp=Math.min(src.max,src.hp+d*.08)}
 if(e.hp<=0&&e.alive){e.alive=false;e.hp=0;e.place=alive().length+1;scene.remove(e.model.g);boom(e.x,e.z,3.2,0xf97316);if(src&&src!==e)src.kills++;feed(`${src&&src!==e?src.name+' ✕ ':'💀 '}${e.name}`);if(e.isP)sfx(80,.5,'sawtooth',.06);else if(Math.hypot(e.x-G.player.x,e.z-G.player.z)<30)sfx(120,.3,'sawtooth',.04)}}
function explode(x,z,r,d,own){boom(x,z,r);G.ents.forEach(e=>{if(!e.alive)return;const dd=Math.hypot(e.x-x,e.z-z);if(dd<r+e.rad)hurt(e,d*(1-.6*dd/(r+e.rad)),own)})}
function muzzle(e,i){return weaponAim(e,{offset:(i?1:-1)*(e.S.s[0]/2+.6),forward:.25,height:(e.groundY||0)+LH+e.S.s[1]*.55,length:e.S.G[i].len+.3},e.target||{x:e.x+Math.sin(e.aim)*30,z:e.z+Math.cos(e.aim)*30});}
const angd=(a,b)=>((b-a+Math.PI)%(2*Math.PI)+2*Math.PI)%(2*Math.PI)-Math.PI;
function shoot(e,i){if(!spendRound(e.ammo[i]))return;if(e.bodyKind==='cloak')e.bodyT=0;e.recoil=.1;e.shots=(e.shots||0)+1;G.shots=(G.shots||0)+1;const g=e.S.G[i],m=muzzle(e,i),A0=m.angle,dm=e.overT>0?1.6:1,D=g.d*dm;
 if(g.k==='flame'){G.ents.forEach(t=>{if(t===e||!t.alive)return;const ex=t.x-m.x,ez=t.z-m.z,d=Math.hypot(ex,ez);const blocked=G.obst.some(o=>coverBeamDistance(m,A0,m.slope,d,o)!==null);if(!blocked&&Math.abs((t.groundY||0)-m.y)<t.model.height+1&&d<g.range+t.rad&&(Math.abs(angd(A0,Math.atan2(ex,ez)))<.42||d<t.rad+1.2)){hurt(t,D,e);t.burnT=2;t.burnDps=3;t.burnSrc=e}});
  for(const q of G.interactions)if(q.kind==='barrel'&&!q.dead&&Math.hypot(q.x-m.x,q.z-m.z)<g.range&&Math.abs(angd(A0,Math.atan2(q.x-m.x,q.z-m.z)))<.42)hitBarrel(q,D,e);
  boom(m.x+Math.sin(A0)*2,m.z+Math.cos(A0)*2,1.3,0xf97316,Math.sin(A0)*8,Math.cos(A0)*8,.3);if(e.isP&&Math.random()<.3)sfx(90,.1,'sawtooth',.02);return}
 if(g.k==='laser'){const dx=Math.sin(A0),dz=Math.cos(A0);let best=g.range,hit=null;
  G.obst.forEach(o=>{const t=coverBeamDistance(m,A0,m.slope,best,o);if(t!==null&&t<best)best=t;});
  G.ents.forEach(t2=>{if(t2===e||!t2.alive)return;const t=coverBeamDistance(m,A0,m.slope,best,{x:t2.x,z:t2.z,r:t2.rad,base:t2.groundY||0,height:t2.model.height});if(t!==null&&t<best){best=t;hit=t2;}});
  for(const q of G.interactions){if(q.kind!=='barrel'||q.dead)continue;const d=coverBeamDistance(m,A0,m.slope,best,{...q,height:1.7});if(d!==null&&d<best){best=d;hit=q;}}if(hit){if(hit.kind==='barrel')hitBarrel(hit,D,e);else hurt(hit,D,e);}const b=new THREE.Mesh(new THREE.BoxGeometry(.1,.1,1),glow(0x22d3ee));const direction=new THREE.Vector3(dx,m.slope,dz);b.position.set(m.x+dx*best/2,m.y+m.slope*best/2,m.z+dz*best/2);b.scale.z=best*direction.length();b.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),direction.normalize());scene.add(b);G.beams.push({m:b,l:.07});if(e.isP)sfx(900,.06,'sine',.02);return}
 const n=g.pellets||1;for(let k=0;k<n;k++){const a=A0+rnd(-g.sp,g.sp),mesh=new THREE.Mesh(g.k==='rocket'?ROC:g.k==='cannon'?SHELL:BUL,glow(g.k==='rocket'?0xf97316:g.k==='cannon'?0xfde047:0xfbbf24));
  mesh.position.set(m.x,m.y,m.z);mesh.rotation.y=a;if(g.k==='rocket')mesh.rotation.x=Math.PI/2;scene.add(mesh);G.proj.push({x:m.x,z:m.z,vx:Math.sin(a)*g.v,vz:Math.cos(a)*g.v,vy:m.slope*g.v,d:D,own:e,life:g.range/g.v,homing:g.k==='rocket'?nearestEnemy(e).e:null,sp:g.splash||0,m:mesh})}
 if(e.isP||Math.hypot(e.x-G.player.x,e.z-G.player.z)<22)sfx(g.k==='cannon'||g.k==='rocket'?150:g.k==='shotgun'?110:380,.07,'square',.02)}
function useBody(e){if(!e.alive||G.cd>0||!activateBody(e,e.S.R.body.t,e.S.R.body.r))return;if(e.bodyKind==='charge'){e.dx=Math.sin(e.aim);e.dz=Math.cos(e.aim);}boom(e.x,e.z,1.4,0x52cfff);}
function hitBarrel(q,d,src){if(!damageBarrel(q,d))return;q.mesh.visible=false;explode(q.x,q.z,6,65,src);for(const next of G.interactions)if(next.kind==='barrel'&&!next.dead&&Math.hypot(next.x-q.x,next.z-q.z)<6)hitBarrel(next,65,src);}
function useSp(e){if(e.spCd>0)return;const k=e.S.sp.k,m=e.S.spm;e.spCd=e.S.spCd;
 if(k==='dash'){e.dashT=.28;const L=Math.hypot(e.ix,e.iz);e.dx=L>.1?e.ix/L:Math.sin(e.aim);e.dz=L>.1?e.iz/L:Math.cos(e.aim)}
 else if(k==='shield'){e.shield=90*m;e.bsT=4}else if(k==='repair')e.healT=4;else if(k==='over')e.overT=5;
 else if(k==='emp'){G.ents.forEach(t=>{if(t!==e&&t.alive&&Math.hypot(t.x-e.x,t.z-e.z)<9)t.stunT=1.5});boom(e.x,e.z,9,0x38bdf8,0,0,.5)}
 if(e.isP)sfx(260,.25,'sawtooth',.04)}
const lerpA=(a,b,t)=>a+angd(a,b)*clamp(t,0,1);
const aimRay=new THREE.Raycaster(),aimPlane=new THREE.Plane(new THREE.Vector3(0,1,0),0),aimPoint=new THREE.Vector3();
function aimWorld(){aimRay.setFromCamera(new THREE.Vector2(viewDrag?0:mouse.x/W*2-1,viewDrag?0:1-mouse.y/H*2),cam);const objects=[];function collect(o,shield){if(!o.visible||o===shield)return;if(o.isMesh)objects.push(o);o.children.forEach(c=>collect(c,shield));}if(G){G.ents.filter(e=>e.alive&&!e.isP).forEach(e=>collect(e.model.g,e.model.sh));G.obst.forEach(o=>collect(o.mesh,null));G.interactions.filter(q=>q.kind==='barrel'&&!q.dead).forEach(q=>collect(q.mesh,null));(G.surfaces||[]).forEach(o=>collect(o,null));}const hit=aimRay.intersectObjects(objects,false)[0];if(hit)return {x:hit.point.x,y:hit.point.y,z:hit.point.z};if(aimRay.ray.intersectPlane(aimPlane,aimPoint))return {x:aimPoint.x,y:aimPoint.y,z:aimPoint.z};const direction=aimRay.ray.direction;return {x:aimRay.ray.origin.x+direction.x*100,y:aimRay.ray.origin.y+direction.y*100,z:aimRay.ray.origin.z+direction.z*100};}
function toScreen(x,y,z){const point=new THREE.Vector3(x,y,z).project(cam);return point.z>1?null:{x:(point.x+1)*W/2,y:(1-point.y)*H/2};}
const viewRay=new THREE.Raycaster();
function updateCamera(){cam.clearViewOffset();const desired=cameraPosition(camP,view),base=G?.player.groundY||0,target=new THREE.Vector3(camP.x,1.8+base,camP.z),delta=new THREE.Vector3(desired.x,desired.y+base,desired.z).sub(target);viewRay.set(target,delta.clone().normalize());viewRay.far=delta.length();const wall=viewRay.intersectObjects(G?[...G.obst.map(o=>o.mesh),...(G.surfaces||[])]:[],true)[0];if(wall)delta.setLength(Math.max(.7,wall.distance-.3));cam.position.copy(target).add(delta);cam.lookAt(camP.x+Math.sin(view.yaw)*12,2+base,camP.z+Math.cos(view.yaw)*12);cam.updateMatrixWorld();}
function nearestEnemy(e){let b=null,bd=1e9;G.ents.forEach(o=>{if(o===e||!o.alive||(o.bodyT>0&&o.bodyKind==='cloak'))return;const d=Math.hypot(o.x-e.x,o.z-e.z);if(d<bd){bd=d;b=o}});return{e:b,d:bd}}

/* ---------- 7. AI BOTÓW ---------- */
function ai(e,dt){const A=e.ai,out={ix:0,iz:0,aim:e.aim,fire:false,sp:false};A.tt-=dt;
 if(A.tt<=0||!A.tgt||!A.tgt.alive||(A.tgt.bodyT>0&&A.tgt.bodyKind==='cloak')){A.tgt=nearestEnemy(e).e;A.tt=1.2}A.st-=dt;if(A.st<=0){A.str*=-1;A.st=rnd(1.2,3)}
 const dc=Math.hypot(e.x,e.z),k=e.S.sp.k,t=A.tgt;let mx=0,mz=0,d=1e9;
 if(dc>G.zr-5){mx=-e.x/dc;mz=-e.z/dc}else if(e.hp<e.max*.45){let q=null,qd=40;G.kits.forEach(o=>{const dd=Math.hypot(o.x-e.x,o.z-e.z);if(o.m.visible!==false&&dd<qd){qd=dd;q=o}});if(q){mx=(q.x-e.x)/qd;mz=(q.z-e.z)/qd}}
 if(t){const dx=t.x-e.x,dz=t.z-e.z;d=Math.hypot(dx,dz)||1;const want=e.S.rng*.65;
  if(!mx&&!mz){const s=d>want?1:d<want*.55?-1:0;mx=dx/d*s-dz/d*A.str*.8;mz=dz/d*s+dx/d*A.str*.8}
  const sp=Math.max(e.S.G[0].v||60,e.S.G[1].v||60),lead=d/sp,er=A.err*d*.3;out.aim=Math.atan2(dx+t.vx*lead+rnd(-1,1)*er,dz+t.vz*lead+rnd(-1,1)*er);
  out.target={x:e.x+Math.sin(out.aim)*d,y:(t.groundY||0)+LH+t.S.s[1]*.55,z:e.z+Math.cos(out.aim)*d};out.fire=d<e.S.rng*1.05&&Math.abs(angd(e.aim,out.aim))<.25&&G.cd<=0}
 else if(!mx&&!mz){mx=-e.x/(dc||1);mz=-e.z/(dc||1)}
 G.obst.forEach(o=>{const dx=e.x-o.x,dz=e.z-o.z,dd=Math.hypot(dx,dz);if(dd>0&&dd<o.r+3.2){mx+=dx/dd*1.5;mz+=dz/dd*1.5}});
 if(e.spCd<=0){if(k==='dash'&&(dc>G.zr+1||(e.lastHit>0&&Math.random()<.03)))out.sp=true;else if(k==='shield'&&e.lastHit>0)out.sp=true;else if(k==='repair'&&e.hp<e.max*.5)out.sp=true;else if(k==='over'&&t&&d<e.S.rng)out.sp=true;else if(k==='emp'&&nearestTo(e,null,7))out.sp=true}
 if(e.bodyCd<=0&&t&&d<22&&e.S.R.body.r>=4)out.body=true;out.ix=mx;out.iz=mz;return out}

/* ---------- aktualizacja gry ---------- */
function update(dt){const g=G;if(paused||g.over)return;g.t+=dt;
 if(g.cd>0){g.cd-=dt;$('#cd').classList.toggle('hide',g.cd<=0);$('#cd').textContent=g.cd>2.2?'3':g.cd>1.2?'2':g.cd>.2?'1':'WALKA!';if(g.cd<=0)$('#cd').classList.add('hide')}
 if(g.cd<=0&&g.stage<g.stages.length){g.timer-=dt;const s=g.stages[g.stage];
  if(g.phase==='wait'&&g.timer<=0){g.phase='shrink';g.timer=s.s;g.r0=g.zr;g.r1=s.r}
  else if(g.phase==='shrink'){g.zr=g.r0+(g.r1-g.r0)*(1-Math.max(0,g.timer)/s.s);if(g.timer<=0){g.zr=g.r1;g.stage++;g.phase='wait';g.timer=g.stages[g.stage]?g.stages[g.stage].w:0}}}
 g.zone.scale.set(g.zr/R_ARENA,1,g.zr/R_ARENA);const zdps=3+g.stage*3;
 for(const q of g.interactions){q.cooldown=Math.max(0,q.cooldown-dt);if(q.kind==='lift'){q.height=liftHeight(g.t);q.deck.position.y=.25+q.height;}}
 g.ents.forEach(e=>{if(!e.alive)return;if(g.cd<=0){tickAmmo(e.ammo,dt);tickWeapons(e,dt);tickBody(e,dt);}e.jumpCd=Math.max(0,e.jumpCd-dt);
  let c;if(e.isP){const k=keys,ix=(k.d||k.arrowright?1:0)-(k.a||k.arrowleft?1:0)+touch.mx,iz=(k.s||k.arrowdown?1:0)-(k.w||k.arrowup?1:0)+touch.mz;const movement=moveRelative(ix,iz,view.yaw);c={ix:movement.x,iz:movement.z,fire:mdown||touch.fire||touch.aiming,body:!!(k.q||touch.body),sp:!!(k[' ']||k.e||touch.dash)};
   if(touch.aiming){const direction=moveRelative(touch.ax,touch.az,view.yaw);c.target={x:e.x+direction.x*30,y:(e.groundY||0)+LH+e.S.s[1]*.55,z:e.z+direction.z*30};c.aim=Math.atan2(direction.x,direction.z);}else if(touch.fire&&!mdown){const n=nearestEnemy(e);c.target=n.e?{x:n.e.x,y:(n.e.groundY||0)+LH+n.e.S.s[1]*.55,z:n.e.z}:null;c.aim=n.e?Math.atan2(n.e.x-e.x,n.e.z-e.z):e.aim}else{c.target=aimWorld();c.aim=Math.atan2(c.target.x-e.x,c.target.z-e.z)}}else c=ai(e,dt);
  if(g.cd>0||e.stunT>0){c.fire=false;c.ix=c.iz=0;c.sp=c.body=false}
  const L=Math.hypot(c.ix,c.iz);if(L>1){c.ix/=L;c.iz/=L}e.ix=c.ix;e.iz=c.iz;
  e.aim=lerpA(e.aim,c.aim,dt*(e.isP?18:8));e.torso=lerpA(e.torso,e.aim,dt*3.2);e.target=c.target||{x:e.x+Math.sin(c.aim)*30,z:e.z+Math.cos(c.aim)*30};e.spCd-=dt;if(c.sp)useSp(e);if(c.body)useBody(e);
  const sl=e.slowT>0?.65:1,spd=e.S.spd*sl;
  if(e.bodyT>0&&e.bodyKind==='charge'){e.vx=e.dx*spd*3.5;e.vz=e.dz*spd*3.5;}else if(e.dashT>0){e.dashT-=dt;e.vx=e.dx*spd*3.2;e.vz=e.dz*spd*3.2}else{e.vx+=(c.ix*spd-e.vx)*Math.min(1,dt*7);e.vz+=(c.iz*spd-e.vz)*Math.min(1,dt*7)}
  e.x+=e.vx*dt;e.z+=e.vz*dt;
  g.obst.forEach(o=>{if(o.tunnelRoof)return;if((e.groundY||0)>o.height+o.base+.2)return;if(o.tunnelWall){const dx=e.x-o.x,dz=e.z-o.z;if(Math.abs(dx)<o.halfX+e.rad&&Math.abs(dz)<o.halfZ+e.rad){if(Math.abs(dx)/(o.halfX+e.rad)>Math.abs(dz)/(o.halfZ+e.rad))e.x=o.x+Math.sign(dx||1)*(o.halfX+e.rad);else e.z=o.z+Math.sign(dz||1)*(o.halfZ+e.rad);}return;}const dx=e.x-o.x,dz=e.z-o.z,d=Math.hypot(dx,dz),m=o.r+e.rad;if(d<m&&d>0){e.x=o.x+dx/d*m;e.z=o.z+dz/d*m}});
  g.ents.forEach(o=>{if(o===e||!o.alive)return;const dx=e.x-o.x,dz=e.z-o.z,d=Math.hypot(dx,dz),m=e.rad+o.rad;if(d<m&&d>0){if(e.bodyT>0&&e.bodyKind==='charge'&&!e.rammed.has(o)){e.rammed.add(o);hurt(o,35,e);o.vx+=e.dx*15;o.vz+=e.dz*15;boom(o.x,o.z,1.2);}const p=(m-d)/2;e.x+=dx/d*p;e.z+=dz/d*p;o.x-=dx/d*p;o.z-=dz/d*p}});
  const dd=Math.hypot(e.x,e.z);if(dd>R_ARENA-1){e.x*=(R_ARENA-1)/dd;e.z*=(R_ARENA-1)/dd}
  let ground=terrainHeight(g.map,e.x,e.z);
  ground=interactionSurface(e,g.interactions,ground,g.cd<=0,()=>boom(e.x,e.z,1.3,0x52cfff));
  e.jumpT=Math.max(0,e.jumpT-dt);const jump=e.jumpT>0?Math.sin(e.jumpT/1.5*Math.PI)*5:0,flight=e.bodyT>0&&e.bodyKind==='flight'?Math.min(1,e.bodyT/.35)*4:0;
  e.air=Math.max(jump,flight,Math.max(0,(e.air||0)-dt*7));e.groundY=ground+e.air;e.wa[0]=muzzle(e,0).angle;e.wa[1]=muzzle(e,1).angle;e.cd[0]-=dt;e.cd[1]-=dt;for(let i=0;i<2;i++){const trigger=c.fire&&e.cd[i]<=0&&e.ammo[i].reload<=0;if(canFireWeapon(e,i,e.S.G[i].k,trigger,dt)){shoot(e,i);e.cd[i]=1/e.S.G[i].r;}}
  e.lastHit-=dt;e.stunT-=dt;e.slowT-=dt;e.overT-=dt;if(e.bsT>0){e.bsT-=dt;if(e.bsT<=0)e.shield=0}if(e.healT>0){e.healT-=dt;e.hp=Math.min(e.max,e.hp+e.max*.35/4*dt)}
  if(e.burnT>0){e.burnT-=dt;hurt(e,e.burnDps*dt,e.burnSrc,{noProc:1,quiet:1})}
  if(e.alive&&Math.hypot(e.x,e.z)>g.zr&&g.cd<=0){e.hp-=zdps*dt;if(e.isP)$('#flash').style.opacity=.5;if(e.hp<=0){e.hp=0;e.alive=false;e.place=alive().length+1;scene.remove(e.model.g);boom(e.x,e.z,3,0xef4444);feed(`🔴 Strefa ✕ ${e.name}`)}}
  if(!e.alive)return;
  g.kits.forEach(k=>{if(k.m.visible!==false&&e.hp<e.max&&Math.hypot(k.x-e.x,k.z-e.z)<1.8){e.hp=Math.min(e.max,e.hp+e.max*.3);k.m.visible=false;k.m.position.y=-9;if(e.isP)sfx(660,.15,'sine',.04)}});
  const m=e.model,stage=damageStage(e.hp,e.max),damaged=stage!=='intact',critical=stage==='critical';m.damage.visible=damaged;m.smoke.visible=critical;m.smoke.position.y=e.S.s[1]*.7+Math.sin(g.t*3)*.18;m.barrier.visible=e.bodyT>0&&e.bodyKind==='shield';m.exhaust.visible=e.bodyT>0&&(e.bodyKind==='flight'||e.bodyKind==='charge');m.exhaust.scale.y=.85+Math.sin(g.t*40)*.15;m.charging.forEach((orb,i)=>{orb.visible=(e.weaponState[i].charge||0)>0;orb.scale.setScalar(.6+(e.weaponState[i].charge||0)*2);});
  const cloaked=e.bodyT>0&&e.bodyKind==='cloak';m.g.traverse(o=>{if(o.isMesh&&o!==m.sh&&o!==m.barrier){o.material.userData.original??={transparent:o.material.transparent,opacity:o.material.opacity};o.material.transparent=cloaked||o.material.userData.original.transparent;o.material.opacity=cloaked?.16:o.material.userData.original.opacity;}});e.damageFx-=dt;
  if((critical||e.damageFx>0)&&g.t>(e.nextSmoke||0)){e.nextSmoke=g.t+.35;boom(e.x,e.z,.25,critical?0x475569:0xffd667,0,0,.3);}
  m.g.position.set(e.x,e.groundY||0,e.z);m.top.rotation.y=e.torso;m.wp.forEach((p,i)=>{p.rotation.y=angd(e.torso,e.wa[i]);p.rotation.x=e.ammo[i].reload>0?-.18:0;});e.recoil=Math.max(0,(e.recoil||0)-dt);const sp=Math.hypot(e.vx,e.vz);if(sp>.6)e.face=lerpA(e.face,Math.atan2(e.vx,e.vz),dt*8);m.lg.rotation.y=e.face;e.walk+=sp*dt*1.4;
  m.parts.forEach((p,i)=>{if(e.S.L.k==='wheel')p.rotation.x=e.walk;else p.rotation.x=Math.sin(e.walk*1.4+(i%2)*Math.PI)*.45});if(m.knees)m.knees.forEach((knee,i)=>{knee.rotation.x=Math.max(0,-Math.sin(e.walk*1.4+(i%2)*Math.PI))*.22;});m.sh.visible=e.shield>1});
 for(let i=g.proj.length-1;i>=0;i--){const p=g.proj[i];if(p.homing?.alive&&!(p.homing.bodyT>0&&p.homing.bodyKind==='cloak')){steerRocket(p,p,p.homing,dt);p.vy=(((p.homing.groundY||0)+1.7)-p.m.position.y)/Math.max(.15,Math.hypot(p.homing.x-p.x,p.homing.z-p.z)/Math.hypot(p.vx,p.vz));p.m.rotation.y=Math.atan2(p.vx,p.vz);}const oldX=p.x,oldZ=p.z,oldY=p.m.position.y; p.x+=p.vx*dt;p.z+=p.vz*dt;p.life-=dt;const newY=oldY+(p.vy||0)*dt;let hit=null,best=2;
  for(const o of g.obst){const t=o.halfX?boxHitTime({x:oldX,y:oldY,z:oldZ},{x:p.x,y:newY,z:p.z},o):segmentHitTime(oldX,oldZ,p.x,p.z,o.x,o.z,o.r);if(t!==null&&t<best){const y=oldY+(newY-oldY)*t;if(y>=o.base&&y<=o.base+o.height){best=t;hit={cover:o};}}}
  for(const e of g.ents){if(e===p.own||!e.alive)continue;const t=segmentHitTime(oldX,oldZ,p.x,p.z,e.x,e.z,e.rad);if(t!==null&&t<best){const y=oldY+(newY-oldY)*t;if(y>=(e.groundY||0)&&y<=(e.groundY||0)+e.model.height){best=t;hit={entity:e};}}}
  for(const q of g.interactions){if(q.kind!=='barrel'||q.dead)continue;const t=segmentHitTime(oldX,oldZ,p.x,p.z,q.x,q.z,q.r);if(t!==null&&t<best){const y=oldY+(newY-oldY)*t;if(y>=q.base&&y<=q.base+1.7){best=t;hit={barrel:q};}}}
  let dead=!!hit||p.life<=0||newY<terrainHeight(g.map,p.x,p.z)+.03||Math.hypot(p.x,p.z)>R_ARENA+3;
  if(hit){p.x=oldX+(p.x-oldX)*best;p.z=oldZ+(p.z-oldZ)*best;if(hit.entity&&!p.sp)hurt(hit.entity,p.d,p.own);if(hit.barrel)hitBarrel(hit.barrel,p.d,p.own);}
  p.m.position.set(p.x,hit?oldY+(newY-oldY)*best:newY,p.z);
  if(dead){if(p.sp)explode(p.x,p.z,p.sp,p.d,p.own);scene.remove(p.m);g.proj.splice(i,1);}}
 for(let i=g.beams.length-1;i>=0;i--){g.beams[i].l-=dt;if(g.beams[i].l<=0){scene.remove(g.beams[i].m);disposeTree(g.beams[i].m);g.beams.splice(i,1)}}
 for(let i=g.fx.length-1;i>=0;i--){const f=g.fx[i];f.l-=dt;const k=1-f.l/f.t;if(f.vx||f.vz){f.x+=f.vx*dt;f.z+=f.vz*dt;f.m.position.x=f.x;f.m.position.z=f.z}f.m.scale.setScalar(.4+f.r*k);f.m.material.opacity=.8*(1-k);if(f.l<=0){scene.remove(f.m);disposeTree(f.m);g.fx.splice(i,1)}}
 g.feed.forEach(f=>f.l-=dt);g.feed=g.feed.filter(f=>f.l>0);
 const al=alive();if(!g.over&&al.length<=1){g.over=true;finish()}else if(!g.over&&!g.player.alive&&!g.shown){g.shown=true;g.endDelay=1.6}
 if(g.endDelay!==undefined){g.endDelay-=dt;if(g.endDelay<=0){g.over=true;finish();}}
 const pl=g.player.alive?g.player:(al[0]||g.player);camP.x+=(pl.x-camP.x)*Math.min(1,dt*6);camP.z+=(pl.z-camP.z)*Math.min(1,dt*6);updateCamera()}
function finish(){const p=G.player,win=p.alive;if(!completeMatch(SV,G,win))return;music.stop();resetInput();$('#cd').classList.add('hide');if(win)p.place=1;save();
 $('#eb').innerHTML=`<h1>${win?'🏆 ZWYCIĘSTWO!':'💥 Mech zniszczony'}</h1><p style="font-size:18px">Miejsce: <b>#${p.place||'?'}</b> z ${G.total}<br>Zniszczeni przeciwnicy: <b>${p.kills}</b><br>Czas: <b>${Math.round(G.t)} s</b></p><p style="font-size:18px;color:#fbbf24">${win?`+${WIN_GOLD} 💰 za wygraną!`:'Brak nagrody. Wygraj, by zdobyć złoto.'}<br>Masz: ${SV.gold.toLocaleString('pl-PL')} 💰</p><button class="btn" id="ag">🔁 Jeszcze raz</button><button class="btn s" id="gr">🔧 Garaż i sklep</button>`;
 $('#end').classList.remove('hide');$('#ag').onclick=startMatch;$('#gr').onclick=toGarage}
function toGarage(){music.stop();void fullscreen.leave();resetInput();paused=false;$('#pause').classList.add('hide');if(G)clearArena();mode='garage';['#end','#hud','#cd','#touch'].forEach(s=>$(s).classList.add('hide'));$('#gp').classList.remove('hide');$('#rp').classList.remove('hide');garCam();renderGarage();showGarMech()}

/* ---------- 8. HUD, wejście, pętla ---------- */
const hb=(l,v,m,c)=>`<div>${l==='HP'?(v/m>.65?'Pancerz sprawny':v/m>.3?'Widoczne uszkodzenia':'Krytyczne uszkodzenia'):'Osłona aktywna'}</div><div class="bar"><i style="width:${v/m*100}%;background:${c}"></i></div>`;
function hud(){const g=G,p=g.player,al=alive().length,s=g.stages[g.stage];
 $('#top').textContent=`Żywych: ${al}/${g.total} · ${g.cd>0?'przygotuj się…':!s?'Ostatnia strefa!':g.phase==='wait'?`Strefa zwęża się za ${Math.ceil(Math.max(0,g.timer))} s`:'⚠️ Strefa się zwęża!'}`;
 $('#me').innerHTML=`<b>${p.alive?p.S.mage.ic+' '+p.S.mage.n:'Obserwujesz'}</b>`+hb('HP',p.hp,p.max,'#3fb950')+(p.shield>1?hb('Tarcza',p.shield,90*p.S.spm,'#38bdf8'):'')+`<div>${p.S.sp.ic} ${p.S.sp.n}: ${p.spCd>0?'odnawia się':'GOTOWE (Spacja)'}</div><div>${p.S.R.body.r>=4?BODY_ABILITIES[p.S.R.body.t].name+': '+(p.bodyT>0?'AKTYWNE':p.bodyCd>0?'odnawia się':'GOTOWE (Q)'):'Zdolność korpusu: wymaga legendarnego korpusu'}</div><div>${p.S.G[0].ic} ${p.S.G[0].n} · ${p.S.G[1].ic} ${p.S.G[1].n}</div>`;
 $('#body-btn').disabled=g.over||paused||g.cd>0||p.S.R.body.r<4||p.bodyCd>0;$('#body-btn').textContent=p.S.R.body.r<4?'Korpus: wymaga legendy':BODY_ABILITIES[p.S.R.body.t].name+' · Q';
 $('#ammo-state').textContent=p.ammo.map((m,i)=>`${i?'Prawa':'Lewa'}: ${p.weaponState[i].hot?'chłodzenie lasera…':p.weaponState[i].charge>0?'ładowanie działa…':m.reload>0?'przeładowanie…':m.remaining===m.capacity?'gotowa':m.remaining/m.capacity<.3?'ostatnie pociski':'amunicja dostępna'}`).join(' · ');$('#reload-btn').disabled=g.over||paused||g.cd>0||p.ammo.every(m=>m.reload>0||m.remaining===m.capacity);
 $('#feed').innerHTML=g.feed.map(f=>`<div>${f.t}</div>`).join('');
 const hc=$('#hc').getContext('2d');hc.clearRect(0,0,W,H);hc.font='bold 12px system-ui';hc.textAlign='center';
 for(const q of g.interactions){if(q.dead||Math.hypot(q.x-p.x,q.z-p.z)>22)continue;const spot=toScreen(q.x,q.base+(q.kind==='tunnel'?5.3:1.4),q.z);if(spot){hc.fillStyle=q.kind==='barrel'?'#ffc276':'#a4f1ef';hc.fillText({lift:'↕ Winda',jump:'↑ Skocznia',barrel:'⚠ Zbiornik',tunnel:'Tunel'}[q.kind],spot.x,spot.y);}}
 g.ents.forEach(e=>{if(!e.alive||e===p||(e.bodyT>0&&e.bodyKind==='cloak'))return;const s2=toScreen(e.x,(e.groundY||0)+e.model.height+.2,e.z);if(!s2)return;hc.fillStyle='#000a';hc.fillRect(s2.x-24,s2.y-4,48,7);hc.fillStyle='#ef4444';hc.fillRect(s2.x-23,s2.y-3,46*e.hp/e.max,5);hc.fillStyle='#fff';hc.fillText(e.S.mage.ic+e.name,s2.x,s2.y-9)});
 if(p.alive&&!matchMedia('(pointer:coarse)').matches){const s3=viewDrag?{x:W/2,y:H/2}:mouse;hc.strokeStyle='#fff9';hc.beginPath();hc.arc(s3.x,s3.y,11,0,7);hc.moveTo(s3.x-16,s3.y);hc.lineTo(s3.x+16,s3.y);hc.moveTo(s3.x,s3.y-16);hc.lineTo(s3.x,s3.y+16);hc.stroke();}

 const m=$('#mm').getContext('2d'),k=140/R_ARENA;m.clearRect(0,0,300,300);m.save();m.translate(150,150);m.strokeStyle='#ef4444';m.lineWidth=3;m.beginPath();m.arc(0,0,g.zr*k,0,7);m.stroke();m.fillStyle='#64748b';g.obst.forEach(o=>{m.beginPath();m.arc(o.x*k,o.z*k,o.r*k,0,7);m.fill()});
 m.fillStyle='#22c55e';g.kits.forEach(q=>{if(q.m.visible!==false)m.fillRect(q.x*k-3,q.z*k-3,6,6)});g.ents.forEach(e=>{if(!e.alive||(!e.isP&&e.bodyT>0&&e.bodyKind==='cloak'))return;m.fillStyle=e.isP?'#fff':'#ef4444';m.beginPath();m.arc(e.x*k,e.z*k,e.isP?8:6,0,7);m.fill()});m.restore()}
const typing=()=>['INPUT','SELECT','TEXTAREA'].includes(document.activeElement?.tagName);
function resetInput(){keys={};mdown=false;drag=false;touch.mx=touch.mz=0;touch.fire=touch.dash=touch.aiming=touch.body=false;viewDrag=viewTouch=null;$('#knob').style.transform='';$('#aim-knob').style.transform='';}
function setPaused(value){if(mode!=='arena'||!G||G.over)return;paused=value;if(paused)music.stop();else void music.start();resetInput();$('#pause').classList.toggle('hide',!paused);if(paused)$('#resume').focus();else document.activeElement?.blur();}
document.addEventListener('fullscreenchange',()=>{resize();if(mode==='garage')garCam();else if(!document.fullscreenElement&&G&&!G.over)setPaused(true);});
$('#music-enable').onchange=e=>{music.setEnabled(e.target.checked);$('#music-toggle').textContent=e.target.checked?'Muzyka: włączona':'Muzyka: wyciszona';};$('#music-volume').oninput=e=>music.setVolume(Number(e.target.value)/100);$('#music-toggle').onclick=()=>{const enabled=!music.snapshot().enabled;music.setEnabled(enabled);$('#music-enable').checked=enabled;$('#music-toggle').textContent=enabled?'Muzyka: włączona':'Muzyka: wyciszona';};
$('#body-btn').onclick=()=>{document.activeElement?.blur();if(G&&!paused&&!G.over)useBody(G.player);};
$('#reload-btn').onclick=()=>{document.activeElement?.blur();if(G&&!paused&&!G.over&&G.cd<=0)reloadAmmo(G.player.ammo);};
$('#pause-btn').onclick=()=>setPaused(true);$('#resume').onclick=()=>setPaused(false);$('#garage-back').onclick=toGarage;
addEventListener('keydown',e=>{if(typing()||mode!=='arena')return;if(['Escape','KeyP'].includes(e.code)){if(!e.repeat)setPaused(!paused);return;}if(paused)return;if(e.code==='KeyR'&&!e.repeat&&G&&!G.over&&G.cd<=0){reloadAmmo(G.player.ammo);e.preventDefault();return;}keys[e.key.toLowerCase()]=true;if(e.key===' '||e.key.startsWith('Arrow'))e.preventDefault();});addEventListener('keyup',e=>{keys[e.key.toLowerCase()]=false;});addEventListener('blur',()=>{resetInput();setPaused(true);});document.addEventListener('visibilitychange',()=>{if(document.hidden){resetInput();setPaused(true);}});
const cv=$('#c');cv.addEventListener('contextmenu',e=>e.preventDefault());
cv.addEventListener('pointerdown',e=>{if(mode==='arena'&&!paused&&!G.over){if(e.pointerType==='touch')viewTouch={id:e.pointerId,x:e.clientX,y:e.clientY};cv.setPointerCapture(e.pointerId);}else if(mode==='garage'){drag=e.clientX;cv.setPointerCapture(e.pointerId);}});
cv.addEventListener('mousedown',e=>{if(mode!=='arena'||paused||G.over||e.sourceCapabilities?.firesTouchEvents)return;if(e.button===2)viewDrag={x:e.clientX,y:e.clientY};if(e.button===0){mdown=true;mouse.x=e.clientX;mouse.y=e.clientY;}});
addEventListener('mouseup',e=>{if(e.button===0)mdown=false;if(e.button===2){viewDrag=null;mouse.x=e.clientX;mouse.y=e.clientY;}});
function release(e){if(viewTouch?.id===e.pointerId)viewTouch=null;mdown=false;viewDrag=null;drag=false;}
addEventListener('pointerup',release);cv.addEventListener('pointercancel',release);cv.addEventListener('lostpointercapture',release);
addEventListener('pointermove',e=>{if(mode==='arena'&&!paused&&!G.over){const active=e.pointerType==='touch'&&viewTouch?.id===e.pointerId?viewTouch:viewDrag;if(active){rotateView(view,e.clientX-active.x,e.clientY-active.y);active.x=e.clientX;active.y=e.clientY;return;}}if(e.pointerType!=='touch'){mouse.x=e.clientX;mouse.y=e.clientY;}if(mode==='garage'&&drag!==false){gyaw+=(e.clientX-drag)*.01;drag=e.clientX;}});
cv.addEventListener('wheel',e=>{if(mode==='arena'&&!paused&&!G.over){e.preventDefault();view.distance=clamp(view.distance+e.deltaY*.01,7,15);}},{passive:false});
const joy=$('#joy'),knob=$('#knob');let jid=null;
function jmove(e){if(paused||mode!=='arena')return;const r=joy.getBoundingClientRect(),dx=e.clientX-r.left-r.width/2,dz=e.clientY-r.top-r.height/2,l=Math.min(1,Math.hypot(dx,dz)/(r.width*.38)),a=Math.atan2(dz,dx);touch.mx=Math.cos(a)*l;touch.mz=Math.sin(a)*l;knob.style.transform=`translate(${Math.cos(a)*l*40}px,${Math.sin(a)*l*40}px)`;}
joy.addEventListener('pointerdown',e=>{if(paused)return;jid=e.pointerId;joy.setPointerCapture(jid);jmove(e);});joy.addEventListener('pointermove',e=>{if(e.pointerId===jid)jmove(e);});for(const event of ['pointerup','pointercancel','lostpointercapture'])joy.addEventListener(event,()=>{jid=null;touch.mx=touch.mz=0;knob.style.transform='';});
const aimStick=$('#aim-joy'),aimKnob=$('#aim-knob');let aimId=null;
function moveAim(e){if(paused||mode!=='arena')return;const r=aimStick.getBoundingClientRect(),x=e.clientX-r.left-r.width/2,z=e.clientY-r.top-r.height/2,d=Math.hypot(x,z),amount=Math.min(1,d/(r.width*.38));touch.ax=d?x/d*amount:0;touch.az=d?z/d*amount:0;touch.aiming=amount>.15;aimKnob.style.transform=`translate(${touch.ax*32}px,${touch.az*32}px)`;}
aimStick.addEventListener('pointerdown',e=>{if(paused)return;aimId=e.pointerId;aimStick.setPointerCapture(aimId);moveAim(e);});aimStick.addEventListener('pointermove',e=>{if(aimId===e.pointerId)moveAim(e);});for(const event of ['pointerup','pointercancel','lostpointercapture'])aimStick.addEventListener(event,()=>{aimId=null;touch.aiming=false;aimKnob.style.transform='';});
for(const [selector,key]of [['#bf','fire'],['#bd','dash']]){const el=$(selector);el.addEventListener('pointerdown',e=>{if(paused||!G||G.over)return;touch[key]=true;el.setPointerCapture(e.pointerId);});for(const event of ['pointerup','pointercancel','lostpointercapture'])el.addEventListener(event,()=>touch[key]=false);}
export function mechSnapshot(){return {mode,paused,music:music.snapshot(),camera:{...view,y:cam.position.y,dragging:!!viewDrag},bots:matchSettings.bots,map:matchSettings.map,aim:G?.player.target?{...G.player.target}:null,guns:G?[muzzle(G.player,0),muzzle(G.player,1)]:[],state:JSON.parse(JSON.stringify(SV)),time:G?.t||0,countdown:G?.cd||0,over:!!G?.over,alive:G?alive().length:0,shots:G?.shots||0,playerShots:G?.player.shots||0,ammo:G?.player.ammo.map(m=>({...m}))||[],interactions:G?.interactions.map(q=>({kind:q.kind,x:q.x,z:q.z,dead:q.dead,height:q.height}))||[],body:G?{kind:G.player.bodyKind,active:G.player.bodyT,cooldown:G.player.bodyCd,rarity:G.player.S.R.body.r}:null,weaponState:G?.player.weaponState,damage:G?{scratches:G.player.model.damage.visible,smoke:G.player.model.smoke.visible}:null,player:G?{x:G.player.x,z:G.player.z,y:G.player.groundY,hp:G.player.hp}:null,input:{...touch,mdown}};}
$('#arena-choice').onchange=e=>{if(MAPS.some(m=>m.id===e.target.value))matchSettings.map=e.target.value;};$('#graphics-shadows').onchange=e=>renderer.shadowMap.enabled=e.target.checked;$('#graphics-shadows').checked=renderer.shadowMap.enabled;
$('#go').onclick=startMatch;$('#opponents').onchange=e=>{const n=Number(e.target.value);if([3,7].includes(n))matchSettings.bots=n;$('#go').textContent=`▶ Do areny! (${matchSettings.bots===3?'3 boty':'7 botów'})`;};
let last=performance.now();
function loop(now){requestAnimationFrame(loop);const dt=Math.min(.05,(now-last)/1000);last=now;
 if(mode==='garage'){if(garMech){gyaw+=dt*.3*(drag===false&&!matchMedia('(prefers-reduced-motion: reduce)').matches?1:0);garMech.g.rotation.y=gyaw}renderer.render(gscene,cam)}else if(G){if(!paused&&!G.over)update(dt);hud();renderer.render(scene,cam)}}
save();resize();garCam();renderGarage();showGarMech();requestAnimationFrame(loop);
