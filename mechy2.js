import {RAR,LEGS,BODY,HEAD,WPN,SP,MAGE,CAT,CRATES,MAGE_PRICE,WIN_GOLD,CODES,PAL,ACC,NAMES,hex} from './mechy2-data.js?v=mechs-69';
import {fresh,validState,buyCrate,redeemCode,completeMatch} from './mechy2-state.js?v=mechs-69';
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
const descriptions={legs:['Szybki przejazd i lekka konstrukcja.','Uniwersalny, kroczący układ.','Stabilna postawa na czterech podporach.','Ciężki, odporny układ gąsienicowy.'],body:['Lekka, zwrotna rama.','Zrównoważony pancerz do wielu zestawów.','Grube osłony i masywna konstrukcja.','Wzmocniona rama do natarcia.'],head:['Osłania kokpit.','Ułatwia precyzyjny ostrzał.','Przyspiesza pracę uzbrojenia.','Wspiera mobilność i rozpoznanie.'],wpn:['Równe serie na średnim dystansie.','Pojedyncze ciężkie pociski.','Precyzyjna wiązka energii.','Salwy eksplodujących rakiet.','Rozproszony ostrzał z bliska.','Strumień ognia do bliskiej walki.'],sp:['Krótki unik z dopalaczem.','Tymczasowa osłona energetyczna.','Stopniowa naprawa uszkodzeń.','Chwilowe wzmocnienie ostrzału.','Impuls zatrzymujący pobliskich rywali.']};
const mageDescriptions=['Trafienia podpalają przeciwników.','Trafienia spowalniają przeciwników.','Część trafień wywołuje dodatkowy łuk energii.','Odzyskuje energię z zadanych obrażeń.','Czasami unika nadchodzącego trafienia.','Wzmacnia pancerz i wytrzymałość.'];
function pinfo(p){return descriptions[p.slot][p.t];}
/* ---------- 4. MODELE 3D ---------- */
const MATS={};const mat=(c,e)=>MATS[c+'_'+(e||0)]||(MATS[c+'_'+(e||0)]=new THREE.MeshLambertMaterial({color:c,emissive:e||0}));
const glow=c=>MATS['g'+c]||(MATS['g'+c]=new THREE.MeshBasicMaterial({color:c}));
const LH=1.1,DK=0x2b313a,GLASS=0x1e6f82;
function bx(p,w,h,d,m,x,y,z){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);p.add(o);return o}
function cy(p,r,l,m,x,y,z,rx,rz){const o=new THREE.Mesh(new THREE.CylinderGeometry(r,r,l,10),m);o.position.set(x,y,z);o.rotation.x=rx||0;o.rotation.z=rz||0;p.add(o);return o}
function sp_(p,r,m,x,y,z){const o=new THREE.Mesh(new THREE.SphereGeometry(r,10,8),m);o.position.set(x,y,z);p.add(o);return o}
function wpnModel(k,main,acc,rc){const g=new THREE.Group(),dk=mat(DK),lit=glow(0xffffff);
 bx(g,.55,.75,.7,dk,0,0,0);bx(g,.5,.12,.6,acc,0,.42,.05);bx(g,.3,.06,.06,glow(rc),0,.3,.36);
 if(k==='mg'){cy(g,.07,1.5,dk,-.12,0,.95,Math.PI/2);cy(g,.07,1.5,dk,.12,0,.95,Math.PI/2);bx(g,.4,.25,.5,main,0,.1,.5)}
 else if(k==='cannon'){cy(g,.2,1.6,dk,0,0,1,Math.PI/2);cy(g,.27,.35,main,0,0,1.8,Math.PI/2);bx(g,.5,.4,.6,main,0,.1,.4)}
 else if(k==='laser'){cy(g,.1,1.2,glow(0x22d3ee),0,0,1,Math.PI/2);cy(g,.2,.3,dk,0,0,.55,Math.PI/2);cy(g,.2,.3,dk,0,0,1.05,Math.PI/2);bx(g,.4,.3,.6,main,0,.12,.4)}
 else if(k==='rocket'){bx(g,.95,.95,1.1,main,0,0,.55);bx(g,.99,.1,1.12,acc,0,.3,.55);for(let i=0;i<2;i++)for(let j=0;j<4;j++)sp_(g,.15,glow(0xf5c542),-.3+j*.2,-.22+i*.45,1.12)}   // pod z głowicami jak na zdjęciu
 else if(k==='shotgun'){cy(g,.1,1,dk,-.12,0,.9,Math.PI/2);cy(g,.1,1,dk,.12,0,.9,Math.PI/2);bx(g,.45,.3,.5,main,0,.1,.4)}
 else{cy(g,.14,1,dk,0,0,.95,Math.PI/2);cy(g,.2,.3,glow(0xf97316),0,0,1.5,Math.PI/2);cy(g,.25,.6,main,0,-.35,.2,0,Math.PI/2)}
 return g}
