import test from 'node:test';import assert from 'node:assert/strict';
import {animeFruits,animeWeapons,animeHaki,createAnimeFighter,createAnimeBattle,advanceAnime} from '../anime.js';
import {seededRandom} from '../engine.js';
const make=(fruit,haki='none',dial='impact',weapon='sword')=>createAnimeFighter('Pirat',{fruit,haki,dial,weapon});
test('all fruits have an individually authored move and all weapons come from One Piece',()=>{
 for(const f of animeFruits){assert.ok(f.move,f.id);assert.ok(Object.keys(f.rule).length,f.id);}
 assert.equal(new Set(animeFruits.map(f=>f.move)).size,animeFruits.length);assert.equal(new Set(animeFruits.map(f=>JSON.stringify(f.rule))).size,animeFruits.length);
 assert.ok(animeWeapons.some(w=>w.name==='Enma'));assert.ok(animeWeapons.some(w=>w.name==='Clima-Tact'));assert.ok(animeWeapons.some(w=>w.name==='Yoru'));
 assert.equal(animeHaki.length,4);assert.throws(()=>make('mera-mera','fake'));
});
test('Kaido reliably dominates smoothness under equal equipment without guaranteeing every roll',()=>{
 let wins=0;for(let i=0;i<120;i++){const b=createAnimeBattle([make('uo-uo-seiryu'),make('sube-sube')],seededRandom(i));while(!b.finished)advanceAnime(b);wins+=b.winner===0;}assert.ok(wins>=100,`${wins}/120`);
});
test('Impact recoil hurts ordinary users, while armor fruit and armament Haki mitigate it',()=>{
 const recoil=(fruit,haki)=>{const b=createAnimeBattle([make(fruit,haki),make('sube-sube','none','tone')],()=>0);return advanceAnime(b,'balanced',()=>0).selfDamage;};
 const normal=recoil('sube-sube','none');assert.ok(normal>0);assert.equal(recoil('kira-kira','none'),0);assert.ok(recoil('sube-sube','armament')<normal);
});
test('armament Haki can hit smoke with weapons, ordinary steel cannot',()=>{
 const damage=haki=>{const b=createAnimeBattle([make('sube-sube',haki,'tone'),make('moku-moku','none','tone')],()=>0);return advanceAnime(b,'balanced',()=>.5).damage;};assert.equal(damage('none'),0);assert.ok(damage('armament')>0);
});
