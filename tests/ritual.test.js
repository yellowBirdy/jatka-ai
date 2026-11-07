import test from 'node:test';import assert from 'node:assert/strict';
import {animals,tiers,pickAnimal} from '../ritual-animals.js';
test('expanded animal pool has unique names, every positive chance and exactly 100 percent',()=>{assert.equal(animals.length,76);assert.equal(new Set(animals.map(a=>a.name)).size,76);assert.equal(animals.reduce((s,a)=>s+a.chance,0),10000);for(const [id,tier]of Object.entries(tiers))assert.equal(animals.filter(a=>a.tier===id).reduce((s,a)=>s+a.chance,0),tier.budget);assert.ok(animals.every(a=>Number.isInteger(a.chance)&&a.chance>0));});
test('every animal occupies exactly its displayed probability interval including rare final entries',()=>{let offset=0;for(const animal of animals){assert.equal(pickAnimal(()=>offset/10000),animal);assert.equal(pickAnimal(()=>(offset+animal.chance-.01)/10000),animal);offset+=animal.chance;}assert.equal(pickAnimal(()=>.999999),animals.at(-1));});

test('Zoan pool distinguishes canon, extras and SMILE, describes every form without invented blank abilities',()=>{assert.equal(tiers.antyczne.budget,500);assert.equal(tiers.mityczne.budget,100);for(const a of animals){assert.ok(a.user&&a.strengths);if('fruit' in a)assert.ok(a.fruit);assert.ok(['kanon','dodatek','wskazowka-gracza'].includes(a.source));assert.ok(!('ability' in a)||a.ability.length>0);}assert.match(animals.find(a=>a.name==='Lazurowy smok').ability,/ogniem/);assert.ok(!('ability' in animals.find(a=>a.name==='Mamut')));assert.ok(animals.some(a=>a.source==='dodatek'));assert.ok(animals.some(a=>a.kind==='SMILE'));});

test('Loki, his hammer and five Elder forms share the unchanged mythical chance budget',()=>{
 const expected=['Nordycki smok','Lodowa wiewiórka','Gyuki — demon-pająk','Itsumade — potworny ptak','Fengxi — olbrzymi dzik','Bakotsu — szkieletowy koń','Sandworm — olbrzymi czerw'];
 for(const name of expected){const form=animals.find(a=>a.name===name);assert.ok(form,name);assert.equal(form.tier,'mityczne');assert.ok(form.chance>0);assert.ok(form.strengths);}
 assert.equal(animals.filter(a=>a.tier==='mityczne').reduce((s,a)=>s+a.chance,0),100);
 assert.equal(animals.find(a=>a.name==='Lodowa wiewiórka').ability,'Władanie lodem.');
 assert.ok(!('fruit' in animals.find(a=>a.name==='Gyuki — demon-pająk')));
 assert.ok(!('ability' in animals.find(a=>a.name==='Nordycki smok')));
});

test('god pool excludes ordinary forms and pteranodon but retains every other ancient and mythical interval',async()=>{const {godPool}=await import('../ritual-animals.js');const pool=godPool();assert.equal(pool.length,animals.filter(a=>a.tier!=='zwykle').length-1);assert.ok(pool.every(a=>a.tier!=='zwykle'&&a.name!=='Pteranodon'));const sum=pool.reduce((s,a)=>s+a.chance,0);let offset=0;for(const a of pool){assert.equal(pickAnimal(()=>(offset+.5)/sum,pool),a);offset+=a.chance;}assert.equal(pickAnimal(()=>0,pool).name,'Mamut');assert.equal(pickAnimal(()=>.999999,pool).name,'Sandworm — olbrzymi czerw');assert.ok(pool.includes(animals.find(a=>a.name==='Nordycki smok')));assert.equal(animals.reduce((s,a)=>s+a.chance,0),10000);});
