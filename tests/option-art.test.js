import test from 'node:test';import assert from 'node:assert/strict';
import {categories} from '../engine.js';import {fantasySlots} from '../fantasy.js';import {lootArmors} from '../progression.js';import {optionArtwork} from '../creature-art.js';
test('all 220 named traits and box armors have distinct option-specific illustrations',()=>{const signatures=new Set();for(const c of [...categories,...fantasySlots,{id:'armor',options:lootArmors}])for(const o of c.options){const art=optionArtwork(c.id,o.id);assert.ok(art,`${c.id}:${o.id}`);const signature=art.image+'|'+art.position;assert.ok(!signatures.has(signature),`${c.id}:${o.id}`);signatures.add(signature);}assert.equal(signatures.size,220);assert.equal(optionArtwork('weapon','unknown'),null);});

import {beasts} from '../mounts.js';import {getBeastAbilities} from '../beast-abilities.js';
test('all 100 beast abilities have a distinct action illustration',()=>{const pictures=new Set();for(const beast of beasts)for(const ability of getBeastAbilities(beast.id)){const art=optionArtwork('beastAbility',ability.id);assert.ok(art,ability.id);pictures.add(art.image+'|'+art.position);}assert.equal(pictures.size,100);});
