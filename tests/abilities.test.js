import {test} from 'node:test';
import assert from 'node:assert/strict';
import {categories,createFighter,abilityRules} from '../engine.js';
import {createCombatState,resolveTurn} from '../combat.js';
function scenario(id,{hp=500,energy=60,roll=.3}={}){
 const picks=Object.fromEntries(categories.map(c=>[c.id,c.options[0].id]));
 const f=[createFighter('A',{...picks,ability:id}),createFighter('B',{...picks,ability:'breath'})];
 for(const fighter of f)Object.assign(fighter.stats,{health:1000,attack:30,defense:12,accuracy:80,speed:15,stamina:90,pierce:0});
 const s=createCombatState(f);s.turns[0]=3;s.hp[0]=hp;s.energy[0]=energy;
 return {f,s,event:resolveTurn(f,s,0,()=>roll)};
}
test('20 umiejętności ma 20 różnych opisów i własne reguły',()=>{const abilities=categories.find(c=>c.id==='ability').options;assert.equal(Object.keys(abilityRules).length,20);assert.equal(new Set(abilities.map(a=>a.desc)).size,20);for(const a of abilities)assert.ok(abilityRules[a.id]);});
test('szał zwiększa siłę, szarża odsłania gardę, a cios znad głowy ignoruje pancerz',()=>{assert.ok(scenario('rage').event.damage>scenario('breathing').event.damage);assert.equal(scenario('charge').s.exposed[0],1);const {f,s}=scenario('overhead');const low=scenario('overhead').event.damage;f[1].stats.defense=80;s.turns[0]=3;const high=resolveTurn(f,s,0,()=>.3);assert.equal(low,high.damage);});
test('rozbrojenie i cios głowicą osłabiają następny atak na różne sposoby',()=>{assert.equal(scenario('disarm').s.disarmed[1],true);assert.equal(scenario('pommel').s.staggered[1],true);});
test('precyzyjny cios trafia, a wypad korzysta z przewagi szybkości',()=>{assert.ok(scenario('precise',{roll:.999}).event.damage>0);const {f,s}=scenario('lunge');f[0].stats.speed=30;s.turns[0]=3;assert.ok(resolveTurn(f,s,0,()=>.3).damage>scenario('lunge').event.damage);});
test('drugi oddech leczy i odzyskuje kondycję, kontrola oddechu tylko kondycję',()=>{const a=scenario('breath'),b=scenario('breathing',{energy:0});assert.equal(a.event.healed,8);assert.equal(a.s.energy[0],68);assert.equal(b.event.healed,0);assert.ok(b.s.energy[0]>0);assert.equal(b.event.exhausted,false);});
test('uderzenie barkiem odbiera kondycję, a seria uderzeń daje drugi trafiający osobno cios',()=>{assert.ok(scenario('shoulder').s.energy[1]<90);assert.equal(scenario('combo').event.strikes.length,2);assert.equal(scenario('rage').event.strikes.length,1);});
test('blokada nadgarstka przygotowuje kontrę, piasek oślepia, zaczepienie broni odsłania gardę',()=>{assert.equal(scenario('wrist-lock').s.wrist[0],1);assert.equal(scenario('sand').s.blind[1],2);assert.equal(scenario('weapon-hook').s.exposed[1],2);});
test('cios w szczelinę trwale osłabia pancerz do limitu, niskie cięcie spowalnia do limitu',()=>{for(const [id,key,cap]of [['gap','armorDamage',9],['low-cut','slow',12]]){const {f,s}=scenario(id);for(let i=0;i<8;i++){s.turns[0]=3;s.hp[1]=1000;resolveTurn(f,s,0,()=>.3);}assert.equal(s[key][1],cap);}});
test('zwód po chybieniu wykonuje słabsze pewne pchnięcie',()=>{const e=scenario('feint-strike',{roll:.999}).event;assert.equal(e.strikes[0],0);assert.ok(e.strikes[1]>0);});
test('mobilizacja leczy tylko poniżej połowy HP, odzyskanie postawy daje jednorazową osłonę',()=>{assert.equal(scenario('rally',{hp:800}).event.healed,0);assert.ok(scenario('rally',{hp:300}).event.healed>0);const {f,s}=scenario('reset-stance');assert.ok(s.shield[0]>0);resolveTurn(f,s,1,()=>.3);assert.equal(s.shield[0],0);});
test('zmiana tempa oszczędza kondycję w dwóch kolejnych atakach',()=>{const {f,s}=scenario('pace');assert.equal(s.tempo[0],2);const energy=s.energy[0];resolveTurn(f,s,0,()=>.3);assert.equal(s.energy[0],energy);resolveTurn(f,s,0,()=>.3);assert.equal(s.energy[0],energy);assert.equal(s.tempo[0],0);});
test('efekty wymagające trafienia nie nakładają się przy chybieniu',()=>{for(const id of ['disarm','shoulder','wrist-lock','weapon-hook','sand','pommel','gap','low-cut']){const {s}=scenario(id,{roll:.999});assert.equal(s.disarmed[1],false);assert.equal(s.staggered[1],false);assert.equal(s.blind[1]+s.wrist[1]+s.exposed[1]+s.armorDamage[1]+s.slow[1],0);assert.equal(s.energy[1],90);}});

test('blokada nadgarstka kontruje jedno trafienie, nie zmieniając celności',()=>{const {f,s}=scenario('wrist-lock');const hp=s.hp[1];const e=resolveTurn(f,s,1,()=>.3);assert.ok(s.hp[1]<hp);assert.ok(e.counterDamage>0);assert.equal(s.wrist[0],0);const next=resolveTurn(f,s,1,()=>.3);assert.equal(next.counterDamage,0);});
test('20 umiejętności daje odrębne przebiegi, a nie tylko inne opisy',()=>{const signatures=[];for(const a of categories.find(c=>c.id==='ability').options){const traces=[];for(const roll of [.3,.999]){const {f,s,event}=scenario(a.id,{roll,hp:300,energy:0});const trace=[event];for(const actor of [1,0,1,0])trace.push(resolveTurn(f,s,actor,()=>roll));traces.push({trace:trace.map(({ability,text,details,...data})=>data),state:s});}signatures.push(JSON.stringify(traces));}assert.equal(new Set(signatures).size,20);});
test('śmiertelna kontra nie pozwala użyć drugiego oddechu do wskrzeszenia',()=>{const {f,s}=scenario('wrist-lock');s.hp[1]=1;s.turns[1]=3;const e=resolveTurn(f,s,1,()=>.3);assert.equal(s.hp[1],0);assert.equal(e.healed,0);});
test('szarża odsłania dokładnie jedną gardę, bez dodawania efektu zaczepienia broni',()=>{const {f,s}=scenario('charge');const before=s.hp[0];const normal=scenario('rage');const standard=resolveTurn(normal.f,normal.s,1,()=>.3).damage;const e=resolveTurn(f,s,1,()=>.3);assert.equal(e.damage-standard,4);assert.equal(s.exposed[0],0);assert.equal(before-s.hp[0],e.damage);});
