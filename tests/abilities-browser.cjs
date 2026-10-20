const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||(process.env.CI?chromium.executablePath():'/usr/bin/chromium'),headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});try{
 const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8000');
 const abilities=await page.evaluate(async()=>{const {categories}=await import('./engine.js?v=unique-abilities-4');return categories.find(c=>c.id==='ability').options.map(a=>({id:a.id,desc:a.desc}));});
 assert.equal(abilities.length,20);assert.equal(new Set(abilities.map(a=>a.desc)).size,20);
 for(const ability of abilities){
  await page.goto('http://127.0.0.1:8000');let radio=page.locator(`input[name="ability"][value="${ability.id}"]`);
  for(let tries=0;await radio.count()===0&&tries<100;tries++)await page.getByRole('button',{name:'Losuj nowe opcje'}).click();
  assert.equal(await radio.count(),1,ability.id);await radio.check();assert.equal(await radio.locator('..').locator('.option-desc').innerText(),ability.desc);
  await page.getByLabel('Długa').check();await page.getByRole('button',{name:'Zatwierdź wojownika'}).click();await page.getByRole('button',{name:'Zatwierdź wojownika'}).click();await page.getByRole('button',{name:'Rozpocznij walkę'}).click();await page.locator('#result').waitFor({state:'visible'});assert.ok((await page.locator('#history li').count())>0);
 }
 await page.screenshot({path:'/tmp/jatka-unique-abilities-result.png',fullPage:true});assert.deepEqual(errors,[]);console.log('PASS: wybór i pełna rozgrywka z każdą z 20 unikalnych umiejętności w przeglądarce');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
