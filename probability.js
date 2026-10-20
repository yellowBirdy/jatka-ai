// An independent roll per activation; seeded generators make combat reproducible.
export function rollChance(chance,random=Math.random){
 if(!Number.isFinite(chance)||chance<0||chance>1)throw Error('Szansa musi mieścić się w przedziale 0–1.');
 if(chance===0)return false;
 if(chance===1)return true;
 return random()<chance;
}
