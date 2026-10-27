"""Original, deterministic score for the second paceIT brand-film treatment.

All sounds are synthesized here. No reference recording or third-party audio is
read. Rendered stems and master stay inside audio/v2/. 48 kHz stereo, 57 seconds.
"""
from pathlib import Path
import json
import math
import subprocess
import wave
import numpy as np
from scipy.signal import butter, sosfilt

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'audio' / 'v2'
OUT.mkdir(parents=True, exist_ok=True)
SR, DURATION = 48000, 57
N = SR * DURATION
RNG = np.random.default_rng(3462026)
STEMS = {k: np.zeros((N, 2), np.float32) for k in
         ['music', 'atmosphere', 'transitions', 'ui', 'impacts']}
CUES = []

def clock(d): return np.arange(round(SR*d), dtype=np.float64) / SR
def note(midi): return 440 * 2 ** ((midi-69)/12)
def filt(x, cutoff, mode='lowpass', order=2):
    return sosfilt(butter(order, cutoff, btype=mode, fs=SR, output='sos'), x)
def noise(d, lo=120, hi=12000):
    return filt(RNG.standard_normal(round(d*SR)), [lo, hi], 'bandpass')
def env(t, attack=.02, release=.4):
    return np.minimum(1, t/attack) * np.minimum(1, np.maximum(0, t[-1]-t)/release)

def add(stem, at, audio, level=1, pan=0):
    i=round(at*SR)
    a=np.asarray(audio, np.float32)
    if i < 0: a=a[-i:]; i=0
    a=a[:N-i]
    if not len(a): return
    if a.ndim == 1:
        a=np.column_stack([a*np.sqrt((1-pan)/2), a*np.sqrt((1+pan)/2)])
    STEMS[stem][i:i+len(a)] += a*level

def cue(at, name, stem): CUES.append({'time':round(at,3), 'name':name, 'stem':stem})

def pad(at, dur, mids, level=.09, brightness=.4):
    t=clock(dur)
    for j,m in enumerate(mids):
        f=note(m)
        a=np.zeros_like(t)
        # Detuned harmonic oscillators form a restrained, slowly opening pad.
        for k, gain in [(1,1),(2,.23*brightness),(3,.12*brightness),(4,.05*brightness)]:
            a += gain*(np.sin(2*np.pi*f*k*t+.004*np.sin(t*1.5)) +
                       .55*np.sin(2*np.pi*f*k*1.0021*t+j*.3))/1.55
        a *= env(t,.75,min(1.8,dur/3)) * (.91+.09*np.sin(t*.8+j))
        add('music',at,a,level/np.sqrt(len(mids)),pan=lerp(-.7,.7,j/max(1,len(mids)-1)))

def lerp(a,b,p): return a+(b-a)*p

def pluck(at, midi, level=.075, pan=0, dur=.85, softness=.3, echo=True):
    t=clock(dur);f=note(midi)
    a=(np.sin(2*np.pi*f*t + 1.6*np.exp(-t*15)*np.sin(2*np.pi*f*2*t))+
       softness*.35*np.sin(2*np.pi*f*3.001*t))*np.exp(-t*5)*env(t,.004,.12)
    add('music',at,a,level,pan)
    if echo:
        add('music',at+.278,a,level*.23,-pan)
        add('music',at+.556,a,level*.11,pan*.4)

def bass(at,midi,dur=.5,level=.13):
    t=clock(dur);f=note(midi)
    a=(np.sin(2*np.pi*f*t)+.18*np.sin(2*np.pi*f*2*t)+.065*np.sin(2*np.pi*f*3*t))
    add('music',at,a*env(t,.012,.12)*np.exp(-t*1.7),level)

def kick(at, level=.21):
    t=clock(.46);phase=2*np.pi*(42*t+2.15*(1-np.exp(-t*38)))
    a=np.sin(phase)*np.exp(-t*11)*env(t,.001,.05)
    a+=noise(.46,1400,6500)*np.exp(-t*180)*.065
    add('music',at,a,level)

def snap(at, level=.065):
    t=clock(.3)
    a=noise(.3,750,9500)*np.exp(-t*24)*env(t,.001,.06)
    a+=.24*np.sin(2*np.pi*185*t)*np.exp(-t*36)
    add('music',at,a,level,.12)
    add('music',at+.047,a,level*.12,-.25)

def hat(at, level=.025, pan=.4, long=False):
    d=.21 if long else .08;t=clock(d)
    a=noise(d,6500,17000)*np.exp(-t*(22 if long else 85))*env(t,.001,.02)
    add('music',at,a,level,pan)

