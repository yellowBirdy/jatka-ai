// Material catalog; availability is defined separately for each weapon family.
export const weaponMaterials={
 headMaterial:{name:'Część bojowa — ostrze / głowica',default:'steel',options:[
  {id:'steel',name:'Stal',texture:'steel',stats:{},desc:'Zrównoważona. Bez zmian statystyk.'},
  {id:'iron',name:'Żelazo',texture:'darksteel',stats:{attack:2,accuracy:-3},desc:'+2 siły · −3 celności'},
  {id:'bronze',name:'Brąz',texture:'bronze',stats:{attack:1,speed:1,pierce:-2},desc:'+1 siły · +1 szybkości · −2 przebicia'},
  {id:'tempered',name:'Stal hartowana',texture:'tempered',stats:{attack:3,pierce:2,speed:-2,stamina:-6},desc:'+3 siły · +2 przebicia · −2 szybkości · −6 kondycji'},
  {id:'hardwood',name:'Drewno wzmacniane',texture:'wood',stats:{attack:-3,speed:4,stamina:8},desc:'−3 siły · +4 szybkości · +8 kondycji'}
 ]},
 gripMaterial:{name:'Rękojeść / drzewce',default:'ash',options:[
  {id:'ash',name:'Jesion',texture:'ash',stats:{},desc:'Sprężysty i uniwersalny. Bez zmian statystyk.'},
  {id:'oak',name:'Dąb',texture:'wood',stats:{attack:2,speed:-2},desc:'+2 siły · −2 szybkości'},
  {id:'birch',name:'Brzoza',texture:'birch',stats:{speed:3,attack:-1},desc:'+3 szybkości · −1 siły'},
  {id:'walnut',name:'Orzech',texture:'walnut',stats:{accuracy:5,stamina:-6},desc:'+5 celności · −6 kondycji'},
  {id:'wrapped',name:'Skórzany oplot',texture:'wrap',stats:{stamina:12,accuracy:2,speed:-1},desc:'+12 kondycji · +2 celności · −1 szybkości'}
 ]}
};

const extra=(id,name,texture,stats,desc)=>({id,name,texture,stats,desc});
weaponMaterials.headMaterial.options.push(
 extra('damascus','Stal damasceńska','damascus',{attack:2,accuracy:4,stamina:-5},'+2 siły · +4 celności · −5 kondycji'),
 extra('flint','Krzemień','flint',{attack:2,pierce:5,accuracy:-5},'+2 siły · +5 przebicia · −5 celności'),
 extra('bone','Kość','bone',{attack:-1,speed:3,pierce:1},'−1 siły · +3 szybkości · +1 przebicia'),
 extra('granite','Granit','granite',{attack:5,speed:-4,stamina:-8},'+5 siły · −4 szybkości · −8 kondycji'),
 extra('wood-core','Twarde drewno','wood',{},'Solidny rdzeń. Bez zmian statystyk.'),
 extra('bamboo','Bambus','bamboo',{attack:-2,speed:5},'−2 siły · +5 szybkości'),
 extra('ironwood','Drewno żelazne','ironwood',{attack:4,speed:-3},'+4 siły · −3 szybkości'),
 extra('rattan','Rattan','rattan',{stamina:15,speed:2,attack:-3},'+15 kondycji · +2 szybkości · −3 siły')
);
weaponMaterials.gripMaterial.options.push(
 extra('bone-grip','Kościana rękojeść','bone',{accuracy:4,stamina:-4},'+4 celności · −4 kondycji'),
 extra('cord','Oplot lniany','rattan',{stamina:10,speed:1,attack:-1},'+10 kondycji · +1 szybkości · −1 siły'),
 extra('hickory','Hikora','ash',{attack:1,stamina:8,speed:-1},'+1 siły · +8 kondycji · −1 szybkości'),
 extra('bamboo-grip','Bambusowe drzewce','bamboo',{speed:4,attack:-2},'+4 szybkości · −2 siły'),
 extra('iron-grip','Żelazny trzonek','darksteel',{attack:3,stamina:-10,speed:-1},'+3 siły · −10 kondycji · −1 szybkości'),
 extra('rawhide','Surowa skóra','leather',{accuracy:3,stamina:6,speed:-1},'+3 celności · +6 kondycji · −1 szybkości')
);
const families={
 blades:{name:'Broń sieczna',headName:'Ostrze',gripName:'Rękojeść',head:['steel','iron','bronze','tempered','damascus'],grip:['ash','walnut','wrapped','bone-grip','cord']},
 axes:{name:'Topory i sierpy',headName:'Głowica / ostrze',gripName:'Trzonek',head:['steel','iron','tempered','damascus','flint'],grip:['ash','oak','wrapped','hickory','birch']},
 polearms:{name:'Broń drzewcowa',headName:'Grot / ostrze',gripName:'Drzewce',head:['steel','iron','bronze','tempered','bone'],grip:['ash','oak','bamboo-grip','birch','hickory']},
 impact:{name:'Broń obuchowa',headName:'Głowica',gripName:'Trzonek',head:['steel','iron','bronze','tempered','granite'],grip:['ash','oak','iron-grip','wrapped','hickory']},
 wooden:{name:'Kostury i maczugi',headName:'Rdzeń broni',gripName:'Chwyt / oplot',head:['wood-core','hardwood','bamboo','ironwood','rattan'],grip:['ash','wrapped','cord','rawhide','walnut']}
};
const weaponFamilies={sword:'blades',sabre:'blades',rapier:'blades',greatsword:'blades',falchion:'blades',scimitar:'blades',estoc:'blades',axe:'axes',sickle:'axes',spear:'polearms',halberd:'polearms',glaive:'polearms',pike:'polearms',trident:'polearms',hammer:'impact',mace:'impact',flail:'impact',warpick:'impact',club:'wooden',staff:'wooden'};
export function getWeaponMaterials(weapon){
 const family=families[weaponFamilies[weapon]];
 if(!family)throw Error(`Nieznany rodzaj głównej broni: ${weapon}`);
 return Object.fromEntries([['headMaterial',family.head,family.headName],['gripMaterial',family.grip,family.gripName]].map(([key,ids,name])=>[key,{name,family:family.name,default:ids[0],options:ids.map(id=>weaponMaterials[key].options.find(m=>m.id===id))}]));
}
export function normalizeMaterials(picks){
 const result={...picks};
 for(const [key,group]of Object.entries(getWeaponMaterials(picks.weapon)))if(!group.options.some(m=>m.id===result[key]))result[key]=group.default;
 return result;
}
export function resolveMaterials(picks){
 return Object.fromEntries(Object.entries(getWeaponMaterials(picks.weapon)).map(([key,group])=>{
  const id=picks[key]??group.default;
  const material=group.options.find(m=>m.id===id);
  if(!material)throw Error(`Materiał nie pasuje do broni: ${group.name}`);
  return [key,material];
 }));
}
