const materials={steel:['Szczotkowana stal','steel'],wood:['Słoje polerowanego drewna','wood'],leather:['Ziarnista skóra i szwy','leather'],rubber:['Gumowa faktura z nacięciami','rubber'],crystal:['Fasetowany kryształ','crystal'],scales:['Tłoczone smocze łuski','scales'],ceramic:['Gładka ceramika z połyskiem','ceramic']};
export function gunMaterial(slot,index){
 let type='steel';
 if(slot==='stock')type=[1,2,5,9,14,19].includes(index)?'wood':[7,15,17].includes(index)?'rubber':'steel';
 if(slot==='grip')type=index===4||index===18?'crystal':index===19?'scales':[2,6,9].includes(index)?'wood':[1,7,11,12,15].includes(index)?'rubber':'leather';
 if(slot==='barrel')type=index===8?'crystal':index===9?'ceramic':'steel';
 if(slot==='body')type=index===18?'ceramic':index===17?'steel':'steel';
 if(slot==='magazine')type=[5,7,16].includes(index)?'crystal':'steel';
 if(slot==='sight')type=index===16||index===17?'crystal':'steel';
 if(slot==='finish')type=[2,12].includes(index)?'ceramic':[4,5,6,7].includes(index)?'crystal':'steel';
 return {id:type,name:materials[type][0],texture:materials[type][1]};
}
const looks={body:['Zaokrąglony korpus z frezowaną krawędzią.','Kanciasta sylwetka z segmentami osłony.','Łukowy grzbiet i wpuszczone panele.','Ścięte boki z nitowaną ramą.'],barrel:['Gładka osłona z metalicznym refleksem.','Wyraźne pierścienie i ciemne zagłębienia.','Smukła sylwetka z podłużnymi przetłoczeniami.','Wielowarstwowa osłona z kontrastowymi obręczami.'],stock:['Otwarta, lekka rama.','Zwarty profil z zaokrągloną stopką.','Wydłużona sylwetka z bocznym panelem.','Kanciasty profil z ozdobnym wycięciem.'],grip:['Łagodnie wygięty profil i rowki pod palce.','Gęsta faktura i wyraźne żłobienia.','Szeroki bok z dekoracyjnymi pasami.','Wąski profil z obszytą krawędzią.'],sight:['Niski profil i precyzyjnie zaznaczona muszka.','Błyszczące szkło z delikatną siatką.','Okrągły obiektyw i wielowarstwowa oprawa.','Otwarta ramka z barwioną szybką.'],magazine:['Prosty profil z podłużnym oknem.','Wydłużona obudowa z żebrami.','Okrągły bęben z tłoczoną pokrywą.','Zakrzywiony profil z zaznaczonymi segmentami.'],muzzle:['Kontrastowy kołnierz i głęboki cień.','Wielowarstwowe pierścienie i satynowa krawędź.','Kanciasta obudowa z ciemnymi szczelinami.','Obła osłona z dekoracyjną koroną.'],mechanism:['Mosiężne detale i wyraźna osłona.','Zdobiona płytka z małymi nitami.','Ażurowy detal i wypukły selektor.','Segmentowa obudowa z polerowaną krawędzią.'],ammo:['Metaliczna powierzchnia z kolorowym znacznikiem.','Kontrastowy rdzeń w ozdobnej oprawie.','Błyszczące wykończenie i barwiony czubek.','Tłoczona oprawa z wyrazistym paskiem.']};
export function gunAppearanceDescription(slot,index){
 if(slot==='finish')return `${gunMaterial(slot,index).name}. Wybrane barwy obejmują panele, krawędzie i zdobienia.`;
 if(slot==='stock'&&index===0)return 'Otwarty tył korpusu — bez kolby.';
 return `${looks[slot][index%4]} ${gunMaterial(slot,index).name}.`;
}
