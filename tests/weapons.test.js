import {test} from 'node:test';
import assert from 'node:assert/strict';
import {categories} from '../engine.js';
import {weaponSvg,weaponIcon} from '../weapons.js';
for(const slot of ['weapon','secondary'])test(`każda broń w slocie ${slot} ma odrębny rysunek i miniaturę`,()=>{const shapes=[];for(const item of categories.find(c=>c.id===slot).options){const svg=weaponSvg(item.id,'test');shapes.push(svg.replace(/data-weapon="[^"]*"/,'').replace(/^<g[^>]*>|<\/g>$/g,''));assert.match(weaponIcon(item.id),/<svg/);assert.ok(!svg.includes('undefined'));}assert.equal(new Set(shapes).size,20);});
test('nieznana broń jest błędem zamiast cichego zastąpienia mieczem',()=>{assert.throws(()=>weaponSvg('unknown','test'));});