function mkMech(R,colHex,accHex){const S=stats(R),[w,h,d]=S.s,g=new THREE.Group(),top=new THREE.Group(),lg=new THREE.Group(),parts=[],main=mat(colHex),acc=mat(accHex),dk=mat(DK),lit=glow(0xffffff),rcl=k=>parseInt(RAR[R[k].r].c.slice(1),16);
 const Lk=S.L.k,rcL=glow(rcl('legs'));
 if(Lk==='wheel')[-1,1].forEach(s=>{const c=cy(lg,.62,.5,dk,s*(w/2),.62,0,0,Math.PI/2);parts.push(c);cy(lg,.3,.55,acc,s*(w/2),.62,0,0,Math.PI/2).rotation.z=Math.PI/2;bx(lg,.2,.1,.1,rcL,s*(w/2+.3),1.15,.2)});
 else if(Lk==='trk')[-1,1].forEach(s=>{bx(lg,.8,.9,d*1.7,dk,s*(w/2),.45,0);bx(lg,.84,.18,d*1.7,acc,s*(w/2),.95,0);bx(lg,.15,.1,.5,rcL,s*(w/2+.42),.5,.3)});
 else{const pos=Lk==='bi'?[[-1,0],[1,0]]:[[-1,-1],[1,-1],[-1,1],[1,1]],q=Lk==='bi'?1:.7;pos.forEach(p=>{const pv=new THREE.Group();pv.position.set(p[0]*w*.34,LH,p[1]*d*.32);
  bx(pv,.7*q,.6,.8*q,main,0,-.2,0);bx(pv,.78*q,.3,.5,acc,0,-.45,.3);bx(pv,.4*q,.1,.12,lit,0,-.42,.6);bx(pv,.6*q,.55,.7*q,main,0,-.72,0);bx(pv,.5*q,.1,.12,rcL,0,-.9,.38);bx(pv,.8*q,.2,1.1*q,dk,0,-LH+.1,.15);lg.add(pv);parts.push(pv)})}
 top.position.y=LH;
 bx(top,w,h,d,main,0,h/2,0);bx(top,w*.8,.16,d*.75,acc,0,h+.08,0);bx(top,w*1.02,.08,d*1.02,acc,0,h*.35,0);
 [-1,1].forEach(s=>{bx(top,.45,.55,d*.95,main,s*(w/2+.1),h*.78,0);bx(top,.35,.14,.06,lit,s*w*.3,h*.55,d/2+.03)});
 bx(top,w*.5,.3,.25,dk,0,h*.85,-d/2);bx(top,w*.5,.08,.06,glow(rcl('body')),0,h*.15,d/2+.03);
 const hd=new THREE.Group();hd.position.set(0,h,d*.1);top.add(hd);const k=S.H.k;
 if(k==='arm'){bx(hd,1,.6,1,main,0,.3,0);bx(hd,.7,.18,.06,glow(0x67e8f9),0,.38,.52);bx(hd,1.04,.1,1.04,acc,0,.62,0)}
 else if(k==='snp'){bx(hd,.8,.5,.9,main,0,.25,0);cy(hd,.08,1.1,dk,.2,.4,.8,Math.PI/2);bx(hd,.5,.15,.06,glow(0xff3b3b),-.05,.3,.46)}
 else if(k==='cool'){bx(hd,.9,.5,.9,main,0,.25,0);for(let i=-1;i<=1;i++)bx(hd,.9,.5,.06,acc,0,.5,i*.3);bx(hd,.6,.16,.05,glow(0x67e8f9),0,.28,.46)}
 else{sp_(hd,.45,main,0,.3,0);cy(hd,.03,.9,dk,.3,.8,0);sp_(hd,.12,glow(0x67e8f9),.3,1.28,0);bx(hd,.5,.15,.05,glow(0x67e8f9),0,.3,.42)}
 bx(hd,.3,.06,.06,glow(rcl('head')),0,.05,.5);
 const wp=[];[['gl',-1],['gr',1]].forEach(([k2,s])=>{const pv=new THREE.Group();pv.position.set(s*(w/2+.6),h*.55,.25);pv.add(wpnModel(WPN[R[k2].t].k,main,acc,rcl(k2)));top.add(pv);wp.push(pv)});
 const sk=S.sp.k;if(sk==='dash')[-1,1].forEach(s=>cy(top,.2,.6,mat(0xf97316),s*.4,h*.6,-d/2-.3,Math.PI/2));if(sk==='repair')bx(top,.6,.6,.2,mat(0x22c55e),0,h*.55,-d/2-.12);
 if(sk==='shield')sp_(top,.3,glow(0x38bdf8),0,h*.55,-d/2-.2);if(sk==='over')bx(top,.7,.5,.3,glow(0xfacc15),0,h*.55,-d/2-.18);if(sk==='emp')cy(top,.4,.2,glow(0x38bdf8),0,h+.3,-d*.3);
 let sh=new THREE.Mesh(new THREE.SphereGeometry(Math.max(w,d)*1.05,16,12),new THREE.MeshBasicMaterial({color:0x38bdf8,transparent:true,opacity:.25}));sh.position.y=LH+h/2;sh.visible=false;g.add(sh);
 g.add(lg);g.add(top);return{g,top,lg,parts,sh,wp}}

/* ---------- renderer ---------- */
let renderer;try{renderer=new THREE.WebGLRenderer({canvas:$('#c'),antialias:true});}catch(error){$('#load-error').classList.remove('hide');throw error;}renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));
const cam=new THREE.PerspectiveCamera(50,1,.1,200),FOV=50,gscene=new THREE.Scene(),scene=new THREE.Scene();
let paused=false;let mode='garage',garMech=null,gyaw=.7,drag=false,W=innerWidth,H=innerHeight;
[gscene,scene].forEach(s=>{s.add(new THREE.AmbientLight(0xffffff,.7));const l=new THREE.DirectionalLight(0xfff1dd,.95);l.position.set(8,14,7);s.add(l);const l2=new THREE.DirectionalLight(0x5eead4,.45);l2.position.set(-9,6,-8);s.add(l2)});
gscene.background=new THREE.Color(0x06130f);scene.background=new THREE.Color(0x07120f);scene.fog=new THREE.Fog(0x07120f,45,95);
{const gg=new THREE.GridHelper(40,40,0x1c6b57,0x12382f);gg.position.y=-.3;gscene.add(gg);const pl=new THREE.Mesh(new THREE.BoxGeometry(6.4,.2,6.4),mat(0x0f2a25));pl.position.y=-.2;gscene.add(pl);const fr=new THREE.Mesh(new THREE.BoxGeometry(6.6,.1,6.6),glow(0xffffff));fr.position.y=-.32;gscene.add(fr)}
function resize(){W=innerWidth;H=innerHeight;renderer.setSize(W,H,false);cam.aspect=W/H;cam.updateProjectionMatrix();const hc=$('#hc');hc.width=W;hc.height=H}
addEventListener('resize',()=>{resize();if(mode==='garage')garCam()});
function garCam(){cam.position.set(0,3.8,10);cam.lookAt(0,1.8,0);const n=W<760,r=W>1000;cam.setViewOffset(W,H,n?0:-(r?70:215),n?H*.3:0,W,H)}
function disposeTree(root){const geos=new Set(),mats=new Set();root.traverse(o=>{if(o.geometry)geos.add(o.geometry);if(o.material&&!Object.values(MATS).includes(o.material))mats.add(o.material);});geos.forEach(g=>{if(![SHELL,BUL,ROC,FXG].includes(g))g.dispose();});mats.forEach(m=>m.dispose());}
function showGarMech(){if(garMech){gscene.remove(garMech.g);disposeTree(garMech.g);}garMech=mkMech(equipped(),PAL[SV.col],ACC[SV.acc]);gscene.add(garMech.g)}

