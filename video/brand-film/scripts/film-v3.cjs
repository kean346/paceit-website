/* SIGNAL / paceIT. Deterministic 3D projection, original geometry and authentic UI. */
const {createCanvas,loadImage,GlobalFonts}=require('@napi-rs/canvas');
const fs=require('fs'),path=require('path'),{spawn}=require('child_process'),{once}=require('events');
process.chdir(path.resolve(__dirname,'..'));
GlobalFonts.registerFromPath('assets/fonts/plus-jakarta-sans-latin-400-normal.woff2','Jakarta');
GlobalFonts.registerFromPath('assets/fonts/space-grotesk-latin-700-normal.woff2','Space');
const vertical=process.argv.includes('--vertical'),W=vertical?1080:1920,H=vertical?1920:1080,FPS=60;
const cvas=createCanvas(W,H),c=cvas.getContext('2d');
const E='#43b19b',WHITE='#f3f4f0',BLACK='#090b0d';
const sat=x=>Math.max(0,Math.min(1,x)),sm=x=>{x=sat(x);return x*x*x*(x*(x*6-15)+10)},out=x=>1-Math.pow(1-sat(x),4),mix=(a,b,t)=>a+(b-a)*t;
function rgba(r,g,b,a){return `rgba(${r},${g},${b},${a})`;}
function rr(x,y,w,h,r,color){c.beginPath();c.roundRect(x,y,w,h,r);c.fillStyle=color;c.fill();}
function type(s,x,y,size=80,color=WHITE,align='left',font='Space'){c.font=`${size}px ${font}`;if(vertical&&(s==='A better'||s==='way.'))y-=125;if(s==='pace'||s==='IT.'){let pw=c.measureText('pace').width,iw=c.measureText('IT.').width;x=W/2-(pw+iw)/2+pw;}if(s==='Built around'){let g=c.createLinearGradient(0,0,0,H*.4);g.addColorStop(0,'#090b0d');g.addColorStop(.7,'#090b0ddd');g.addColorStop(1,'#090b0d00');c.fillStyle=g;c.fillRect(0,0,W,H*.4);}c.fillStyle=color;c.textAlign=align;c.textBaseline='alphabetic';c.fillText(s,x,y);}
function alpha(a,fn){c.save();c.globalAlpha*=sat(a);fn();c.restore();}
function reveal(s,x,y,size,p,color=WHITE,align='left'){c.save();c.beginPath();c.rect(0,y-size*1.05,W,size*1.25);c.clip();type(s,x,y+size*1.2*(1-out(p)),size,color,align);c.restore();}
function wash(x,y,rx,ry,col){c.save();c.translate(x,y);c.scale(rx,ry);let g=c.createRadialGradient(0,0,0,0,0,1);g.addColorStop(0,col);g.addColorStop(1,'transparent');c.fillStyle=g;c.fillRect(-1,-1,2,2);c.restore();}
function bg(light=false){c.fillStyle=light?'#efefeb':BLACK;c.fillRect(0,0,W,H);if(light){wash(W*.5,H*.2,W*.8,H*.9,'#ffffff');}else{wash(W*.68,H*.45,W*.55,H*.55,'#172326');}}
function stroke(points,color,width=2,p=1){c.beginPath();let n=Math.max(2,Math.floor(points.length*sat(p)));points.slice(0,n).forEach((q,i)=>i?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1]));c.strokeStyle=color;c.lineWidth=width;c.lineCap='round';c.lineJoin='round';c.stroke();}
function transform(p,rx=0,ry=0,rz=0){let [x,y,z]=p;let y1=y*Math.cos(rx)-z*Math.sin(rx),z1=y*Math.sin(rx)+z*Math.cos(rx);let x2=x*Math.cos(ry)+z1*Math.sin(ry),z2=-x*Math.sin(ry)+z1*Math.cos(ry);return [x2*Math.cos(rz)-y1*Math.sin(rz),x2*Math.sin(rz)+y1*Math.cos(rz),z2];}
function project(p,x,y,z=0,f=1900){let k=f/(f+p[2]+z);return [x+p[0]*k,y+p[1]*k];}
// Affine-textured triangles form a subdivided perspective plane.
function triangle(img,src,dst){let [a,b,d]=src,[A,B,D]=dst;let den=(b[0]-a[0])*(d[1]-a[1])-(d[0]-a[0])*(b[1]-a[1]);let m1=((B[0]-A[0])*(d[1]-a[1])-(D[0]-A[0])*(b[1]-a[1]))/den,m2=((B[1]-A[1])*(d[1]-a[1])-(D[1]-A[1])*(b[1]-a[1]))/den,m3=((D[0]-A[0])*(b[0]-a[0])-(B[0]-A[0])*(d[0]-a[0]))/den,m4=((D[1]-A[1])*(b[0]-a[0])-(B[1]-A[1])*(d[0]-a[0]))/den;
c.save();let cx=(A[0]+B[0]+D[0])/3,cy=(A[1]+B[1]+D[1])/3;let expand=p=>[cx+(p[0]-cx)*1.055,cy+(p[1]-cy)*1.055];c.beginPath();c.moveTo(...expand(A));c.lineTo(...expand(B));c.lineTo(...expand(D));c.closePath();c.clip();c.setTransform(m1,m2,m3,m4,A[0]-m1*a[0]-m3*a[1],A[1]-m2*a[0]-m4*a[1]);c.drawImage(img,0,0);c.restore();}
function surface(img,{x=W/2,y=H/2,w=1500,rx=0,ry=0,rz=0,z=0,opacity=1,shadow=true}={}){let h=w*img.height/img.width;let P=(u,v)=>project(transform([(u-.5)*w,(v-.5)*h,0],rx,ry,rz),x,y,z);c.save();c.globalAlpha*=opacity;
let corners=[P(0,0),P(1,0),P(1,1),P(0,1)];if(shadow){c.beginPath();corners.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));c.closePath();c.shadowBlur=55;c.shadowColor='#00000066';c.shadowOffsetY=32;c.fillStyle='#161b1b';c.fill();c.shadowBlur=0;c.shadowOffsetY=0;}
const nx=6,ny=4;for(let j=0;j<ny;j++)for(let i=0;i<nx;i++){let a=[i/nx,j/ny],b=[(i+1)/nx,j/ny],d=[i/nx,(j+1)/ny],e=[(i+1)/nx,(j+1)/ny];let src=p=>[p[0]*img.width,p[1]*img.height];triangle(img,[src(a),src(b),src(d)],[P(...a),P(...b),P(...d)]);triangle(img,[src(b),src(e),src(d)],[P(...b),P(...e),P(...d)]);}
stroke([...corners,corners[0]],'#ffffff35',1.2);c.restore();}
function crop(img,x,y,w,h){let n=createCanvas(w,h);n.getContext('2d').drawImage(img,x,y,w,h,0,0,w,h);return n;}
function framed(img,phone=false){let pad=phone?15:12,top=phone?20:42;let n=createCanvas(img.width+pad*2,img.height+top+pad),g=n.getContext('2d');g.fillStyle=phone?'#202728':'#e7eae5';g.beginPath();g.roundRect(0,0,n.width,n.height,phone?40:18);g.fill();g.drawImage(img,pad,top);if(phone){g.fillStyle='#090b0d';g.beginPath();g.roundRect(n.width/2-48,top+12,96,15,8);g.fill();}else{g.fillStyle='#9da8a1';for(let i=0;i<3;i++){g.beginPath();g.arc(30+i*18,22,4,0,Math.PI*2);g.fill();}g.font='13px Jakarta';g.fillText('paceIT / selected work',120,27);}return n;}
// A lit 3D tube. Per-segment highlights follow the same curve as the silhouette.
function conduit(t,opts={}){require('./tube-v2.cjs')(c,W,H,t,opts);}
const im={},tex={},flows=[];
function whiteFlash(p){alpha(p,()=>{c.fillStyle=WHITE;c.fillRect(0,0,W,H);});}
function small(s,light=false){type(s,W/2,H-(vertical?210:42),vertical?22:20,light?'#57635e':'#9caaa5','center','Jakarta');}

