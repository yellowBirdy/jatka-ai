import test from 'node:test';
import assert from 'node:assert/strict';
import {attackVariation} from '../combat.js';
test('attack rolls have a wider bounded spread that scales with strength',()=>{
 for(const attack of [10,40,100]){
  const low=attackVariation(attack,()=>0),high=attackVariation(attack,()=>1),middle=attackVariation(attack,()=>.5);
  assert.equal(low,-high);assert.equal(middle,0);assert.ok(high>=8);assert.ok(high>=attack*.25);
 }
});
test('the wider spread preserves average attack strength and consumes one roll',()=>{
 let total=0,calls=0;for(let i=0;i<1000;i++)total+=attackVariation(40,()=>{calls++;return (i+.5)/1000;});
 assert.ok(Math.abs(total)<1e-8);assert.equal(calls,1000);
});
