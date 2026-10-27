/* Original emerald-metal tube: swept cylinder, perspective and studio lighting.
 * Uses the film's Canvas engine. It writes no files; output is a composited layer.
 */
const TAU = Math.PI * 2;
const {createCanvas,ImageData}=require('@napi-rs/canvas');
const BUFFERS=new Map();
const clamp = (v, a=0, b=1) => Math.max(a, Math.min(b, v));
const add = (a,b) => [a[0]+b[0],a[1]+b[1],a[2]+b[2]];
const mul = (a,k) => [a[0]*k,a[1]*k,a[2]*k];
const dot = (a,b) => a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
const cross = (a,b) => [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const norm = a => mul(a,1/(Math.hypot(...a)||1));
function rotate3(p,ry) {
  const ax=.55, az=-.22;
  const yy=p[1]*Math.cos(ax)-p[2]*Math.sin(ax), zz=p[1]*Math.sin(ax)+p[2]*Math.cos(ax);
  const xx=p[0]*Math.cos(ry)+zz*Math.sin(ry), z=-p[0]*Math.sin(ry)+zz*Math.cos(ry);
  return [xx*Math.cos(az)-yy*Math.sin(az),xx*Math.sin(az)+yy*Math.cos(az),z];
}

// A broad softbox and a narrow silver strip light. Front faces point toward -Z.
const KEY=norm([-.5,-.72,-.8]), HALF=norm([-.26,-.38,-1.45]);
const STRIP=norm([.72,-.23,-1.1]);
function metal(n,p) {
  const view=norm([-p[0],-p[1],-2200-p[2]]);
  const nv=clamp(dot(n,view));
  const diffuse=.18+.62*clamp(dot(n,KEY));
  const wide=Math.pow(clamp(dot(n,HALF)),8)*.37;
  const sharp=Math.pow(clamp(dot(n,HALF)),48)*1.05;
  const strip=Math.pow(clamp(dot(n,STRIP)),72)*.48;
  const rim=Math.pow(1-nv,3)*.18;
  const reflection=wide+sharp+strip;
  const base=[15,112,79], shine=[229,249,237], edge=[48,128,99];
  const rgb=base.map((v,i)=>Math.round(clamp(v*diffuse+shine[i]*reflection+edge[i]*rim,0,255)));
  return `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
}

function drawTube(ctx,W,H,t,{
  x=W/2,y=H/2,scale=1,rotate=0,alpha=1,mode='loop',progress=1
}={}) {
  progress=clamp(progress);if(progress<=0 || alpha<=0 || scale<=0)return;
  const LONG=112,RAD=20,F=2200;
  // Broad enough to read as a sculpted object, rather than a glowing wire.
  const radius=mode==='loop'?31:26;
  const steps=Math.max(1,Math.ceil(LONG*progress));
  const rings=[];
  function path(u) {
    const a=u*TAU;
    if(mode==='loop') return {
      p:[460*Math.sin(a),280*Math.cos(a),100*Math.sin(2*a+t*.24)],
      d:[460*TAU*Math.cos(a),-280*TAU*Math.sin(a),200*TAU*Math.cos(2*a+t*.24)]
    };
    return {
      p:[-1100+2200*u,180*Math.sin(a+t*.45),130*Math.cos(a*1.5+t*.1)],
      d:[2200,180*TAU*Math.cos(a+t*.45),-195*TAU*Math.sin(a*1.5+t*.1)]
    };
  }
  for(let i=0;i<=steps;i++) {
    const u=progress*i/steps, q=path(u), tangent=norm(q.d);
    const a=norm(cross(tangent,[0,0,1])),b=norm(cross(tangent,a));
    const ring=[];
    for(let j=0;j<RAD;j++) {
      const theta=TAU*j/RAD;
      const normal=add(mul(a,Math.cos(theta)),mul(b,Math.sin(theta)));
      const p=mul(rotate3(add(q.p,mul(normal,radius)),rotate),scale);
      const n=rotate3(normal,rotate),depth=F+p[2];
      ring.push({p,n,xy:[x+p[0]*F/depth,y+p[1]*F/depth],depth});
    }
    rings.push(ring);
  }
  const faces=[];
  for(let i=0;i<steps;i++)for(let j=0;j<RAD;j++) {
    const j1=(j+1)%RAD;
    const q=[rings[i][j],rings[i+1][j],rings[i+1][j1],rings[i][j1]];
    if(q.some(v=>v.depth<100))continue;
    const p=mul(q.reduce((a,v)=>add(a,v.p),[0,0,0]),.25);
    const n=norm(q.reduce((a,v)=>add(a,v.n),[0,0,0]));
    if(dot(n,norm([-p[0],-p[1],-F-p[2]]))<-.06)continue;
    faces.push({q,z:p[2]});
  }
  // Pixel-wise interpolated normals avoid both Gouraud bands and compositing
  // seams. Alpha is applied only after the opaque, depth-tested object exists.
  const key=W+'x'+H;
  let buffer=BUFFERS.get(key);
  if(!buffer){const canvas=createCanvas(W,H);buffer={canvas,g:canvas.getContext('2d'),rgba:new Uint8ClampedArray(W*H*4),z:new Float32Array(W*H)};BUFFERS.set(key,buffer);}
  const pixels=buffer.rgba,depths=buffer.z;pixels.fill(0);depths.fill(0);
  function raster(a,b,d){
    const ax=a.xy[0],ay=a.xy[1],bx=b.xy[0],by=b.xy[1],cx=d.xy[0],cy=d.xy[1];
    const area=(by-cy)*(ax-cx)+(cx-bx)*(ay-cy);
    if(Math.abs(area)<.001)return;
    const minX=Math.max(0,Math.floor(Math.min(ax,bx,cx))),maxX=Math.min(W-1,Math.ceil(Math.max(ax,bx,cx)));
    const minY=Math.max(0,Math.floor(Math.min(ay,by,cy))),maxY=Math.min(H-1,Math.ceil(Math.max(ay,by,cy)));
    const dx1=(by-cy)/area,dy1=(cx-bx)/area,dx2=(cy-ay)/area,dy2=(ax-cx)/area;
    const za=1/a.depth,zb=1/b.depth,zd=1/d.depth;
    for(let py=minY;py<=maxY;py++){
      let u=((by-cy)*(minX+.5-cx)+(cx-bx)*(py+.5-cy))/area;
      let v=((cy-ay)*(minX+.5-cx)+(ax-cx)*(py+.5-cy))/area;
      for(let px=minX;px<=maxX;px++,u+=dx1,v+=dx2){
        const w=1-u-v;if(u<-.00001||v<-.00001||w<-.00001)continue;
        const iz=u*za+v*zb+w*zd,idx=py*W+px;if(iz<=depths[idx])continue;
        const aa=u*za,bb=v*zb,dd=w*zd;
        let nx=a.n[0]*aa+b.n[0]*bb+d.n[0]*dd,ny=a.n[1]*aa+b.n[1]*bb+d.n[1]*dd,nz=a.n[2]*aa+b.n[2]*bb+d.n[2]*dd;
        const len=1/Math.sqrt(nx*nx+ny*ny+nz*nz);nx*=len;ny*=len;nz*=len;
        const diffuse=.18+.62*Math.max(0,nx*KEY[0]+ny*KEY[1]+nz*KEY[2]);
        const k=Math.max(0,nx*HALF[0]+ny*HALF[1]+nz*HALF[2]),k2=k*k,k4=k2*k2,k8=k4*k4,k16=k8*k8;
        const sk=Math.max(0,nx*STRIP[0]+ny*STRIP[1]+nz*STRIP[2]),s2=sk*sk,s4=s2*s2,s8=s4*s4,s16=s8*s8,s32=s16*s16;
        const shine=k8*.37+k16*k16*k16*1.05+s32*s32*s8*.48;
        const rayX=(px-x)/F,rayY=(py-y)/F;
        const nv=Math.max(0,(-nx*rayX-ny*rayY-nz)/Math.sqrt(1+rayX*rayX+rayY*rayY));
        const fr=1-nv,rim=fr*fr*fr*.18;
        const off=idx*4;pixels[off]=15*diffuse+229*shine+48*rim;
        pixels[off+1]=112*diffuse+249*shine+128*rim;
        pixels[off+2]=79*diffuse+237*shine+99*rim;pixels[off+3]=255;depths[idx]=iz;
      }
    }
  }
  for(const {q} of faces){raster(q[0],q[1],q[2]);raster(q[0],q[2],q[3]);}
  // A rounded-looking polished terminal keeps a partially revealed conduit tidy.
  if(progress<.997 || mode!=='loop') {
    const r=rings[steps];const p=path(progress), center=mul(rotate3(p.p,rotate),scale);
    const tangent=rotate3(norm(p.d),rotate);
    if(F+center[2]>100 && dot(tangent,norm([-center[0],-center[1],-F-center[2]]))>.03) {
      const depth=F+center[2],mid={p:center,n:tangent,depth,xy:[x+center[0]*F/depth,y+center[1]*F/depth]};
      for(let j=0;j<RAD;j++)raster(mid,{...r[j],n:tangent},{...r[(j+1)%RAD],n:tangent});
    }
  }
  buffer.g.putImageData(new ImageData(pixels,W,H),0,0);
  ctx.save();ctx.globalAlpha*=clamp(alpha);ctx.drawImage(buffer.canvas,0,0);ctx.restore();
}
module.exports=drawTube;
module.exports.drawTube=drawTube;
