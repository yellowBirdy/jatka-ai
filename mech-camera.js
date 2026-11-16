const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const createOrbit=(yaw=Math.PI)=>({yaw,pitch:.28,distance:10.5});
export function rotateOrbit(orbit,dx,dy){orbit.yaw-=dx*.006;orbit.pitch=clamp(orbit.pitch+dy*.004,.12,.8);}
export function screenMotion(x,z,yaw){return {x:-Math.cos(yaw)*x-Math.sin(yaw)*z,z:Math.sin(yaw)*x-Math.cos(yaw)*z};}
export function orbitPosition(target,orbit){const d=orbit.distance*Math.cos(orbit.pitch);return {x:target.x-Math.sin(orbit.yaw)*d,y:1.7+Math.sin(orbit.pitch)*orbit.distance,z:target.z-Math.cos(orbit.yaw)*d};}
