export const tactics={
 balanced:{name:'Zrównoważona',attack:0,accuracy:0,defense:0,desc:'Bez dodatkowych premii i kosztów.'},
 aggressive:{name:'Agresywna',attack:5,accuracy:0,defense:-4,desc:'+5 siły; −4 ochrony do następnego własnego ruchu.'},
 cautious:{name:'Ostrożna',attack:-3,accuracy:.15,defense:0,desc:'−3 siły; +15 pkt proc. celności tego ataku (obowiązują limity).'},
 defend:{name:'Obrona',attack:0,accuracy:0,defense:0,desc:'Oddajesz atak. Następne trafienie bronią zadaje o połowę mniej obrażeń, do kolejnego własnego ruchu. Magia i jad omijają obronę.'},
 rest:{name:'Odpoczynek',attack:0,accuracy:0,defense:0,desc:'Oddajesz atak i odzyskujesz do 21 kondycji. Bez aktywacji umiejętności i magii.'}
};
export function resolveTactic(id){if(!Object.hasOwn(tactics,id))throw Error('Wybierz poprawną taktykę.');return tactics[id];}
