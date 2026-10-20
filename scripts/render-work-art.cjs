#!/usr/bin/env node
/* Original portfolio concept artwork. Regenerate with node scripts/render-work-art.cjs. */
const {createCanvas,GlobalFonts}=require('@napi-rs/canvas');
const fs=require('node:fs');const path=require('node:path');
const root=path.resolve(__dirname,'..'),dir=path.join(root,'public/work');
for(const weight of[400,500,600,700])GlobalFonts.registerFromPath(path.join(root,`node_modules/@fontsource/plus-jakarta-sans/files/plus-jakarta-sans-latin-${weight}-normal.woff2`),'Jakarta');
for(const weight of[400,500])GlobalFonts.registerFromPath(path.join(root,`node_modules/@fontsource/space-grotesk/files/space-grotesk-latin-${weight}-normal.woff2`),'Grotesk');
const c=createCanvas(1600,1000),g=c.getContext('2d');
function box(x,y,w,h,fill,r=10,stroke){g.beginPath();g.roundRect(x,y,w,h,r);if(fill){g.fillStyle=fill;g.fill();}if(stroke){g.strokeStyle=stroke;g.lineWidth=1;g.stroke();}}
function txt(t,x,y,s=20,color='#22342b',weight=400,align='left',numeric=false){g.font=`${weight} ${s}px ${numeric?'Grotesk':'Jakarta'}`;g.textAlign=align;g.textBaseline='alphabetic';g.fillStyle=color;g.fillText(t,x,y);}
function line(x,y,a,b,color='#d6dace'){g.beginPath();g.moveTo(x,y);g.lineTo(a,b);g.strokeStyle=color;g.lineWidth=1;g.stroke();}
function circle(x,y,r,color){g.beginPath();g.arc(x,y,r,0,Math.PI*2);g.fillStyle=color;g.fill();}
function arrow(x,y,color='#366955'){g.strokeStyle=color;g.lineWidth=2;g.beginPath();g.moveTo(x,y+14);g.lineTo(x+14,y);g.lineTo(x,y);g.moveTo(x+14,y);g.lineTo(x+14,y+14);g.stroke();}
function gradient(x,y,x2,y2,a,b){const d=g.createLinearGradient(x,y,x2,y2);d.addColorStop(0,a);d.addColorStop(1,b);return d;}
function start(color){g.clearRect(0,0,1600,1000);g.fillStyle=color;g.fillRect(0,0,1600,1000);}
function save(name){fs.writeFileSync(path.join(dir,name),c.toBuffer('image/webp',92));console.log('Created',name);}
function badge(label,x,y,w,fill,color){box(x,y,w,32,fill,16);txt(label,x+w/2,y+21,11,color,500,'center');}
function fieldStudio(){
 start('#F3EEE5');
 txt('FIELD / STUDIO',66,81,26,'#283F34',600);txt('Spaces',1088,77,16,'#526457');txt('The studio',1203,77,16,'#526457');txt('Enquire',1399,77,16,'#283F34');arrow(1490,61,'#283F34');line(66,115,1534,115,'#D7D4C9');
 txt('ARCHITECTURE & INTERIORS',68,229,13,'#6E7C68',500);txt('Space for',60,364,102,'#2B4334',500);txt('better living.',60,488,102,'#2B4334',500);
 txt('Considered spaces. A slower kind of living.',68,565,21,'#74816E');txt('Designed around what matters to you.',68,601,21,'#74816E');
 box(68,658,267,59,'#2B4334',30);txt('Discover the studio',96,695,16,'#F8F5EB',500);arrow(294,679,'#F8F5EB');
 // An original architectural illustration: warm stone, a garden arch, and sunlight.
 g.save();g.beginPath();g.roundRect(830,170,704,690,4);g.clip();g.fillStyle=gradient(830,170,1534,730,'#DDD2C0','#BBBBA5');g.fillRect(830,170,704,690);
 g.fillStyle=gradient(830,170,1000,750,'#EEE4D0','#CCBFA8');g.fillRect(830,170,150,690);
 g.beginPath();g.moveTo(980,170);g.lineTo(1534,170);g.lineTo(1534,577);g.lineTo(1145,360);g.closePath();g.fillStyle='#F5E8CE7D';g.fill();
 g.shadowColor='#4A4B3540';g.shadowBlur=28;g.shadowOffsetX=9;
 g.beginPath();g.moveTo(1020,742);g.lineTo(1020,382);g.bezierCurveTo(1020,171,1350,171,1350,382);g.lineTo(1350,742);g.closePath();g.fillStyle='#C7BBA1';g.fill();g.shadowColor='transparent';
 g.beginPath();g.moveTo(1053,742);g.lineTo(1053,383);g.bezierCurveTo(1053,202,1317,202,1317,383);g.lineTo(1317,742);g.closePath();g.fillStyle=gradient(1053,270,1317,742,'#264D3D','#8AA17B');g.fill();
 g.save();g.beginPath();g.moveTo(1053,742);g.lineTo(1053,383);g.bezierCurveTo(1053,202,1317,202,1317,383);g.lineTo(1317,742);g.closePath();g.clip();
 g.fillStyle='#B9C6A5';g.fillRect(1053,592,264,150);g.fillStyle='#7C9A77';g.beginPath();g.ellipse(1190,645,220,50,0,0,Math.PI*2);g.fill();
 for(let i=0;i<27;i++){const x=1070+(i*97)%255,y=340+(i*47)%290;circle(x,y,25+(i%4)*7,['#456B4A','#587A51','#668458'][i%3]);}g.restore();
 g.fillStyle=gradient(830,738,1200,860,'#BDB39E','#D1C2AC');g.fillRect(830,738,704,122);
 for(let i=0;i<3;i++){const x=971-i*38,y=719+i*38,w=425+i*76;box(x,y,w,32,gradient(x,y,x,y+32,'#E4D6BF','#C6B89F'),0);line(x,y,x+w,y,'#F5E8D0');}
 g.shadowColor='#49523F45';g.shadowBlur=18;g.shadowOffsetY=8;box(1398,657,79,100,gradient(1398,660,1477,750,'#8F8D70','#B0A588'),8);g.shadowColor='transparent';
 g.strokeStyle='#6E7558';g.lineWidth=7;g.beginPath();g.moveTo(1437,668);g.lineTo(1433,494);g.moveTo(1436,573);g.lineTo(1406,540);g.moveTo(1435,549);g.lineTo(1466,510);g.stroke();
 for(let i=0;i<23;i++){g.save();const a=i*2.4;g.translate(1437+Math.sin(a)*43,510+Math.cos(a*.7)*56);g.rotate(a);g.beginPath();g.ellipse(0,0,22,8,0,0,Math.PI*2);g.fillStyle=i%2?'#677A53':'#89936C';g.fill();g.restore();}
 // Fine, fixed texture adds a material finish without a photographic dependency.
 let seed=107;for(let i=0;i<11000;i++){seed=(seed*16807)%2147483647;const x=830+(seed%704);seed=(seed*16807)%2147483647;const y=170+(seed%690);g.fillStyle=i%2?'#FFFFFF0A':'#4A452B08';g.fillRect(x,y,1,1);}g.restore();
 txt('01 / SPACES TO LIVE IN',68,831,11,'#7B8572',500);line(68,854,734,854,'#CECFC1');txt('A home, thoughtfully considered.',68,893,18,'#55634E');txt('View the collection',1534,900,13,'#55634E',400,'right');
 line(66,933,1534,933,'#D7D4C9');txt('FIELD STUDIO',68,971,11,'#7F8876',500);txt('DESIGN CONCEPT · FICTIONAL STUDIO',1534,971,11,'#7F8876',500,'right');
 save('field-studio-preview.webp');
}
function daylight(){
 start('#F8F7FB');box(0,0,222,1000,'#30283F',0);txt('daylight.',31,76,31,'#F6F0FE',600);txt('A LITTLE ROOM TO BREATHE',33,111,8,'#B3A3C8',500);
 [['Overview',191],['Calendar',253],['Appointments',315],['Customers',377]].forEach(([s,y],i)=>{if(i===1)box(18,y-31,186,49,'#514262',8);circle(43,y-7,4,i===1?'#D9C6FB':'#A495B6');txt(s,62,y,14,i===1?'#FCFAFF':'#BFB1CC',i===1?600:400);});
 box(23,839,176,92,'#3C324D',10);txt('Your week, organised.',38,872,12,'#D6C9E5',500);txt('Time for the good work.',38,899,11,'#AFA0BE');
 txt('Calendar  /  Weekly view',263,56,13,'#8C8099');badge('Design concept',1400,31,156,'#EBE5F3','#807089');line(222,84,1600,84,'#E8E1ED');
 txt('A little room in your day.',261,153,36,'#342B44',600);txt('The people, appointments and space between.',264,192,16,'#928699');box(1342,124,214,52,'#8970B7',8);txt('+  New appointment',1363,157,15,'#FFFFFF',600);
 const stats=[['Today’s appointments','08','Two spaces still open'],['Next appointment','11:00','Avery Stone · Consultation'],['Your week','24','A manageable kind of busy']];
 stats.forEach((s,i)=>{const x=263+i*437;box(x,226,418,120,i===1?'#EBE3F5':'#FFFFFF',11,'#E8E0ED');txt(s[0],x+21,256,13,'#8D8098',500);txt(s[1],x+21,302,35,'#493956',500,'left',true);txt(s[2],x+154,302,12,'#92859C');});
 box(263,374,1015,543,'#FFFFFF',11,'#E8E1EC');txt('Your week',286,411,19,'#483955',600);txt('19–23 October',1249,409,13,'#9A8AA4',400,'right');line(264,433,1277,433,'#E9E4EE');
 ['MON 19','TUE 20','WED 21','THU 22','FRI 23'].forEach((s,i)=>{const x=365+i*181;txt(s,x+84,468,11,i===1?'#7C5CA5':'#9E8EA8',500,'center');line(x,489,x,915,'#F0ECF4');});
 [9,10,11,12,13,14,15].forEach((n,i)=>{const y=511+i*57;txt(`${String(n).padStart(2,'0')}:00`,285,y,11,'#B1A4B9',400,'left',true);line(350,y-4,1277,y-4,'#F2EEF5');});
 const appointments=[{x:375,y:511,w:162,h:87,bg:'#E6DCF5',name:'Consultation',time:'09:00 – 10:00'},{x:556,y:567,w:162,h:88,bg:'#EEE5D2',name:'Site visit',time:'10:00 – 11:00'},{x:737,y:510,w:162,h:116,bg:'#DCEDE5',name:'Studio session',time:'09:00 – 10:30'},{x:918,y:682,w:162,h:86,bg:'#E6DCF5',name:'Project review',time:'12:00 – 13:00'},{x:1099,y:567,w:162,h:116,bg:'#F1DFDB',name:'Discovery call',time:'10:00 – 11:30'},{x:375,y:739,w:162,h:100,bg:'#E9EAD9',name:'A little focus time',time:'13:00 – 14:30'},{x:556,y:739,w:162,h:141,bg:'#E6DCF5',name:'Consultation',time:'13:00 – 15:00'}];
 appointments.forEach(a=>{box(a.x,a.y,a.w,a.h,a.bg,7);txt(a.name,a.x+11,a.y+25,11,'#6A597B',600);txt(a.time,a.x+11,a.y+47,10,'#9B8AA8',400,'left',true);});
 box(1300,374,273,543,'#FFFFFF',11,'#E8E1EC');txt('Up next',1323,410,18,'#483955',600);txt('TUESDAY, 20 OCTOBER',1323,447,9,'#A694B1',500);circle(1334,491,11,'#D7C4EE');txt('11:00',1356,489,13,'#745B8B',500,'left',true);txt('Avery Stone',1323,534,20,'#594467',500);txt('Consultation',1323,561,13,'#A18BAF');line(1323,586,1552,586,'#EEE7F4');txt('45 minutes',1323,615,13,'#A18BAF');txt('Studio one',1323,646,13,'#A18BAF');box(1323,686,227,43,'#F0EAF7',6);txt('View appointment',1343,713,12,'#8A6CA3',500);txt('A little breathing room.',1323,853,12,'#A18BAF');
 txt('DAYLIGHT / BOOKING WORKSPACE',263,969,10,'#B0A1BB',500);txt('DESIGN CONCEPT · SAMPLE DATA',1556,969,10,'#B0A1BB',500,'right');save('daylight-preview.webp');
}
function relay(){
 start('#111A1C');box(0,0,224,1000,'#101719',0);line(224,0,224,1000,'#293437');txt('relay',34,79,38,'#E8F1E9',600);circle(132,71,5,'#75BCA9');txt('MAKE THE NEXT STEP CLEAR',34,112,8,'#65827B',500);
 [['Workspace',193],['Projects',255],['Activity',317],['Team',379]].forEach(([s,y],i)=>{if(i===1)box(18,y-31,188,49,'#203C35',8);box(36,y-16,12,12,null,3,i===1?'#89CDB7':'#506C64');txt(s,65,y,15,i===1?'#C1E4D4':'#6B8C83',500);});
 txt('WORKSPACES',35,477,9,'#4D6C62',500);circle(43,513,4,'#8BBC9F');txt('Studio projects',62,518,13,'#7C9D90');circle(43,560,4,'#A994C5');txt('Internal',62,565,13,'#7C9D90');
 txt('Workspace  /  Projects',264,56,13,'#709084');badge('Design concept',1404,31,152,'#223932','#85AB97');line(224,84,1600,84,'#273732');
 txt('Good work. Moving forward.',262,151,36,'#E1EDE3',600);txt('A clear view of what needs doing, and who’s on it.',264,192,16,'#6F9685');box(1370,126,185,47,'#7CBFA5',7);txt('+  Add task',1397,156,15,'#133428',600);
 [['In progress','06','One step at a time'],['Ready to review','03','A fresh pair of eyes'],['Completed','12','Good work, out the door']].forEach((s,i)=>{const x=263+i*436;box(x,226,418,121,i===0?'#203A30':'#19282A',10,'#2B4037');txt(s[0],x+23,256,13,'#7DA38D');txt(s[1],x+23,307,39,'#D7ECD9',500,'left',true);txt(s[2],x+123,305,12,'#658A76');});
 const cols=[{name:'To do',count:'04',items:[['Website content','Field Studio','A clear first impression.','#7B9C8A','Website','This week'],['Appointment flow','Daylight','Make finding a time easier.','#A599BA','Product','This week']]},{name:'In progress',count:'06',items:[['Quote workspace','Flow Plumbing','From request to next step.','#77BCA6','Build','Today'],['Customer onboarding','Studio','A smoother way to get started.','#B8A47E','Workflow','Tomorrow']]},{name:'Ready to review',count:'03',items:[['Project handover','Studio','Everything, in the right place.','#77BCA6','Delivery','Today'],['Weekly reminders','Daylight','A little less remembering.','#A599BA','Automation','Tomorrow']]}];
 cols.forEach((col,i)=>{const x=263+i*436;txt(col.name,x,403,18,'#ACC9B6',500);badge(col.count,x+355,379,45,'#263D32','#719A80');line(x,432,x+418,432,'#304139');col.items.forEach((a,k)=>{const y=455+k*203;box(x,y,418,180,'#1B2D2A',10,'#30463B');circle(x+23,y+27,4,a[3]);txt(a[1].toUpperCase(),x+38,y+31,9,'#739A83',500);txt(a[0],x+22,y+76,21,'#C5DDC9',600);txt(a[2],x+22,y+108,13,'#6B927B');badge(a[4],x+20,y+130,110,'#273E33','#8EB097');txt(a[5],x+394,y+153,12,'#70937C',400,'right');});});
 line(264,930,1554,930,'#253A2D');txt('RELAY / OPERATIONS WORKSPACE',264,970,10,'#537F67',500);txt('DESIGN CONCEPT · SAMPLE DATA',1554,970,10,'#537F67',500,'right');save('relay-preview.webp');
}
function flow(){
 const {render,canvas:film}=require('./render-flow-demo.cjs');render(19.8);start('#102019');
 txt('Flow Plumbing',40,51,22,'#DAEBDD',600);badge('Product demo',1391,25,169,'#203D2F','#94C6A7');
 g.save();g.shadowColor='#00000040';g.shadowBlur=30;g.shadowOffsetY=15;box(32,89,1536,802,'#DCE4DB',15);g.restore();g.save();g.beginPath();g.roundRect(32,89,1536,802,15);g.clip();g.drawImage(film,305,104,1310,683,32,89,1536,802);g.restore();
 txt('Quotes, approvals and the next step.',40,955,21,'#ACC4AF',400);txt('DEMO · FICTIONAL BUSINESS',1560,955,11,'#62866E',500,'right');save('flow-plumbing-preview.webp');
}
fs.mkdirSync(dir,{recursive:true});fieldStudio();daylight();relay();flow();
