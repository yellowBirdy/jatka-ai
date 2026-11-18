const settings={mg:[24,1.8],cannon:[4,2.3],laser:[18,2],rocket:[4,2.7],shotgun:[6,2.4],flame:[30,2.2]};
export const createAmmo=guns=>guns.map(g=>{const [capacity,duration]=settings[g.k]||settings.mg;return {capacity,duration,remaining:capacity,reload:0};});
export function spendRound(m){if(m.reload>0||m.remaining<=0)return false;m.remaining--;if(m.remaining===0)m.reload=m.duration;return true;}
export function reloadAmmo(mags){for(const m of mags)if(m.reload<=0&&m.remaining<m.capacity)m.reload=m.duration;}
export function tickAmmo(mags,dt){for(const m of mags)if(m.reload>0){m.reload=Math.max(0,m.reload-dt);if(m.reload===0)m.remaining=m.capacity;}}
