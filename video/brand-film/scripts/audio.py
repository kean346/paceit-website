import numpy as np, wave, os
os.chdir(os.path.join(os.path.dirname(__file__),'..'))
sr=48000; n=sr*57; rng=np.random.default_rng(346)
stems={k:np.zeros((n,2),np.float32) for k in ['music','atmosphere','transitions','ui','impacts']}
def put(name,at,signal,gain=1,pan=0):
 i=int(at*sr); a=np.asarray(signal,np.float32)[:n-i]*gain
 stems[name][i:i+len(a),0]+=a*np.sqrt((1-pan)/2);stems[name][i:i+len(a),1]+=a*np.sqrt((1+pan)/2)
def tone(freq,dur):
 t=np.arange(int(sr*dur))/sr;return t,np.sin(2*np.pi*freq*t)
for at in np.arange(0,57,4):
 t=np.arange(int(sr*min(5,57-at)))/sr; env=np.minimum(t/1.2,1)*np.minimum((len(t)/sr-t)/1.5,1)
 for j,f in enumerate([[110,130.813,164.814],[87.307,110,130.813],[130.813,164.814,195.998],[97.999,123.471,146.832]][int(at/4)%4]):
  put('music',at,(np.sin(2*np.pi*f*t)+.18*np.sin(2*np.pi*f*2.002*t))*env,.07,[-.5,0,.5][j])
for at in np.arange(7,51,.5):
 t=np.arange(int(sr*.3))/sr; put('music',at,np.sin(2*np.pi*(48*t+2*(1-np.exp(-t*35))))*np.exp(-t*18),.19)
 if int(at*2)%2:put('music',at,rng.normal(0,1,len(t))*np.exp(-t*75),.025,.35)
for at in np.arange(19,50,.25):
 f=[220,261.626,329.628,392][int(at*4)%4];t,s=tone(f,.35);put('music',at,s*np.exp(-t*17)*np.minimum(t*300,1),.045,(-1)**int(at*4)*.4)
for at in [6.8,12.8,18.8,27.8,35.8,43.8,49.8,51.7]:
 t=np.arange(int(sr*1.0))/sr; noise=rng.normal(0,1,len(t));noise=np.convolve(noise,np.ones(12)/12,'same');put('transitions',at-.5,noise*np.sin(np.pi*t)**3,.32,-.3)
for at in [10.8,13,19,28,36,44,52.2]:
 t=np.arange(sr*2)/sr;put('impacts',at,np.sin(2*np.pi*(38*t+2*(1-np.exp(-t*8))))*np.exp(-t*3),.5)
for at in [7,7.55,8.1,13.6,14.9,16.2,36,37.45,38.9,40.35,44.7,45.1,45.5,52.2,52.45,52.7]:
 t,s=tone(660 if at<38.9 else 880,.4);put('ui',at,(s+.3*np.sin(2*np.pi*1320*t))*np.exp(-t*13)*np.minimum(t*500,1),.085,.25)
t=np.arange(n)/sr;put('atmosphere',0,(np.sin(2*np.pi*36.7*t)+.3*np.sin(2*np.pi*73.5*t))*.025)
def save(name,a):
 with wave.open('audio/'+name+'.wav','wb') as w:w.setnchannels(2);w.setsampwidth(2);w.setframerate(sr);w.writeframes((np.clip(a,-1,1)*32767).astype('<i2').tobytes())
master=sum(stems.values());fade=np.minimum(t/1,1)*np.minimum((57-t)/2.5,1)
for key,a in stems.items():save(key,a*fade[:,None])
master*=fade[:,None];master*=.87/max(.001,np.max(np.abs(master)));save('master',master)
print('Original stereo score and 5 stems. Peak',20*np.log10(np.max(np.abs(master))))
