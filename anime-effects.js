const hash=text=>[...text].reduce((n,c)=>(Math.imul(n,31)+c.charCodeAt(0))>>>0,7);

export function fruitEffectSvg(fruit){
 const seed=hash(fruit.id),family=fruit.family,hue=seed%360;
 let shapes='';
 for(let i=0;i<12+seed%7;i++){const n=hash(`${fruit.id}:${i}`),x=12+n%176,y=12+(n>>>8)%176,r=4+(n>>>16)%16;
  if(fruit.id==='moku-moku')shapes+=`<ellipse cx="${x}" cy="${y}" rx="${r*2}" ry="${r}" fill="#e9f5ef" opacity=".5"/>`;
  else if(fruit.id==='suna-suna')shapes+=`<path d="M${x} ${y}q${r} ${-r} ${r*2} 0l${-r} ${r}Z" fill="#d4ad61"/>`;
  else if(['lightning','light'].includes(family))shapes+=`<path d="M${x} ${y}l${r} ${-r*2}-${r/2} ${r*2} ${r} 0-${r*2} ${r*2} ${r/2}-${r*2}Z" fill="hsl(${hue} 95% 76%)"/>`;
  else if(['fire','dragon'].includes(family))shapes+=`<path d="M${x} ${y}q${-r*2} ${-r} 0 ${-r*3}q${r*2} ${r*2} 0 ${r*3}Z" fill="${i%2?'#ff762d':'#ffe2a0'}"/>`;
  else if(family==='ice')shapes+=`<path d="M${x-r} ${y-r}l${r*2} ${r*2}m0-${r*2}-${r*2} ${r*2}m${r}-${r*2}v${r*2}" stroke="#a0eafa" stroke-width="3"/>`;
  else if(family==='beast')shapes+=`<path d="M${x} ${y}q${-r} ${-r*2} ${r} ${-r*2}q${r*2} 0 ${r} ${r*2}Z" fill="hsl(${hue} 65% 70%)"/><circle cx="${x-r}" cy="${y-r*2}" r="3" fill="#fff"/>`;
  else if(['cut','blast','quake'].includes(family))shapes+=`<path d="M${x-r*2} ${y+r}Q${x+r} ${y-r*3} ${x+r*2} ${y-r}" fill="none" stroke="hsl(${hue} 80% 78%)" stroke-width="${2+i%4}"/>`;
  else if(['guard','bind'].includes(family))shapes+=`<path d="M${x-r} ${y-r}h${r*2}v${r*2}h-${r*2}Z" fill="none" stroke="hsl(${hue} 70% 73%)" stroke-width="3"/>`;
  else shapes+=`<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${Math.max(2,r/2)}" transform="rotate(${n%180} ${x} ${y})" fill="none" stroke="hsl(${hue} 75% 72%)" stroke-width="3"/>`;
 }
 if(fruit.id==='uo-uo-seiryu')shapes+='<path class="anime-dragon-silhouette" d="M20 115Q40 40 100 70L85 32 118 63 156 28 147 75 182 92 158 116 139 98Q95 80 75 130L90 167 58 146 32 175 42 132Z" fill="#659fdb" stroke="#f9d981" stroke-width="3"/><path d="M147 102Q178 105 199 156Q160 140 144 119Z" fill="#ff9c46"/>';
 if(fruit.id==='gomu-gomu')shapes+='<path d="M15 140Q180 15 170 120T35 75" fill="none" stroke="#fff6d3" stroke-width="12"/>';
 if(fruit.id==='bari-bari')shapes+='<path d="M100 22 170 60V130L100 181 30 130V60Z" fill="#79ecc344" stroke="#a0ffda" stroke-width="5"/>';
 return `<svg viewBox="0 0 200 200" aria-hidden="true" data-effect-family="${family}">${shapes}</svg>`;
}
const timers=new Set();
export function clearAnimeEffects(){document.getElementById('anime-field')?.classList.remove('power-hit');for(const timer of timers)clearTimeout(timer);timers.clear();document.querySelectorAll('.anime-fruit-fx,.anime-hit-fx,.anime-haki-fx').forEach(n=>n.remove());}
export function showAnimeEffects(event,fighters){
 clearAnimeEffects();if(['rest','defend'].includes(event.tactic))return;
 const stage=document.getElementById('anime-field');if(stage&&(event.damage+event.magicDamage)>=30&&!matchMedia('(prefers-reduced-motion: reduce)').matches){void stage.offsetWidth;stage.classList.add('power-hit');}
 const card=document.getElementById(`anime-fighter-${event.target}`);if(!card)return;
 if(event.damage>0||event.magicDamage>0){const hit=document.createElement('span');hit.className='anime-hit-fx combat-impact';hit.textContent='✧';card.append(hit);}
 if(fighters[event.actor].anime.haki.touch&&event.damage>0){const haki=document.createElement('span');haki.className='anime-haki-fx';haki.textContent='ϟ';card.append(haki);}
 const timer=setTimeout(()=>{document.querySelectorAll('.anime-hit-fx,.anime-haki-fx').forEach(n=>n.remove());timers.delete(timer);},550);timers.add(timer);
}
