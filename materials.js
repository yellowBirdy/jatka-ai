// Universal construction choices for the main weapon only.
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
export const defaultMaterials=Object.fromEntries(Object.entries(weaponMaterials).map(([key,group])=>[key,group.default]));
export function resolveMaterials(picks){
 return Object.fromEntries(Object.entries(weaponMaterials).map(([key,group])=>{
  const id=picks[key]??group.default;
  const material=group.options.find(m=>m.id===id);
  if(!material)throw Error(`Wybierz poprawny materiał: ${group.name}`);
  return [key,material];
 }));
}
