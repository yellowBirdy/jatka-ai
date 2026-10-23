import {pathToFileURL} from 'node:url';
import {categories,createFighter,simulate,seededRandom} from '../engine.js';
import {getBeastAbilities} from '../beast-abilities.js';
export function benchmarkBeasts({builds=12,seeds=4}={}){
 const targets=['sabretooth','griffin','drake'],opponents=['tiger','lion','rhino','panther','mammoth'],report={};let fights=0;
 for(const beast of targets){let wins=0,games=0;const lengths={};
  for(const duration of ['short','medium','long']){let durationWins=0,durationGames=0;
   for(let build=0;build<builds;build++){
    const random=seededRandom(701+build*491),picks=Object.fromEntries(categories.map(c=>[c.id,c.options[Math.floor(random()*c.options.length)].id]));
    const armor=['none','leather','mail','scale','plate'][build%5],ownSkill=getBeastAbilities(beast)[build%5].id;
    for(const opponent of opponents){
     const a=createFighter('A',{...picks,beast,beastArmor:armor,beastAbility:ownSkill},duration,'classic',true),b=createFighter('B',{...picks,beast:opponent,beastArmor:armor,beastAbility:getBeastAbilities(opponent)[build%5].id},duration,'classic',true);
     for(let seed=0;seed<seeds;seed++)for(const swap of [false,true]){const pair=swap?[b,a]:[a,b],result=simulate(...pair,seededRandom(913+build*2311+seed*79));const won=result.winner===(swap?1:0);wins+=won;durationWins+=won;games++;durationGames++;fights++;}
    }
   }
   lengths[duration]=Number((100*durationWins/durationGames).toFixed(1));
  }
  report[beast]={wins,games,winPercent:Number((100*wins/games).toFixed(1)),byLength:lengths};
 }
 return {fights,builds,seeds,opponents,report};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)console.log(JSON.stringify(benchmarkBeasts(),null,2));
