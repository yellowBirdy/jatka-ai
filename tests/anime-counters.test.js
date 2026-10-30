import test from 'node:test';import assert from 'node:assert/strict';
import {animeFruits,animeDials,createAnimeFighter,createAnimeBattle,advanceAnime} from '../anime.js';
import {powerInteraction} from '../anime-lore.js';
const fruit=id=>animeFruits.find(f=>f.id===id),dial=id=>animeDials.find(d=>d.id===id);
test('water binds Crocodile sand and wind disperses Smoker smoke without making water disable every fruit',()=>{
 assert.equal(powerInteraction(dial('water'),fruit('suna-suna')).seal,2);
 assert.equal(powerInteraction(dial('breath'),fruit('moku-moku')).seal,1);
 assert.equal(powerInteraction(dial('water'),fruit('mera-mera')).seal,0);
});
test('rubber stops lightning and matching elements do not injure their own substance',()=>{
 assert.equal(powerInteraction(fruit('goro-goro'),fruit('gomu-gomu')).multiplier,0);
 assert.equal(powerInteraction(dial('flame'),fruit('mera-mera')).multiplier,0);
});
test('water actually blocks sand powers in combat and makes a Logia hittable',()=>{
 const f=(id,d)=>createAnimeFighter('Pirat',{fruit:id,weapon:'sword',dial:d});
 const b=createAnimeBattle([f('gomu-gomu','water'),f('suna-suna','tone')],()=>0);
 const e=advanceAnime(b,'balanced',()=>0);assert.equal(e.dial,'water');assert.equal(b.exposed[1],2);assert.ok(e.details.some(s=>s.includes('piasek')));
 const answer=advanceAnime(b,'balanced',()=>0);assert.equal(answer.fruit,null);
});
test('anime cards and descriptions tell stories instead of listing combat numbers',()=>{
 for(const item of [...animeFruits,...animeDials])assert.doesNotMatch(item.desc,/\d|HP|obrażeń/);
});
