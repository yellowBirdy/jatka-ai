import test from 'node:test';import assert from 'node:assert/strict';
import {gunDefaults,buildGun,createGunBattle,advanceGun} from '../gun-workshop.js';
import {gunSynergies} from '../gun-synergies.js';
const make=(dials={})=>buildGun('Projekt',{...gunDefaults(),...dials});
test('Flame and Flavour form an order-independent explosive-shot synergy',()=>{
 for(const dials of [{dial1:'flame',dial2:'flavour'},{dial1:'flavour',dial3:'flame'}])assert.equal(gunSynergies(make(dials))[0].id,'explosive-shot');
 assert.deepEqual(gunSynergies(make({dial1:'flame'})),[]);assert.deepEqual(gunSynergies(make({dial1:'flavour'})),[]);
});
test('explosive shots have real extra impact, spend both dial charges and obey cooldowns',()=>{
 const g=make({dial1:'flame',dial2:'flavour'}),b=createGunBattle([g,make()],()=>0),baseline=createGunBattle([make(),make()],()=>0);
 const normal=advanceGun(baseline,'shoot'),explosive=advanceGun(b,'shoot');assert.equal(explosive.synergy,'explosive-shot');assert.ok(explosive.damage>normal.damage);assert.equal(b.state.charges[0][0],2);assert.equal(b.state.charges[0][1],2);assert.deepEqual(b.state.cooldowns[0],[2,2,0]);assert.equal(b.state.status[1].burn,2);
 advanceGun(b,'guard');assert.equal(advanceGun(b,'shoot').synergy,null);
});
test('empty or silenced dials cannot create free explosive ammunition',()=>{
 const g=make({dial1:'flame',dial2:'flavour'});for(const setup of [b=>b.state.charges[0][1]=0,b=>b.state.status[0].silence=1]){const b=createGunBattle([g,make()],()=>0);setup(b);assert.equal(advanceGun(b,'shoot').synergy,null);assert.equal(b.state.charges[0][0],3);}
});
test('a miss uses the combo but does not burn the opponent, and a barrier can absorb a blast',()=>{
 const g=make({dial1:'flame',dial2:'flavour'}),b=createGunBattle([g,make()],()=>.999);b.actor=0;const e=advanceGun(b,'shoot');assert.equal(e.damage,0);assert.equal(b.state.status[1].burn,0);assert.equal(b.state.charges[0][0],2);
 const shield=createGunBattle([g,make()],()=>0);shield.state.shield[1]=100;const blocked=advanceGun(shield,'shoot');assert.equal(blocked.damage,0);assert.equal(blocked.impacts,1);assert.ok(shield.state.shield[1]<100);
});
test('other paired dials add distinct shot effects and independent resource costs',()=>{
 for(const [a,b,effect]of [['thunder','water','jam'],['breath','axe','armor'],['jet','impact','recoil'],['vision','flash','blind']]){const gun=make({dial1:a,dial3:b}),battle=createGunBattle([gun,make()],()=>0),event=advanceGun(battle,'shoot');assert.ok(event.synergy);assert.equal(battle.state.charges[0][0],2);assert.equal(battle.state.charges[0][2],2);if(effect==='armor')assert.ok(battle.state.armorDamage[1]>0);else if(effect==='recoil')assert.ok(event.selfDamage>0);else assert.ok(battle.state.status[1][effect]>0);}
});
