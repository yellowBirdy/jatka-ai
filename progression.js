import {beastLootArmors,beastSkins,lootBeasts,beasts} from './mounts.js?v=army-pool-47';
import {armorSkills} from './armor-skills.js?v=army-pool-47';
const key='jatka.progress.v1';
const names=['Przeszywanica rekruta','Płaszcz zwiadowcy','Nitowany kaftan','Kolczuga strażnika','Pancerz łowcy','Zbroja weterana','Łuski pustyni','Płyty legionisty','Pancerz husarza','Zbroja czempiona','Srebrna kolczuga','Pancerz nosorożca','Karmazynowa garda','Zbroja zdobywcy','Tytanowy bastion','Obsydianowy pancerz','Złoty kolos','Zbroja imperatora','Pancerz nieśmiertelnego','Zbroja boga wojny'];
const chances=[30,12,8,6,5,5,5,4,4,4,2,2,2,2,2,2,1.5,1.5,1,1];
export const lootArmors=names.map((name,i)=>({id:`box-armor-${i+1}`,name,chance:chances[i],rarity:i<5?'Zwykła':i<10?'Rzadka':i<15?'Epicka':'Legendarna',texture:i<1?'cloth':i<5?'leather':i<10?'chainmail':i<15?'steel':i<18?'darksteel':'bronze',icon:'⬢',desc:`${name} — zbroja z boxa.`,skill:i>=5?armorSkills[i-5]:null,stats:{defense:[3,1,5,7,4,8,6,10,8,10,9,12,10,12,14,13,16,15,13,18][i],health:[0,4,6,8,6,10,8,12,10,14,12,18,14,18,22,20,24,24,24,26][i],attack:[0,0,0,0,0,0,0,0,0,0,1,1,2,2,2,3,3,4,3,4][i],speed:[3,6,2,-2,4,-3,1,-4,-2,-3,-2,-6,-1,-3,-7,-4,-8,-5,1,-6][i]}}));
for(const armor of lootArmors)armor.desc=`Ochrona +${armor.stats.defense}, HP +${armor.stats.health}, siła +${armor.stats.attack}, szybkość ${armor.stats.speed>=0?'+':''}${armor.stats.speed}.${armor.skill?` ✦ ${armor.skill.name}: ${armor.skill.description}`:''}`;
export const emptyProgress=()=>Array.from({length:4},()=>({xp:0,armors:[],codes:[],beastArmors:[],beastSkins:[],beasts:[],godClaimed:false}));
export function readProgress(storage){const out=emptyProgress();try{const data=JSON.parse(storage.getItem(key));for(let i=0;i<4;i++){const p=data?.[i];if(Number.isSafeInteger(p?.xp)&&p.xp>=0)out[i].xp=Math.min(p.xp,1000000);for(const [field,pool] of [['beastArmors',beastLootArmors],['beastSkins',beastSkins],['beasts',lootBeasts]])out[i][field]=pool.filter(a=>Array.isArray(p?.[field])&&(p[field].includes(a.id)||(field!=='beasts'&&beasts.some(b=>b.id===a.beast)&&p[field].includes(a.id.slice(a.beast.length+1))))).map(a=>a.id);out[i].codes=['cheat','cheat 2','x10box','god'].filter(code=>Array.isArray(p?.codes)&&p.codes.includes(code));out[i].godClaimed=out[i].codes.includes('god')&&p?.godClaimed===true;out[i].armors=lootArmors.filter(a=>Array.isArray(p?.armors)&&p.armors.includes(a.id)).map(a=>a.id);}}catch{}return out;}
export function saveProgress(storage,progress){try{storage.setItem(key,JSON.stringify(progress));return true;}catch{return false;}}
export function buyBox(progress,id,random=Math.random){const p=progress[id];if(!p||p.xp<100)return null;let roll=Math.max(0,Math.min(.999999999,random()))*100;const armor=lootArmors.find(a=>(roll-=a.chance)<0)||lootArmors.at(-1);p.xp-=100;const duplicate=p.armors.includes(armor.id);if(duplicate)p.xp+=25;else p.armors.push(armor.id);return {armor,duplicate};}
export function rewardProfiles(progress,owners,wins,winReward=60){const rewards=new Map();owners.forEach((id,i)=>{if(id===''||!progress[id])return;const amount=wins[i]===null?40:wins[i]?winReward:-40;rewards.set(id,Math.max(rewards.get(id)??-Infinity,amount));});for(const [id,amount] of rewards)progress[id].xp=Math.max(0,Math.min(1000000,progress[id].xp+amount));return [...rewards];}
export function drawArmorOffer(base,owned,random=Math.random){const pool=[...base,...lootArmors.filter(a=>owned.includes(a.id))];for(let i=pool.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}return pool.slice(0,5);}

