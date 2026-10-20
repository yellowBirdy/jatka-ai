import {test} from 'node:test';
import assert from 'node:assert/strict';
import {rollChance} from '../probability.js';
import {abilityRules,categories,createFighter,seededRandom} from '../engine.js';
import {fantasySlots} from '../fantasy.js';
import {createCombatState,resolveTurn} from '../combat.js';
const picks=()=>Object.fromEntries(categories.map(c=>[c.id,c.options[0].id]));
function fighters(){const f=[createFighter('A',{...picks(),magicPower:'lightning'},'long','fantasy'),createFighter('B',picks(),'long','fantasy')];for(const x of f)x.stats.health=1000000;return f;}
const queue=(values,fallback=.5)=>()=>values.length?values.shift():fallback;
test('0% nigdy, 100% zawsze; próg jest wyłączny i niepoprawne szanse są błędem',()=>{assert.equal(rollChance(0,()=>0),false);assert.equal(rollChance(1,()=>.999),true);assert.equal(rollChance(.25,()=>.2499),true);assert.equal(rollChance(.25,()=>.25),false);for(const p of [-.1,1.1,NaN])assert.throws(()=>rollChance(p,()=>0));});
test('karty wszystkich specjalnych i magicznych umiejętności podają faktyczny procent',()=>{for(const rule of [...Object.values(abilityRules),...fantasySlots[1].options]){assert.ok(rule.chance>0&&rule.chance<1);assert.ok((rule.description||rule.desc).includes(`${Math.round(rule.chance*100)}%`));assert.doesNotMatch(rule.description||rule.desc,/Co czwarty|Co piąty/);}});
test('obie zdolności mogą zadziałać w pierwszym ataku albo nie zadziałać w czwartym i piątym',()=>{const f=fighters();let s=createCombatState(f);const first=resolveTurn(f,s,0,queue([0,.5,.3,0]));assert.equal(first.ability,'rage');assert.equal(first.magic,'lightning');s=createCombatState(f);for(const turn of [3,4]){s.turns[0]=turn;const e=resolveTurn(f,s,0,queue([.99,.5,.3,.99]));assert.equal(e.ability,null);assert.equal(e.magic,null);}});
test('losowania specjalnej zdolności i magii są niezależne',()=>{const f=fighters();for(const [a,m,expectedA,expectedM]of [[0,.99,'rage',null],[.99,0,null,'lightning']]){const s=createCombatState(f);const e=resolveTurn(f,s,0,queue([a,.5,.3,m]));assert.equal(e.ability,expectedA);assert.equal(e.magic,expectedM);}});
test('częstość aktywacji odpowiada procentom w 10000 ataków z ziarnem',()=>{const f=fighters(),s=createCombatState(f),rng=seededRandom(243);let a=0,m=0;for(let i=0;i<10000;i++){s.hp=[1000000,1000000];const e=resolveTurn(f,s,0,rng);a+=!!e.ability;m+=!!e.magic;}assert.ok(Math.abs(a/10000-abilityRules.rage.chance)<.02);assert.ok(Math.abs(m/10000-f[0].traits.magicPower.chance)<.02);});