function softCard(img,x,y,w,rotation=0,opacity=1){
 const h=w*img.height/img.width,r=Math.min(30,w*.035);c.save();c.globalAlpha*=opacity;c.translate(x,y);c.rotate(rotation);
 c.shadowColor='#00000090';c.shadowBlur=55;c.shadowOffsetY=24;rr(-w/2,-h/2,w,h,r,'#172024');c.shadowBlur=0;c.shadowOffsetY=0;
 c.beginPath();c.roundRect(-w/2,-h/2,w,h,r);c.clip();c.drawImage(img,-w/2,-h/2,w,h);
 const shine=c.createLinearGradient(0,-h/2,0,h/2);shine.addColorStop(0,'#ffffff10');shine.addColorStop(.25,'#ffffff00');c.fillStyle=shine;c.fillRect(-w/2,-h/2,w,h);c.restore();
}
let scrollCanvas;
function scrollView(t){
 const image=im[vertical?'scrollmobile':'scrolldesktop'],sw=vertical?600:1600,sh=vertical?1080:1000;
 if(!scrollCanvas)scrollCanvas=createCanvas(sw,sh+48);
 const g=scrollCanvas.getContext('2d');g.fillStyle='#e9ece7';g.fillRect(0,0,sw,sh+48);
 const offset=sm((t-19.5)/3.7)*Math.min(image.height-sh,vertical?2900:2700);
 g.drawImage(image,0,offset,sw,sh,0,48,sw,sh);
 g.fillStyle='#a2b2aa';for(let i=0;i<3;i++){g.beginPath();g.arc(24+i*18,24,4,0,Math.PI*2);g.fill();}
 g.fillStyle='#395347';g.font='16px Jakarta';g.fillText('paceit.co.za',110,30);return scrollCanvas;
}
function missed(t){
 const u=t-7;bg();const exit=sm((u-5.1)/.9);c.save();c.translate(0,-exit*H*.18);c.globalAlpha=1-exit;
 const pw=vertical?830:780,py=H*.34;let entrance=out(u/.8);c.save();c.translate(W/2,py+60*(1-entrance));c.globalAlpha*=entrance;
 c.shadowBlur=50;c.shadowColor='#00000070';rr(-pw/2,-80,pw,160,24,'#1b2527');c.shadowBlur=0;
 c.strokeStyle=u<2.8?E:'#d3977b';c.lineWidth=3;c.strokeRect(-pw/2+36,-25,66,46);stroke([[-pw/2+37,-24],[-pw/2+69,0],[-pw/2+101,-24]],c.strokeStyle,3);
 type('New project enquiry',-pw/2+130,-10,vertical?32:31,WHITE,'left','Jakarta');
 type(u<2.8?'Waiting for a reply':'No response sent',-pw/2+130,34,24,u<2.8?'#9eaea7':'#d3977b','left','Jakarta');
 rr(-pw/2+30,72,(pw-60)*(1-sat(u/3)),3,1,E);c.restore();
 if(u<2.8){reveal('One message.',W/2,H*.57,vertical?80:112,u/.7,WHITE,'center');reveal('Waiting.',W/2,H*.57+110,vertical?80:112,(u-.5)/.8,'#7e9990','center');}
 else{const a=out((u-2.8)/.65);alpha(a,()=>type('Missed enquiry.',W/2,H*.58+28*(1-a),vertical?83:116,WHITE,'center','Jakarta'));alpha(sm((u-3.3)/.7),()=>type('The work should keep moving.',W/2,H*.58+90,vertical?31:32,'#a9b9b1','center','Jakarta'));}
 c.restore();if(exit>0)conduit(t,{x:W/2,y:H*.48,scale:mix(.2,vertical?1.2:1.45,exit),rotate:.9,alpha:exit});
}
function panelGrid(t){
 const u=t-24,landings=[0,.72,1.44,2.16],imgs=[tex.travel,tex.flow,tex.daylight,tex.relay];
 const fw=vertical?440:700,gap=vertical?25:36,fh=fw*tex.travel.height/tex.travel.width;
 for(let i=0;i<4;i++){if(u<landings[i])continue;let age=u-landings[i],p=out(age/.48);
 let targets= i===0?[-.5,-.5]:i===1?[.5,-.5]:i===2?[.5,.5]:[-.5,.5];
 let x=W/2+targets[0]*(fw+gap),y=H/2+targets[1]*(fh+gap);
 // Each new arrival displaces the already placed surfaces, then they settle.
 let push=0;for(let j=i+1;j<4;j++){let dt=u-landings[j];if(dt>=0&&dt<.6)push+=Math.sin(dt*16)*Math.exp(-dt*8)*24;}
 x+=targets[0]*push;y+=targets[1]*push;
 const start=i===0?[W/2,H/2]:i===1?[W+fw,H*.4]:i===2?[W*.75,H+fh]:[-fw,H*.6];
 softCard(imgs[i],mix(start[0],x,p),mix(start[1],y,p),fw*(1+.12*(1-p)),(i%2?1:-1)*.06*(1-p));
 }
 type('Made to work together.',W/2,vertical?H*.22:100,vertical?48:45,WHITE,'center','Jakarta');
 small('Selected work / Product demonstrations');
}

