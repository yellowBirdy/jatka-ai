// Four local profile slots; their positions remain stable when names change.
const key='jatka.profiles.v1';
const normalize=value=>Array.from({length:4},(_,i)=>typeof value?.[i]==='string'?value[i].trim().slice(0,24):'');
export function readProfiles(storage){try{const value=JSON.parse(storage.getItem(key));return Array.isArray(value)?normalize(value):normalize([]);}catch{return normalize([]);}}
export function writeProfiles(storage,names){try{storage.setItem(key,JSON.stringify(normalize(names)));return true;}catch{return false;}}
