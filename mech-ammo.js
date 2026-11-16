const magazines={mg:[24,1.8],cannon:[4,2.4],laser:[18,1.9],rocket:[3,2.6],shotgun:[6,2.2],minigun:[48,2.5],plasma:[6,2.3],rail:[3,2.8],flame:[20,2.1],pulse:[14,2],thermal:[10,2.3],micro:[4,2.5],heavymg:[18,2.2],flak:[5,2.3]};
export const createMagazines=guns=>guns.map(g=>{const [capacity,duration]=magazines[g.k]||magazines.mg;return {capacity,duration,remaining:capacity,reload:0};});
export function reloadMagazines(mags){for(const m of mags)if(m.remaining<m.capacity&&m.reload<=0)m.reload=m.duration;}
export function spendRound(m){if(m.reload>0||m.remaining<=0)return false;m.remaining--;if(m.remaining===0)m.reload=m.duration;return true;}
export function tickMagazines(mags,dt){for(const m of mags)if(m.reload>0){m.reload=Math.max(0,m.reload-dt);if(m.reload===0)m.remaining=m.capacity;}}