/* ---------- 5. GARAŻ I SKLEP ---------- */
let tab='legs',side='gl',codeMsg='';
const TABS=[['legs','Nogi'],['body','Korpus'],['head','Głowa'],['wpn','Broń'],['sp','Moc'],['shop','Sklep'],['mech','Mech']];
function bar(l,v,m){return`<div class="st"><span>${l}</span><div class="bar"><i style="width:${clamp(v/m*100,3,100)}%"></i></div><b>${Math.round(v)}</b></div>`}
function statBlock(){const S=stats(equipped());return `<p>${S.mage.ic} <b>${S.mage.n}</b><br><span class="mut">${mageDescriptions[SV.mage]}</span></p><p>${S.sp.ic} <b>${S.sp.n}</b><br><span class="mut">${pinfo(equipped().sp)} · Spacja / E</span></p>`;}
function card(p){const r=RAR[p.r],t=CAT[p.slot][p.t],eq=isEq(p);return`<div role="button" tabindex="0" class="cd ${eq?'eq':''}" style="--rc:${r.c}" data-id="${p.id}"><div class="ic">${t.ic}</div><b>${t.n}</b><div class="rr">${r.n}</div><small>${pinfo(p)}</small>${eq?'<small>✓ założone</small>':`<span role="button" tabindex="0" class="sl" data-sell="${p.id}">sprzedaj ${r.sell}💰</span>`}</div>`}
function colors(){return`<h3>Kolor główny</h3>${PAL.map((c,i)=>`<span class="dot ${SV.col===i?'sel':''}" data-col="${i}" style="background:${hex(c)}"></span>`).join('')}<h3>Kolor dodatkowy</h3>${ACC.map((c,i)=>`<span class="dot ${SV.acc===i?'sel':''}" data-acc="${i}" style="background:${hex(c)}"></span>`).join('')}`}
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
 document.querySelectorAll('[data-col]').forEach(d=>d.onclick=()=>{SV.col=+d.dataset.col;save();renderGarage();showGarMech()});
 document.querySelectorAll('[data-acc]').forEach(d=>d.onclick=()=>{SV.acc=+d.dataset.acc;save();renderGarage();showGarMech()});
 const mg=$('#mg');if(mg)mg.onclick=()=>{if(SV.gold<MAGE_PRICE)return;SV.gold-=MAGE_PRICE;SV.mage=ri(MAGE.length);save();renderGarage();showGarMech();const m=MAGE[SV.mage];modal(`<div style="font-size:60px">${m.ic}</div><h2>${m.n}</h2><p>${mageDescriptions[SV.mage]}</p>`,'#a855f7')};
 const ck=$('#cok');if(ck)ck.onclick=redeem;const ci=$('#code');if(ci)ci.onkeydown=e=>{e.stopPropagation();if(e.key==='Enter')redeem()};
 $('#go2')&&($('#go2').onclick=startMatch)}
function redeem(){const input=$('#code').value||'',result=redeemCode(SV,input);codeMsg=result==='ok'?'✅ Kod przyjęty! +100 000 💰':result==='used'?'⚠️ Ten kod został już użyty.':'❌ Nieznany kod.';if(result==='ok')save();renderGarage();}
function modal(html,rc){const m=$('#modal');m.style.setProperty('--rc',rc);m.innerHTML=`<div class="box">${html}<button class="btn" id="mok">OK</button></div>`;m.classList.remove('hide');$('#mok').onclick=()=>m.classList.add('hide')}
function modalPart(p){const r=RAR[p.r],t=CAT[p.slot][p.t];modal(`<div class="rr" style="color:${r.c};font-weight:900;font-size:20px;text-transform:uppercase">${r.n}</div><div style="font-size:64px">${t.ic}</div><h2>${t.n}</h2><p class="mut">${pinfo(p)}</p>`,r.c)}

/* ---------- 6. ARENA ---------- */
const R_ARENA=42;let G=null,keys={},mdown=false,mouse={x:W/2,y:H/2},touch={mx:0,mz:0,fire:false,dash:false},camP={x:0,z:0},AC=null;
function sfx(f,d,type='square',v=.03){try{AC=AC||new AudioContext();const o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.value=f;g.gain.value=v;o.connect(g);g.connect(AC.destination);o.start();g.gain.exponentialRampToValueAtTime(.0001,AC.currentTime+d);o.stop(AC.currentTime+d)}catch(e){}}
const SHELL=new THREE.SphereGeometry(.22,8,6),BUL=new THREE.BoxGeometry(.12,.12,.7),ROC=new THREE.CylinderGeometry(.14,.14,.8,6),FXG=new THREE.SphereGeometry(1,12,8);
function startMatch(){
 document.activeElement?.blur();resetInput();paused=false;$('#pause').classList.add('hide');if(G)clearArena();mode='arena';$('#gp').classList.add('hide');$('#rp').classList.add('hide');$('#hud').classList.remove('hide');$('#end').classList.add('hide');if(matchMedia('(pointer:coarse)').matches)$('#touch').classList.remove('hide');
 const ground=new THREE.Mesh(new THREE.CircleGeometry(R_ARENA+4,48),mat(0x1d2b2a));ground.rotation.x=-Math.PI/2;scene.add(ground);const grid=new THREE.GridHelper(R_ARENA*2,28,0x2a5a4c,0x1c3b33);grid.position.y=.02;scene.add(grid);
 const zone=new THREE.Mesh(new THREE.CylinderGeometry(R_ARENA,R_ARENA,7,48,1,true),new THREE.MeshBasicMaterial({color:0xef4444,transparent:true,opacity:.22,side:THREE.DoubleSide}));zone.position.y=3.5;scene.add(zone);
 G={ents:[],obst:[],proj:[],beams:[],fx:[],kits:[],feed:[],t:0,cd:3.2,over:false,shown:false,zr:40,stage:0,phase:'wait',timer:18,r0:40,r1:40,ground,grid,zone,stages:[{w:18,s:14,r:27},{w:14,s:12,r:16},{w:12,s:10,r:8},{w:10,s:8,r:3}]};
 for(let i=0;i<20;i++){const r=rnd(1.2,2.8),a=rnd(0,6.283),d=rnd(6,36),o={x:Math.cos(a)*d,z:Math.sin(a)*d,r};if(G.obst.some(q=>Math.hypot(q.x-o.x,q.z-o.z)<q.r+o.r+3))continue;
  const m=i%2?new THREE.Mesh(new THREE.BoxGeometry(r*1.7,r*2,r*1.7),mat(0x3f4f55)):new THREE.Mesh(new THREE.CylinderGeometry(r,r,r*2.2,10),mat(0x4b5f66));m.position.set(o.x,r,o.z);scene.add(m);o.mesh=m;G.obst.push(o)}
 for(let i=0;i<10;i++){const a=rnd(0,6.283),d=rnd(4,34),m=new THREE.Mesh(new THREE.BoxGeometry(.8,.8,.8),glow(0x22c55e));m.position.set(Math.cos(a)*d,.7,Math.sin(a)*d);scene.add(m);G.kits.push({x:m.position.x,z:m.position.z,m})}
 const mine=equipped(),avg=avgR(mine);
 for(let i=0;i<8;i++){const a=i/8*6.283+.3,p=i===0,R=p?mine:botR(avg),e=mkEnt(R,p?'Ty':NAMES[i],p,p?PAL[SV.col]:PAL[ri(8)],p?ACC[SV.acc]:ACC[ri(6)]);e.x=Math.cos(a)*31;e.z=Math.sin(a)*31;e.aim=Math.atan2(-e.x,-e.z);e.face=e.aim;e.torso=e.aim;e.wa=[e.aim,e.aim];G.ents.push(e);scene.add(e.model.g)}
 G.player=G.ents[0];camP.x=G.player.x;camP.z=G.player.z}