function render(t){bg();
if(t<7){let u=t;conduit(t,{x:W*.55,y:H*(vertical?.42:.52),scale:mix(4.5,1.25,sm(u/4.8)),rotate:mix(.8,.1,sm(u/5)),mode:'wave',progress:1});if(u>1.6){let p=out((u-1.6)/1);alpha(1-sm((u-6.4)/.6),()=>{reveal('Every business problem',W/2,H*.65,vertical?64:87,p,WHITE,'center');reveal('starts small.',W/2,H*.65+(vertical?90:108),vertical?92:130,(u-2.1)/.8,E,'center');});}wash(W*.78,H*.48,W*.15,H*.2,'#88ffc912');}
else if(t<13){missed(t);}
else if(t<19){let u=t-13,p=out(u/1.4);bg();conduit(t,{x:W/2,y:H*.51,scale:vertical?1.2:1.45,rotate:u*.3,alpha:.65});surface(tex.mobile,{x:mix(W*.65,W*.5,p),y:H*.5,w:vertical?540:360,ry:mix(1.35,-.15,p),rz:mix(.16,-.05,p),z:-sm((u-4.9)/1.1)*1050});if(u<4.8){alpha(sm((u-.8)/.5)*(1-sm((u-4)/.7)),()=>{type('A better',vertical?85:130,vertical?H*.19:H*.44,vertical?76:102);type('way.',vertical?85:130,vertical?H*.19+90:H*.44+120,vertical?100:145,E);});if(u>1.4){let idx=Math.min(2,Math.floor((u-1.4)/1.1));let text=['Request received','Quote created','Ready for approval'][idx];rr(vertical?160:W*.69,vertical?H*.8:H*.65,vertical?760:465,80,18,'#e5f4e8');type(text,vertical?195:W*.69+30,(vertical?H*.8:H*.65)+51,vertical?35:30,'#173e30');}}if(u>5.8)whiteFlash(sm((u-5.8)/.2));}
else if(t<24){bg(true);const p=out((t-19)/.7);softCard(scrollView(t),W/2,H/2+15,(vertical?870:1480)*mix(.94,1,p));}
else if(t<28){bg();panelGrid(t);}
else if(t<36){let u=t-28,k=Math.min(2,Math.floor(u/(8/3))),v=u-k*8/3,p=out(v/.85);bg(true);const words=[['Websites.','That work.'],['Systems.','That connect.'],['Workflows.','That move.']][k];const texture=[tex.travel,tex.daylight,tex.relay][k];let ww=vertical?860:1600;surface(texture,{x:vertical?W*.7:W*.7+(1-p)*800,y:vertical?H*.62:H*.59,w:ww,rx:.12*(1-p),ry:mix(-.4,-.14,p),rz:mix(.08,-.035,p),z:40});c.save();let g=c.createLinearGradient(0,0,vertical?0:W*.58,vertical?H*.37:0);g.addColorStop(0,'#efefeb');g.addColorStop(.6,'#efefeb');g.addColorStop(1,'#efefeb00');c.fillStyle=g;c.fillRect(0,0,vertical?W:W*.6,vertical?H*.4:H);c.restore();reveal(words[0],vertical?75:100,vertical?H*.23:H*.42,vertical?105:115,p,'#13281e');reveal(words[1],vertical?75:100,vertical?H*.23+110:H*.42+125,vertical?85:88,(v-.12)/.7,'#508d73');small(['SA Family Travel / Website','Daylight / Booking concept','Relay / Operations concept'][k],true);}
else if(t<41.8){let u=t-36,source=20*u/5.8;let frame=flows[Math.min(239,Math.floor(source*12))];let zoom=1+.04*Math.sin(u*.65);if(vertical){surface(frame,{x:W*.55,y:H*.51,w:900*zoom,ry:.08*Math.sin(u*.5)});type('Less chasing.',80,H*.14,82);type('More doing.',80,H*.14+94,90,E);small('Flow Plumbing / Fictional product demonstration');}else{surface(frame,{w:W*1.13*zoom,x:W/2-100*Math.sin(u*.7),y:H/2,shadow:false});} }
else if(t<44){let u=t-41.8,p=sm(u/2.2);bg();const pts=[];for(let i=0;i<=140;i++){let x=i/140;pts.push([mix(-100,W+100,x),H*.53+Math.sin(x*Math.PI*2-.3)*(vertical?230:120)]);}stroke(pts,'#1e3630',24);stroke(pts,'#3fba94',7,p);for(let i=0;i<4;i++){let q=pts[Math.floor((i+.5)/4*140)],a=out((p-i*.2)/.3);alpha(a,()=>{rr(q[0]-95,q[1]-65,190,130,23,'#d9eee4');type(['Request','Quote','Approved','Follow-up'][i],q[0],q[1]+8,24,'#153e2d','center');});}alpha(sm((u-.7)/.5),()=>{type('Connected.',W/2,H*.22,vertical?112:145,WHITE,'center');});}
else if(t<50){let u=t-44;bg();if(u<2.8){softCard(tex.analytics,W/2,H/2,vertical?960:1700,-.015*(1-sm(u/2)));}else{let q=u-2.8;let chart=require('./analytics-v2.cjs').createAnalyticsTexture(im.analytics,sm(q/1.8));softCard(chart,W*(vertical?.5:.36),H*(vertical?.47:.6),vertical?940:1110,-.025);softCard(tex.metric,W*(vertical?.5:.79),H*(vertical?.71:.44),vertical?680:550,.025);reveal('A clearer picture.',W/2,H*.18,vertical?81:109,q/.65,WHITE,'center');}small('Northstar / Illustrative analytics');}
else{let u=t-50,p=sm(u/2.5);bg();conduit(t,{x:W/2,y:H*.48,scale:mix(2.3,vertical?.8:1.2,p),rotate:mix(.8,0,p),alpha:1-sm((u-2.1)/1.3),mode:'loop'});if(u>1.8){let a=out((u-1.8)/.75);alpha(a,()=>{type('pace',W/2-(vertical?55:80),H*.49,vertical?200:290,WHITE,'right');type('IT.',W/2-(vertical?55:80),H*.49,vertical?200:290,E,'left');type('Good business. Better systems.',W/2,H*.49+110,vertical?43:57,WHITE,'center','Jakarta');type('paceit.co.za',W/2,H*.49+210,vertical?37:38,'#9fbbb0','center','Jakarta');});} }
}
(async()=>{for(const [k,file] of Object.entries({scrollmobile:'scroll-mobile.png',scrolldesktop:'scroll-desktop.png',desktop:'desktop.png',mobile:'mobile.png',travel:'sa-family-travel-elephants.webp',flow:'flow-plumbing-preview.webp',daylight:'daylight-preview.webp',relay:'relay-preview.webp',analytics:'analytics-preview.webp'})){im[k]=await loadImage('assets/'+file);tex[k]=framed(im[k],k==='mobile');}tex.chart=crop(im.analytics,315,415,990,405);tex.metric=crop(im.analytics,323,232,374,170);for(let i=1;i<=240;i++)flows.push(await loadImage('assets/flow-frames/'+String(i).padStart(4,'0')+'.jpg'));
fs.mkdirSync('out/v3',{recursive:true});let name=vertical?'paceit-signal-reel':'paceit-signal-16x9';
if(process.argv.includes('--stills')){for(const t of [0,1,3.8,6,8.5,11,14,16,18,20,22,24.5,26,28.8,31.5,34.2,37,39.8,42.8,45.5,48,51,54,56.9]){render(t);fs.writeFileSync(`out/v3/${name}-${String(t).padStart(4,'0')}.jpg`,cvas.toBuffer('image/jpeg'));}return;}
let start=process.argv.includes('--preview')?0:0,dur=process.argv.includes('--preview')?57:57;let fps=process.argv.includes('--preview')?15:FPS;const args=['-y','-v','error','-threads','2','-f','rawvideo','-pix_fmt','rgba','-s',`${W}x${H}`,'-r',String(fps),'-i','-','-i','audio/v3/master.wav','-c:v','libx264','-threads','2','-preset','fast','-crf','18','-pix_fmt','yuv420p','-c:a','aac','-b:a','256k','-t',String(dur),'-movflags','+faststart',`out/v3/${name}.mp4`];
args[args.indexOf('audio/v3/master.wav')]='audio/v3/master-final.wav';
const proc=spawn('ffmpeg',args,{stdio:['pipe','inherit','inherit']});for(let f=0;f<fps*dur;f++){render(start+f/fps);if(!proc.stdin.write(cvas.data()))await once(proc.stdin,'drain');if(f%(fps*5)===0)console.log(name,(f/fps).toFixed(1)+'s');}proc.stdin.end();let [code]=await once(proc,'exit');if(code)process.exit(code);})();