def impact(at, level=.38, weight=1):
    t=clock(2.7)
    a=np.sin(2*np.pi*(34*t+2.7*(1-np.exp(-t*11))))*np.exp(-t*2.8)
    a+=noise(2.7,100,3800)*np.exp(-t*13)*.25
    a+=.09*np.sin(2*np.pi*68*t)*np.exp(-t*2)
    add('impacts',at,a*env(t,.002,.5),level*weight)
    cue(at,'Cinematic low impact','impacts')

def sweep(end, dur=1.0, level=.16, direction=1):
    t=clock(dur);u=t/dur
    air=noise(dur,350,10500)
    low=noise(dur,55,700)
    a=(air*u**2.5+low*.6*u**2)*np.sin(np.pi*u)**.7
    # Stereo traversal and multiple filtered layers make a camera movement.
    left=a*np.sqrt(np.clip(1-u,0,1)); right=a*np.sqrt(u)
    if direction<0:left,right=right,left
    add('transitions',end-dur,np.column_stack([left,right]),level)
    tail=noise(.62,700,9000)*np.exp(-clock(.62)*9)
    add('transitions',end,tail,level*.16,.45*direction)
    cue(end,'Travelling camera sweep','transitions')

def ui(at,midi=81, level=.045, pan=.1, success=False):
    for j, interval in enumerate([0,7,12] if success else [0]):
        t=clock(.55);f=note(midi+interval)
        a=(np.sin(2*np.pi*f*t)+.15*np.sin(2*np.pi*f*2.5*t))*np.exp(-t*13)*env(t,.002,.08)
        add('ui',at+j*.065,a,level,pan)
    cue(at,'Confirmation' if success else 'Interface tap','ui')

# Opening: a physically quiet tonal bed with electrical traces and forward pull.
t=clock(57)
atmos=(filt(RNG.standard_normal(N),[70,700],'bandpass')*.008+
       np.sin(2*np.pi*36.708*t)*.012*(.7+.3*np.sin(t*.23)))
add('atmosphere',0,atmos*env(t,2,3))
pad(0,8,[38,57,64,69],.055,.15)
for i,at in enumerate([.8,2.1,3.6,5.1,6.1]):
    pluck(at,[74,69,76,74,81][i],.045,-.5+i*.2,dur=1.1,softness=.1)
    ui(at,69,.018,-.4+i*.2)
sweep(7,1.6,.20)

# Friction: tighter pulse and filtered warning. The breath before 13 is deliberate.
pad(7,5.7,[38,53,57,64],.055,.4)
for at in np.arange(7,11.9,.5):
    bass(at,38,.32,.09)
    hat(at+.25,.02,-.3)
for at in [7,7.38,7.76]:ui(at,76,.052)
impact(10.8,.34)
q=clock(.23)
add('transitions',10.8,noise(.23,200,9000)*(np.sin(q*2*np.pi*29)>0)*np.exp(-q*18),.08)
sweep(13,1.1,.30)

# Resolution: warmer harmony, bright but soft confirmation tones.
pad(13,6.8,[46,57,60,65,69],.092,.5)
impact(13,.22)
for i,at in enumerate([14.4,15.5,16.6]):
    ui(at,[74,77,81][i],.062,[-.35,0,.35][i],success=i==2)
for at,m in [(14,65),(15,69),(16,72),(17,77),(18,81)]:pluck(at,m,.046,(-1)**m*.4)
sweep(19,1.25,.27)

# Main movement: 108 BPM, D minor / Bb / F / C harmonic movement.
# Motifs leave space; drums vary by phrase instead of a continuous identical loop.
beat=60/108
sections=[(19,28,[[38,57,60,64,69],[34,53,57,60,65],[41,57,60,65,69],[36,55,60,64,67]],1),
          (28,36,[[41,57,60,65,69],[36,55,60,64,67],[38,57,60,64,69],[34,53,57,60,65]],.85),
          (36,44,[[38,57,60,64,69],[34,53,57,60,65],[41,57,60,65,69],[36,55,60,64,67]],.73),
          (44,50,[[46,57,60,65,69],[48,55,60,64,67],[50,57,62,65,69]],.95)]
for start,end,chords,energy in sections:
    for k,at in enumerate(np.arange(start,end,beat*4)):
        chord=chords[k%len(chords)]
        pad(at,min(3.2,57-at),chord[1:],.10*energy,.65)
        root=chord[0]
        for j in range(8):
            pos=at+j*beat/2
            if pos>=end-.15:break
            if j in [0,3,4,6]:bass(pos,root,.42,.12*energy)
            if j in [0,4] or (k%2==1 and j==7):kick(pos,.18*energy)
            if j in [2,6]:snap(pos,.078*energy)
            hat(pos,.024*energy,(-1)**j*.55,long=j==7)
            if j in [0,2,3,5,7]:
                melodic=chord[1:][[0,2,1,3,2,0,1,3][j]]+12
                pluck(pos,melodic,.041*energy,(-1)**j*.4,dur=.8,softness=.2)
    impact(start,.29 if start!=44 else .34)

