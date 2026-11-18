// Divine designs retain the base geometry and slot, with a unique combat effect.
export const DIVINE=[
 ['legs',1,'Krok Hermesa','sprint','Przyspiesza poruszanie i pozwala ignorować spowolnienia.'],
 ['legs',3,'Kotwica Tytana','anchor','Chroni przed ogłuszeniem i odrzutem szarży.'],
 ['legs',0,'Ślad Widma','phase','Unika co czwartego nadchodzącego trafienia.'],
 ['legs',2,'Szlak Odnowy','scavenger','Naprawia pancerz podczas przemieszczania się.'],
 ['body',2,'Egida Nieba','aegis','Odnawia osłonę po przerwie od otrzymywania obrażeń.'],
 ['body',1,'Serce Feniksa','phoenix','Raz w walce przywraca uszkodzony mech do działania.'],
 ['body',3,'Pajęczy Tron','spider','Odblokowuje cztery niezależne mocowania broni.'],
 ['body',0,'Rdzeń Ragnaroku','reactor','Przy krytycznym pancerzu wzmacnia własne trafienia.'],
 ['head',1,'Oko Wyroczni','seeker','Nadaje naprowadzanie także pociskom karabinu, działa i strzelby.'],
 ['head',3,'Oko Zimy','cryo','Każde trafienie spowalnia przeciwnika.'],
 ['head',0,'Maska Wampira','siphon','Trafienia odzyskują część utraconego pancerza.'],
 ['head',2,'Korona Ciszy','disrupt','Trafienia wypalają dodatkową energię osłon przeciwnika.'],
 ['wpn',2,'Grom Zeusa','storm','Trafienie wysyła łuk energii do drugiego pobliskiego przeciwnika.'],
 ['wpn',5,'Oddech Surtra','inferno','Trafienia pozostawiają długotrwały, silny ogień.'],
 ['wpn',0,'Mróz Ymira','frost','Co trzecie trafienie na krótko zamraża cel.'],
 ['wpn',1,'Sąd Anubisa','judgment','Zadaje mocniejsze trafienia przeciwnikom z krytycznym pancerzem.'],
 ['sp',2,'Źródło Życia','renewal','Użycie modułu mocy natychmiast naprawia dodatkowy pancerz.'],
 ['sp',0,'Piasek Czasu','haste','Przyspiesza odnawianie modułu mocy i zdolności korpusu.'],
 ['sp',4,'Gniew Olimpu','shockwave','Każde użycie modułu mocy ogłusza pobliskich przeciwników.'],
 ['sp',1,'Studnia Otchłani','void','Użycie modułu mocy przyciąga pobliskich przeciwników.']
].map(([slot,t,name,power,description],id)=>({id,slot,t,name,power,description}));
export const divineDesign=p=>Number.isInteger(p?.divine)?DIVINE[p.divine]:null;
export function divinePowers(R){return new Set(['legs','body','head',...weaponSlots(R),'sp'].map(k=>divineDesign(R[k])?.power).filter(Boolean));}
export function defendDivine(e,d){if(e.powers.has('phase')){e.divineHits=(e.divineHits||0)+1;if(e.divineHits%4===0)return 0;}return d;}
export function tickDivine(e,dt){const p=e.powers;if(p.has('phoenix')&&e.hp<=0&&!e.reborn){e.reborn=true;e.hp=e.max*.45;e.burnT=0;e.stunT=0;}
 if(p.has('anchor'))e.stunT=0;if(p.has('sprint'))e.slowT=0;
 if(p.has('scavenger')&&Math.hypot(e.vx||0,e.vz||0)>1)e.hp=Math.min(e.max,e.hp+e.max*.025*dt);
 e.divineRest=e.lastHit>0?0:(e.divineRest||0)+dt;if(p.has('aegis')&&e.divineRest>3)e.shield=Math.min(e.max*.25,e.shield+e.max*.06*dt);
 if(p.has('haste')){e.spCd=Math.max(0,e.spCd-dt*.35);e.bodyCd=Math.max(0,e.bodyCd-dt*.35);}}
export function attackDivine(src,target,d,chain=()=>{}){const p=src.powers;if(p.has('reactor')&&src.hp<src.max*.3)d*=1.4;if(p.has('judgment')&&target.hp<target.max*.3)d*=1.7;
 if(p.has('siphon'))src.hp=Math.min(src.max,src.hp+d*.12);if(p.has('cryo'))target.slowT=2;
 if(p.has('disrupt'))target.shield=Math.max(0,(target.shield||0)-d*.7);
 if(p.has('inferno')){target.burnT=4;target.burnDps=7;target.burnSrc=src;}
 if(p.has('frost')){src.frostHits=(src.frostHits||0)+1;if(src.frostHits%3===0)target.stunT=.7;}
 if(p.has('storm')&&(src.stormCd||0)<=0){src.stormCd=.7;chain();}return d;}
export function powerDivine(e,ents){const p=e.powers;if(p.has('renewal'))e.hp=Math.min(e.max,e.hp+e.max*.2);for(const t of ents){if(t===e||!t.alive)continue;const dx=e.x-t.x,dz=e.z-t.z,d=Math.hypot(dx,dz);if(d<9&&Math.abs((t.groundY||0)-(e.groundY||0))<4){if(p.has('shockwave'))t.stunT=1;if(p.has('void')&&d>0){t.x+=dx/d*Math.min(3,d);t.z+=dz/d*Math.min(3,d);}}}}

export const weaponSlots=R=>divineDesign(R.body)?.power==='spider'?['gl','gr','gx','gy']:['gl','gr'];
