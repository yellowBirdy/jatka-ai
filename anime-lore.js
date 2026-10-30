// Matchups are deliberately named rules, not a universal elemental ranking.
const logias=new Set(['moku-moku','suna-suna','mera-mera','goro-goro','hie-hie','pika-pika','magu-magu','numa-numa','gasu-gasu','yuki-yuki','susu-susu','mori-mori']);
export const isLogia=fruit=>logias.has(fruit.id);
export function powerInteraction(power,opponent){
 const id=power.id,target=opponent.id;
 const result={multiplier:1,seal:0,text:''};
 if(target==='suna-suna'&&(id==='water'||power.rule?.element==='water'))return {multiplier:2,seal:2,text:'Woda skleja piasek! Suna Suna traci możliwość rozsypania ciała, a Crocodile nie może osłonić się piaskiem.'};
 if(target==='moku-moku'&&(['breath','jet','kama-kama','guru-guru'].includes(id)||power.rule?.element==='wind'))return {multiplier:1.5,seal:1,text:'Podmuch rozwiewa dym Moku Moku! Smoker musi odzyskać materialną postać.'};
 if(target==='gomu-gomu'&&(['goro-goro','thunder'].includes(id)||power.rule?.element==='lightning'))return {multiplier:0,seal:0,text:'Pioruny nie robią wrażenia na gumowym ciele! Gomu Gomu jest naturalną kontrą na elektryczność.'};
 if(target==='mera-mera'&&['mera-mera','flame','heat'].includes(id))return {multiplier:0,seal:0,text:'Ogień przechodzi przez ciało z płomieni. Mera Mera nie boi się zwykłego żaru.'};
 if(target==='magu-magu'&&['mera-mera','flame','heat'].includes(id))return {multiplier:0,seal:0,text:'Płomień nie przebija ciała z magmy.'};
 if(target==='mera-mera'&&id==='magu-magu')return {multiplier:1.6,seal:1,text:'Magma pochłania płomienie! Magu Magu przełamuje ochronę Mera Mera.'};
 if(['hie-hie','yuki-yuki'].includes(target)&&['mera-mera','magu-magu','flame','heat'].includes(id))return {multiplier:1.5,seal:1,text:'Żar topi lodową osłonę. Zimno nie wystarcza, by zatrzymać ten atak.'};
 if(id==='yami-yami'&&isLogia(opponent))return {multiplier:1.4,seal:1,text:'Ciemność pochłania żywioł. Dotyk Yami Yami odbiera rywalowi ochronę niematerialnego ciała.'};
 if(id===target&&isLogia(opponent))return {multiplier:0,seal:0,text:'Ten sam żywioł łączy się z ciałem przeciwnika zamiast go zranić.'};
 return result;
}
const stories={fire:'Otacza pole walki żarem i zmusza przeciwnika do szukania schronienia.',ice:'Zamraża otoczenie i utrudnia przeciwnikowi poruszanie się.',lightning:'Uderza błyskawicą, zanim przeciwnik zdąży złapać oddech.',light:'Oślepia i szuka szczeliny w obronie.',poison:'Zatruwa pole walki; nieostrożny przeciwnik cierpi także po ataku.',sand:'Zasypuje oczy i naciera przez tumany piasku.',heal:'Pozwala wrócić do walki mimo odniesionych ran.',quake:'Rozrywa teren potężnym wstrząsem, który wymaga opanowania.',drain:'Odbiera przeciwnikowi przewagę i odwraca przebieg starcia.',cut:'Przecina przeszkody i szuka drogi przez obronę.',blast:'Przełamuje gardę gwałtownym uderzeniem.',guard:'Tworzy osłonę, za którą można przeczekać natarcie.',evade:'Utrudnia pochwycenie ciała i pozwala wymknąć się z pułapki.',bind:'Krępuje ruchy przeciwnika i przejmuje kontrolę nad otoczeniem.',weaken:'Zakłóca działanie przeciwnika i otwiera drogę do kolejnego ruchu.',confuse:'Zaskakuje przeciwnika niezwykłą właściwością mocy.',energy:'Pomaga odzyskać inicjatywę i kontynuować natarcie.',beast:'Przemiana daje zwierzęce ciało, instynkt i naturalną broń.',dragon:'Smocze ciało i ognisty oddech zmieniają pole walki.',extra:'Wykorzystuje niezwykłą właściwość mocy, by zaskoczyć przeciwnika.'};
const personal={
 'moku-moku':'Ciało staje się dymem, przez który przechodzi zwykła broń. Silny podmuch rozwiewa dym i odsłania użytkownika.',
 'suna-suna':'Ciało rozsypuje się w piasek i wymyka broni. Woda skleja ziarna: mokry piasek nie pozwala zniknąć ani użyć piaskowej osłony.',
 'uo-uo-seiryu':'Mityczny smok Kaido: ogromne, łuskowate ciało, potężne uderzenia i niszczycielski Boro Breath. Drobne sztuczki nie wystarczą, żeby go powstrzymać.',
 'sube-sube':'Śliskie ciało pomaga wymknąć się broni, ale nie daje siły mitycznego smoka ani odporności na każdą moc.',
 'gomu-gomu':'Gumowe ciało rozciąga się i nie przewodzi elektryczności. Ostrza pozostają niebezpieczne.',
 'goro-goro':'Ciało staje się błyskawicą. Guma jest naturalną przeszkodą, której pioruny nie pokonają.',
 'mera-mera':'Włada płomieniami i zmienia ciało w ogień. Zwykły żar nie szkodzi, ale magma potrafi przełamać tę ochronę.',
 'yami-yami':'Ciemność pochłania żywioły i przy kontakcie odbiera ochronę Logii. Sam użytkownik nie jest niematerialny.'
};
const dialStories={water:'Wypuszcza strumień wody. Może skleić piaskowe ciało Suna Suna — samo ochlapanie nie odbiera mocy każdemu owocowi.',breath:'Wypuszcza zgromadzone powietrze. Podmuch rozwiewa dym Moku Moku.',jet:'Gwałtowny wyrzut powietrza napędza natarcie i rozprasza dym.',impact:'Oddaje zgromadzoną siłę uderzenia, ale odrzut rani także użytkownika. Twarda moc ochronna lub Haki uzbrojenia łagodzą ten wstrząs.',reject:'Uwalnia gwałtowny odrzut, który rani także użytkownika.',axe:'Wypuszcza tnące uderzenie powietrza.',flame:'Wypuszcza płomień. Ogień topi lód, ale nie zrani ciała Mera Mera.',heat:'Oddaje nagromadzony żar i topi lodowe osłony.',thunder:'Uwalnia elektryczne wyładowanie. Gumowe ciało pozostaje odporne.',flash:'Nagły błysk oślepia przeciwnika.',vision:'Odtwarza obraz i pomaga zmylić przeciwnika.',tone:'Odtwarza nagrany dźwięk, by odwrócić uwagę.',lamp:'Rozświetla otoczenie i utrudnia ukrycie się.',flavour:'Uwalnia zgromadzony zapach, tworząc mylący trop.',milky:'Tworzy ścieżkę z chmur.',ball:'Wypuszcza kuliste chmury, za którymi można się schować.',iron:'Tworzy twardą chmurę, która osłania przed ciosem.',string:'Wypuszcza chmurne nici, które krępują ruch.',swamp:'Tworzy grząską chmurę, w której łatwo ugrzęznąć.'};
export const loreDescription=item=>item.family?(personal[item.id]||`${item.power[0].toUpperCase()+item.power.slice(1)}. ${stories[item.family]}`):dialStories[item.id];
export function animeCondition(hp,max){return hp<=0?'Nie może kontynuować':hp/max>.75?'Gotowy do walki':hp/max>.45?'Poobijany, ale walczy':hp/max>.2?'Ciężko ranny':'Ledwo trzyma się na nogach';}
