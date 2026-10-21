const skill=(id,name,description)=>({id,name,description});
export const armorSkills=[
 skill('veteran','Zapasy weterana','Co 3 własny atak: odzyskujesz do 12 kondycji.'),
 skill('desert','Pył pustyni','Co 3 własny atak: oślepiasz rywala na 2 jego ataki.'),
 skill('legion','Żółw legionu','Co 3 własny atak: następne trafienie bronią w Ciebie zadaje połowę obrażeń.'),
 skill('hussar','Impet husarii','Co 3 własny atak: następny atak rywala jest osłabiony jak po ciosie głowicą.'),
 skill('champion','Oko czempiona','Co 3 własny atak: skupienie poprawia celność tego i następnego ataku o 30 pkt proc.'),
 skill('silver','Srebrny oddech','Co 3 własny atak: odzyskujesz do 6 HP.'),
 skill('rhino','Gruba skóra','Co 3 własny atak: osłona pochłania do 12 obrażeń następnego trafienia bronią.'),
 skill('crimson','Karmazynowy rozłam','Co 3 własny atak: ochrona celu spada o 3 do końca walki, maksymalnie o 12.'),
 skill('conqueror','Uchwyt zdobywcy','Co 4 własny atak: rozbrajasz rywala, osłabiając jego następny cios o 12 siły.'),
 skill('titan','Tytanowa forteca','Co 3 własny atak: ustawiasz barierę 16 HP przeciw broni. Nie sumuje się.'),
 skill('obsidian','Obsydianowe kolce','Co 3 własny atak: dwa następne trafienia bronią odbiją po 4 obrażenia, jeśli przeżyjesz cios.'),
 skill('gold','Złota riposta','Co 3 własny atak: przygotowujesz jedną kontrę za 9 HP po przeżytym trafieniu bronią.'),
 skill('emperor','Rozkaz imperatora','Co 3 własny atak: odzyskujesz do 8 kondycji i Twój celny cios zyskuje +8 siły.'),
 skill('immortal','Ostatnia nadzieja','Raz w walce, przy maksymalnie 35% HP podczas ataku: odzyskujesz do 20 HP i usuwasz negatywne efekty.'),
 skill('wargod','Gniew boga wojny','Co 4 własny atak: dodatkowe pewne uderzenie za 18 obrażeń bronią. Osłony nadal działają.')
];
export function applyArmorSkill({fighters,state,actor,target,heal,details}){
 const armor=fighters[actor].traits.armor,rule=armor?.skill;if(!rule)return null;
 const n=++state.armorTurns[actor],s=fighters[actor].stats;
 if(rule.id==='immortal'){
  if(state.armorRescue[actor]||state.hp[actor]>s.health*.35)return null;
  state.armorRescue[actor]=1;heal(20);
  for(const key of ['venom','burn','frozen','blind','silenced','rooted','stunned','slow','armorDamage','exposed','staggered','disarmed'])state[key][actor]=typeof state[key][actor]==='boolean'?false:0;
 }else{
  if(n%(['conqueror','wargod'].includes(rule.id)?4:3))return null;
  switch(rule.id){
   case 'veteran':state.energy[actor]=Math.min(s.stamina,state.energy[actor]+12);break;
   case 'desert':state.blind[target]=Math.max(state.blind[target],2);break;
   case 'legion':state.guard[actor]=1;break;
   case 'hussar':state.staggered[target]=true;break;
   case 'champion':state.focus[actor]=Math.max(state.focus[actor],2);break;
   case 'silver':heal(6);break;
   case 'rhino':state.shield[actor]=Math.max(state.shield[actor],12);break;
   case 'crimson':state.armorDamage[target]=Math.max(state.armorDamage[target],Math.min(12,Math.max(0,fighters[target].stats.defense),state.armorDamage[target]+3));break;
   case 'conqueror':state.disarmed[target]=true;break;
   case 'titan':state.barrier[actor]=Math.max(state.barrier[actor],16);break;
   case 'obsidian':state.thorns[actor]=Math.max(state.thorns[actor],2);break;
   case 'gold':state.wrist[actor]=1;break;
   case 'emperor':state.energy[actor]=Math.min(s.stamina,state.energy[actor]+8);break;
  }
 }
 details.push(`Zbroja: ${rule.name}. ${rule.description}`);
 return rule;
}