# Specific movement/interaction accents. Main scene cuts and sub-scene slides.
for end,dur,level in [(23.7,.8,.13),(26.4,.7,.11),(28,1,.21),
                      (30.667,.55,.13),(33.334,.55,.13),(36,1,.21),
                      (41.8,.8,.18),(44,1.2,.24),(50,1.2,.25)]:
    sweep(end,dur,level,direction=-1 if int(end)%2 else 1)
# Exact original Flow click times retimed from 20 s into the 36–41.8 s shot.
flow_clicks=[2.64,6.62,10.06,12.36,13.16,15.48,17.06]
for source,m in zip(flow_clicks,[76,76,77,79,81,79,84]):
    ui(36+source*5.8/20,m,.04,success=source in [13.16,17.06])
for at,m in [(46.8,74),(47.2,77),(47.6,81)]:
    ui(at,m,.032)

# Finale: rhythm stops for a breath, line gathers, then a warm three-note signature.
pad(49.8,2.3,[50,57,64,69],.043,.3)
sweep(52.2,1.6,.28)
impact(52.2,.46)
pad(52.2,4.8,[38,57,60,64,69],.13,.55)
for at,m,l in [(52.2,74,.12),(52.48,77,.105),(52.78,81,.095)]:
    pluck(at,m,l,[-.3,0,.3][int(round((at-52.2)/.29))],dur=3.8,softness=.4)
    cue(at,'paceIT tonal signature','music')

# Small stereo room/delay taps blend synth parts without washing out UI sounds.
for key,wet in [('music',.16),('ui',.14),('impacts',.09)]:
    dry=STEMS[key].copy()
    for delay,gain in [(.083,wet),(.137,wet*.7),(.251,wet*.5),(.389,wet*.3)]:
        off=round(delay*SR)
        STEMS[key][off:,0]+=dry[:-off,1]*gain
        STEMS[key][off:,1]+=dry[:-off,0]*gain

fade=np.minimum(1,t/.15)*np.minimum(1,np.maximum(0,57-t)/2.3)
mix=sum(STEMS.values())*fade[:,None]
# Gentle bus saturation restrains transient crest factor; output is normalized
# with an independently measured two-pass loudness conversion below.
mix=np.tanh(mix*1.35)/1.35

def save(file,data):
    with wave.open(str(file),'wb') as w:
        w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR)
        w.writeframes((np.clip(data,-.999,.999)*32767).astype('<i2').tobytes())
save(OUT/'premaster.wav',mix)
for name,a in STEMS.items():save(OUT/(name+'.wav'),a*fade[:,None])

scan=subprocess.run(['ffmpeg','-hide_banner','-i',str(OUT/'premaster.wav'),'-af',
    'loudnorm=I=-16:TP=-1.5:LRA=9:print_format=json','-f','null','-'],capture_output=True,text=True,check=True)
stats=json.loads(scan.stderr[scan.stderr.rfind('{'):scan.stderr.rfind('}')+1])
ln='loudnorm=I=-16:TP=-1.5:LRA=9:linear=true:measured_I={input_i}:measured_TP={input_tp}:measured_LRA={input_lra}:measured_thresh={input_thresh}:offset={target_offset}'.format(**stats)
subprocess.run(['ffmpeg','-y','-v','error','-i',str(OUT/'premaster.wav'),'-af',ln,
                '-ar',str(SR),'-ac','2','-c:a','pcm_s24le',str(OUT/'master-final.wav')],check=True)
measure=subprocess.run(['ffmpeg','-hide_banner','-i',str(OUT/'master-final.wav'),'-af',
    'loudnorm=I=-16:TP=-1.5:LRA=9:print_format=json','-f','null','-'],capture_output=True,text=True,check=True)
verified=json.loads(measure.stderr[measure.stderr.rfind('{'):measure.stderr.rfind('}')+1])
(OUT/'measurement-final.json').write_text(json.dumps(verified,indent=2)+'\n')
(OUT/'cue-sheet.json').write_text(json.dumps(sorted(CUES,key=lambda x:x['time']),indent=2)+'\n')
print(json.dumps({'master':str(OUT/'master-final.wav'),'duration':57,'rate':SR,'channels':2,
                  'integrated_lufs':verified['input_i'],'true_peak_dbtp':verified['input_tp'],
                  'loudness_range_lu':verified['input_lra']},indent=2))
