import test from 'node:test';import assert from 'node:assert/strict';
import {allBeasts,beastLootArmors,beastSkins,lootBeasts,resolveMount,getBeastArmors} from '../mounts.js';
import {buyBeastBox,emptyProgress,readProgress} from '../progression.js';
test('every species has five exclusive armor and skin drops',()=>{for(const b of allBeasts){for(const pool of [beastLootArmors,beastSkins]){const own=pool.filter(x=>x.beast===b.id);assert.equal(own.length,5);assert.equal(own.reduce((n,x)=>n+x.chance,0),100);}const armor=beastLootArmors.find(x=>x.beast===b.id);assert.equal(getBeastArmors(b.id,[armor.id]).at(-1).id,armor.id);assert.throws(()=>resolveMount({beast:b.id,beastSkin:beastSkins.find(x=>x.beast!==b.id).id}));}});
test('beast box unlocks dragons and probabilities total 100',()=>{assert.equal(lootBeasts.reduce((n,x)=>n+x.chance,0),100);const p=emptyProgress();p[0].xp=300;const drop=buyBeastBox(p,0,'beast',()=>.999);assert.equal(drop.armor.id,'dragon');assert.deepEqual(p[0].beasts,['dragon']);assert.equal(p[0].xp,200);assert.equal(buyBeastBox(p,0,'beast',()=>.999).duplicate,true);assert.equal(p[0].xp,125);});
test('dragon stats rank above Chinese dragon and remaining box beasts',()=>{const dragon=lootBeasts.find(b=>b.id==='dragon'),chinese=lootBeasts.find(b=>b.id==='chinese-dragon');for(const stat of ['health','attack','defense','speed','pierce']){assert.ok(dragon.stats[stat]>chinese.stats[stat]);assert.ok(lootBeasts.filter(b=>![dragon.id,chinese.id].includes(b.id)).every(b=>(b.stats[stat]||0)<chinese.stats[stat]));}});
test('legacy universal rewards are preserved as species variants',()=>{const p=readProgress({getItem:()=>JSON.stringify([{xp:40,beastArmors:['relic-tracker'],beastSkins:['skin-ash']}])});assert.equal(p[0].beastArmors.length,20);assert.equal(p[0].beastSkins.length,20);});

test('all five powers of every box beast can fight with its own armor and skin',async()=>{
 const {createFighter,categories,simulate,seededRandom}=await import('../engine.js');const {getBeastAbilities}=await import('../beast-abilities.js');
 const picks=Object.fromEntries(categories.map(c=>[c.id,c.options[0].id]));
 for(const beast of lootBeasts)for(const skill of getBeastAbilities(beast.id)){
  const ownArmor=beastLootArmors.find(a=>a.beast===beast.id),skin=beastSkins.find(s=>s.beast===beast.id);
  const a=createFighter('Smok',{...picks,beast:beast.id,beastArmor:ownArmor.id,beastSkin:skin.id,beastAbility:skill.id},'short','classic',true);
  const b=createFighter('Rywal',picks,'short','classic',true),result=simulate(a,b,seededRandom(3));
  assert.ok(result.events.length>0&&result.events.length<=160);assert.ok(result.events.every(e=>e.hp.every(n=>Number.isFinite(n)&&n>=0)));
 }
});