function mkEnt(R,name,isP,col,acc){const S=stats(R);return{name,isP,S,x:0,z:0,vx:0,vz:0,ix:0,iz:0,aim:0,face:0,torso:0,wa:[0,0],hp:S.hp,max:S.hp,shield:0,shT:0,bsT:0,cd:[0,0],spCd:3,dashT:0,dx:0,dz:0,alive:true,kills:0,place:0,rad:Math.max(1,S.s[0]/2+.3),
  burnT:0,burnDps:0,burnSrc:null,slowT:0,stunT:0,healT:0,overT:0,model:mkMech(R,col,acc),ai:{tgt:null,tt:0,str:1,st:rnd(1,3),err:rnd(.04,.14)},walk:0,lastHit:0}}
function clearArena(){[G.ground,G.grid,G.zone,...G.obst.map(o=>o.mesh),...G.kits.map(k=>k.m),...G.ents.map(e=>e.model.g),...G.proj.map(p=>p.m),...G.beams.map(b=>b.m),...G.fx.map(f=>f.m)].forEach(o=>{if(o){scene.remove(o);disposeTree(o);}});G=null}
const alive=()=>G.ents.filter(e=>e.alive);
function feed(t){G.feed.push({t,l:5});if(G.feed.length>5)G.feed.shift()}
function boom(x,z,r,col=0xfbbf24,vx=0,vz=0,l=.4){if(G.fx.length>50)return;const m=new THREE.Mesh(FXG,new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.8}));m.position.set(x,1.4,z);scene.add(m);G.fx.push({m,r,l,t:l,vx,vz,x,z})}
function nearestTo(e,ex,rng){let b=null,bd=rng;G.ents.forEach(o=>{if(o===e||o===ex||!o.alive)return;const d=Math.hypot(o.x-e.x,o.z-e.z);if(d<bd){bd=d;b=o}});return b}
function beamFx(a,b){const dx=b.x-a.x,dz=b.z-a.z,L=Math.hypot(dx,dz),m=new THREE.Mesh(new THREE.BoxGeometry(.12,.12,1),glow(0xfde047));m.position.set((a.x+b.x)/2,1.6,(a.z+b.z)/2);m.scale.z=L;m.rotation.y=Math.atan2(dx,dz);scene.add(m);G.beams.push({m,l:.12})}
function hurt(e,d,src,o){o=o||{};if(!e.alive||G.cd>0)return;
 if(e.S.mage.k==='cie'&&!o.noProc&&Math.random()<.12)return;
 d*=1-e.S.arm;if(e.shield>0){const a=Math.min(e.shield,d);e.shield-=a;d-=a}e.hp-=d;e.shT=5;e.lastHit=.6;
 if(e.isP&&!o.quiet){$('#flash').style.opacity=.9;setTimeout(()=>$('#flash').style.opacity=0,120)}
 const mg=src&&src!==e&&src.alive?src.S.mage:null;
 if(mg&&!o.noProc){if(mg.k==='pyr'){e.burnT=3;e.burnDps=3;e.burnSrc=src}else if(mg.k==='kri')e.slowT=2;else if(mg.k==='bur'&&Math.random()<.18){const n=nearestTo(e,src,10);if(n){hurt(n,14,src,{noProc:1});beamFx(e,n)}}else if(mg.k==='wam')src.hp=Math.min(src.max,src.hp+d*.08)}
 if(e.hp<=0&&e.alive){e.alive=false;e.hp=0;e.place=alive().length+1;scene.remove(e.model.g);boom(e.x,e.z,3.2,0xf97316);if(src&&src!==e)src.kills++;feed(`${src&&src!==e?src.name+' ✕ ':'💀 '}${e.name}`);if(e.isP)sfx(80,.5,'sawtooth',.06);else if(Math.hypot(e.x-G.player.x,e.z-G.player.z)<30)sfx(120,.3,'sawtooth',.04)}}
