import test from 'node:test';import assert from 'node:assert/strict';
import {onePieceCharacters,characterSlots,validateCharacterBuild,createCustomAnimeFighter} from '../anime-custom.js';
import {createAnimeBattle,advanceAnime} from '../anime.js';import {seededRandom} from '../engine.js';
const build=()=>Object.fromEntries(characterSlots.map((s,i)=>[s.id,onePieceCharacters[i].id]));
test('a broad named One Piece cast can fill six distinct slots',()=>{assert.ok(onePieceCharacters.length>=60);assert.equal(new Set(onePieceCharacters.map(c=>c.id)).size,onePieceCharacters.length);assert.equal(characterSlots.length,6);assert.equal(validateCharacterBuild(build()),true);});
test('a hero cannot be assigned to two stats and every slot is mandatory',()=>{const b=build();b.speed=b.strength;assert.throws(()=>validateCharacterBuild(b),/raz/);delete b.speed;assert.throws(()=>validateCharacterBuild(b));assert.throws(()=>validateCharacterBuild({...build(),iq:'fake'}));});
test('each hero contributes only the chosen stat and the skill hero contributes its power',()=>{
 const a=build(),b={...a,strength:'chopper'};const x=createCustomAnimeFighter('A',a),y=createCustomAnimeFighter('A',b);assert.notEqual(x.stats.attack,y.stats.attack);assert.equal(x.stats.speed,y.stats.speed);assert.equal(x.stats.health,y.stats.health);assert.equal(x.anime.skillHero.id,a.skill);
});
test('custom fighters can fight, replay and use every hero as their skill source',()=>{
 for(const [i,hero]of onePieceCharacters.entries()){const ids=onePieceCharacters.filter(c=>c.id!==hero.id).slice(0,5).map(c=>c.id),b={};let index=0;for(const s of characterSlots)b[s.id]=s.id==='skill'?hero.id:ids[index++];const f=createCustomAnimeFighter('Pirat',b),snapshot=JSON.stringify(f),battle=createAnimeBattle([f,createCustomAnimeFighter('Rywal',build())],seededRandom(i));while(!battle.finished)advanceAnime(battle);assert.equal(JSON.stringify(f),snapshot);assert.ok(battle.events.length<=160);}
});