export function redeemCode(progress,id,value){
 const p=/^[0-3]$/.test(String(id))?progress[id]:null;
 if(!p)return {ok:false,message:'Najpierw wybierz profil.'};
 const code=typeof value==='string'?value.trim().toLowerCase():'';
 if(!['cheat','cheat 2','x10box','god'].includes(code))return {ok:false,message:'Nieprawidłowy kod.'};
 if(p.codes?.includes(code))return {ok:false,message:'Ten profil już wykorzystał ten kod.'};
 p.codes=[...(p.codes||[]),code];if(code==='god')return {ok:true,reward:'god',message:'Wybierz 2 legendarne zbroje gracza i 2 legendarne skiny bestii!'};if(code==='x10box')return {ok:true,message:'Odblokowano otwieranie od 1 do 10 skrzynek naraz! Wybierz liczbę przy profilu. Każda kosztuje 100 EXP.'};const reward=code==='cheat 2'?2000:1000;p.xp=Math.min(1000000,p.xp+reward);
 return {ok:true,message:`+${reward} EXP! Kod wykorzystany.`};
}

export function buyBeastBox(progress,id,type,random=Math.random,beastId='horse'){
 if(!['armor','skin','beast'].includes(type))return null;
 const p=progress[id];if(!p||p.xp<100)return null;
 const pool=type==='beast'?lootBeasts:(type==='armor'?beastLootArmors:beastSkins).filter(a=>a.beast===beastId),field=type==='beast'?'beasts':type==='armor'?'beastArmors':'beastSkins';if(!pool.length)return null;
 let roll=Math.max(0,Math.min(.999999999,random()))*100;
 const armor=pool.find(a=>(roll-=a.chance)<0)||pool.at(-1);p.xp-=100;p[field]??=[];
 const duplicate=p[field].includes(armor.id);if(duplicate)p.xp+=25;else p[field].push(armor.id);
 return {armor,duplicate,kind:type};
}

export function buyBoxes(progress,id,type,count=1,random=Math.random,beastId='horse'){
 const p=progress[id];
 if(!p||!Number.isInteger(count)||count<1||count>10||(count>1&&!p.codes?.includes('x10box'))||p.xp<count*100)return null;
 if(!['warrior','armor','skin','beast'].includes(type))return null;
 if(['armor','skin'].includes(type)&&!(type==='armor'?beastLootArmors:beastSkins).some(a=>a.beast===beastId))return null;
 return Array.from({length:count},()=>type==='warrior'?buyBox(progress,id,random):buyBeastBox(progress,id,type,random,beastId));
}

export function claimGod(progress,id,armors,skins){
 const p=/^[0-3]$/.test(String(id))?progress[id]:null;
 if(!p?.codes?.includes('god')||p.godClaimed)return {ok:false,message:'Nagroda GOD jest niedostępna lub została już odebrana.'};
 const valid=(ids,pool)=>Array.isArray(ids)&&ids.length===2&&new Set(ids).size===2&&ids.every(id=>pool.some(a=>a.id===id&&a.rarity==='Legendarna'));
 if(!valid(armors,lootArmors)||!valid(skins,beastSkins))return {ok:false,message:'Wybierz dokładnie 2 różne legendarne zbroje i 2 różne legendarne skiny.'};
 p.armors=[...new Set([...p.armors,...armors])];p.beastSkins=[...new Set([...p.beastSkins,...skins])];p.godClaimed=true;
 return {ok:true,message:'Odebrano wybrane legendarne zbroje i skiny!'};
}
