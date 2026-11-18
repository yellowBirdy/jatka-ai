const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const createView=(yaw=Math.PI)=>({yaw,pitch:.22,distance:10.5});
export function rotateView(view,x,y){view.yaw-=x*.006;view.pitch=clamp(view.pitch+y*.004,-.7,1.35);}
export function moveRelative(x,z,yaw){return {x:-Math.cos(yaw)*x-Math.sin(yaw)*z,z:Math.sin(yaw)*x-Math.cos(yaw)*z};}
export function cameraPosition(target,view){const d=view.distance*Math.cos(view.pitch);return {x:target.x-Math.sin(view.yaw)*d,y:1.8+Math.sin(view.pitch)*view.distance,z:target.z-Math.cos(view.yaw)*d};}

export function viewDirection(view){return {x:Math.sin(view.yaw)*Math.cos(view.pitch),y:-Math.sin(view.pitch),z:Math.cos(view.yaw)*Math.cos(view.pitch)};}
