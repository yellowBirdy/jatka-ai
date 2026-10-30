import test from 'node:test';import assert from 'node:assert/strict';
import {animeHaki,animeFruits,createAnimeFighter,createAnimeBattle,advanceAnime,drawAnimeOptions} from '../anime.js';
import {animeTactics} from '../anime-styles.js';
const make=(fruit,haki='armament')=>createAnimeFighter('Pirat',{fruit,haki,weapon:'sword',dial:'impact'});
test('only the four requested Haki are offered, with distinct roles',()=>{
 assert.deepEqual(animeHaki.map(h=>h.name),['Haki uzbrojenia','Haki obrony','Haki obserwacji','Haki królewskie']);const o=drawAnimeOptions(()=>.5);assert.equal(o.haki.length,4);assert.equal(o.haki2.length,4);
 assert.ok(animeHaki.find(h=>h.id==='defense').defense>animeHaki.find(h=>h.id==='armament').defense);
});
test('combat tactics depend on the active fruit and use its actual techniques',()=>{
 const a=make('ope-ope'),b=make('suna-suna'),ta=animeTactics(a),tb=animeTactics(b);assert.ok(ta.some(t=>/ROOM/.test(t.name)));assert.ok(tb.some(t=>/piaskowe tornado/.test(t.name)));assert.ok(!tb.some(t=>/ROOM/.test(t.name)));
 const battle=createAnimeBattle([a,b],()=>0),event=advanceAnime(battle,ta[2].id,()=>0);assert.match(event.fruitMove,/Shambles/);assert.equal(battle.state.blink[0],1);
 assert.throws(()=>advanceAnime(battle,ta[0].id,()=>0));
});

test('royal Haki can interrupt the next technique without granting Logia contact',()=>{const b=createAnimeBattle([make('sube-sube','conqueror'),make('moku-moku','defense')],()=>0);const e=advanceAnime(b,'balanced',()=>0);assert.ok(e.details.some(t=>t.includes('Królewska wola')));assert.equal(b.state.stunned[1],1);assert.equal(b.fighters[0].anime.haki.touch,false);});
