import test from 'node:test';
import assert from 'node:assert/strict';
import {mountedPortrait,resolveMount,beasts} from '../mounts.js';
test('every mount has sculpted body and face details without removing rider or armor',()=>{
 for(const beast of beasts){const svg=mountedPortrait('<svg><path data-rider="yes"/></svg>',{traits:resolveMount({beast:beast.id,beastArmor:'plate'})});assert.match(svg,/creature-muscles/);assert.match(svg,/creature-face/);assert.match(svg,/data-rider/);assert.match(svg,/beast-armor-ornament/);}
});
