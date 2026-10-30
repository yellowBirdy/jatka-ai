import {animeFruits,createAnimeFighter} from './anime.js?v=anime-56';
import {durations} from './engine.js?v=anime-56';
import {fruitStyles} from './anime-styles.js?v=anime-56';
export const characterSlots=[{id:'strength',name:'Siła',icon:'✊',desc:'Czyje uderzenie ma Twoja postać?'},{id:'speed',name:'Szybkość',icon:'ϟ',desc:'Czyim tempem porusza się w walce?'},{id:'iq',name:'IQ',icon:'◎',desc:'Czyj spryt i przewidywanie wykorzystuje?'},{id:'skill',name:'Umiejętności',icon:'✦',desc:'Czyje techniki i moce przejmuje?'},{id:'defense',name:'Obrona',icon:'⬡',desc:'Czyją ochronę i gardę posiada?'},{id:'endurance',name:'Wytrzymałość',icon:'♥',desc:'Czyją odporność i kondycję dziedziczy?'}];
// Relative game ratings are an adaptation, not official anime power levels.
const rows=`roger|Gol D. Roger|10,9,9,10,9,10||Kamusari — królewskie cięcie
whitebeard|Białobrody|10,7,9,10,9,10|gura-gura|Wstrząsowa pięść
kaido|Kaido|10,8,7,10,10,10|uo-uo-seiryu|Smoczy oddech
shanks|Shanks|9,10,9,10,9,9||Królewska wola i cięcie
luffy|Monkey D. Luffy|9,9,7,10,9,10|gomu-gomu|Wyzwolone gumowe ciało
mihawk|Dracule Mihawk|9,9,9,10,9,9||Mistrzowskie cięcie Yoru
garp|Monkey D. Garp|10,8,8,10,9,10||Galaxy Impact
big-mom|Big Mom|10,6,7,9,10,10|soru-soru|Władczyni dusz
blackbeard|Marshall D. Teach|9,5,9,9,8,10|yami-yami|Pochłonięcie ciemności
sengoku|Sengoku|9,7,10,9,9,9|hito-hito-daibutsu|Fala złotego Buddy
rayleigh|Silvers Rayleigh|8,9,10,10,9,8||Mistrzowskie Haki
oden|Kozuki Oden|10,8,7,9,8,10||Cięcie dwóch mieczy
akainu|Sakazuki — Akainu|9,8,8,10,9,10|magu-magu|Pięść magmy
aokiji|Kuzan — Aokiji|9,8,9,9,9,9|hie-hie|Lodowa epoka
kizaru|Borsalino — Kizaru|8,10,8,9,9,8|pika-pika|Kopnięcie światła
fujitora|Issho — Fujitora|8,8,10,9,9,9|zushi-zushi|Grawitacyjne natarcie
ryokugyu|Aramaki — Ryokugyu|8,7,7,9,9,9|mori-mori|Żywy las
law|Trafalgar Law|7,8,10,10,7,8|ope-ope|ROOM — operacje przestrzenne
kid|Eustass Kid|9,7,7,9,8,9|jiki-jiki|Magnetyczny zgniot
zoro|Roronoa Zoro|9,8,7,9,9,10||Santoryu — trzy miecze
sanji|Vinsmoke Sanji|8,10,9,9,8,9||Płonące kopnięcia
jinbe|Jinbe|9,7,9,9,9,9||Karate ryboludzi
sabo|Sabo|8,9,9,9,8,9|mera-mera|Smoczy pazur i płomienie
ace|Portgas D. Ace|8,8,7,8,7,8|mera-mera|Ognista pięść
marco|Marco|7,9,9,9,9,10|tori-tori-phoenix|Błękitne płomienie feniksa
katakuri|Charlotte Katakuri|9,9,9,10,9,9|mochi-mochi|Mochi i przewidywanie
king|King|9,9,7,9,10,9|ryu-ryu-pteranodon|Lunariańska osłona i nalot
queen|Queen|9,6,9,8,9,9|ryu-ryu-brachiosaurus|Brachiozaur i technologia
jack|Jack|9,5,5,7,9,10|zou-zou-mammoth|Mamuci taran
yamato|Yamato|9,9,8,9,9,9|inu-inu-okuchi-no-makami|Lodowy strażnik
beckman|Benn Beckman|8,8,10,9,8,8||Precyzyjny ostrzał
lucky-roux|Lucky Roux|8,8,7,8,8,8||Szybkie natarcie
lucci|Rob Lucci|8,10,8,9,8,9|neko-neko-leopard|Rokushiki i lampart
kaku|Kaku|7,9,8,8,7,8|ushi-ushi-giraffe|Żyrafa i szermierka
crocodile|Crocodile|7,7,10,9,8,8|suna-suna|Piaskowe wysuszenie
doflamingo|Donquixote Doflamingo|8,9,10,9,8,9|ito-ito|Klatka z nici
hancock|Boa Hancock|8,9,8,9,8,8|mero-mero|Kamienne zauroczenie
kuma|Bartholomew Kuma|9,8,8,9,10,10|nikyu-nikyu|Odparcie łapami
magellan|Magellan|8,6,8,9,8,9|doku-doku|Trujący olbrzym
enel|Enel|7,10,7,9,6,7|goro-goro|Sąd piorunów
ivankov|Emporio Ivankov|7,8,9,9,7,8|horu-horu|Hormonalny zryw
cracker|Charlotte Cracker|8,7,8,8,9,8|bisu-bisu|Herbatnikowi żołnierze
smoothie|Charlotte Smoothie|8,7,7,8,8,8|shibo-shibo|Wyciśnięcie siły
perospero|Charlotte Perospero|7,7,9,8,8,7|pero-pero|Cukrowe więzy
barto|Bartolomeo|6,6,6,8,10,7|bari-bari|Niezłomna bariera
cavendish|Cavendish|7,9,7,8,7,7||Błyskawiczne cięcie
sulong-carrot|Carrot|6,10,6,8,6,7||Sulong i Electro
nekomamushi|Nekomamushi|9,9,7,8,8,9||Sulong — pazury kota
inuarashi|Inuarashi|9,9,8,8,8,9||Sulong — miecz strażnika
smoker|Smoker|7,7,8,8,8,8|moku-moku|Dymne więzy
vergo|Vergo|8,7,8,8,9,8||Utwardzone ciało
sentomaru|Sentomaru|8,6,8,8,10,8||Ochronna garda
jozu|Jozu|9,6,7,8,10,9|kira-kira|Diamentowe ciało
vista|Vista|8,8,8,9,8,8||Różane cięcia
robin|Nico Robin|6,7,10,9,6,7|hana-hana|Wiele dłoni
nami|Nami|4,7,10,8,4,6||Burza i podstęp
usopp|Usopp|4,6,9,8,4,8||Snajperska zasadzka
franky|Franky|8,5,9,8,9,8||Cyborg i Radical Beam
brook|Brook|6,10,8,8,6,8|yomi-yomi|Chłód podziemi
chopper|Tony Tony Chopper|7,6,9,8,7,8|hito-hito|Monster Point
vegapunk|Dr Vegapunk|2,3,10,10,3,4|nomi-nomi|Genialna analiza
bonney|Jewelry Bonney|6,7,8,9,6,7|toshi-toshi|Zmieniona przyszłość
killer|Killer|8,9,8,8,7,8||Wirujące ostrza
urouge|Urouge|9,6,7,8,8,9||Siła mimo bólu
hawkins|Basil Hawkins|7,6,9,8,7,8|wara-wara|Słomiana osłona
apoo|Scratchmen Apoo|6,7,8,8,6,7|oto-oto|Muzyczna eksplozja
xebec|Rocks D. Xebec|10,9,9,10,9,10||Natarcie legendarnego kapitana
dragon|Monkey D. Dragon|8,8,10,9,8,9||Przywództwo i plan bitwy
shiki|Shiki|9,8,9,10,8,9|fuwa-fuwa|Lewitujące pole walki
gaban|Scopper Gaban|9,9,9,10,9,9||Cięcie dwóch toporów
tsuru|Tsuru|5,6,10,9,7,7|woshu-woshu|Wypranie złych zamiarów
coby|Koby|8,8,8,8,8,9||Honesty Impact
shiryu|Shiryu|8,9,8,9,8,8|suke-suke|Niewidzialne ostrze
zephyr|Zephyr|9,7,9,9,9,9||Miażdżące ramię`;

