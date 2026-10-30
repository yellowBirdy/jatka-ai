// Authored moves: same family does not mean the same power.
// Compact keys are internal; players see the move and its narrative description.
const rows=`gabu-gabu|Płonący trunek|d:12,burn:2,recoil:2
mera-mera|Ognista pięść|d:14,burn:2
magu-magu|Magma pochłania pole walki|d:20,burn:2,armor:3
netsu-netsu|Rozżarzone dłonie|d:11,burn:1,armor:2
atsu-atsu|Rozpalone ciało|d:9,burn:3,shield:5
hie-hie|Epoka lodowcowa|d:13,frozen:3,shield:8
yuki-yuki|Śnieżna zaspa|d:7,blind:2,frozen:2
hito-hito-onyudo|Przemiana w olbrzymiego mnicha|d:10,shield:7
 goro-goro|Sąd piorunów|d:22,stunned:1
pika-pika|Kopnięcie światła|d:19,evade:1
kira-kira|Diamentowe ciało|shield:24,d:7
noko-noko|Chmura zarodników|d:3,venom:4,blind:1
doku-doku|Trujący olbrzym|d:9,venom:4
gasu-gasu|Duszący obłok|d:8,venom:2,stunned:1
mushi-mushi-suzumebachi|Żądło szerszenia|d:6,venom:2,evade:1
suna-suna|Pustynne wysuszenie|d:12,blind:2,steal:10
sabi-sabi|Zardzewiała broń|armor:5,stunned:1
shari-shari|Wirujące koła|d:8,armor:1,boost:1
tori-tori-phoenix|Odrodzenie w błękitnym płomieniu|heal:22,shield:6
chiyu-chiyu|Uzdrawiające łzy|heal:26
horu-horu|Hormonalny zryw|heal:9,energy:24,boost:2
yomi-yomi|Chłód podziemi|d:8,frozen:2,heal:6
mori-mori|Żywotny las|d:10,rooted:2,heal:8
gura-gura|Pęknięcie nieba|d:24,armor:4,recoil:3
zushi-zushi|Ciężar grawitacji|d:16,rooted:3
ton-ton|Upadek kolosa|d:21,recoil:4
kilo-kilo|Nagła zmiana ciężaru|d:9,evade:1,energy:6
ishi-ishi|Kamienny olbrzym|d:14,shield:16
shima-shima|Żywa wyspa|d:17,shield:19
yami-yami|Pochłonięcie ciemności|d:16,seal:1,steal:12
soru-soru|Wyrwanie odwagi|d:13,steal:18,heal:5
kage-kage|Armia cieni|d:11,boost:3,shield:5
sui-sui|Natarcie spod podłoża|d:9,evade:1,marked:1
numa-numa|Bagienna pułapka|d:5,rooted:3,shield:7
ope-ope|Room — chirurgiczne cięcie|d:17,armor:4,energy:5
supa-supa|Stalowe kończyny|d:13,armor:3,shield:5
kama-kama|Wietrzne ostrza|d:10,armor:2,marked:1
choki-choki|Rozcięcie drogi|d:8,armor:4,evade:1
ito-ito|Klatka z nici|d:14,rooted:2,armor:1
toge-toge|Kolczaste natarcie|d:12,armor:2,shield:3
buki-buki|Arsenał w ciele|d:15,armor:3
bomu-bomu|Eksplodujący cios|d:18,armor:2,recoil:2
pamu-pamu|Pękająca osłona|d:12,armor:5
jiki-jiki|Magnetyczny zgniot|d:19,rooted:1,armor:2
deka-deka|Gigantyczna pięść|d:23,recoil:2
moa-moa|Powiększony pocisk|d:20,marked:2
jara-jara|Łańcuchowa pułapka|d:7,rooted:3,armor:1
gutsu-gutsu|Rozpalony piec|d:13,burn:2,shield:6
kyubu-kyubu|Sześcienna przeszkoda|d:6,shield:13,rooted:1
bari-bari|Niezłomna bariera|shield:30
doru-doru|Woskowa klatka|shield:12,rooted:2
pero-pero|Cukrowe więzienie|shield:15,rooted:2,d:3
bisu-bisu|Herbatnikowi żołnierze|d:8,shield:20
beta-beta|Lepki chwyt|rooted:3,steal:9
kuri-kuri|Kremowa osłona|shield:11,heal:4
bata-bata|Śliska zasadzka|shield:7,rooted:2,evade:1
ame-ame|Cukierkowa fala|d:7,rooted:2,shield:9
kachi-kachi|Rozgrzana twardość|shield:17,burn:1
kame-kame|Żółwi pancerz|shield:22,energy:8
moku-moku|Białe kłęby|mist:3,rooted:1,d:5
sube-sube|Ślizg obok ciosu|evade:1,energy:10
suke-suke|Niewidzialna zasadzka|evade:1,marked:2,d:4
mira-mira|Lustrzana pułapka|evade:1,shield:10,d:3
doa-doa|Drzwi za plecami|evade:1,marked:1,energy:8
wapu-wapu|Nagła teleportacja|evade:1,d:9
nuke-nuke|Przeniknięcie przez przeszkodę|evade:1,armor:2
hira-hira|Powiewające ciało|evade:1,shield:6
hana-hana|Chwyt wielu dłoni|d:8,rooted:2,stunned:1
mochi-mochi|Lepkie ramiona|d:12,rooted:2,evade:1
nori-nori|Przejęcie wierzchowca|stunned:2,marked:2
nui-nui|Przyszycie do ziemi|rooted:4,d:2
ori-ori|Żelazne więzy|rooted:3,d:6
maki-maki|Zwój odbicia|shield:14,boost:1
hiso-hiso|Pomoc zwierząt|marked:2,energy:15
kobu-kobu|Zagrzanie do boju|boost:4,energy:18
kibi-kibi|Sprzymierzeniec z dango|shield:8,boost:2
awa-awa|Zmycie sił|steal:20,stunned:1
woshu-woshu|Wypranie złych zamiarów|steal:15,cleanse:1
noro-noro|Spowalniający promień|frozen:4,marked:2
horo-horo|Negatywny duch|stunned:2,steal:14
hobi-hobi|Groźba przemiany w zabawkę|stunned:3,d:2
mero-mero|Kamienne zauroczenie|stunned:2,d:9
shibo-shibo|Wyciśnięcie siły|d:6,drain:1,steal:16
juku-juku|Postarzenie osłony|armor:6,d:3
toshi-toshi|Inna przyszłość|d:15,evade:1,energy:9
shiku-shiku|Zaraźliwa choroba|venom:5,steal:8
nomi-nomi|Analiza przeciwnika|marked:4,energy:14
memo-memo|Wycięte wspomnienie|stunned:2,mist:2
mane-mane|Podmieniona tożsamość|mist:3,marked:1
fuku-fuku|Przebranie do zasadzki|mist:2,shield:8
kuku-kuku|Posiłek na powrót sił|heal:14,energy:16
mato-mato|Nieustępliwy pocisk|d:12,marked:3
giro-giro|Przejrzenie zamiarów|marked:3,evade:1
nagi-nagi|Pole ciszy|silenced:3,mist:2
buku-buku|Więzienie w książce|rooted:3,stunned:1
fude-fude|Ożywiony rysunek|d:9,shield:9
uta-uta|Pieśń sennego świata|stunned:2,mist:3
hito-hito|Ludzka zręczność|energy:18,heal:5
hito-hito-daibutsu|Fala złotego Buddy|d:20,shield:18
gomu-gomu|Wyzwolona gumowa pięść|d:19,boost:2,evade:1
bara-bara|Rozdzielone ciało|evade:1,d:7
bane-bane|Sprężynowy skok|d:13,boost:1,evade:1
riki-riki|Nadludzki chwyt|d:21,armor:3
wara-wara|Słomiana osłona|shield:16,d:4
jake-jake|Próba przejęcia ciała|stunned:1,boost:3
guru-guru|Śmigłowe natarcie|d:8,evade:1,energy:4
mogu-mogu|Atak kreta spod ziemi|d:8,marked:2,evade:1
ushi-ushi-bison|Szarża bizona|d:14,armor:1
ushi-ushi-giraffe|Zasięg żyrafy|d:10,marked:2
inu-inu-dachshund|Zwinny doskok jamnika|d:5,evade:1,energy:7
inu-inu-jackal|Kły szakala|d:10,armor:1,energy:5
inu-inu-wolf|Wilcze osaczenie|d:11,marked:1,energy:6
inu-inu-kyubi-no-kitsune|Zwodniczy lis|d:12,mist:3,evade:1
inu-inu-okuchi-no-makami|Lodowy oddech strażnika|d:16,frozen:2,shield:12
inu-inu-tanuki|Spryt tanuki|evade:1,shield:4,energy:12
neko-neko-leopard|Drapieżne rozszarpanie|d:18,armor:2,marked:1
neko-neko-saber-tiger|Kły pradawnego łowcy|d:19,armor:3,heal:3
tori-tori-falcon|Sokoli pikujący atak|d:11,evade:1,marked:1
tori-tori-albatross|Szeroki lot|d:7,evade:1,energy:13
uma-uma|Koński galop|d:9,energy:16
uma-uma-pegasus|Natarcie pegaza|d:13,evade:1,shield:3
zou-zou|Słoniowy taran|d:17,shield:11
zou-zou-mammoth|Pradawny mamuci taran|d:20,shield:14
hebi-hebi-anaconda|Splot anakondy|d:9,rooted:3
hebi-hebi-king-cobra|Jadowity atak kobry|d:8,venom:3
hebi-hebi-yamata-no-orochi|Osiem wężowych głów|d:15,heal:10,rooted:1
sara-sara-axolotl|Odnowa aksolotla|heal:16,evade:1
mushi-mushi-kabutomushi|Pancerz i róg chrząszcza|d:10,shield:13
ryu-ryu-allosaurus|Szczęki allozaura|d:18,armor:3
ryu-ryu-spinosaurus|Drapieżny spinozaur|d:19,shield:8
ryu-ryu-pteranodon|Pikujący pteranodon|d:18,evade:1,shield:5
ryu-ryu-brachiosaurus|Zgniatający splot|d:19,rooted:2
ryu-ryu-pachycephalosaurus|Cios pancerną głową|d:17,armor:4
ryu-ryu-triceratops|Trójrożna szarża|d:18,armor:2,shield:9
kumo-kumo-rosamygale-grauvogeli|Prehistoryczna pajęczyna|d:11,rooted:3,venom:1
tama-tama|Pękająca skorupa|heal:8,shield:10,boost:1
tori-tori-eagle|Orli nalot|d:12,evade:1,energy:3
uma-uma-zebra|Zwinny galop zebry|d:8,evade:1,energy:11
ushi-ushi-holstein|Taran przebudzonego strażnika|d:13,heal:7,shield:6
uo-uo-seiryu|Boro Breath — smoczy oddech|d:28,burn:3,shield:16
oto-oto|Muzyczna eksplozja|d:14,stunned:1
goe-goe|Krzyk fali uderzeniowej|d:12,armor:3
toro-toro|Płynna zasadzka|evade:1,rooted:2
mini-mini|Zniknięcie w szczelinie|evade:1,mist:2
ami-ami|Sieć na przeciwnika|rooted:3,shield:5
fuwa-fuwa|Lewitujące pole walki|d:15,evade:1,rooted:1
raki-raki|Skradzione szczęście|evade:1,marked:3,energy:4
goru-goru|Złote kajdany|d:12,rooted:3,shield:7
mosa-mosa|Błyskawiczny porost|rooted:3,shield:12
peto-peto|Obroża przymusu|stunned:2,rooted:2
modo-modo|Cofnięte lata|d:8,stunned:1,armor:3
beri-beri|Rozsypane jagody|evade:1,shield:5,energy:3
susu-susu|Sadza na polu walki|d:9,blind:3
muchi-muchi|Rozkaz dla otoczenia|d:10,boost:3
gunyo-gunyo|Gliniani żołnierze|d:11,shield:15
oshi-oshi|Tunel przez przeszkodę|armor:4,evade:1,energy:4
gocha-gocha|Połączona siła|d:16,shield:10
hoya-hoya|Cios przyzwanego dżina|d:18,armor:1
shiro-shiro|Żywa twierdza|shield:28,d:5
baku-baku|Pożarcie uzbrojenia|armor:4,heal:6
nikyu-nikyu|Odparcie natarcia|d:17,evade:1,cleanse:1
ato-ato|Przemalowana rzeczywistość|stunned:1,mist:3
poke-poke|Ukryty arsenał|d:10,shield:8,energy:5
toki-toki|Ucieczka w przyszłość|evade:1,cleanse:1
 iro-iro|Kamuflaż otoczenia|mist:4
koro-koro|Pędzący wagon|d:14,boost:1,rooted:1`;
export const fruitPowers=Object.fromEntries(rows.split('\n').map(line=>{const [id,move,encoded]=line.trim().split('|'),rule={};for(const field of encoded.split(',')){const [key,value]=field.split(':');if(key==='d')rule.damage=+value;else if(['burn','frozen','blind','venom','rooted','stunned','marked','silenced','mist'].includes(key)){(rule.statuses??={})[key]=+value;}else rule[key]=+value;}return [id,{move,rule}];}));
export const armoredFruits=new Set(['kira-kira','bari-bari','kachi-kachi','kame-kame','ishi-ishi','shiro-shiro','uo-uo-seiryu','ryu-ryu-triceratops','ryu-ryu-brachiosaurus','ryu-ryu-pteranodon','mushi-mushi-kabutomushi']);
