/** Mount the continuously looping dot-matrix hero; return its cleanup.
 * @param {HTMLCanvasElement} canvas
 */
export function mountHands(canvas) {
 const ctx = canvas.getContext('2d');
 if (!ctx) return;
 const image = new Image();
 image.crossOrigin = 'anonymous';
 let disposed=false,visible=true,lastFrame=-Infinity;
 const src = [[0,.06,.47,.40],[.53,.06,.47,.40],[0,.55,.47,.40],[.53,.55,.47,.40]];
 // Keep each hand/pose in its own field so crossing the centre cannot switch its pose.
 const tiles = [], fields = Array.from({ length: 4 }, () => document.createElement('canvas'));
 const fc = fields.map(c => c.getContext('2d',{willReadFrequently:true}));
 let W,H,DPR,step,rowStep,cols,rows,seeds,seedSin,seedCos,frame=0,ready=false,t0=performance.now();
 const clamp = (v,a=0,b=1) => Math.max(a,Math.min(b,v));
 const hash = (a,b) => {const n=Math.sin(a*127.1+b*311.7)*43758.5453;return n-Math.floor(n)};
 const smooth = (a,b,x) => {const p=clamp((x-a)/(b-a));return p*p*(3-2*p)};
 const brightness = Float32Array.from({length:256},(_,value)=>Math.pow(clamp((1-value/255-.035)/.86),.86));
 const mixAt = (t,on,off,dur) => smooth(on,on+dur,t)*(1-smooth(off,off+dur,t));
 function resize(){
  const r=canvas.getBoundingClientRect();W=r.width;H=r.height;DPR=Math.min(2,devicePixelRatio||1);
  canvas.width=Math.round(W*DPR);canvas.height=Math.round(H*DPR);ctx.setTransform(DPR,0,0,DPR,0,0);
  step=Math.max(2.2,W/320)*1.05*1.10;rowStep=step*1.5;cols=Math.ceil(W/step);rows=Math.ceil(H/rowStep);
  fields.forEach(c=>{c.width=cols;c.height=rows});
  seeds=new Float32Array(cols*rows);for(let j=0;j<rows;j++)for(let i=0;i<cols;i++)seeds[j*cols+i]=.55*hash(i,j)+.45*hash(j*3.1,7.7);
  seedSin=seeds.map(seed=>Math.sin(seed*40));seedCos=seeds.map(seed=>Math.cos(seed*40));
  if(ready)render((performance.now()-t0)/1000);
 }
 function paintField(c,hand,pose,t){
  c.setTransform(1,0,0,1,0,0);c.fillStyle='#fff';c.fillRect(0,0,cols,rows);
  const portrait=H>W,hw=W*(portrait?.52:.53),hh=hw*(.40*1520)/(.47*2688),cy=H*(portrait?.57:.54),a=2*Math.PI*t/20;
  const left=hand===0,ph=left?0:Math.PI,reach=((portrait?.015:.035)*Math.sin(a+ph)+(portrait?.006:.012)*Math.sin(2*a+1.3+ph))*W;
  const scale=1+(portrait?.035:.07)*Math.sin(a+.9+ph),rot=(left?1:-1)*.045*Math.sin(a+2.1+ph),x=left?reach-W*.045:W-hw+W*.045-reach,pivot=left?0:W;
  c.save();c.scale(cols/W,rows/H);c.translate(pivot,cy);c.rotate(rot);c.scale(scale,scale);c.translate(-pivot,-cy);c.drawImage(tiles[pose*2+hand],x,cy-hh/2,hw,hh);c.restore();
 }
 function render(time){
  if(!ready)return;const t=((time%20)+20)%20;
  for(let pose=0;pose<2;pose++)for(let hand=0;hand<2;hand++)paintField(fc[pose*2+hand],hand,pose,t);
  const pixels=fc.map(field=>field.getImageData(0,0,cols,rows).data);
  ctx.clearRect(0,0,W,H);ctx.fillStyle='#0d0d0d';
  const mL=mixAt(t,6.2,14.6,1.6),mR=mixAt(t,2.4,10.4,1.6),tick=Math.floor(t*7),R=step*.46;
  const waveSin=Math.sin(t*3.2),waveCos=Math.cos(t*3.2);
  ctx.beginPath();
  for(let j=0;j<rows;j++){
   const shift=hash(j,tick)>.965?Math.round((hash(tick,j)-.5)*8):0;
   for(let i=0;i<cols;i++){
    const k=j*cols+i,seed=seeds[k],ii=clamp(i-shift,0,cols-1);
    let v=0;
    for(let hand=0;hand<2;hand++){
     const m=hand===0?mL:mR,field=pixels[(seed<m?2:0)+hand];
     let handValue=brightness[field[(j*cols+ii)*4]];
     if(m>.001&&m<.999&&Math.abs(seed-m)<.12){handValue*=Math.abs(seed-m)/.12;if(hash(i+tick,j)<=.4)handValue*=.3}
     v=Math.max(v,handValue);
    }
    v*=.96+.04*(waveSin*seedCos[k]+waveCos*seedSin[k]);
    const level=Math.round(v*10)/10;
    if(!level)continue;const x=(i+.5)*step,y=(j+.5)*rowStep,r=R*Math.sqrt(level);ctx.moveTo(x+r,y);ctx.arc(x,y,r,0,Math.PI*2);
   }
  }
  ctx.fill();
 }
 // Keep the authored timing while avoiding duplicate work on high-refresh screens.
 function animate(now){if(disposed||!visible||document.hidden)return;if(now-lastFrame>=1000/30-1){render((now-t0)/1000);lastFrame=now}frame=requestAnimationFrame(animate)}
 function start(){cancelAnimationFrame(frame);lastFrame=-Infinity;if(!disposed&&visible&&!document.hidden)frame=requestAnimationFrame(animate)}
 image.onload=()=>{if(disposed)return;src.forEach(([x,y,w,h])=>{const tile=document.createElement('canvas');tile.width=420;tile.height=Math.round(420*h*image.height/(w*image.width));const c=tile.getContext('2d');c.imageSmoothingQuality='high';c.drawImage(image,x*image.width,y*image.height,w*image.width,h*image.height,0,0,tile.width,tile.height);tiles.push(tile)});ready=true;resize();start()};

 const visibilityChanged=()=>{if(document.hidden)cancelAnimationFrame(frame);else start()};
 const observer = new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;start()});
 observer.observe(canvas);
 window.addEventListener('resize',resize);
 document.addEventListener('visibilitychange',visibilityChanged);
 resize();image.src='/media/connecting-hands.webp';
 return ()=>{disposed=true;cancelAnimationFrame(frame);observer.disconnect();image.onload=null;window.removeEventListener('resize',resize);document.removeEventListener('visibilitychange',visibilityChanged)};
}
