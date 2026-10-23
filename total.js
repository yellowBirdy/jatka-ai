export const totalFields=[['name','Imię lub nazwa postaci','Np. Cesarz Galaktyki'],['weapon','Broń i materiały','Co to za broń, z czego jest i co potrafi?'],['armor','Zbroja, ciało i ochrona','Pancerz z tytanu, ciało smoka, tarcza energetyczna…'],['origin','Pochodzenie','Skąd pochodzi? Jakie ma doświadczenie?'],['style','Jak walczy?','Taktyka, szybkość, dystans, wyszkolenie…'],['advantage','Największe przewagi','Co czyni tę postać wyjątkową?'],['weakness','Słabości','Co może ją powstrzymać? Możesz napisać „brak”.'],['power','Moce i wszystko inne','Magia, technologia, bestia, dodatkowe bronie — dowolny pomysł.']];
const normalize=s=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ł/g,'l').replace(/Ł/g,'L').toLowerCase();
const labels={attack:'Siła rażenia',defense:'Ochrona',mobility:'Mobilność',range:'Zasięg',control:'Kontrola',endurance:'Wytrzymałość'};
// A rule contributes once, regardless of how many times a player repeats it.
const rules=[
 ['Prosta broń biała',/kij|patyk|kamien|piesc|galaret/,{attack:1}],
 ['Ostrze lub broń drzewcowa',/miecz|szabl|katana|topor|siekier|wloczni|halabard|mlot|ostrze/,{attack:5,range:1}],
 ['Broń strzelecka',/\bluk\b|kusz|strzal|bumerang/,{attack:5,range:6}],
 ['Broń palna',/karabin|pistolet|strzelb|snajper|minigun|maszynow/,{attack:13,range:10}],
 ['Energia lub materiały przyszłości',/laser|plazm|antymater|atomow|nuklearn|foton/,{attack:16,range:11}],
 ['Wybuchy i artyleria',/rakiet|bomb|granat|dzialo|eksploz/,{attack:12,range:9}],
 ['Ciężki pancerz',/stal|tytan|tytan|diament|adamant|wibran|pancerz|plytow/,{defense:9,endurance:4}],
 ['Tarcza lub bariera',/tarcz|barier|polem silow|pole silow/,{defense:7}],
 ['Lekka ochrona',/skorz|kolczug|kewlar|kevlar/,{defense:4}],
 ['Nadludzka siła',/nadludzk|gigant|olbrzym|tytan|smok|goryl/,{attack:7,endurance:7}],
 ['Zwinność i wyszkolenie',/zwin|szybk|ninja|samuraj|mistrz|doswiadcz|weteran/,{mobility:6,control:3}],
 ['Lot',/lata|latanie|skrzydl|odrzut|lotu/,{mobility:7,range:3}],
 ['Teleportacja',/teleport/,{mobility:13,control:5}],
 ['Magia żywiołów',/ogien|ogni|lod|piorun|blyskawic|zywiol/,{attack:8,range:5}],
 ['Manipulacja umysłem lub czasem',/\bczas\w*|umysl|hipno|telekinez|rzeczywistosc/,{control:13,attack:4}],
 ['Regeneracja',/regener|odrast|leczen|uzdraw/,{endurance:10}],
 ['Niewidzialność lub zasadzka',/niewidzial|zasadzk|skrad|kamufl/,{control:7,mobility:3}],
 ['Niezniszczalność opisana przez gracza',/niesmierteln|niezniszczal|nietykal|wszechmoc|niepokonan/,{defense:18,endurance:15}],
 ['Działanie na dystans',/dystans|dalek|odleglosc/,{range:4}],
 ['Trucizna',/truciz|jadow|jad\b/,{attack:4,control:4}]
];
function affirmative(value){return normalize(value).split(/[.!?;,\n]/).filter(clause=>!/(^|\s)(nie|bez|brak)(\s|$)/.test(clause)).join(' ');}
export function assessTotal(description){
 const stats={attack:5,defense:5,mobility:5,range:1,control:5,endurance:5},recognized=[];
 const text=totalFields.filter(([key])=>!['name','weakness'].includes(key)).map(([key])=>affirmative(description[key])).join(' ');
 for(const [name,pattern,bonus] of rules)if(pattern.test(text)){recognized.push(name);for(const [key,n]of Object.entries(bonus))stats[key]+=n;}
 const weakness=normalize(description.weakness);
 if(/powol|ciezk|brak szyb/.test(weakness)){stats.mobility=Math.max(1,stats.mobility-5);recognized.push('Słabość: ograniczona mobilność');}
 if(/kruch|slab.*pancerz|bez zbro|brak ochron/.test(weakness)){stats.defense=Math.max(1,stats.defense-5);recognized.push('Słabość: podatna ochrona');}
 if(/zmec|kondyc|wyczerp/.test(weakness)){stats.endurance=Math.max(1,stats.endurance-5);recognized.push('Słabość: zmęczenie');}
 if(/ogien|ogni|lod|wod|swiatl|magii/.test(weakness))recognized.push('Warunkowa podatność na wskazany żywioł lub moc');
 return {stats,recognized,absoluteGuard:/niezniszczal|nietykal|niesmierteln|wszechmoc/.test(text),realityControl:/rzeczywistosc|wymaz|usun.*istnien|wszechmoc/.test(text)};
}
const clean=d=>Object.fromEntries(totalFields.map(([key])=>[key,String(d?.[key]??'').trim()]));
export function resolveTotal(first,second){
 const fighters=[clean(first),clean(second)];for(const f of fighters){if(!f.name)throw Error('Podaj imię obu postaci.');if(!f.weapon)throw Error('Opisz broń obu postaci (możesz wpisać „bez broni”).');}
 const analyses=fighters.map(assessTotal),scores=analyses.map(a=>Object.values(a.stats).reduce((n,v)=>n+v,0)),advantages=[[],[]];
 for(let i=0;i<2;i++){
  const own=analyses[i].stats,enemy=analyses[1-i].stats;
  for(const key of Object.keys(labels))if(own[key]>enemy[key])advantages[i].push(labels[key].toLowerCase());
  // Opening range matters less when the opponent can close with flight/teleportation.
  scores[i]+=Math.max(0,own.range-enemy.range)*Math.max(.2,1-enemy.mobility/40);
  const weakness=normalize(fighters[1-i].weakness),attack=affirmative([fighters[i].weapon,fighters[i].power].join(' '));
  if([[/ogien|ogni/,/ogien|ogni/],[/lod|zimn/,/lod|zimn/],[/wod/,/wod/],[/magii/,/mag|czar/]].some(([w,p])=>w.test(weakness)&&p.test(attack))){scores[i]+=10;advantages[i].push('wykorzystanie słabości przeciwnika');}
 }
 const protectedSides=analyses.map((a,i)=>a.absoluteGuard&&!analyses[1-i].realityControl);
 const winner=protectedSides.every(Boolean)?null:protectedSides.some(Boolean)?protectedSides.indexOf(true):Math.abs(scores[0]-scores[1])<.5?null:scores[0]>scores[1]?0:1;
 if(winner!==null&&protectedSides[winner])advantages[winner].push('opisana niezniszczalność bez rozpoznanej kontry');
 const reason=winner===null?'Żaden opis nie daje rozpoznanej przewagi wystarczającej do przełamania rywala.':`O wyniku decydują: ${advantages[winner].join(', ')||'łączny potencjał bojowy'}.`;
 const short=winner===null?`Remis: ${fighters[0].name} i ${fighters[1].name} nie przełamują swoich możliwości. ${reason}`:`Wygrywa ${fighters[winner].name}. ${reason}`;
 const long=[
  ...fighters.map(f=>`${f.name} wchodzi na arenę. Pochodzenie: ${f.origin||'nieopisane'}. Broń: ${f.weapon}. Ochrona: ${f.armor||'nieopisane zabezpieczenia'}. Sposób walki: ${f.style||'nieokreślony'}.`),
  ...fighters.map((f,i)=>`Przygotowanie ${f.name}: ${f.advantage||'brak dodatkowo opisanej przewagi'}. Moce i wsparcie: ${f.power||'nie podano'}. Silnik rozpoznaje: ${analyses[i].recognized.join('; ')||'brak znanych cech — neutralna ocena'}.`),
  `Pierwsze starcie: ${analyses[0].stats.range===analyses[1].stats.range?'obie strony mają porównywalny rozpoznany zasięg':fighters[analyses[0].stats.range>analyses[1].stats.range?0:1].name+' uzyskuje przewagę dystansu'}. Mobilność i kontrola wpływają na to, czy rywal zdoła odpowiedzieć.`,
  `Próba przełamania: ${fighters[0].name} wykorzystuje ${fighters[0].weapon}, a ${fighters[1].name} odpowiada, używając ${fighters[1].weapon}. ${reason}`,
  `Słabe punkty: ${fighters[0].name} — ${fighters[0].weakness||'nie podano'}; ${fighters[1].name} — ${fighters[1].weakness||'nie podano'}. ${advantages.some(a=>a.includes('wykorzystanie słabości przeciwnika'))?'Rozpoznana moc odpowiada podatności rywala, co przechyla starcie.':'Nie rozpoznano bezpośredniego wykorzystania opisanej podatności.'}`,
  winner===null?'Finał: starcie pozostaje nierozstrzygnięte. Według rozpoznanych cech żadna strona nie ma wyraźnej przewagi.':`Finał: ${fighters[winner].name} przełamuje opór ${fighters[1-winner].name}. Zestawienie rozpoznanej siły, ochrony, zasięgu, mobilności, kontroli i wytrzymałości daje zwycięstwo tej postaci.`
 ];
 return {fighters,analyses,scores:scores.map(s=>Math.round(s*10)/10),winner,reason,short,long};
}
export function setupTotal(){
 const $=id=>document.getElementById(id);let stage=0,drafts=[{},{}],snapshot=[];
 try{const stored=JSON.parse(localStorage.getItem('jatka.total.v1'));if(Array.isArray(stored)&&stored.length===2)drafts=stored.map(clean);}catch{}
 const save=()=>{try{localStorage.setItem('jatka.total.v1',JSON.stringify(drafts));}catch{}};
 function read(){drafts[stage]=Object.fromEntries(totalFields.map(([key])=>[key,$('total-'+key).value]));save();}
 function render(){
  $('total-result').hidden=true;$('total-review').hidden=true;$('total-form').hidden=false;$('total-step').textContent=`GRACZ ${stage+1} / 2`;
  $('total-fields').replaceChildren(...totalFields.map(([key,label,placeholder])=>{const wrapper=document.createElement('label'),title=document.createElement('span'),input=document.createElement(key==='name'?'input':'textarea');title.textContent=label;input.id='total-'+key;input.name=key;input.placeholder=placeholder;input.value=drafts[stage][key]||'';input.required=['name','weapon'].includes(key);if(key!=='name')input.rows=3;wrapper.append(title,input);return wrapper;}));
  $('total-next').textContent=stage===0?'Zapisz postać · gracz 2 →':'Zatwierdź postacie →';$('total-error').textContent='';
 }
 function review(){
  $('total-form').hidden=true;$('total-review').hidden=false;$('total-result').hidden=true;$('total-step').textContent='GOTOWI DO TOTALNEJ JATKI';
  $('total-roster').replaceChildren(...drafts.map((f,i)=>{const card=document.createElement('article'),title=document.createElement('h3'),icon=document.createElement('span'),details=document.createElement('dl'),edit=document.createElement('button');icon.className='total-emblem';icon.textContent=i?'♜':'♞';icon.setAttribute('aria-hidden','true');title.textContent=f.name;for(const [key,label]of totalFields.filter(([key])=>key!=='name')){const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.textContent=f[key]||'Nie podano';details.append(dt,dd);}edit.type='button';edit.className='quiet';edit.textContent='Edytuj postać';edit.onclick=()=>{stage=i;render();};card.append(icon,title,details,edit);return card;}));
 }
 $('total-start').onclick=()=>{snapshot=[...document.querySelectorAll('.match-settings,.steps,#creator,#arena,#stat-guide,#profile-settings,#tutorial-start')].map(node=>[node,node.hidden]);snapshot.forEach(([node])=>node.hidden=true);$('total-mode').hidden=false;stage=0;render();$('total-mode').scrollIntoView({block:'start'});};
 $('total-exit').onclick=()=>{if(!$('total-form').hidden)read();$('total-mode').hidden=true;snapshot.forEach(([node,hidden])=>node.hidden=hidden);$('total-start').focus();};
 $('total-form').addEventListener('input',read);
 $('total-form').onsubmit=e=>{e.preventDefault();read();if(stage===0){stage=1;render();$('total-name').focus();}else review();};
 $('total-battle').onclick=()=>{try{const result=resolveTotal(...drafts);$('total-result').hidden=false;$('total-review').hidden=true;$('total-step').textContent='WERDYKT';$('total-winner').textContent=result.winner===null?'Remis':`Wygrywa ${result.fighters[result.winner].name}`;$('total-short').textContent=result.short;$('total-long').replaceChildren(...result.long.map(text=>{const p=document.createElement('p');p.textContent=text;return p;}));$('total-analysis').replaceChildren(...result.fighters.map((f,i)=>{const card=document.createElement('article'),title=document.createElement('h3'),traits=document.createElement('p'),stats=document.createElement('p');title.textContent=f.name;traits.textContent=result.analyses[i].recognized.join(' · ')||'Nie rozpoznano cech. Neutralne wartości.';stats.textContent=Object.entries(result.analyses[i].stats).map(([key,n])=>`${labels[key]}: ${n}`).join(' · ');card.append(title,traits,stats);return card;}));$('total-result').scrollIntoView({block:'start'});}catch(error){$('total-error').textContent=error.message;}};
 $('total-edit').onclick=review;
 $('total-new').onclick=()=>{drafts=[{},{}];save();stage=0;render();};
}