function explode(x,z,r,d,own){boom(x,z,r);G.ents.forEach(e=>{if(!e.alive)return;const dd=Math.hypot(e.x-x,e.z-z);if(dd<r+e.rad)hurt(e,d*(1-.6*dd/(r+e.rad)),own)})}
function muzzle(e,i){const w=e.S.s[0],t=e.torso,ox=(i?1:-1)*(w/2+.6),a=e.wa[i],fz=e.S.G[i].len+.3,sx=e.x+Math.cos(t)*ox+Math.sin(t)*.25,sz=e.z-Math.sin(t)*ox+Math.cos(t)*.25;return{x:sx+Math.sin(a)*fz,z:sz+Math.cos(a)*fz,y:LH+e.S.s[1]*.55}}
const angd=(a,b)=>((b-a+Math.PI)%(2*Math.PI)+2*Math.PI)%(2*Math.PI)-Math.PI;
function shoot(e,i){G.shots=(G.shots||0)+1;const A0=e.wa[i],g=e.S.G[i],m=muzzle(e,i),dm=e.overT>0?1.6:1,D=g.d*dm;
 if(g.k==='flame'){G.ents.forEach(t=>{if(t===e||!t.alive)return;const ex=t.x-m.x,ez=t.z-m.z,d=Math.hypot(ex,ez);if(d<g.range+t.rad&&(Math.abs(angd(A0,Math.atan2(ex,ez)))<.42||d<t.rad+1.2)){hurt(t,D,e);t.burnT=2;t.burnDps=3;t.burnSrc=e}});
  boom(m.x+Math.sin(A0)*2,m.z+Math.cos(A0)*2,1.3,0xf97316,Math.sin(A0)*8,Math.cos(A0)*8,.3);if(e.isP&&Math.random()<.3)sfx(90,.1,'sawtooth',.02);return}
 if(g.k==='laser'){const dx=Math.sin(A0),dz=Math.cos(A0);let best=g.range,hit=null;
  G.obst.forEach(o=>{const ex=o.x-m.x,ez=o.z-m.z,t=ex*dx+ez*dz;if(t>0&&t<best&&ex*ex+ez*ez-t*t<o.r*o.r)best=t});
  G.ents.forEach(t2=>{if(t2===e||!t2.alive)return;const ex=t2.x-m.x,ez=t2.z-m.z,t=ex*dx+ez*dz;if(t>0&&t<best&&ex*ex+ez*ez-t*t<t2.rad*t2.rad){best=t;hit=t2}});
  if(hit)hurt(hit,D,e);const b=new THREE.Mesh(new THREE.BoxGeometry(.1,.1,1),glow(0x22d3ee));b.position.set(m.x+dx*best/2,m.y,m.z+dz*best/2);b.scale.z=best;b.rotation.y=A0;scene.add(b);G.beams.push({m:b,l:.07});if(e.isP)sfx(900,.06,'sine',.02);return}
 const n=g.pellets||1;for(let k=0;k<n;k++){const a=A0+rnd(-g.sp,g.sp),mesh=new THREE.Mesh(g.k==='rocket'?ROC:g.k==='cannon'?SHELL:BUL,glow(g.k==='rocket'?0xf97316:g.k==='cannon'?0xfde047:0xfbbf24));
  mesh.position.set(m.x,m.y,m.z);mesh.rotation.y=a;if(g.k==='rocket')mesh.rotation.x=Math.PI/2;scene.add(mesh);G.proj.push({x:m.x,z:m.z,vx:Math.sin(a)*g.v,vz:Math.cos(a)*g.v,d:D,own:e,life:g.range/g.v,sp:g.splash||0,m:mesh})}
 if(e.isP||Math.hypot(e.x-G.player.x,e.z-G.player.z)<22)sfx(g.k==='cannon'||g.k==='rocket'?150:g.k==='shotgun'?110:380,.07,'square',.02)}
function useSp(e){if(e.spCd>0)return;const k=e.S.sp.k,m=e.S.spm;e.spCd=e.S.spCd;
 if(k==='dash'){e.dashT=.28;const L=Math.hypot(e.ix,e.iz);e.dx=L>.1?e.ix/L:Math.sin(e.aim);e.dz=L>.1?e.iz/L:Math.cos(e.aim)}
 else if(k==='shield'){e.shield=90*m;e.bsT=4}else if(k==='repair')e.healT=4;else if(k==='over')e.overT=5;
 else if(k==='emp'){G.ents.forEach(t=>{if(t!==e&&t.alive&&Math.hypot(t.x-e.x,t.z-e.z)<9)t.stunT=1.5});boom(e.x,e.z,9,0x38bdf8,0,0,.5)}
 if(e.isP)sfx(260,.25,'sawtooth',.04)}
const lerpA=(a,b,t)=>a+angd(a,b)*clamp(t,0,1);
function aimWorld(){const t=Math.tan(FOV*Math.PI/360),nx=mouse.x/W*2-1,ny=-(mouse.y/H*2-1),L=Math.hypot(18,14),f=[0,-18/L,-14/L],u=[0,14/L,-18/L];const d=[nx*t*(W/H),f[1]+ny*t*u[1],f[2]+ny*t*u[2]],tt=-18/d[1];return{x:camP.x+d[0]*tt,z:camP.z+14+d[2]*tt}}
function toScreen(x,y,z){const t=Math.tan(FOV*Math.PI/360),L=Math.hypot(18,14),f=[0,-18/L,-14/L],u=[0,14/L,-18/L],v=[x-camP.x,y-18,z-(camP.z+14)],dep=v[1]*f[1]+v[2]*f[2];return dep<=0?null:{x:(v[0]/(dep*t*(W/H))*.5+.5)*W,y:(.5-(v[1]*u[1]+v[2]*u[2])/(dep*t)*.5)*H}}
function nearestEnemy(e){let b=null,bd=1e9;G.ents.forEach(o=>{if(o===e||!o.alive)return;const d=Math.hypot(o.x-e.x,o.z-e.z);if(d<bd){bd=d;b=o}});return{e:b,d:bd}}

