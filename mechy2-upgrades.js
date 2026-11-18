import {beamHitDistance} from './mechy2-aim.js?v=mechs-76';
export const BODY_ABILITIES=[{kind:'cloak',name:'Kamuflaż',description:'Znika z celowników botów; strzał ujawnia mecha.',duration:4,cd:13},{kind:'flight',name:'Skok odrzutowy',description:'Krótki lot ponad przeszkodami.',duration:3,cd:12},{kind:'shield',name:'Rozkładana tarcza',description:'Przechwytuje ostrzał nadchodzący z przodu.',duration:4,cd:14},{kind:'charge',name:'Szarża',description:'Przyspiesza i odrzuca trafionego przeciwnika.',duration:1.1,cd:9}];
export function activateBody(e,index,rarity){if(rarity<4||!Number.isInteger(rarity)||e.bodyCd>0)return false;const a=BODY_ABILITIES[index];e.bodyKind=a.kind;e.bodyT=a.duration;e.bodyCd=a.cd;e.rammed=new Set();return true;}
export function tickBody(e,dt){e.bodyCd=Math.max(0,(e.bodyCd||0)-dt);e.bodyT=Math.max(0,(e.bodyT||0)-dt);}
export function tickWeapons(e,dt){for(const w of e.weaponState){w.heat=Math.max(0,(w.heat||0)-dt*.25);if(w.hot&&w.heat<.25)w.hot=false;}}
export function canFireWeapon(e,i,kind,trigger,dt){const w=e.weaponState[i];if(kind==='cannon'){if(trigger){w.charge=Math.min(.65,(w.charge||0)+dt);return false;}const ready=(w.charge||0)>=.65;w.charge=0;return ready;}if(!trigger)return false;if(kind==='laser'){if(w.hot)return false;w.heat=(w.heat||0)+(e.S?.G[i]?.heat??.19);if(w.heat>=1)w.hot=true;}return true;}
export const paintFor=(s,slot)=>s.paint?.[slot]??s.col;
export const validPaint=p=>p===undefined||!!p&&typeof p==='object'&&!Array.isArray(p)&&Object.entries(p).every(([k,v])=>['body','legs','gl','gr','gx','gy'].includes(k)&&Number.isInteger(v)&&v>=0&&v<8);
export function steerRocket(p,origin,target,dt){const speed=Math.hypot(p.vx,p.vz),a=Math.atan2(p.vx,p.vz),b=Math.atan2(target.x-origin.x,target.z-origin.z),d=Math.atan2(Math.sin(b-a),Math.cos(b-a)),n=a+Math.max(-dt*1.6,Math.min(dt*1.6,d));p.vx=Math.sin(n)*speed;p.vz=Math.cos(n)*speed;}
export const liftHeight=t=>(1-Math.cos(t*Math.PI/4))*1.75;
export const INTERACTIONS={foundry:[{kind:'lift',x:-12,z:-7},{kind:'jump',x:19,z:5},{kind:'barrel',x:6,z:10},{kind:'tunnel',x:-10,z:12}],port:[{kind:'lift',x:12,z:-15},{kind:'jump',x:-13,z:7},{kind:'barrel',x:15,z:18},{kind:'tunnel',x:7,z:5}],reactor:[{kind:'lift',x:-15,z:14},{kind:'jump',x:19,z:-10},{kind:'barrel',x:3,z:18},{kind:'tunnel',x:-4,z:-15}]};

export function boxHitTime(a,b,o){let near=0,far=1;for(const [k,h]of [['x',o.halfX],['z',o.halfZ],['y',o.height/2]]){const center=k==='y'?(o.base||0)+h:o[k],d=b[k]-a[k],low=center-h,high=center+h;if(Math.abs(d)<1e-9){if(a[k]<low||a[k]>high)return null;continue;}let t1=(low-a[k])/d,t2=(high-a[k])/d;near=Math.max(near,Math.min(t1,t2));far=Math.min(far,Math.max(t1,t2));if(near>far)return null;}return near;}
export function coverBeamDistance(m,angle,slope,limit,o){if(!o.halfX)return beamHitDistance(m,angle,slope,limit,o);const t=boxHitTime(m,{x:m.x+Math.sin(angle)*limit,y:m.y+slope*limit,z:m.z+Math.cos(angle)*limit},o);return t===null?null:t*limit;}
export function interactionSurface(e,objects,ground,active=true,onJump=()=>{}){for(const q of objects){const dist=Math.hypot(q.x-e.x,q.z-e.z);if(q.kind==='jump'&&dist<1.8&&e.jumpCd<=0&&active){e.jumpT=1.5;e.jumpCd=2;onJump();}
 if(q.kind==='lift'&&Math.abs(q.x-e.x)<(q.size?q.size/2:1.6)&&Math.abs(q.z-e.z)<(q.size?q.size/2:1.6)&&(Math.abs((e.groundY||0)-(q.base+q.height+.35))<(e.lift===q.index?.85:.6))){ground=Math.max(ground,q.base+q.height+.35);e.lift=q.index;}else if(e.lift===q.index)e.lift=null;
 if(q.kind==='tunnel'&&Math.abs(q.x-e.x)<3.3&&Math.abs(q.z-e.z)<4&&e.groundY>q.base+4.4)ground=Math.max(ground,q.base+5.03);
 }return ground;}
export function damageBarrel(q,damage){if(q.dead)return false;q.hp-=damage;if(q.hp>0)return false;q.dead=true;return true;}
export const damageStage=(hp,max)=>hp/max<.3?'critical':hp/max<.65?'damaged':'intact';

export function liftRouteHeight(t,stops=[0,6,12,18]){const route=[...stops,...stops.slice(1,-1).reverse()],segment=Math.floor(t/5)%route.length,a=route[segment],b=route[(segment+1)%route.length],u=Math.max(0,Math.min(1,(t%5-1.2)/3.8));return a+(b-a)*u*u*(3-2*u);}
export function stepVertical(e,ground,surfaces,dt,flight=false,lift=null){let old=e.groundY??ground;const support=surfaces.filter(p=>Math.abs(e.x-p.x)<=p.w/2&&Math.abs(e.z-p.z)<=p.d/2);let floor=ground;for(const p of support)if(p.y<=old+.35)floor=Math.max(floor,p.y);if(lift!==null&&!flight){e.groundY=Math.max(floor,lift);e.verticalV=0;return;}
 if(flight){e.flightOrigin??=old;e.verticalV=old<e.flightOrigin+8?6:0;}else{e.flightOrigin=null;e.verticalV=(e.verticalV||0)-18*dt;}
 let next=old+e.verticalV*dt;if(next>old){for(const p of support)if(old+(e.height||3)<=p.y-.35&&next+(e.height||3)>p.y-.35){next=p.y-.35-(e.height||3);e.verticalV=0;}}
 if(next<=floor){next=floor;e.verticalV=0;}e.groundY=next;
}
