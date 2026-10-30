import test from 'node:test';import assert from 'node:assert/strict';
import {animeFruits} from '../anime.js';import {fruitEffectSvg} from '../anime-effects.js';
test('each fruit has distinct effect geometry, not just a different caption or color',()=>{
 const shapes=animeFruits.map(f=>fruitEffectSvg(f).replace(/data-effect-family="[^"]*"/g,'').replace(/hsl\([^)]*\)/g,'color'));
 assert.equal(new Set(shapes).size,animeFruits.length);
 for(const svg of shapes)assert.match(svg,/viewBox="0 0 200 200"/);
 assert.match(fruitEffectSvg(animeFruits.find(f=>f.id==='uo-uo-seiryu')),/anime-dragon-silhouette/);
 assert.match(fruitEffectSvg(animeFruits.find(f=>f.id==='moku-moku')),/<ellipse/);
});
