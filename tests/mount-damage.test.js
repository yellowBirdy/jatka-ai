import {test} from 'node:test';import assert from 'node:assert/strict';
import {categories,createFighter} from '../engine.js';import {createCombatState,resolveTurn} from '../combat.js';
const picks=Object.fromEntries(categories.map(c=>[c.id,c.options[0].id]));
function attack(mounted,{ability=picks.ability,random=()=>.5,shield=0,energy=90,target=1}={}){const a=createFighter('A',{...picks,ability,beastAbility:'none'}),b=createFighter('B',picks);a.mounted=mounted;const f=target===3?[a,b,b,b]:[a,b],state=createCombatState(f);state.energy[0]=energy;state.barrier[target]=shield;return resolveTurn(f,state,0,random,target);}
test('wierzchowiec daje dokładnie +10 obrażeń trafienia, także po zmęczeniu i w 2v2',()=>{for(const energy of [90,0])for(const target of [1,3])assert.equal(attack(true,{energy,target}).damage-attack(false,{energy,target}).damage,10);});
test('chybienie nie otrzymuje bonusu, osłona pochłania także dodatkowe obrażenia',()=>{assert.equal(attack(true,{random:()=>.999}).damage,0);assert.equal(attack(true,{shield:1000}).damage,0);});
test('seria dostaje +10 na każdy celny cios bronią',()=>{const on=attack(true,{ability:'combo',random:()=>0}),off=attack(false,{ability:'combo',random:()=>0});assert.equal(on.strikes.length,2);assert.deepEqual(on.strikes.map((n,i)=>n-off.strikes[i]),[10,10]);});
