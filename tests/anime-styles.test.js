import test from 'node:test';import assert from 'node:assert/strict';
import {animeFruits,fruitStyles,createAnimeFighter,createAnimeBattle,advanceAnime} from '../anime.js';import {fruitTier} from '../anime-styles.js';import {seededRandom} from '../engine.js';
const make=(id,style)=>createAnimeFighter('Pirat',{fruit:id,fruitStyle:style,weapon:'sword',haki:'armament',dial:'impact'});
test('each fruit has five compatible techniques and rejects another fruit style',()=>{
 for(const f of animeFruits){const styles=fruitStyles(f);assert.equal(styles.length,5);assert.equal(new Set(styles.map(s=>s.id)).size,5);assert.equal(new Set(styles.map(s=>JSON.stringify(s.rule))).size,5);for(const s of styles)assert.equal(make(f.id,s.id).anime.style.id,s.id);}
 assert.throws(()=>make('mera-mera','ope-ope-0'));
});
test('ROOM blade, Shambles and Counter Shock have materially different combat effects',()=>{
 const styles=fruitStyles(animeFruits.find(f=>f.id==='ope-ope'));assert.match(styles[0].name,/K-ROOM/);assert.ok(styles[0].rule.armor>0);assert.equal(styles[2].rule.evade,1);assert.equal(styles[3].rule.element,'lightning');assert.equal(styles[3].rule.statuses.stunned,1);
});
test('power tiers apply to many fruits, rather than only Kaido',()=>{
 const rank=id=>fruitTier(animeFruits.find(f=>f.id===id));for(const id of ['gura-gura','goro-goro','magu-magu','ope-ope'])assert.ok(rank(id)>rank('sube-sube'));assert.ok(rank('neko-neko-leopard')>rank('inu-inu-dachshund'));
});
test('every fruit style can finish a battle with valid health and an independent fighter',()=>{
 for(const [i,f]of animeFruits.entries())for(const style of fruitStyles(f)){
  const fighter=make(f.id,style.id),snapshot=JSON.stringify(fighter),b=createAnimeBattle([fighter,make('gomu-gomu')],seededRandom(i));while(!b.finished)advanceAnime(b);assert.equal(JSON.stringify(fighter),snapshot);assert.ok(b.events.length<=160);assert.ok(b.state.hp.every((hp,j)=>hp>=0&&hp<=b.fighters[j].stats.health));
 }
});