/* ---------- 7. AI BOTÓW ---------- */
function ai(e,dt){const A=e.ai,out={ix:0,iz:0,aim:e.aim,fire:false,sp:false};A.tt-=dt;
 if(A.tt<=0||!A.tgt||!A.tgt.alive){A.tgt=nearestEnemy(e).e;A.tt=1.2}A.st-=dt;if(A.st<=0){A.str*=-1;A.st=rnd(1.2,3)}
 const dc=Math.hypot(e.x,e.z),k=e.S.sp.k,t=A.tgt;let mx=0,mz=0,d=1e9;
 if(dc>G.zr-5){mx=-e.x/dc;mz=-e.z/dc}else if(e.hp<e.max*.45){let q=null,qd=40;G.kits.forEach(o=>{const dd=Math.hypot(o.x-e.x,o.z-e.z);if(o.m.visible!==false&&dd<qd){qd=dd;q=o}});if(q){mx=(q.x-e.x)/qd;mz=(q.z-e.z)/qd}}
 if(t){const dx=t.x-e.x,dz=t.z-e.z;d=Math.hypot(dx,dz)||1;const want=e.S.rng*.65;
  if(!mx&&!mz){const s=d>want?1:d<want*.55?-1:0;mx=dx/d*s-dz/d*A.str*.8;mz=dz/d*s+dx/d*A.str*.8}
  const sp=Math.max(e.S.G[0].v||60,e.S.G[1].v||60),lead=d/sp,er=A.err*d*.3;out.aim=Math.atan2(dx+t.vx*lead+rnd(-1,1)*er,dz+t.vz*lead+rnd(-1,1)*er);
  out.fire=d<e.S.rng*1.05&&Math.abs(angd(e.aim,out.aim))<.25&&G.cd<=0}
 else if(!mx&&!mz){mx=-e.x/(dc||1);mz=-e.z/(dc||1)}
 G.obst.forEach(o=>{const dx=e.x-o.x,dz=e.z-o.z,dd=Math.hypot(dx,dz);if(dd>0&&dd<o.r+3.2){mx+=dx/dd*1.5;mz+=dz/dd*1.5}});
 if(e.spCd<=0){if(k==='dash'&&(dc>G.zr+1||(e.lastHit>0&&Math.random()<.03)))out.sp=true;else if(k==='shield'&&e.lastHit>0)out.sp=true;else if(k==='repair'&&e.hp<e.max*.5)out.sp=true;else if(k==='over'&&t&&d<e.S.rng)out.sp=true;else if(k==='emp'&&nearestTo(e,null,7))out.sp=true}
 out.ix=mx;out.iz=mz;return out}

/* ---------- aktualizacja gry ---------- */
function update(dt){const g=G;if(paused||g.over)return;g.t+=dt;
 if(g.cd>0){g.cd-=dt;$('#cd').classList.toggle('hide',g.cd<=0);$('#cd').textContent=g.cd>2.2?'3':g.cd>1.2?'2':g.cd>.2?'1':'WALKA!';if(g.cd<=0)$('#cd').classList.add('hide')}
 if(g.cd<=0&&g.stage<g.stages.length){g.timer-=dt;const s=g.stages[g.stage];
  if(g.phase==='wait'&&g.timer<=0){g.phase='shrink';g.timer=s.s;g.r0=g.zr;g.r1=s.r}
  else if(g.phase==='shrink'){g.zr=g.r0+(g.r1-g.r0)*(1-Math.max(0,g.timer)/s.s);if(g.timer<=0){g.zr=g.r1;g.stage++;g.phase='wait';g.timer=g.stages[g.stage]?g.stages[g.stage].w:0}}}
 g.zone.scale.set(g.zr/R_ARENA,1,g.zr/R_ARENA);const zdps=3+g.stage*3;
 g.ents.forEach(e=>{if(!e.alive)return;
  let c;if(e.isP){const k=keys,ix=(k.d||k.arrowright?1:0)-(k.a||k.arrowleft?1:0)+touch.mx,iz=(k.s||k.arrowdown?1:0)-(k.w||k.arrowup?1:0)+touch.mz;c={ix,iz,fire:mdown||touch.fire,sp:!!(k[' ']||k.e||touch.dash)};
   if(touch.fire&&!mdown){const n=nearestEnemy(e);c.aim=n.e?Math.atan2(n.e.x-e.x,n.e.z-e.z):e.aim}else{const a=aimWorld();c.aim=Math.atan2(a.x-e.x,a.z-e.z)}}else c=ai(e,dt);
  if(g.cd>0||e.stunT>0){c.fire=false;c.ix=c.iz=0;c.sp=false}
  const L=Math.hypot(c.ix,c.iz);if(L>1){c.ix/=L;c.iz/=L}e.ix=c.ix;e.iz=c.iz;
  e.aim=lerpA(e.aim,c.aim,dt*(e.isP?18:8));e.torso=lerpA(e.torso,e.aim,dt*3.2);e.wa[0]=lerpA(e.wa[0],e.aim,dt*16);e.wa[1]=lerpA(e.wa[1],e.aim,dt*16);e.spCd-=dt;if(c.sp)useSp(e);
  const sl=e.slowT>0?.65:1,spd=e.S.spd*sl;
  if(e.dashT>0){e.dashT-=dt;e.vx=e.dx*spd*3.2;e.vz=e.dz*spd*3.2}else{e.vx+=(c.ix*spd-e.vx)*Math.min(1,dt*7);e.vz+=(c.iz*spd-e.vz)*Math.min(1,dt*7)}
  e.x+=e.vx*dt;e.z+=e.vz*dt;
  g.obst.forEach(o=>{const dx=e.x-o.x,dz=e.z-o.z,d=Math.hypot(dx,dz),m=o.r+e.rad;if(d<m&&d>0){e.x=o.x+dx/d*m;e.z=o.z+dz/d*m}});
  g.ents.forEach(o=>{if(o===e||!o.alive)return;const dx=e.x-o.x,dz=e.z-o.z,d=Math.hypot(dx,dz),m=e.rad+o.rad;if(d<m&&d>0){const p=(m-d)/2;e.x+=dx/d*p;e.z+=dz/d*p;o.x-=dx/d*p;o.z-=dz/d*p}});
  const dd=Math.hypot(e.x,e.z);if(dd>R_ARENA-1){e.x*=(R_ARENA-1)/dd;e.z*=(R_ARENA-1)/dd}
  e.cd[0]-=dt;e.cd[1]-=dt;if(c.fire)for(let i=0;i<2;i++)if(e.cd[i]<=0){shoot(e,i);e.cd[i]=1/e.S.G[i].r}
  e.lastHit-=dt;e.stunT-=dt;e.slowT-=dt;e.overT-=dt;if(e.bsT>0){e.bsT-=dt;if(e.bsT<=0)e.shield=0}if(e.healT>0){e.healT-=dt;e.hp=Math.min(e.max,e.hp+e.max*.35/4*dt)}
  if(e.burnT>0){e.burnT-=dt;hurt(e,e.burnDps*dt,e.burnSrc,{noProc:1,quiet:1})}
  if(e.alive&&Math.hypot(e.x,e.z)>g.zr&&g.cd<=0){e.hp-=zdps*dt;if(e.isP)$('#flash').style.opacity=.5;if(e.hp<=0){e.hp=0;e.alive=false;e.place=alive().length+1;scene.remove(e.model.g);boom(e.x,e.z,3,0xef4444);feed(`🔴 Strefa ✕ ${e.name}`)}}
  if(!e.alive)return;
  g.kits.forEach(k=>{if(k.m.visible!==false&&e.hp<e.max&&Math.hypot(k.x-e.x,k.z-e.z)<1.8){e.hp=Math.min(e.max,e.hp+e.max*.3);k.m.visible=false;k.m.position.y=-9;if(e.isP)sfx(660,.15,'sine',.04)}});
  const m=e.model;m.g.position.set(e.x,0,e.z);m.top.rotation.y=e.torso;m.wp.forEach((p,i)=>p.rotation.y=angd(e.torso,e.wa[i]));const sp=Math.hypot(e.vx,e.vz);if(sp>.6)e.face=lerpA(e.face,Math.atan2(e.vx,e.vz),dt*8);m.lg.rotation.y=e.face;e.walk+=sp*dt*1.4;
  m.parts.forEach((p,i)=>{if(e.S.L.k==='wheel')p.rotation.x=e.walk;else p.rotation.x=Math.sin(e.walk*1.4+(i%2)*Math.PI)*.45});m.sh.visible=e.shield>1});
 for(let i=g.proj.length-1;i>=0;i--){const p=g.proj[i];p.x+=p.vx*dt;p.z+=p.vz*dt;p.life-=dt;p.m.position.x=p.x;p.m.position.z=p.z;let dead=p.life<=0||Math.hypot(p.x,p.z)>R_ARENA+3;
  if(!dead)dead=g.obst.some(o=>Math.hypot(p.x-o.x,p.z-o.z)<o.r);
  if(!dead)for(const e of g.ents){if(e===p.own||!e.alive)continue;if(Math.hypot(p.x-e.x,p.z-e.z)<e.rad){dead=true;if(!p.sp)hurt(e,p.d,p.own);break}}
  if(dead){if(p.sp)explode(p.x,p.z,p.sp,p.d,p.own);scene.remove(p.m);g.proj.splice(i,1)}}
 for(let i=g.beams.length-1;i>=0;i--){g.beams[i].l-=dt;if(g.beams[i].l<=0){scene.remove(g.beams[i].m);disposeTree(g.beams[i].m);g.beams.splice(i,1)}}
 for(let i=g.fx.length-1;i>=0;i--){const f=g.fx[i];f.l-=dt;const k=1-f.l/f.t;if(f.vx||f.vz){f.x+=f.vx*dt;f.z+=f.vz*dt;f.m.position.x=f.x;f.m.position.z=f.z}f.m.scale.setScalar(.4+f.r*k);f.m.material.opacity=.8*(1-k);if(f.l<=0){scene.remove(f.m);disposeTree(f.m);g.fx.splice(i,1)}}
 g.feed.forEach(f=>f.l-=dt);g.feed=g.feed.filter(f=>f.l>0);
 const al=alive();if(!g.over&&al.length<=1){g.over=true;finish()}else if(!g.over&&!g.player.alive&&!g.shown){g.shown=true;g.endDelay=1.6}
 if(g.endDelay!==undefined){g.endDelay-=dt;if(g.endDelay<=0){g.over=true;finish();}}
 const pl=g.player.alive?g.player:(al[0]||g.player);camP.x+=(pl.x-camP.x)*Math.min(1,dt*6);camP.z+=(pl.z-camP.z)*Math.min(1,dt*6);cam.clearViewOffset();cam.position.set(camP.x,18,camP.z+14);cam.lookAt(camP.x,0,camP.z)}
