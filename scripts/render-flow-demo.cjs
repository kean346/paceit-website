#!/usr/bin/env node
/** Deterministic 20-second product film. No browser, external assets, or audio. */
const { createCanvas, GlobalFonts } = require('@napi-rs/canvas');
const { spawn } = require('node:child_process');
const { once } = require('node:events');
const fs = require('node:fs');
const path = require('node:path');
const ROOT = path.resolve(__dirname, '..');
for (const weight of [400, 500, 600, 700]) {
  GlobalFonts.registerFromPath(path.join(ROOT, `node_modules/@fontsource/plus-jakarta-sans/files/plus-jakarta-sans-latin-${weight}-normal.woff2`), 'Jakarta');
}
for (const weight of [400, 500, 600]) {
  GlobalFonts.registerFromPath(path.join(ROOT, `node_modules/@fontsource/space-grotesk/files/space-grotesk-latin-${weight}-normal.woff2`), 'Grotesk');
}
const W = 1920, H = 1080, FPS = 60, SECONDS = 20;
const C = { carbon: '#0F0F11', white: '#FFFFFF', limestone: '#EAEAE8', green: '#43B19B', ink: '#172720', muted: '#738078', border: '#DFE5E0', pale: '#E9F5EF' };
const output = path.join(ROOT, 'public/work');
const canvas = createCanvas(W, H), ctx = canvas.getContext('2d');
const stage = createCanvas(1440, 760), g = stage.getContext('2d');
const clamp = x => Math.max(0, Math.min(1, x));
const smooth = x => { x = clamp(x); return x*x*x*(x*(x*6-15)+10); };
const ease = (t, a, b) => smooth((t-a)/(b-a));
const mix = (a,b,p) => a+(b-a)*p;
function lerpRect(a,b,p) { return Object.fromEntries(Object.keys(a).map(k=>[k,mix(a[k],b[k],p)])); }
function alpha(c, a, fn) { if(a<=0)return; c.save();c.globalAlpha*=clamp(a);fn();c.restore(); }
function rr(c,x,y,w,h,r=12,fill=C.white,stroke=null) {
  c.beginPath();c.roundRect(x,y,w,h,Math.max(0,Math.min(r,w/2,h/2)));
  if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.lineWidth=1;c.strokeStyle=stroke;c.stroke();}
}
function text(c,str,x,y,size=20,color=C.ink,weight=400,align='left',numeric=false) {
  c.font=`${weight} ${size}px ${numeric?'Grotesk':'Jakarta'}`;c.fillStyle=color;c.textAlign=align;c.textBaseline='alphabetic';c.fillText(str,x,y);
}
function line(c,x,y,x2,y2,color=C.border,width=1) {c.beginPath();c.moveTo(x,y);c.lineTo(x2,y2);c.strokeStyle=color;c.lineWidth=width;c.stroke();}
function icon(c,name,x,y,size=20,color=C.muted,progress=1) {
  c.save();c.translate(x,y);c.scale(size/24,size/24);c.strokeStyle=color;c.lineWidth=1.7;c.lineCap='round';c.lineJoin='round';c.beginPath();
  if(name==='check'){c.moveTo(5,12);c.lineTo(10,17);c.lineTo(20,6);if(progress<1){c.setLineDash([30*progress,60]);}}
  if(name==='arrow'){c.moveTo(5,12);c.lineTo(19,12);c.moveTo(13,6);c.lineTo(19,12);c.lineTo(13,18);}
  if(name==='chevron'){c.moveTo(7,9);c.lineTo(12,14);c.lineTo(17,9);}
  if(name==='plus'){c.moveTo(12,5);c.lineTo(12,19);c.moveTo(5,12);c.lineTo(19,12);}
  if(name==='grid'){for(const [dx,dy]of[[4,4],[14,4],[4,14],[14,14]])c.roundRect(dx,dy,6,6,1);}
  if(name==='doc'){c.moveTo(6,3);c.lineTo(15,3);c.lineTo(20,8);c.lineTo(20,21);c.lineTo(6,21);c.closePath();c.moveTo(15,3);c.lineTo(15,8);c.lineTo(20,8);c.moveTo(9,12);c.lineTo(16,12);c.moveTo(9,16);c.lineTo(16,16);}
  if(name==='bell'){c.moveTo(5,17);c.lineTo(7,14);c.lineTo(7,10);c.bezierCurveTo(7,3,17,3,17,10);c.lineTo(17,14);c.lineTo(19,17);c.closePath();c.moveTo(10,20);c.quadraticCurveTo(12,23,14,20);}
  if(name==='clock'){c.arc(12,12,9,0,Math.PI*2);c.moveTo(12,6);c.lineTo(12,12);c.lineTo(16,14);}
  if(name==='message'){c.roundRect(3,4,18,14,4);c.moveTo(7,18);c.lineTo(6,22);c.lineTo(12,18);c.moveTo(7,9);c.lineTo(17,9);c.moveTo(7,13);c.lineTo(14,13);}
  c.stroke();c.restore();
}
const clicks = [2.64,6.62,10.06,12.36,13.16,15.48,17.06];
function press(t,at){ const p=(t-at)/.24;return p>=0&&p<=1?Math.sin(p*Math.PI)*.035:0; }
function button(c,label,r,t,at,kind='primary',glyph='arrow') {
  const q=press(t,at);c.save();c.translate(r.x+r.w/2,r.y+r.h/2);c.scale(1-q,1-q);c.translate(-r.w/2,-r.h/2);
  rr(c,0,0,r.w,r.h,9,kind==='primary'?C.green:C.white,kind==='primary'?null:C.border);
  text(c,label,18,r.h/2+6,17,kind==='primary'?'#102C23':C.ink,600);
  icon(c,glyph,r.w-37,r.h/2-10,20,kind==='primary'?'#17372C':C.muted);c.restore();
}
const createButton={x:448,y:504,w:228,h:54};
const generateButton={x:970,y:626,w:232,h:50};
const sendButton={x:1014,y:665,w:188,h:48};
const reminderButton={x:1056,y:616,w:308,h:46};
const saveButton={x:1008,y:572,w:354,h:46};
const rowRect={x:264,y:434,w:728,h:78};
function dashboard(t) {
  g.clearRect(0,0,1440,760);
  g.save();g.beginPath();g.roundRect(0,0,1440,760,22);g.clip();
  g.fillStyle=C.limestone;g.fillRect(0,0,1440,760);
  g.fillStyle='#15251F';g.fillRect(0,0,220,760);
  text(g,'flow',31,77,48,C.white,700);text(g,'.',132,77,48,C.green,700);text(g,'P L U M B I N G',34,105,10,'#8FB0A1',500);
  line(g,28,140,192,140,'#2C3E35');
  [['grid','Overview',195],['doc','Quotes',258],['bell','Follow-ups',321]].forEach(([i,label,y],n)=>{
    if(n===0)rr(g,18,y-31,184,49,8,'#294D3D');icon(g,i,34,y-17,21,n===0?'#9FE0C2':'#86A394');text(g,label,69,y,16,n===0?'#E5F6ED':'#97AFA2',n===0?600:400);
  });
  rr(g,29,643,162,69,9,'#20372C');text(g,'A little less admin.',43,669,13,'#C1D9C9',500);text(g,'A lot more flow.',43,691,13,'#8FAB9B');
  text(g,'Built with paceIT.',33,735,11,'#86A394');
  g.fillStyle=C.white;g.fillRect(220,0,1220,58);line(g,220,58,1440,58,'#D9DFD9');
  text(g,'Workspace',264,36,13,C.muted);text(g,'/   Overview',356,36,13,'#A0AAA3');
  rr(g,1264,17,138,25,12,'#F1F4F0');text(g,'Demo workspace',1333,34,10,'#6A7B6E',500,'center');
  text(g,'FLOW PLUMBING  /  PRETORIA',264,101,11,C.muted,600);
  text(g,'A clear view of your work.',264,144,30,C.ink,600);
  const approved=ease(t,13.26,14.10), total=Math.round(mix(20400,24850,approved));
  const stats=[{x:264,w:350,label:'Quotes sent',value:'08',sub:'This month'},{x:632,w:384,label:'Approved value',value:`R ${total.toLocaleString('en-US')}`,sub:approved>.99?'Ready to move forward':'This month'},{x:1034,w:368,label:'To follow up',value:t>=17.3?'03':'02',sub:'Keep the conversation going'}];
  stats.forEach((s,i)=>{rr(g,s.x,174,s.w,133,12,i===1?'#E3F0E8':C.white,'#DAE2DA');text(g,s.label,s.x+23,203,14,C.muted,500);text(g,s.value,s.x+22,254,i===1?42:44,C.ink,500,'left',true);text(g,s.sub,s.x+23,284,11,C.muted);if(i===1)icon(g,'arrow',s.x+s.w-47,196,20,'#5B917A');});
  rr(g,264,332,728,367,12,C.white,'#DAE2DA');text(g,'Recent quotes',288,369,19,C.ink,600);text(g,'View all',968,368,12,C.muted,400,'right');
  g.fillStyle='#F5F6F2';g.fillRect(265,388,726,36);text(g,'CUSTOMER',288,412,10,C.muted,600);text(g,'QUOTE',574,412,10,C.muted,600);text(g,'AMOUNT',789,412,10,C.muted,600,'right');text(g,'STATUS',853,412,10,C.muted,600);
  const showAlex=ease(t,11.50,11.85);
  alpha(g,showAlex,()=>{rr(g,274,435,708,75,7,t>=13.18?'#EFF8F2':'#F6F9F4');if(t>=11.85)text(g,'Alex Morgan',288,464,18,C.ink,600);text(g,'Geyser installation',288,486,12,C.muted);text(g,'Q-008',574,466,15,C.muted,500,'left',true);if(t>=11.85)text(g,'R 4,450',789,466,20,C.ink,500,'right',true);
    const p=ease(t,13.16,13.45);rr(g,829,449,137,33,7,p>0?'#DAF0E3':'#EDEFEA');
    if(p>0){icon(g,'check',839,456,17,'#247A52',ease(t,13.20,13.52));text(g,'Approved',862,471,12,'#247A52',600);}else{text(g,'Sent',846,471,13,'#758274',500);icon(g,'chevron',938,456,17,C.muted);}
  });
  [['Jamie Taylor','Kitchen repairs','Q-007','R 2,850','Sent'],['Sam Jacobs','Bathroom fittings','Q-006','R 8,200','Approved']].forEach((r,i)=>{const y=546+i*78;line(g,284,y-32,974,y-32,'#E9EDE7');text(g,r[0],288,y,17,C.ink,500);text(g,r[1],288,y+22,12,C.muted);text(g,r[2],574,y+2,15,C.muted,400,'left',true);text(g,r[3],789,y+2,19,C.ink,500,'right',true);rr(g,829,y-16,137,32,7,i?'#E7F3EA':'#F1F2ED');text(g,r[4],897,y+5,12,i?'#43805C':'#7A8977',500,'center');});
  rr(g,1034,332,368,367,12,C.white,'#DAE2DA');icon(g,'bell',1056,350,20,'#54836A');text(g,'Follow-ups',1086,369,19,C.ink,600);
  alpha(g,1-ease(t,17.2,17.65),()=>{text(g,'Keep the next step clear.',1056,416,14,C.muted);rr(g,1056,440,308,134,8,'#F5F7F2');text(g,'Everything, in its place.',1076,475,16,C.ink,500);text(g,'Quotes, customers and the',1076,505,13,C.muted);text(g,'conversations that come next.',1076,528,13,C.muted);});
  alpha(g,ease(t,17.4,17.8),()=>{line(g,1056,575,1364,575);icon(g,'check',1058,594,16,'#7B9381');text(g,'Reminder scheduled',1083,608,12,C.muted);});
  alpha(g,1-ease(t,15.48,15.72),()=>button(g,'Set reminder',reminderButton,t,15.48,'secondary','plus'));
  text(g,'Fictional business. Real possibilities.',264,736,11,'#879384');
  text(g,'All changes saved',1400,736,11,'#879384',400,'right');
  g.restore();
  // Status menu is a real control in the film, tied to the cursor's two clicks.
  const menu=ease(t,12.36,12.56)*(1-ease(t,13.16,13.40));
  alpha(g,menu,()=>{g.save();g.shadowColor='#18271C24';g.shadowBlur=24;g.shadowOffsetY=10;rr(g,813,493,176,115,9,C.white,C.border);g.restore();text(g,'QUOTE STATUS',829,516,9,C.muted,600);text(g,'Sent',841,544,13,C.muted);rr(g,822,552,158,41,5,'#EBF6EE');icon(g,'check',834,564,17,'#2D7E57');text(g,'Approved',860,581,14,'#2D7E57',600);});
}
const request={x:400,y:172,w:850,h:414}, form={x:400,y:82,w:850,h:620}, document={x:400,y:20,w:850,h:720};
function quoteSequence(t) {
  if(t>11.86||t<.30)return;
  const reveal=ease(t,.30,.90), rf=ease(t,2.76,3.40), fd=ease(t,6.80,7.55), dr=ease(t,10.95,11.65);
  let r=lerpRect(request,form,rf);r=lerpRect(r,document,fd);r=lerpRect(r,rowRect,dr);r.y+=(1-reveal)*34;
  const fade=reveal*(1-ease(t,11.76,11.86));
  alpha(g,fade,()=>{
    g.save();g.shadowColor='#0F201B30';g.shadowBlur=42*(1-dr);g.shadowOffsetY=22*(1-dr);rr(g,r.x,r.y,r.w,r.h,mix(17,7,dr),C.white,'#DEE6DE');g.restore();
    g.save();g.beginPath();g.roundRect(r.x,r.y,r.w,r.h,mix(17,7,dr));g.clip();
    const rq=1-ease(t,2.65,3.08), fm=ease(t,3.02,3.45)*(1-ease(t,6.80,7.18)), doc=ease(t,7.10,7.60)*(1-ease(t,10.94,11.46));
    alpha(g,rq,()=>{text(g,'NEW CUSTOMER REQUEST',448,219,12,'#6D8977',600);icon(g,'message',1180,200,25,'#3B8F73');text(g,'“Hi, could you quote me for a',448,352,31,C.ink,500);text(g,'geyser installation in Pretoria?”',448,398,31,C.ink,500);button(g,'Create quote',createButton,t,2.64);text(g,'Just received',1202,536,12,C.muted,400,'right');});
    alpha(g,fm,()=>{text(g,'QUOTE Q-008',448,124,12,C.muted,600);text(g,'Create a quote',448,171,34,C.ink,600);rr(g,432,204,382,78,8,'#F6F8F4',C.border);rr(g,834,204,384,78,8,'#F6F8F4',C.border);text(g,'CUSTOMER',448,225,10,C.muted,600);text(g,'LOCATION',852,225,10,C.muted,600);alpha(g,ease(t,3.6,3.95),()=>text(g,'Pretoria',852,253+9*(1-ease(t,3.6,3.95)),23,C.ink,500));text(g,'DESCRIPTION',448,328,11,C.muted,600);text(g,'AMOUNT',1202,328,11,C.muted,600,'right');line(g,448,346,1202,346);button(g,'Generate quote',generateButton,t,6.62,'primary','doc');});
    alpha(g,doc,()=>{text(g,'Flow Plumbing',448,84,29,C.ink,700);text(g,'QUOTATION  /  PRETORIA',448,105,9,'#51846D',500);text(g,'Quotation',448,164,42,C.ink,600);text(g,'Quote Q-008',1202,161,21,C.muted,500,'right',true);line(g,448,185,1202,185);text(g,'PREPARED FOR',448,220,10,C.muted,600);text(g,'Pretoria',448,284,17,C.muted);text(g,'DESCRIPTION',448,338,10,C.muted,600);text(g,'AMOUNT',1202,338,10,C.muted,600,'right');line(g,448,354,1202,354);text(g,'Prepared with care. Ready for the next step.',448,690,12,C.muted);button(g,'Send quote',sendButton,t,10.06);});
    // One customer label persists through all four geometries.
    const nameY=mix(mix(mix(284,253,rf),255,fd),464,dr)+(1-reveal)*34;
    const nameX=mix(448,288,dr), nameSize=mix(24,18,dr);
    text(g,'Alex Morgan',nameX,nameY,nameSize,C.ink,600);
    const shared=(ease(t,4.15,4.5))*(1-ease(t,11.0,11.48));
    alpha(g,shared,()=>{
      const p1=ease(t,4.15,4.5), p2=ease(t,4.78,5.15);
      const y1=mix(385,398,fd),y2=mix(448,461,fd);
      alpha(g,p1,()=>{text(g,'Installation labour',448,y1+(1-p1)*12,22,C.ink,500);text(g,'R 3,200',1202,y1+(1-p1)*12,25,C.ink,500,'right',true);line(g,448,y1+23,1202,y1+23);});
      alpha(g,p2,()=>{text(g,'Fittings and materials',448,y2+(1-p2)*12,22,C.ink,500);text(g,'R 1,250',1202,y2+(1-p2)*12,25,C.ink,500,'right',true);line(g,448,y2+23,1202,y2+23);});
    });
    const total=ease(t,5.35,5.85);
    alpha(g,total,()=>{const yy=mix(554,604,fd);alpha(g,1-dr,()=>{rr(g,432,mix(503,550,fd),786,88,9,'#E7F3EB');text(g,'Total',448,yy-5,18,C.ink,500);text(g,'ZAR',448,yy+17,9,C.muted,500);});text(g,'R 4,450',mix(1202,789,dr),mix(yy,466,dr)+8*(1-total),mix(51,20,dr),C.ink,500,'right',true);});
    g.restore();
  });
  const sent=ease(t,10.12,10.35)*(1-ease(t,10.86,11.14));
  alpha(g,sent,()=>{rr(g,738,620,228,52,26,'#173D2C');icon(g,'check',760,635,20,'#A9E9C4');text(g,'Quote sent',793,653,18,C.white,500);});
}
function reminder(t) {
  if(t<15.48)return;
  const open=ease(t,15.48,16.02), fold=ease(t,17.16,17.84);
  const expanded={x:980,y:306,w:410,h:326}, final={x:1056,y:434,w:308,h:123};
  let r=lerpRect(reminderButton,expanded,open);r=lerpRect(r,final,fold);
  alpha(g,ease(t,15.48,15.7),()=>{g.save();g.shadowColor=`rgba(10,35,20,${.19*(1-fold)})`;g.shadowBlur=28;g.shadowOffsetY=12;rr(g,r.x,r.y,r.w,r.h,11,fold>.8?'#EEF8F1':C.white,fold>.8?'#B8DCC7':C.border);g.restore();
    alpha(g,ease(t,15.86,16.1)*(1-fold),()=>{icon(g,'bell',1008,333,21,'#398367');text(g,'Schedule reminder',1041,352,20,C.ink,600);line(g,1008,374,1362,374);rr(g,1008,460,354,66,7,'#F3F6F0',C.border);text(g,'Pretoria · Quote Q-008',1008,551,12,C.muted);button(g,'Save reminder',saveButton,t,17.06,'primary','check');});
    alpha(g,ease(t,15.90,16.16),()=>{text(g,'Arrange Alex’s installation',mix(1008,1076,fold),mix(422,468,fold),mix(21,16.5,fold),C.ink,600);icon(g,'clock',mix(1024,1076,fold),mix(481,487,fold),mix(22,16,fold),'#4B8E70');text(g,'Tomorrow, 09:00',mix(1062,1100,fold),mix(503,502,fold),mix(24,15,fold),'#2C7856',500,'left',true);});
    const pulse=ease(t,17.60,17.78)*(1-ease(t,17.90,18.22));alpha(g,pulse*.5,()=>{g.lineWidth=2;rr(g,1052,430,316,131,13,null,C.green);});
    alpha(g,ease(t,17.7,18.0),()=>{text(g,'REMINDER SAVED',1076,538,9,'#629279',600);icon(g,'check',1329,520,18,'#438967');});
  });
}
const cameraKeys=[
 [0,{s:.93,cx:720,cy:380,y:535,r:-.018,kx:.020,ky:.008}],
 [2.65,{s:1.055,cx:790,cy:370,y:535,r:-.008,kx:.012,ky:.003}],
 [3.5,{s:1.065,cx:810,cy:378,y:535,r:-.006,kx:.009,ky:.002}],
 [6.45,{s:1.09,cx:830,cy:405,y:535,r:-.004,kx:.004,ky:.001}],
 [7.8,{s:1.01,cx:820,cy:380,y:535,r:0,kx:0,ky:0}],
 [10.7,{s:1.045,cx:820,cy:380,y:535,r:0,kx:0,ky:0}],
 [12.1,{s:1.09,cx:800,cy:380,y:535,r:-.003,kx:.005,ky:0}],
 [14.3,{s:1.12,cx:840,cy:380,y:535,r:0,kx:0,ky:0}],
 [15.9,{s:1.14,cx:980,cy:390,y:535,r:.004,kx:-.006,ky:0}],
 [17.4,{s:1.14,cx:980,cy:390,y:535,r:.004,kx:-.006,ky:0}],
 [18.85,{s:.91,cx:720,cy:380,y:445,r:0,kx:0,ky:0}],
 [20,{s:.91,cx:720,cy:380,y:445,r:0,kx:0,ky:0}]
];
function camera(t){for(let i=1;i<cameraKeys.length;i++){if(t<=cameraKeys[i][0])return lerpRect(cameraKeys[i-1][1],cameraKeys[i][1],ease(t,cameraKeys[i-1][0],cameraKeys[i][0]));}return cameraKeys.at(-1)[1];}
// All coordinates are control hit points in the same interface coordinate space.
// Holds before and after each click keep actions intentional and unambiguous.
const cursorKeys=[[0,1194,665],[.9,1120,620],[2.17,611,531],[2.92,611,531],[3.92,978,250],[4.8,978,250],[5.60,1115,551],[6.15,1085,650],[6.90,1085,650],[7.8,1100,690],[9.65,1100,690],[10.40,1100,690],[12.0,897,466],[12.55,897,466],[12.91,902,575],[13.44,902,575],[14.25,966,427],[15.15,1190,639],[15.75,1190,639],[16.73,1185,595],[17.34,1185,595],[18.25,1335,686],[20,1335,686]];
function cursor(t) {
  let p={x:cursorKeys[0][1],y:cursorKeys[0][2]};
  for(let i=1;i<cursorKeys.length;i++){if(t<=cursorKeys[i][0]){const a=cursorKeys[i-1],b=cursorKeys[i],u=ease(t,a[0],b[0]);p={x:mix(a[1],b[1],u),y:mix(a[2],b[2],u)};break;}}
  const opacity=ease(t,.65,1.15)*(1-ease(t,18.0,18.55));
  alpha(g,opacity,()=>{
    for(const at of clicks){const q=(t-at)/.42;if(q>=0&&q<1){g.beginPath();g.arc(p.x,p.y,8+q*22,0,2*Math.PI);g.strokeStyle=`rgba(67,177,155,${(1-q)*.58})`;g.lineWidth=2.5;g.stroke();}}
    g.save();g.translate(p.x,p.y);const clickScale=1-clicks.reduce((m,at)=>Math.max(m,press(t,at)),0)*2;g.scale(clickScale,clickScale);g.shadowColor='#0000004D';g.shadowBlur=5;g.shadowOffsetY=3;
    g.beginPath();g.moveTo(0,0);g.lineTo(1,27);g.lineTo(8,20);g.lineTo(14,33);g.lineTo(20,30);g.lineTo(14,18);g.lineTo(25,17);g.closePath();g.fillStyle='#14221B';g.fill();g.lineWidth=1.9;g.strokeStyle='#FFFFFF';g.stroke();g.restore();
  });
}
const chapters=[['01','A request. A clear beginning.'],['02','Every detail, in place.'],['03','A quote worth sending.'],['04','One view. A clear next step.'],['05','Keep the work moving.']];
function render(t) {
  ctx.fillStyle=C.carbon;ctx.fillRect(0,0,W,H);
  const halo=ctx.createRadialGradient(1050,440,120,970,500,1050);halo.addColorStop(0,'#23342C');halo.addColorStop(.55,'#151B18');halo.addColorStop(1,C.carbon);ctx.fillStyle=halo;ctx.fillRect(0,0,W,H);
  // Quiet studio-floor line and ambient horizon, rather than decorative effects.
  line(ctx,112,1000,1808,1000,'#2A302C');
  text(ctx,'pace',112,78,24,'#DFE9E0',600);text(ctx,'IT.',168,78,24,C.green,600);line(ctx,226,58,226,81,'#404C42');text(ctx,'PRODUCT STORIES',249,75,11,'#94A397',500);
  text(ctx,'Demo · Fictional business',1808,75,14,'#9AAA9E',400,'right');
  dashboard(t);
  const shade=ease(t,.30,.90)*(1-ease(t,10.95,11.85))*.26;
  g.save();g.beginPath();g.roundRect(0,0,1440,760,22);g.clip();g.fillStyle=`rgba(15,17,16,${shade})`;g.fillRect(0,0,1440,760);g.restore();
  quoteSequence(t);reminder(t);cursor(t);
  const cam=camera(t);
  ctx.save();ctx.translate(960,cam.y);ctx.rotate(cam.r);ctx.transform(cam.s,cam.ky,cam.kx,cam.s*.985,0,0);ctx.translate(-cam.cx,-cam.cy);
  ctx.save();ctx.shadowColor='#00000085';ctx.shadowBlur=58;ctx.shadowOffsetY=37;rr(ctx,0,0,1440,760,22,'#16201B');ctx.restore();ctx.drawImage(stage,0,0);ctx.restore();
  const end=ease(t,18.28,18.90);
  alpha(ctx,end,()=>{text(ctx,'Less chasing. More getting it done.',960,906+13*(1-end),45,C.white,500,'center');text(ctx,'pace',931,966,23,'#BFCBC1',600,'right');text(ctx,'IT.',932,966,23,C.green,600);});
  alpha(ctx,1-ease(t,18.0,18.5),()=>{const n=t<3?0:t<7?1:t<11?2:t<15?3:4;const start=[0,3,7,11,15][n],v=ease(t,start,start+.45);alpha(ctx,v,()=>{text(ctx,chapters[n][0],112,1037,12,C.green,500,'left',true);text(ctx,chapters[n][1],151,1037,15,'#A3B1A5',400);});text(ctx,'FLOW PLUMBING',1808,1037,11,'#6C8071',500,'right');});
}
async function main() {
  fs.mkdirSync(output,{recursive:true});
  const args=process.argv.slice(2);
  if(args.includes('--stills')){
    const folder=path.join(ROOT,'.next/film-stills');fs.mkdirSync(folder,{recursive:true});
    for(const t of [0,1.7,2.64,3.6,6.1,7.8,9.3,10.4,11.4,12.8,13.8,16.5,17.7,19.8]){render(t);fs.writeFileSync(path.join(folder,`${String(t).replace('.','_')}.jpg`),canvas.toBuffer('image/jpeg',90));}
    console.log(`Stills rendered to ${folder}`);return;
  }
  const dest=path.join(output,'flow-plumbing-demo.mp4');
  const temp=dest.replace('.mp4','.rendering.mp4');
  const encoder=spawn('ffmpeg',['-hide_banner','-loglevel','warning','-y','-f','rawvideo','-pixel_format','rgba','-video_size',`${W}x${H}`,'-framerate',String(FPS),'-i','pipe:0','-an','-c:v','libx264','-preset','medium','-crf','18','-pix_fmt','yuv420p','-movflags','+faststart','-color_primaries','bt709','-color_trc','bt709','-colorspace','bt709','-threads','4',temp],{stdio:['pipe','inherit','inherit']});
  let encoderError;encoder.on('error',e=>encoderError=e);encoder.stdin.on('error',e=>encoderError=e);
  const done=new Promise((resolve,reject)=>encoder.on('close',code=>code===0?resolve():reject(new Error(`FFmpeg exited ${code}`))));
  for(let frame=0;frame<SECONDS*FPS;frame++){
    if(encoderError)throw encoderError;
    render(frame/FPS);
    if(!encoder.stdin.write(canvas.data()))await once(encoder.stdin,'drain');
    if(frame%120===0)console.log(`Rendered ${(frame/FPS).toFixed(0)} / ${SECONDS}s (${frame}/${SECONDS*FPS} frames)`);
  }
  encoder.stdin.end();await done;fs.renameSync(temp,dest);
  render(19.8);fs.writeFileSync(path.join(output,'flow-plumbing-poster.jpg'),canvas.toBuffer('image/jpeg',92));
  console.log(`Created ${dest}: ${W}×${H}, ${FPS}fps, ${SECONDS}s, silent.`);
}
if(require.main===module)main().catch(error=>{console.error(error);process.exitCode=1;});
module.exports={render,canvas,clicks,createButton,generateButton,sendButton,reminderButton,saveButton,cursorKeys};
