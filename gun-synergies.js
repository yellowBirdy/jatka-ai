const synergies=[
 {id:'explosive-shot',name:'Wybuchowe strzały',dials:['flame','flavour'],desc:'Flame + Flavour: pociski wybuchają przy trafieniu i zostawiają płomienie.',bonus:8,heat:6,burn:2},
 {id:'storm-shot',name:'Burzowe pociski',dials:['thunder','water'],desc:'Thunder + Water: magiczne wyładowanie zakłóca ostrzał przeciwnika.',bonus:4,heat:2,jam:1},
 {id:'razor-wind',name:'Wietrzne ostrza',dials:['breath','axe'],desc:'Breath + Axe: wirujące cięcia pomagają przełamać osłonę.',bonus:4,heat:1,pierce:8,armor:2},
 {id:'impact-drive',name:'Taran odrzutowy',dials:['jet','impact'],desc:'Jet + Impact: mocne natarcie kosztem odrzutu własnej konstrukcji.',bonus:10,heat:4,recoil:4},
 {id:'flash-mark',name:'Oślepiający znacznik',dials:['vision','flash'],desc:'Vision + Flash: świetlisty ślad ułatwia namierzenie i oślepia rywala.',bonus:0,heat:1,accuracy:15,blind:1,marked:2}
];
export function gunSynergies(gun){return synergies.filter(s=>s.dials.every(id=>gun.dials.some(d=>d.id===id)));}
export function readyGunSynergy(battle,actor){
 const gun=battle.guns[actor],state=battle.state;if(state.status[actor].silence)return null;
 for(const synergy of gunSynergies(gun)){const slots=synergy.dials.map(id=>gun.dials.findIndex((d,n)=>d.id===id&&state.charges[actor][n]>0&&state.cooldowns[actor][n]===0));if(slots.every(n=>n>=0))return {...synergy,slots};}
 return null;
}

export const gunSynergyCatalog=synergies;