function finish(){const p=G.player,win=p.alive;if(!completeMatch(SV,G,win))return;resetInput();$('#cd').classList.add('hide');if(win)p.place=1;save();
 $('#eb').innerHTML=`<h1>${win?'🏆 ZWYCIĘSTWO!':'💥 Mech zniszczony'}</h1><p style="font-size:18px">Miejsce: <b>#${p.place||'?'}</b> z 8<br>Zniszczeni przeciwnicy: <b>${p.kills}</b><br>Czas: <b>${Math.round(G.t)} s</b></p><p style="font-size:18px;color:#fbbf24">${win?`+${WIN_GOLD} 💰 za wygraną!`:'Brak nagrody. Wygraj, by zdobyć złoto.'}<br>Masz: ${SV.gold.toLocaleString('pl-PL')} 💰</p><button class="btn" id="ag">🔁 Jeszcze raz</button><button class="btn s" id="gr">🔧 Garaż i sklep</button>`;
 $('#end').classList.remove('hide');$('#ag').onclick=startMatch;$('#gr').onclick=toGarage}
function toGarage(){resetInput();paused=false;$('#pause').classList.add('hide');if(G)clearArena();mode='garage';['#end','#hud','#cd','#touch'].forEach(s=>$(s).classList.add('hide'));$('#gp').classList.remove('hide');$('#rp').classList.remove('hide');garCam();renderGarage();showGarMech()}

