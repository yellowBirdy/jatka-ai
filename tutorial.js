// The guide observes real game actions; starting or closing it never resets a match.
export function setupTutorial(context){
 const $=id=>document.getElementById(id);
 let active=false,step='settings',firstPlayer=0,lastFormat='',lastPhase='',rendered='',highlight=null;
 const lessons={
  settings:['Ustaw swoją grę','Wybierz 1 na 1 lub 2 na 2, tryb klasyczny albo fantastyczny i długość walki. Długość zmienia HP. Modyfikacja Wierzchowce dodaje bestię i jej zbroję. Gdy ustawienia pasują, kliknij Dalej.','#format-settings',true],
  name:['Nadaj wojownikowi imię','Wpisz imię w podświetlonym polu. To Twoja pierwsza postać — jej wygląd i statystyki zobaczysz obok.','#fighter-name'],
  weapon:['Wybierz broń','Kliknij inną broń spośród pięciu propozycji z puli dwudziestu. Sprawdź, jak zmieniają się jej kształt i statystyki wojownika.','[data-category="weapon"] > .option-grid'],
  material:['Zmień materiał broni','Wybierz inny materiał części bojowej lub chwytu. Premie i koszty sumują się ze statystykami, a dostępne materiały zależą od rodzaju broni.','.weapon-materials'],
  ability:['Wybierz umiejętność specjalną','Wybierz inną umiejętność i przeczytaj jej efekt. Każda ma 25% szans aktywacji przy własnym ataku; nie ma gwarantowanego wyzwolenia po kilku turach.','[data-category="ability"]'],
  item:['Wybierz przedmiot specjalny','Wybierz inny przedmiot. Daje stałą premię do statystyk — jego działanie nie wymaga losowania.','fieldset.fantasy-category:has(input[name="specialItem"])'],
  magic:['Wybierz moc magiczną','Wybierz inną moc i sprawdź procent na karcie. Magia i umiejętność specjalna mają niezależne szanse aktywacji.','fieldset.fantasy-category:has(input[name="magicPower"])'],
  beast:['Wybierz bestię','Wybierz inną bestię spośród pięciu propozycji z puli dwudziestu. Jej premie i koszty zmieniają statystyki całej postaci.','input[name="beast"]:checked + span'],
  beastArmor:['Wybierz zbroję bestii','Wybierz inną zbroję bestii. Cięższy pancerz chroni mocniej, ale obniża szybkość i kondycję. Bestia i jeździec mają wspólne HP.','.beast-armor-group'],
  beastSkill:['Sprawdź umiejętność bestii','Każda bestia ma 5 własnych umiejętności. Wybierz jedną z nich — ma 25% szans aktywacji po ataku, niezależnie od umiejętności jeźdźca i magii. Potem kliknij Dalej.','.beast-ability-group',true],
  confirm:['Zatwierdź wojownika','Pozostałe cechy mają już wybrane propozycje. Możesz je zmienić, a potem zatwierdzić gotową postać.','#confirm'],
  remaining:['Przygotuj kolejnych wojowników','Wybierz cechy kolejnej postaci i zatwierdź ją. W 1 na 1 potrzebujesz dwóch postaci, a w 2 na 2 — po dwóch dla drużyn A i B.','#confirm'],
  arena:['Rozpocznij walkę','Sprawdź ekwipunek i zdrowie postaci, a następnie kliknij Rozpocznij walkę. W 1 na 1 walka przebiega automatycznie. W 2 na 2 wybierasz każdy atak.','#fight'],
  watching:['Obserwuj walkę','Paski pokazują pozostałe HP, a komentarz opisuje faktyczne zdarzenia. Możesz obejrzeć całą walkę lub pominąć animację.','#commentary'],
  actor:['Wybierz atakującego','Wskaż wojownika swojej drużyny z listy lub przyciskiem przy jego postaci. Żywi sojusznicy wykonują po jednym ruchu, zanim ta sama postać zaatakuje ponownie.','#team-actor'],
  target:['Wybierz cel ataku','Wskaż żywego przeciwnika z listy lub przyciskiem przy jego postaci. Nie możesz atakować sojuszników ani pokonanych.','#team-target'],
  attack:['Atakuj wybrany cel','Sprawdź strzałkę z imionami i kliknij Atakuj. Po rozstrzygnięciu ruchu kolej przejdzie na drugą drużynę.','#team-attack'],
  turns:['Rozgrywaj kolejne tury','Kontynuuj wybór atakującego i celu. Pokonaj obu rywali, aby wygrać. Po 320 turach decyduje suma pozostałych procentów HP drużyny; równość daje remis.','#team-controls'],
  done:['Gotowe — znasz już zasady!','Wynik i przebieg walki znajdziesz na arenie. Rewanż zachowuje postacie, Zmień cechy wraca do kreatora, a Nowi wojownicy zaczyna od nowa.','#result',true]
 };
 const creatorSteps=c=>['settings','name','weapon','material','ability',...(c.mode==='fantasy'?['item','magic']:[]),...(c.mounted?['beast','beastArmor','beastSkill']:[]),'confirm'];
 function close(){active=false;$('tutorial').hidden=true;highlight?.classList.remove('tutorial-highlight');highlight=null;document.body.classList.remove('tutorial-active');$('tutorial-start').setAttribute('aria-expanded','false');$('tutorial-start').focus({preventScroll:true});}
 function next(){if(step==='done'){close();return;}const steps=creatorSteps(context());step=steps[steps.indexOf(step)+1]||'confirm';refresh();}
 function refresh(event){
  if(!active)return;
  const c=context();
  if(c.format!==lastFormat){step='settings';firstPlayer=c.player;lastPhase='';lastFormat=c.format;}
  if(c.phase!==lastPhase){
   if(c.phase==='creator'&&lastPhase){step='settings';firstPlayer=c.player;}
   else if(c.phase==='arena')step='arena';
   else if(c.phase==='teams')step='actor';
   else if(c.phase==='watching')step='watching';
   else if(c.phase==='result')step='done';
   lastPhase=c.phase;
  }
  if(c.phase==='creator'){
   if(c.player!==firstPlayer)step='remaining';
   else if(!creatorSteps(c).includes(step))step='confirm';
  }
  const node=event?.target,name=node?.name;
  const changed=event?.type==='change',input=event?.type==='input',clicked=event?.type==='click';
  const card=clicked?node.closest('[data-fighter]'):null;
  if(step==='name'&&input&&node.id==='fighter-name'&&node.value.trim())next();
  else if(step==='weapon'&&changed&&name==='weapon')next();
  else if(step==='material'&&changed&&['headMaterial','gripMaterial'].includes(name))next();
  else if(step==='ability'&&changed&&name==='ability')next();
  else if(step==='item'&&changed&&name==='specialItem')next();
  else if(step==='magic'&&changed&&name==='magicPower')next();
  else if(step==='beast'&&changed&&name==='beast')next();
  else if(step==='beastArmor'&&changed&&name==='beastArmor')next();
  else if(step==='actor'&&((changed&&node.id==='team-actor')||(card&&!card.disabled&&Math.floor(Number(card.dataset.fighter)/2)===c.activeTeam)))step='target';
  else if(step==='target'&&((changed&&node.id==='team-target')||(card&&!card.disabled&&Math.floor(Number(card.dataset.fighter)/2)!==c.activeTeam)))step='attack';
  else if(['actor','target','attack'].includes(step)&&clicked&&node.closest('#team-attack')&&c.phase==='teams')step='turns';
  const key=`${step}:${c.player}:${c.format}:${c.mode}:${c.mounted}`;
  if(key===rendered)return;rendered=key;
  const [title,body,selector,canNext]=lessons[step];
  $('tutorial-title').textContent=title;$('tutorial-text').textContent=body;
  $('tutorial-progress').textContent=step==='done'?'SAMOUCZEK UKOŃCZONY':`SAMOUCZEK · ${c.format==='teams'?'2 NA 2':'1 NA 1'} · ${c.phase==='creator'?'TWORZENIE POSTACI':'ARENA'}`;
  $('tutorial-next').hidden=!canNext;$('tutorial-next').textContent=step==='done'?'Zakończ samouczek':'Dalej →';
  highlight?.classList.remove('tutorial-highlight');highlight=document.querySelector(selector);highlight?.classList.add('tutorial-highlight');
  highlight?.scrollIntoView({behavior:'instant',block:'center'});
 }
 $('tutorial-start').onclick=()=>{
  if(active){$('tutorial-title').focus({preventScroll:true});return;}
  const c=context();active=true;step='settings';firstPlayer=c.player;lastFormat=c.format;lastPhase='';rendered='';
  $('tutorial').hidden=false;document.body.classList.add('tutorial-active');$('tutorial-start').setAttribute('aria-expanded','true');refresh();$('tutorial-title').focus({preventScroll:true});
 };
 $('tutorial-close').onclick=close;$('tutorial-next').onclick=next;
 document.addEventListener('keydown',e=>{if(active&&e.key==='Escape'){e.preventDefault();close();}});
 for(const type of ['input','change','click'])document.addEventListener(type,event=>queueMicrotask(()=>refresh(event)));
 const observer=new MutationObserver(()=>refresh());
 for(const id of ['creator','arena','result','team-controls'])observer.observe($(id),{attributes:true,attributeFilter:['hidden']});
 observer.observe($('player-label'),{childList:true});
}
