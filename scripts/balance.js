import {categories,createFighter,simulate,seededRandom,durations} from '../engine.js';
export function benchmark(buildCount=40,seeds=12,buildSeed=947){
 const abilities=categories.find(c=>c.id==='ability').options;
 const report={};let fights=0;
 for(const length of Object.keys(durations)){
 const wins=Object.fromEntries(abilities.map(a=>[a.id,0])),games={...wins};
 for(let build=0;build<buildCount;build++){
  const rng=seededRandom(buildSeed+build*7919);
  const picks=Object.fromEntries(categories.map(c=>[c.id,c.options[Math.floor(rng()*c.options.length)].id]));
  const fighters=abilities.map(a=>createFighter(a.id,{...picks,ability:a.id},length));
  for(let i=0;i<abilities.length;i++)for(let j=i+1;j<abilities.length;j++)for(let seed=0;seed<seeds;seed++)for(let swap=0;swap<2;swap++){
   const pair=swap?[j,i]:[i,j];const r=simulate(fighters[pair[0]],fighters[pair[1]],seededRandom(build*1009+seed*47+123));
   wins[abilities[pair[r.winner]].id]++;games[abilities[i].id]++;games[abilities[j].id]++;fights++;
  }
 }
 report[length]=Object.fromEntries(abilities.map(a=>[a.id,Number((100*wins[a.id]/games[a.id]).toFixed(2))]));
 }
 return {fights,buildCount,seeds,winPercent:report};
}
if(process.argv[1]?.endsWith('/balance.js'))console.log(JSON.stringify(benchmark(),null,2));