/* ---------- 8. HUD, wejście, pętla ---------- */
const hb=(l,v,m,c)=>`<div>${l==='HP'?(v/m>.65?'Pancerz sprawny':v/m>.3?'Widoczne uszkodzenia':'Krytyczne uszkodzenia'):'Osłona aktywna'}</div><div class="bar"><i style="width:${v/m*100}%;background:${c}"></i></div>`;
function hud(){const g=G,p=g.player,al=alive().length,s=g.stages[g.stage];
 $('#top').textContent=`Żywych: ${al}/8 · ${g.cd>0?'przygotuj się…':!s?'Ostatnia strefa!':g.phase==='wait'?`Strefa zwęża się za ${Math.ceil(Math.max(0,g.timer))} s`:'⚠️ Strefa się zwęża!'}`;
 $('#me').innerHTML=`<b>${p.alive?p.S.mage.ic+' '+p.S.mage.n:'Obserwujesz'}</b>`+hb('HP',p.hp,p.max,'#3fb950')+(p.shield>1?hb('Tarcza',p.shield,90*p.S.spm,'#38bdf8'):'')+`<div>${p.S.sp.ic} ${p.S.sp.n}: ${p.spCd>0?'odnawia się':'GOTOWE (Spacja)'}</div><div>${p.S.G[0].ic} ${p.S.G[0].n} · ${p.S.G[1].ic} ${p.S.G[1].n}</div>`;
 $('#feed').innerHTML=g.feed.map(f=>`<div>${f.t}</div>`).join('');
 const hc=$('#hc').getContext('2d');hc.clearRect(0,0,W,H);hc.font='bold 12px system-ui';hc.textAlign='center';
 g.ents.forEach(e=>{if(!e.alive||e===p)return;const s2=toScreen(e.x,3.8,e.z);if(!s2)return;hc.fillStyle='#000a';hc.fillRect(s2.x-24,s2.y-4,48,7);hc.fillStyle='#ef4444';hc.fillRect(s2.x-23,s2.y-3,46*e.hp/e.max,5);hc.fillStyle='#fff';hc.fillText(e.S.mage.ic+e.name,s2.x,s2.y-9)});
 if(p.alive&&!matchMedia('(pointer:coarse)').matches){const a=aimWorld(),s3=toScreen(a.x,0,a.z);if(s3){hc.strokeStyle='#fff9';hc.beginPath();hc.arc(s3.x,s3.y,11,0,7);hc.moveTo(s3.x-16,s3.y);hc.lineTo(s3.x+16,s3.y);hc.moveTo(s3.x,s3.y-16);hc.lineTo(s3.x,s3.y+16);hc.stroke()}}
 const m=$('#mm').getContext('2d'),k=140/R_ARENA;m.clearRect(0,0,300,300);m.save();m.translate(150,150);m.strokeStyle='#ef4444';m.lineWidth=3;m.beginPath();m.arc(0,0,g.zr*k,0,7);m.stroke();m.fillStyle='#64748b';g.obst.forEach(o=>{m.beginPath();m.arc(o.x*k,o.z*k,o.r*k,0,7);m.fill()});
 m.fillStyle='#22c55e';g.kits.forEach(q=>{if(q.m.visible!==false)m.fillRect(q.x*k-3,q.z*k-3,6,6)});g.ents.forEach(e=>{if(!e.alive)return;m.fillStyle=e.isP?'#fff':'#ef4444';m.beginPath();m.arc(e.x*k,e.z*k,e.isP?8:6,0,7);m.fill()});m.restore()}
const typing=()=>['INPUT','SELECT','TEXTAREA'].includes(document.activeElement?.tagName);
function resetInput(){keys={};mdown=false;drag=false;touch.mx=touch.mz=0;touch.fire=touch.dash=false;$('#knob').style.transform='';}
function setPaused(value){if(mode!=='arena'||!G||G.over)return;paused=value;resetInput();$('#pause').classList.toggle('hide',!paused);if(paused)$('#resume').focus();else document.activeElement?.blur();}
$('#pause-btn').onclick=()=>setPaused(true);$('#resume').onclick=()=>setPaused(false);$('#garage-back').onclick=toGarage;
addEventListener('keydown',e=>{if(typing()||mode!=='arena')return;if(['Escape','KeyP'].includes(e.code)){if(!e.repeat)setPaused(!paused);return;}if(paused)return;keys[e.key.toLowerCase()]=true;if(e.key===' '||e.key.startsWith('Arrow'))e.preventDefault();});addEventListener('keyup',e=>{keys[e.key.toLowerCase()]=false;});addEventListener('blur',()=>{resetInput();setPaused(true);});document.addEventListener('visibilitychange',()=>{if(document.hidden){resetInput();setPaused(true);}});
const cv=$('#c');cv.addEventListener('pointerdown',e=>{if(mode==='arena'&&!paused&&!G.over){if(e.pointerType!=='touch'){mdown=true;mouse.x=e.clientX;mouse.y=e.clientY;cv.setPointerCapture(e.pointerId);}}else if(mode==='garage'){drag=e.clientX;cv.setPointerCapture(e.pointerId);}});
addEventListener('pointerup',()=>{mdown=false;drag=false;});cv.addEventListener('pointercancel',()=>{mdown=false;drag=false;});addEventListener('pointermove',e=>{if(e.pointerType!=='touch'){mouse.x=e.clientX;mouse.y=e.clientY;}if(mode==='garage'&&drag!==false){gyaw+=(e.clientX-drag)*.01;drag=e.clientX;}});
const joy=$('#joy'),knob=$('#knob');let jid=null;
function jmove(e){if(paused||mode!=='arena')return;const r=joy.getBoundingClientRect(),dx=e.clientX-r.left-r.width/2,dz=e.clientY-r.top-r.height/2,l=Math.min(1,Math.hypot(dx,dz)/(r.width*.38)),a=Math.atan2(dz,dx);touch.mx=Math.cos(a)*l;touch.mz=Math.sin(a)*l;knob.style.transform=`translate(${Math.cos(a)*l*40}px,${Math.sin(a)*l*40}px)`;}
joy.addEventListener('pointerdown',e=>{if(paused)return;jid=e.pointerId;joy.setPointerCapture(jid);jmove(e);});joy.addEventListener('pointermove',e=>{if(e.pointerId===jid)jmove(e);});for(const event of ['pointerup','pointercancel','lostpointercapture'])joy.addEventListener(event,()=>{jid=null;touch.mx=touch.mz=0;knob.style.transform='';});
for(const [selector,key]of [['#bf','fire'],['#bd','dash']]){const el=$(selector);el.addEventListener('pointerdown',e=>{if(paused||!G||G.over)return;touch[key]=true;el.setPointerCapture(e.pointerId);});for(const event of ['pointerup','pointercancel','lostpointercapture'])el.addEventListener(event,()=>touch[key]=false);}
export function mechSnapshot(){return {mode,paused,state:JSON.parse(JSON.stringify(SV)),time:G?.t||0,countdown:G?.cd||0,over:!!G?.over,alive:G?alive().length:0,shots:G?.shots||0,player:G?{x:G.player.x,z:G.player.z,hp:G.player.hp}:null,input:{...touch,mdown}};}
$('#go').onclick=startMatch;
let last=performance.now();
function loop(now){requestAnimationFrame(loop);const dt=Math.min(.05,(now-last)/1000);last=now;
 if(mode==='garage'){if(garMech){gyaw+=dt*.3*(drag===false&&!matchMedia('(prefers-reduced-motion: reduce)').matches?1:0);garMech.g.rotation.y=gyaw}renderer.render(gscene,cam)}else if(G){if(!paused&&!G.over)update(dt);hud();renderer.render(scene,cam)}}
save();resize();garCam();renderGarage();showGarMech();requestAnimationFrame(loop);
