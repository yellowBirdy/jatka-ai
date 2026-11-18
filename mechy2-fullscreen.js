export function createFullscreenController(doc){
 const root=doc.documentElement;let wanted=false,owned=false,pending=false;
 const current=()=>doc.fullscreenElement||doc.webkitFullscreenElement;
 async function leave(){wanted=false;if(!owned)return false;if(!current()){if(!pending)owned=false;return false;}if(current()!==root){owned=false;return false;}owned=false;try{const exit=doc.exitFullscreen||doc.webkitExitFullscreen;if(exit)await exit.call(doc);return true;}catch{return false;}}
 async function enter(){wanted=true;if(current()||pending)return false;const request=root.requestFullscreen||root.webkitRequestFullscreen;if(!request)return false;owned=true;pending=true;try{await request.call(root);pending=false;if(!wanted)return leave();return current()===root;}catch{pending=false;owned=false;return false;}}
 return {enter,leave};
}
