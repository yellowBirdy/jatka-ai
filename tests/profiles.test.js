import test from 'node:test';
import assert from 'node:assert/strict';
import {readProfiles,writeProfiles} from '../profiles.js';
test('profiles keep four stable slots and normalize stored names',()=>{
 const storage={getItem:()=>JSON.stringify(['  Ola  ',null,'x'.repeat(40),'Jan','extra'])};
 assert.deepEqual(readProfiles(storage),['Ola','','x'.repeat(24),'Jan']);
});
test('invalid or unavailable storage falls back safely',()=>{
 for(const storage of [{getItem:()=>'{broken'},{getItem:()=>JSON.stringify({name:'Ola'})},{getItem(){throw Error();}}]) assert.deepEqual(readProfiles(storage),['','','','']);
 assert.equal(writeProfiles({setItem(){throw Error();}},['Ola']),false);
});
test('save and reload preserve profile slot identity',()=>{
 let saved;const storage={setItem:(key,value)=>{saved=value;},getItem:()=>saved};
 assert.equal(writeProfiles(storage,['Ola','','Jan','']),true);
 assert.deepEqual(readProfiles(storage),['Ola','','Jan','']);
});
