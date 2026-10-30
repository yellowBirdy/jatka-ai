import test from 'node:test';import assert from 'node:assert/strict';
import {createAnimeFighter,createAnimeBattle,advanceAnime,fruitStyles,animeFruits} from '../anime.js';import {seededRandom} from '../engine.js';
const picks={fruit:'ope-ope',dial:'impact',combatStyle:'fists',haki:'observation',haki2:'armament'};
test('fists need two distinct Haki and work without a weapon',()=>{
 const f=createAnimeFighter('Pirat',picks);assert.equal(f.anime.weapon.name,'Pięści');assert.equal(f.anime.hakis.length,2);assert.ok(f.anime.haki.touch);assert.ok(f.anime.haki.speed>0);assert.match(f.anime.style.name,/Scalpel/);assert.doesNotMatch(f.anime.style.name,/miecz/);
 assert.throws(()=>createAnimeFighter('Pirat',{...picks,haki2:'observation'}));assert.throws(()=>createAnimeFighter('Pirat',{...picks,haki2:'bad'}));
});
test('weapon choice and hidden second Haki do not contribute to an armed fighter or a fist fighter',()=>{
 const first=createAnimeFighter('Pirat',{...picks,weapon:'greatsword'}),second=createAnimeFighter('Pirat',{...picks,weapon:'hammer'});assert.deepEqual(first.stats,second.stats);
 const armed={...picks,weapon:'sword',combatStyle:'weapon'};assert.equal(createAnimeFighter('Pirat',armed).anime.hakis.length,1);assert.deepEqual(createAnimeFighter('Pirat',{...armed,haki2:'coating'}).stats,createAnimeFighter('Pirat',armed).stats);
});
test('weapon-specific ROOM stays a sword technique after switching to fists and back',()=>{
 const fruit=animeFruits.find(f=>f.id==='ope-ope');assert.match(fruitStyles(fruit,'fists')[0].name,/Scalpel/);assert.match(fruitStyles(fruit,'weapon')[0].name,/K-ROOM/);
 const fighters=[createAnimeFighter('Pirat',picks),createAnimeFighter('Drugi',{...picks,fruit:'gomu-gomu'})],b=createAnimeBattle(fighters,seededRandom(14));while(!b.finished)advanceAnime(b);assert.ok(b.events.length<=160);
});
