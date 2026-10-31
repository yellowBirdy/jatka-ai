import {dbPowers,opPowers,crossStyles,crossWeaknesses,crossHaki} from './crossover-catalog.js?v=crossover-58';
export {dbPowers,opPowers,crossStyles,crossWeaknesses,crossHaki};
const pools={db:dbPowers,op:opPowers,style:crossStyles,weakness:crossWeaknesses,haki:crossHaki};
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
export function drawCrossOffers(random=Math.random){return Object.fromEntries(Object.entries(pools).map(([key,list])=>{const copy=[...list];for(let i=copy.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]];}return [key,copy.slice(0,5)];}));}
export function createCrossFighter(name,picks,duration='medium'){
 if(typeof name!=='string'||!name.trim()||name.trim().length>24)throw Error('Imię musi mieć od 1 do 24 znaków.');
 if(!['short','medium','long'].includes(duration))throw Error('Wybierz długość walki.');
 const traits={};for(const [key,list]of Object.entries(pools)){const item=list.find(x=>x.id===picks[key]);if(!item)throw Error('Uzupełnij wszystkie wybory wojownika.');traits[key]=item;}
 const stats={health:190,attack:24,defense:8,speed:15,accuracy:84,stamina:90,pierce:0};
 for(const source of [traits.style.stats,traits.weakness.stats])for(const [key,value]of Object.entries(source))stats[key]+=value;
 stats.defense+=traits.haki.defense||0;stats.speed+=traits.haki.speed||0;
 if(traits.op.id==='diamond')stats.defense+=4;if(traits.op.id==='dragon')stats.health+=15;
 stats.health=Math.round(stats.health*({short:.75,medium:1,long:1.5}[duration]));
 return {name:name.trim(),picks:{...picks},traits,stats,duration};
}
export function createCrossBattle(fighters,random=Math.random){
 if(!Array.isArray(fighters)||fighters.length!==2)throw Error('Potrzebnych jest dwóch wojowników.');
 const first=random()<clamp(.5+(fighters[0].stats.speed-fighters[1].stats.speed)/100,.1,.9)?0:1;
 return {fighters,random,first,actor:first,events:[],finished:false,winner:null,reason:null,state:{hp:fighters.map(f=>f.stats.health),energy:fighters.map(f=>f.stats.stamina),gauge:[0,0],guard:[false,false],shield:[0,0],forms:[null,null],status:fighters.map(()=>({burn:0,poison:0,slow:0,stun:0,exposed:0,marked:0}))}};
}
const costs={attack:[0,8],charge:[0,0],guard:[0,0],db:[40,18],op:[35,15],ultimate:[60,28],transform:[100,10],awaken:[100,10]};
export function availableCrossActions(b){if(b.finished)return [];const i=b.actor,s=b.state;return Object.keys(costs).filter(action=>s.gauge[i]>=costs[action][0]&&s.energy[i]>=costs[action][1]&&(!s.forms[i]||!['transform','awaken'].includes(action))&&(!s.status[i].stun||['attack','charge','guard'].includes(action)));}
const logia=new Set(['flame','smoke','sand','lightning','ice','magma','light','dark']);
export function crossInteraction(element,op){
 if(element==='lightning'&&op==='rubber')return {ratio:0,text:'Gumowe ciało nie przewodzi elektryczności!'};
 if(['fire','magma'].includes(op)&&element==='fire')return {ratio:0,text:'Płomienie nie ranią ciała z ognia lub magmy.'};
 if(element==='magma'&&op==='flame')return {ratio:1.5,seal:1,text:'Magma pochłania płomienie i przełamuje ochronę Mera Mera!'};
 if(element==='water'&&op==='sand')return {ratio:1.5,seal:2,text:'Woda skleja piasek i uniemożliwia rozsypanie ciała!'};
 if(element==='wind'&&op==='smoke')return {ratio:1.4,seal:2,text:'Podmuch rozwiewa dym i odsłania prawdziwe ciało!'};
 if(['fire','magma'].includes(element)&&op==='ice')return {ratio:1.35,seal:1,text:'Żar topi lodową osłonę!'};
 if(element==='dark'&&logia.has(op))return {ratio:1.2,seal:1,text:'Ciemność pochłania żywiołową osłonę.'};
 return {ratio:1,text:''};
}
export function advanceCross(b,action){
 if(!availableCrossActions(b).includes(action))throw Error(b.finished?'Walka jest zakończona.':'Nie możesz teraz wykonać tej akcji.');
 const actor=b.actor,target=1-actor,f=b.fighters[actor],enemy=b.fighters[target],s=b.state,oldForm=s.forms[actor],oldStatus={...s.status[actor]},notes=[];
 const e={actor,target,action,damage:0,selfDamage:0,healed:0,power:null,hit:false,text:'',details:notes};
 const heal=n=>{const actual=Math.min(n,f.stats.health-s.hp[actor]);s.hp[actor]+=actual;e.healed+=actual;};
 s.guard[actor]=false;
 for(const key of ['burn','poison'])if(oldStatus[key]){const amount=Math.min(s.hp[actor],key==='burn'?5:3);s.hp[actor]-=amount;e.selfDamage+=amount;notes.push(key==='burn'?'Płomienie nadal parzą wojownika.':'Trucizna osłabia wojownika.');}
 for(const key of Object.keys(oldStatus))s.status[actor][key]=Math.max(0,s.status[actor][key]-1);
 if(s.hp[actor]>0){
  s.gauge[actor]-=costs[action][0];s.energy[actor]-=costs[action][1];
  if(action==='charge'){s.energy[actor]=Math.min(f.stats.stamina,s.energy[actor]+26);s.gauge[actor]=Math.min(100,s.gauge[actor]+35);e.text=`${f.name} ładuje energię i przygotowuje przebudzenie.`;}
  else if(action==='guard'){s.guard[actor]=true;s.energy[actor]=Math.min(f.stats.stamina,s.energy[actor]+10);s.gauge[actor]=Math.min(100,s.gauge[actor]+12);e.text=`${f.name} przyjmuje gardę i oszczędza siły.`;}
  else if(['transform','awaken'].includes(action)){const kind=action==='transform'?'db':'op';s.forms[actor]={kind,left:4};e.power=kind;e.text=`${f.name}: ${f.traits[kind].form}!`;notes.push('Nowa forma wzmacnia cztery kolejne własne ruchy.');}
  else {
   const special=action!=='attack',power=action==='op'?f.traits.op:action==='ultimate'?null:f.traits.db;
   e.power=special?action==='op'?'op':'db':null;
   const speed=f.stats.speed-(oldStatus.slow?6:0)+(oldForm?.kind==='db'?5:0),enemySpeed=enemy.stats.speed-(s.status[target].slow?6:0);
   const chance=clamp((special?.92:f.stats.accuracy/100)+(speed-enemySpeed)*.008-(s.status[target].marked?-.1:0),.35,.98);
   e.hit=b.random()<chance;
   let raw=action==='attack'?f.stats.attack+b.random()*14-7:action==='ultimate'?f.traits.db.power+f.traits.op.power+8:power.power;
   if(oldForm?.kind==='db')raw+=9;if(oldForm?.kind==='op'&&['op','ultimate'].includes(action))raw+=12;
   const ultimateCounter=action==='ultimate'?crossInteraction(f.traits.op.element,enemy.traits.op.id):null;
   if(ultimateCounter){raw-=f.traits.op.power*(1-ultimateCounter.ratio);if(oldForm?.kind==='op'&&ultimateCounter.ratio===0)raw-=12;if(ultimateCounter.text)notes.push(ultimateCounter.text);}
   const element=action==='attack'?f.traits.style.element:action==='op'?power.element:'ki';
   const interaction=crossInteraction(element,enemy.traits.op.id);if(interaction.text)notes.push(interaction.text);
   const intangible=action==='attack'&&logia.has(enemy.traits.op.id)&&enemy.traits.op.id!=='dark'&&!f.traits.haki.touch&&element!=='ki'&&!s.status[target].exposed;
   if(intangible){e.hit=false;notes.push('Zwykły cios przenika przez Logię. Potrzebne jest Haki albo technika ki.');}
   const pierce=special&&power?.kind==='pierce'?0:Math.max(0,enemy.stats.defense-f.stats.pierce);
   let damage=e.hit?Math.max(2,Math.round((raw-pierce*.5)*interaction.ratio)):0;
   if(interaction.ratio===0)damage=0;
   if(enemy.traits.op.id==='rubber'&&element==='blunt'&&!f.traits.haki.touch)damage=Math.ceil(damage*.6);
   if(special&&power?.kind==='dispel')s.shield[target]=0;
   if(s.guard[target]&&damage>0){damage=Math.ceil(damage/2);s.guard[target]=false;notes.push('Garda osłabia trafienie.');}
   const absorbed=Math.min(s.shield[target],damage);s.shield[target]-=absorbed;damage-=absorbed;
   e.damage=Math.min(s.hp[target],damage);s.hp[target]-=e.damage;
   if(e.hit&&interaction.ratio>0&&s.hp[target]>0){
    if(ultimateCounter?.seal)s.status[target].exposed=Math.max(s.status[target].exposed,ultimateCounter.seal);
    if(interaction.seal)s.status[target].exposed=Math.max(s.status[target].exposed,interaction.seal);
    if(special){const effects=action==='ultimate'?[f.traits.db,...(ultimateCounter.ratio>0?[f.traits.op]:[])]:[power];for(const effect of effects){switch(effect.kind){case 'burn':s.status[target].burn=2;break;case 'poison':s.status[target].poison=3;break;case 'slow':case 'bind':s.status[target].slow=2;break;case 'stun':s.status[target].stun=1;break;case 'mark':s.status[target].marked=2;break;case 'seal':s.status[target].exposed=2;break;case 'drain':s.energy[target]=Math.max(0,s.energy[target]-16);heal(6);break;}}}
    if(f.traits.haki.pressure&&b.random()<.25){s.status[target].stun=1;notes.push('Królewska wola przerywa koncentrację przeciwnika!');}
   }
   if(special){const effects=action==='ultimate'?[f.traits.db,f.traits.op]:[power];for(const effect of effects){if(effect.kind==='shield')s.shield[actor]=Math.max(s.shield[actor],oldForm?.kind==='op'?28:18);if(effect.kind==='heal')heal(oldForm?.kind==='op'?22:14);if(effect.kind==='cleanse')for(const key of Object.keys(s.status[actor]))s.status[actor][key]=0;if(effect.kind==='recoil'){const recoil=Math.min(5,Math.max(0,s.hp[actor]-1));s.hp[actor]-=recoil;e.selfDamage+=recoil;notes.push('Własne ciało odczuwa wysiłek techniki.');}}}
   s.gauge[actor]=Math.min(100,s.gauge[actor]+(action==='attack'?(e.damage>0?22:12):5));
   const move=action==='attack'?'natarcie':action==='ultimate'?`${f.traits.db.move} × ${f.traits.op.move}`:power.move;
   e.text=`${f.name}: ${move}. ${e.damage>0?'Atak przełamuje obronę rywala!':e.hit?'Rywal wytrzymuje natarcie.':'Przeciwnik wymyka się z zasięgu.'}`;
  }
  if(oldForm?.kind==='op'&&f.traits.op.id==='phoenix')heal(4);
  if(oldForm&&!['transform','awaken'].includes(action)){oldForm.left--;if(oldForm.left===0){s.forms[actor]=null;notes.push('Wzmocniona forma wygasa — potrzeba nowej energii.');}}
 }else e.text=`${f.name} nie jest już w stanie kontynuować walki.`;
 e.hp=[...s.hp];e.energy=[...s.energy];e.gauge=[...s.gauge];e.forms=s.forms.map(x=>x?{...x}:null);b.events.push(e);
 if(s.hp.some(h=>h<=0)){b.finished=true;b.reason='knockout';b.winner=s.hp[0]>0?0:1;}
 else if(b.events.length>=160){b.finished=true;b.reason='decision';const score=s.hp.map((hp,i)=>hp/b.fighters[i].stats.health);b.winner=Math.abs(score[0]-score[1])<1e-8?null:score[0]>score[1]?0:1;}
 b.actor=target;return e;
}
export function chooseCrossAction(b){const actions=availableCrossActions(b),i=b.actor;if(actions.includes('transform'))return b.random()<.5?'transform':'awaken';if(b.state.energy[i]<18)return 'charge';if(!b.state.forms[i]&&b.state.gauge[i]>=65)return 'charge';if(actions.includes('ultimate'))return 'ultimate';if(actions.includes('op')&&b.fighters[i].traits.op.kind==='heal'&&b.state.hp[i]<b.fighters[i].stats.health*.6)return 'op';if(actions.includes('db')&&b.random()<.5)return 'db';if(b.state.gauge[i]<60&&b.random()<.3)return 'charge';return actions.includes('attack')?'attack':'charge';}
