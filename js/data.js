window.POM_DATA = (() => {
const DIM = {booth:[900,1600],bowling:[1100,1467],concert:[1100,825],m01:[787,1400],m02:[787,1400],m03:[796,1400],m04:[787,1400],m05:[787,1400],m06:[704,1395],m07:[900,1200],m08:[900,1200],m09:[900,675],m10:[900,675],m11:[900,1205],m12:[900,1200],m13:[787,1400],m14:[900,777],m15:[787,1400],m16:[700,961],m17:[787,1400],m18:[646,1400],m19:[719,1280]};
const BOARDS = [
  {id:'birthday', name:'Birthday Girl', e:'🎂'},
  {id:'pink', name:'Pretty in Pink', e:'🌸'},
  {id:'food', name:'Food I Will Never Share', e:'🍝'},
  {id:'himachal', name:'Himachal Diaries', e:'🏔️'},
  {id:'story', name:'Our Story', e:'💞'},
  {id:'ldr', name:'Miles Apart, Same Heart', e:'📱'},
  {id:'poet', name:'Tingu the Poet', e:'✍️'},
  {id:'friends', name:'Our Monica & Chandler Era', e:'🛋️'},
  {id:'salsa', name:'Salsa Nights with Buddhu', e:'💃'}
];
const BNAME = Object.fromEntries(BOARDS.map(b => [b.id, b.e+' '+b.name]));

const POEM = [
  'साँसों में भर लेता, अगर तू धुआँ होती,',
  'हानि न पहुँचाता, पर तोड़ लेता, अगर तू गुलाब होती…',
  '',
  'मद्यत्यागी हूँ, जिसे जाम की ख़ुमारी की चाह नहीं होती,',
  'पर एक ही घूँट में पी जाता, अगर तू शराब होती',
  '',
  'ख़ुशनसीब हूँ कि तू न धुआँ है, न गुलाब, न शराब',
  'पर तू तो वो मोहब्बत है,',
  'जिसे न पाता अगर….तो सिर्फ़ बेकरारी होती'
];

/* r = displayed height/width in the grid */
const PINS = [
  {id:'p14', img:'m14', r:1.05, boards:['birthday','pink'], tag:'Birthday girl', title:'This face. That\'s the whole pin.', cap:'No caption needed. Look at her.', by:'b', c:[['b','Saved this to every board I own. Twice.']]},
  {id:'t24', t:'t-pink', boards:['birthday'], kind:'level', title:'Level 24 unlocked', r:1.1},
  {id:'p07', img:'m07', r:1.33, boards:['himachal'], title:'Pahadi princess 🏔️', cap:'Himachal saw her once and asked her to stay.', by:'b', c:[['b','The mountains were pretty. Then you stood in front of them.']]},
  {id:'tcake', t:'t-night', boards:['birthday'], kind:'cake', title:'24 candles are waiting', r:1.0},
  {id:'p03', img:'m03', r:1.5, boards:['food','pink'], title:'Dressed for the eatery, obviously 🍝', cap:'Outfit chosen based on what is on the menu. As it should be.', by:'m', c:[['m','Save me a bite. Just one. Please.']]},
  {id:'fpasta', t:'t-cream', boards:['food'], kind:'food', e:'🍝', big:'Pasta', title:'Pasta, her one true love', cap:'Her one true love. (After Buddhu.) Sharing status: never.', r:1.15},
  {id:'p18', img:'m18', r:1.6, boards:['ldr','food'], tag:'📌 Buddhu\'s favourite', title:'Dinner date, LDR edition 🍜', cap:'Same meal time, different cities, one call that never wants to end.', by:'b', c:[['b','Best restaurant I have ever been to. Table for two, 10,037 km apart.']]},
  {id:'p01', img:'m01', r:1.45, boards:['pink'], title:'Main character, ethnic edition ✨', cap:'Golden light, red kurta, and that smile. The camera never stood a chance.', by:'b', c:[['b','Wallpaper. Lock screen. Home screen. All of them.']]},
  {id:'tpoem', t:'t-poem', boards:['poet'], kind:'poem', title:'A poem for the poet', r:1.3},
  {id:'p12', img:'m12', r:1.33, boards:['himachal'], title:'Brave enough to jump off a mountain in Himachal 🪂', cap:'She actually flew. Paragliding, smiling, peace sign and all.', by:'b', c:[['m','Meanwhile I get scared on the second-floor balcony.']]},
  {id:'tfriends', t:'t-purple', boards:['friends','birthday'], kind:'friends', title:'The One Where Tingu Turns 24', r:0.95},
  {id:'p15', img:'m15', r:1.4, boards:['pink','birthday'], title:'Pagal Bacchi, official portrait 😤', cap:'Peak cuteness. Also peak attitude. Both certified.', by:'m', c:[['m','This is the face I get when I am late on the call.']]},
  {id:'treasons', t:'t-blush', boards:['birthday','story'], kind:'reasons', title:'24 reasons I love you', r:1.05},
  {id:'p10', img:'m10', r:0.75, boards:['himachal'], title:'Snow day, warm smile ❄️', cap:'Minus degrees outside, full sunshine on her face.', by:'b', c:[]},
  {id:'fparatha', t:'t-yellow', boards:['food'], kind:'food', e:'🫓', big:'Aloo Paratha', title:'Aloo paratha appreciation', cap:'Breakfast, lunch, dinner. It is never the wrong time.', r:1.0},
  {id:'p19', img:'m19', r:1.55, boards:['pink'], title:'Trying on the whole store 💃', cap:'Sequins: yes. Budget: we don\'t talk about it.', by:'m', c:[['m','You looked better than the mannequins. Sorry mannequins.']]},
  {id:'tscratch', boards:['birthday'], kind:'scratch', title:'Mystery pin', r:1.25},
  {id:'p08', img:'m08', r:1.33, boards:['himachal'], title:'Lost in the woods, found by the camera 🌲', cap:'Pine trees, fresh air, and one very photogenic traveller.', by:'b', c:[]},
  {id:'tsong', t:'t-night', boards:['story'], kind:'song', title:'Can\'t Take My Eyes Off You', r:1.05},
  {id:'p13', img:'m13', r:1.5, boards:['pink'], title:'Big glasses, bigger brain 📚', cap:'Bookstore mode. Poet energy. Do not disturb (unless you have snacks).', by:'b', c:[]},
  {id:'tdist', t:'t-sky', boards:['ldr'], kind:'distance', title:'10,037 km apart', r:0.95},
  {id:'p05', img:'m05', r:1.35, boards:['pink','food'], title:'Official snack navigator 🚗', cap:'In charge of directions, music and, most importantly, which café we stop at.', by:'m', c:[]},
  {id:'fdal', t:'t-mint', boards:['food'], kind:'food', e:'🍛', big:'Dal Chawal', title:'Dal chawal, comfort food', cap:'Comfort food for the comfort person. Both available 24/7.', r:1.0},
  {id:'p09', img:'m09', r:0.75, boards:['pink'], title:'Two Tingus > one Tingu', cap:'Reflection included at no extra cost.', by:'b', c:[['b','Double the Tingu, double the trouble. Worth it.']]},
  {id:'tclock', t:'t-blush', boards:['ldr'], kind:'clocks', title:'Two time zones, one heart', r:1.0},
  {id:'p17', img:'m17', r:1.6, boards:['pink'], title:'Festive & fabulous 🪔', cap:'Ganpati Bappa got the best-dressed devotee this year.', by:'b', c:[]},
  {id:'tsalsa', t:'t-pink', boards:['salsa'], kind:'salsa', title:'Salsa Nights with Buddhu', r:1.1},
  {id:'p11', img:'m11', r:1.25, boards:['himachal'], title:'Coldest place in Himachal, hottest girl in it', cap:'Snow everywhere. Still the brightest thing in the frame.', by:'b', c:[]},
  {id:'p02', img:'m02', r:1.5, boards:['pink'], title:'Night suit, but make it fashion', cap:'Some people dress up to go out. Tingu dresses up to sleep.', by:'m', c:[]},
  {id:'fpastry', t:'t-lilac', boards:['food'], kind:'food', e:'🍰', big:'Pastries', title:'Pastries, not for sharing', cap:'A pastry a day keeps the bad mood away. Do not ask for a bite.', r:1.0},
  {id:'p16', img:'m16', r:1.3, boards:['pink'], title:'Soft hours 🌸', cap:'Cozy, sleepy, and still the cutest thing on this site.', by:'b', c:[]},
  {id:'tmonica', t:'t-cream', boards:['friends'], kind:'monica', title:'Our Monica & Chandler era', r:1.0},
  {id:'p04', img:'m04', r:1.6, boards:['pink'], title:'Any mirror is a photo studio', cap:'If there is a mirror, there is a photo. Rules are rules.', by:'m', c:[]},
  {id:'teat', t:'t-yellow', boards:['food'], kind:'eatery', title:'Eatery hopping', r:0.9},
  {id:'p06', img:'m06', r:1.55, boards:['pink'], title:'Pretty, and she knows it', cap:'Blue dress, hair flip, phone ready. Iconic behaviour.', by:'b', c:[]},
  {id:'pus', img:'us', r:0.75, boards:['story','ldr','birthday'], tag:'⭐ Highlight', title:'Main characters 🎬', cap:'Tingu & Buddhu. Same frame, same sunset, same team. 10,037 km never stood a chance.', by:'b', c:[['b','Framing this. Literally.'],['m','Cool shirt. Cooler girlfriend.']]},
  {id:'smovie', img:'movie-night', r:1.78, boards:['story','ldr'], tag:'🍿 Movie night · Pune ⇄ Sydney', title:'Now Showing: Us, Obviously 🍿', cap:'One screen, two cities, one bowl of popcorn. I may or may not be watching the movie.', by:'b', c:[['b','Plot twist: the best part is you.'],['m','Movie was good. The company was better.']]},
  {id:'sconcert', img:'concert', r:0.75, boards:['story'], tag:'22 Nov 2025', title:'The night it all started', cap:'A concert, a crowd, and one person I could not take my eyes off.', by:'b', c:[['b','Spot the two people who are about to fall for each other 👀']]},
  {id:'sbowling', img:'bowling', r:1.33, boards:['story'], tag:'13 Dec 2025', title:'Bowling night 🎳', cap:'Not together yet. But definitely something there.', by:'b', c:[['m','I was looking at you, not the pins.']]},
  {id:'sbooth', img:'booth', r:1.6, boards:['story','ldr'], tag:'22 Aug 2026', title:'Photobooth date, LDR edition 📸', cap:'Two cities, one strip of photos. And it was the 22nd again.', by:'b', c:[['b','22 is our number. I don\'t make the rules.']]},
  {id:'t22', t:'t-pink', boards:['story'], kind:'22', title:'22 is our number', r:0.95}
];
const byId = Object.fromEntries(PINS.map(p => [p.id, p]));

const REASONS = [
  'You turn every meal into an event.',
  'You write poems. You put feelings into words better than anyone I know.',
  'Salsa with you, even when I step on your toes.',
  'Pink looks like it was invented for you.',
  'You jumped off a mountain in Himachal and smiled the whole way down.',
  'You know Friends better than the cast does.',
  'You\'re the Monica to my Chandler.',
  'That hands-on-cheeks face. You know the one.',
  'You make 10,037 km feel like the next room.',
  'You stay on video calls even when we\'re just eating dinner.',
  'A concert on 22 November, and somehow you kept me.',
  'Bowling night, when we weren\'t even together and I already didn\'t want it to end.',
  'You said yes on 22 March.',
  'The first "I love you" on 28 March.',
  'Your mirror selfies deserve their own museum.',
  'You never share your pastry, and honestly, respect.',
  'Your laugh on a bad network is still my favourite sound.',
  'You\'re a Pagal Bacchi in the best possible way.',
  'You make dal chawal sound romantic.',
  'You\'re brave and soft at the same time.',
  'Time zones can\'t keep up with how much I miss you.',
  '22 is our number, and you\'re the reason.',
  'You\'re my favourite notification, every single day.',
  'You\'re 24 today, and I get to love every one of your years.'
];

const NOTIFS = [
  ['b','Buddhu saved you to his board <b>Forever</b> 📌','just now'],
  ['m','<b>Bandar</b> commented on <i>Dressed for the eatery</i>: "Save me a bite."','2m'],
  ['b','Cutu, your 24 candles are waiting 🎂','5m'],
  ['b','Pagal Bacchi, stop scrolling and go eat cake.','12m'],
  ['b','Your pin <i>This face</i> got ∞ likes from Buddhu','1h'],
  ['b','Reminder: Pune → Sydney is 10,037 km. Love is not affected by distance.','3h'],
  ['m','<b>Monica & Chandler</b> started following you','1d'],
  ['b','Tingu, your 24th has arrived. Happy birthday 💗','today']
];

/* search jokes: [keywords], message, filter (board id | pin ids | null) */
const JOKES = [
  [['pasta','spaghetti','penne','macaroni'], 'Found: your one true love. (After Buddhu.)', {board:'food'}],
  [['dal','daal','chawal','rice'], 'Comfort food and comfort person, both available 24/7.', {board:'food'}],
  [['paratha','parantha','parotha','aloo'], 'Aloo paratha found. Butter levels: dangerous.', {board:'food'}],
  [['pastry','pastries','cake','dessert','sweet'], '1 result: a pastry you will not be sharing.', {board:'food'}],
  [['food','eat','hungry','khana','foodie','cafe','eatery','restaurant'], 'Hungry? Same. Here is everything delicious, including you.', {board:'food'}],
  [['prettiest','pretty','beautiful','cutest','cute','gorgeous','hottest','queen','princess'], '1 result. Obviously.', {ids:['p14']}],
  [['buddhu','bandar','boyfriend','monkey','omkar'], 'Found 1 Bandar, currently 10,037 km away, missing you.', {board:'ldr'}],
  [['love','us','we','together','relationship'], 'Everything that matters, in order.', {board:'story'}],
  [['monica','chandler','friends','joey','ross','rachel','phoebe'], 'Could this search BE any more on brand?', {board:'friends'}],
  [['himachal','mountain','snow','manali','hills','paragliding','trip'], 'Himachal called. It misses you too.', {board:'himachal'}],
  [['poem','poet','poetry','shayari','kavita'], 'One poem, from one Buddhu, for one poet.', {board:'poet'}],
  [['salsa','dance','dancing'], '5, 6, 7, 8… Buddhu is still counting.', {board:'salsa'}],
  [['birthday','bday','24','tingu','cutu','mitali','pagal'], 'Searching for the birthday girl… found her everywhere.', {board:'birthday'}],
  [['song','music','frankie','valli'], 'Our song, coming right up.', {ids:['tsong']}],
  [['distance','ldr','sydney','pune','call'], '10,037 km, one heart. Here you go.', {board:'ldr'}],
  [['pink'], 'Your colour, your board.', {board:'pink'}]
];

return { DIM, BOARDS, BNAME, POEM, PINS, byId, REASONS, NOTIFS, JOKES };
})();