export const onePieceCharacters=rows.split('\n').map((row,index)=>{const [rawId,name,ratings,fruit,move]=row.split('|'),values=ratings.split(',').map(Number);return {id:rawId.replaceAll(' ',''),name,ratings:Object.fromEntries(characterSlots.map((s,i)=>[s.id,values[i]])),fruit,move,icon:['♛','⚓','✦','⚔','☀','◈'][index%6],color:`hsl(${(index*137)%360} 40% 45%)`};});
export function validateCharacterBuild(build){
 const ids=characterSlots.map(s=>build?.[s.id]);if(ids.some(id=>!onePieceCharacters.some(c=>c.id===id)))throw Error('Wybierz bohatera do każdej z sześciu cech.');
 if(new Set(ids).size!==ids.length)throw Error('Każdego bohatera możesz użyć tylko raz w jednej postaci.');return true;
}
export function randomCharacterBuild(random=Math.random){const pool=[...onePieceCharacters];for(let i=pool.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}return Object.fromEntries(characterSlots.map((slot,i)=>[slot.id,pool[i].id]));}
const heroTechniques={
 gaban:{damage:23,armor:5,boost:1},coby:{damage:22,armor:2,energy:6},zephyr:{damage:21,shield:12},roger:{damage:24,armor:4},shanks:{damage:23,statuses:{stunned:1}},mihawk:{damage:22,armor:7},garp:{damage:26,armor:3},rayleigh:{damage:17,shield:12,steal:9},oden:{damage:24,armor:5},zoro:{damage:23,armor:4,boost:1},sanji:{damage:17,statuses:{burn:2},evade:1},jinbe:{damage:16,armor:3,element:'water'},beckman:{damage:16,statuses:{marked:3}},'lucky-roux':{damage:15,evade:1},cavendish:{damage:18,evade:1},'sulong-carrot':{damage:14,statuses:{stunned:1},element:'lightning'},nekomamushi:{damage:20,statuses:{marked:2}},inuarashi:{damage:19,armor:4},vergo:{damage:17,shield:14},sentomaru:{damage:12,shield:24},vista:{damage:20,armor:3,evade:1},nami:{damage:17,statuses:{blind:1},element:'lightning'},usopp:{damage:10,statuses:{rooted:2,marked:1}},franky:{damage:20,armor:3},killer:{damage:18,armor:4},urouge:{damage:20,heal:7},xebec:{damage:21,boost:3},dragon:{statuses:{marked:4},shield:8,energy:14}
};
export function createCustomAnimeFighter(name,build,duration='medium'){
 validateCharacterBuild(build);const heroes=Object.fromEntries(characterSlots.map(s=>[s.id,onePieceCharacters.find(c=>c.id===build[s.id])])),skill=heroes.skill;
 const noHaki=new Set(['nami','robin','franky','brook','chopper','vegapunk','barto','sulong-carrot','hiso-hiso']);
 const f=createAnimeFighter(name,{fruit:skill.fruit||'gomu-gomu',weapon:'sword',dial:'tone',haki:noHaki.has(skill.id)?'none':skill.id==='enel'?'observation':'armament'},duration);
 const base=skill.fruit?animeFruits.find(p=>p.id===skill.fruit):{id:`hero-${skill.id}`,name:`Techniki: ${skill.name}`,power:skill.move,family:'energy',move:skill.move,desc:`${skill.name} wykorzystuje technikę „${skill.move}”.`,rule:heroTechniques[skill.id]||{damage:8+skill.ratings.skill,boost:2},chance:.3};
 const styles=fruitStyles(base,'fists');f.anime.baseFruit=base;f.anime.fruit={...base,move:styles[0].name,rule:styles[0].rule};f.anime.style=styles[0];f.anime.skillHero=skill;f.anime.custom=true;f.anime.customTraits={...build};f.anime.combatStyle='fists';f.anime.weapon={id:'fists',name:'Własna postać',kind:'blunt',attack:0};f.traits.weapon={...f.traits.weapon,name:'Własna postać'};
 f.anime.dial={id:'no-dial',name:'Bez dialu',chance:0,rule:{},desc:''};
 f.stats={health:Math.round((95+heroes.endurance.ratings.endurance*6)*durations[duration].multiplier),attack:14+heroes.strength.ratings.strength*2,speed:8+heroes.speed.ratings.speed*2,accuracy:60+heroes.iq.ratings.iq*2,defense:4+heroes.defense.ratings.defense*2,stamina:60+heroes.endurance.ratings.endurance*6,pierce:Math.round(skill.ratings.skill/2)};
 return f;
}
