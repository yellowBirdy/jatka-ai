const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});try{
const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('http://127.0.0.1:8000');
const offers=()=>page.locator('#categories input').evaluateAll(inputs=>inputs.map(i=>i.name+':'+i.value));
const checkOffers=async()=>{assert.equal(await page.locator('.category').count(),8);for(const group of await page.locator('.category').all()){assert.equal(await group.locator('input').count(),5);assert.equal(new Set(await group.locator('input').evaluateAll(a=>a.map(i=>i.value))).size,5);}};
await checkOffers();const first=await offers();await page.locator('input[name="weapon"]').nth(2).check();assert.deepEqual(await offers(),first);const selected=await page.locator('input[name="weapon"]:checked').inputValue();
await page.getByRole('button',{name:'Zatwierdź wojownika'}).click();await checkOffers();const second=await offers();assert.notDeepEqual(first,second);await page.getByRole('button',{name:'Zatwierdź wojownika'}).click();
const health=()=>page.locator('.health').evaluateAll(b=>b.map(e=>Number(e.getAttribute('aria-valuemax'))));const medium=await health();
await page.getByLabel('Krótka').check();assert.deepEqual(await health(),medium.map(h=>Math.round(h*.65)));await page.getByLabel('Długa').check();assert.deepEqual(await health(),medium.map(h=>Math.round(h*1.6)));
await page.getByRole('button',{name:'Rozpocznij walkę'}).click();assert.ok(await page.getByLabel('Średnia').isDisabled());await page.getByRole('button',{name:'Pomiń animację'}).click();assert.ok(await page.getByLabel('Średnia').isEnabled());await page.getByRole('button',{name:'Rewanż'}).click();assert.deepEqual(await health(),medium.map(h=>Math.round(h*1.6)));await page.getByRole('button',{name:'Pomiń animację'}).click();
await page.getByRole('button',{name:'Zmień cechy'}).click();assert.deepEqual(await offers(),first);assert.equal(await page.locator('input[name="weapon"]:checked').inputValue(),selected);
await page.getByRole('button',{name:'Losuj nowe opcje'}).click();assert.notDeepEqual(await offers(),first);await checkOffers();assert.equal(await page.locator('#categories input:checked').count(),8);
await page.setViewportSize({width:390,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:'/tmp/jatka-expanded-mobile.png',fullPage:true});assert.deepEqual(errors,[]);console.log('PASS: 5 z 20, osobne oferty, zachowanie wyborów, nowe losowanie, HP obu graczy, blokada długości, rewanż, mobile');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
