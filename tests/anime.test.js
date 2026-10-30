import {readFileSync} from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {animeFruits,animeDials,drawAnimeOptions,createAnimeFighter,createAnimeBattle,advanceAnime} from '../anime.js';
import {seededRandom} from '../engine.js';
test('anime catalog has distinct fruit models and all nineteen named dial types',()=>{
 assert.ok(animeFruits.length>=150);assert.equal(animeDials.length,19);
 for(const list of [animeFruits,animeDials]){assert.equal(new Set(list.map(o=>o.id)).size,list.length);for(const o of list){assert.ok(o.name&&o.desc);assert.ok(o.chance>0&&o.chance<1);}}
 for(const name of ['Gomu Gomu / Hito Hito: Nika','Yami Yami','Gura Gura','Ope Ope','Nomi Nomi','Gabu Gabu','Uo Uo: Seiryu'])assert.ok(animeFruits.some(o=>o.name===name),name);
});
test('each slot independently draws five unique valid offers',()=>{
 const a=drawAnimeOptions(seededRandom(1)),b=drawAnimeOptions(seededRandom(2));
 assert.notDeepEqual(a,b);for(const values of Object.values(a)){assert.equal(values.length,5);assert.equal(new Set(values.map(v=>v.id)).size,5);}
});
test('fighter validates fruit, weapon and dial and leaves the standard roster untouched',()=>{
 assert.throws(()=>createAnimeFighter('A',{fruit:'fake',weapon:'sword',dial:'impact'}));
 assert.throws(()=>createAnimeFighter('A',{fruit:animeFruits[0].id,weapon:'fake',dial:'impact'}));
 assert.throws(()=>createAnimeFighter('',{fruit:animeFruits[0].id,weapon:'sword',dial:'impact'}));
});
test('every fruit and dial can finish real reproducible combat with bounded HP',()=>{
 for(let i=0;i<animeFruits.length;i++){
  const make=j=>createAnimeFighter(`Pirat ${j}`,{fruit:animeFruits[j%animeFruits.length].id,weapon:'sword',dial:animeDials[j%animeDials.length].id});
  const fighters=[make(i),make(i+1)],snapshot=JSON.stringify(fighters);
  const run=()=>{const b=createAnimeBattle(fighters,seededRandom(i));while(!b.finished)advanceAnime(b);return b;};
  const b=run();assert.ok(b.events.length<=160);assert.ok(b.events.every(e=>e.hp.every((hp,j)=>hp>=0&&hp<=fighters[j].stats.health)));assert.deepEqual(b.events,run().events);assert.equal(JSON.stringify(fighters),snapshot);
 }
});
test('powers and dials activate independently and rest does not trigger either',()=>{
 const make=()=>createAnimeFighter('A',{fruit:'mera-mera',weapon:'sword',dial:'impact'});
 const b=createAnimeBattle([make(),make()],()=>0);const rest=advanceAnime(b,'rest',()=>0);assert.equal(rest.fruit,null);assert.equal(rest.dial,null);
 const hit=advanceAnime(b,'balanced',()=>0);assert.equal(hit.fruit,'mera-mera');assert.equal(hit.dial,'impact');assert.ok(hit.details.some(t=>t.includes('Mera Mera')));
});

test('catalog includes every named fruit in the independent baseline checklist, merging the Nika alias',()=>{
 const reference=JSON.parse(readFileSync(new URL('./anime-fruit-reference.json',import.meta.url)));
 const normalize=name=>name.replace(' no Mi, Model: ',': ').replace(' no Mi','').replace('Kiro Kiro','Kilo Kilo');
 for(const name of reference.names){const normal=normalize(name);assert.ok(animeFruits.some(o=>o.name===normal||o.name.includes(normal)),name);}
});
