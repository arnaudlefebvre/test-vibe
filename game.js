const canvas = document.querySelector('#gameCanvas');
const ctx = canvas.getContext('2d');
const gameArea = document.querySelector('#gameArea');
const overlay = document.querySelector('#gameMessage');
const startButton = document.querySelector('#startButton');
const pauseButton = document.querySelector('#pauseButton');
const soundButton = document.querySelector('#soundToggle');
const touchControls = document.querySelector('#touchControls');

let running = false, paused = false, soundOn = true, score = 1250, destroyed = 18, lives = 3;
let player = { x: 450, y: 465, width: 60, height: 66 };
let shots = [], enemies = [], particles = [], keys = {}, lastShot = 0, lastSpawn = 0, pointerActive = false;
let bonuses = [], activeBonuses = {}; 
const bonusTypes = [{type:'speed',label:'PLUS VITE',color:'#61d9df',chance:.16},{type:'wide',label:'TIR LARGE',color:'#ffd166',chance:.13},{type:'double',label:'DOUBLE TIR',color:'#ff8fab',chance:.09},{type:'triple',label:'TRIPLE TIR',color:'#c9a7ff',chance:.04},{type:'five',label:'CINQ TIRS',color:'#b7a0ff',chance:.02},{type:'life',label:'+1 VIE',color:'#ff5d7b',chance:.025}];

const enemyTypes = [
  { color:'#8456d8', accent:'#b28bea', points:100, speed:34, kind:'carie' },
  { color:'#f1bc36', accent:'#ffe28a', points:200, speed:42, kind:'tartre' },
  { color:'#ef628a', accent:'#ff9eb9', points:300, speed:50, kind:'sucre' }
];

function resizeCanvas() { const r=canvas.getBoundingClientRect(); canvas.width=r.width*devicePixelRatio; canvas.height=r.height*devicePixelRatio; ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0); }
function dimensions(){ return {w:canvas.clientWidth,h:canvas.clientHeight}; }
function movePlayerToPointer(event){ const r=canvas.getBoundingClientRect(), d=dimensions(); player.x=Math.max(34,Math.min(d.w-34,event.clientX-r.left)); }

function drawTooth(x,y,s,color='#f9fbff') {
  ctx.save(); ctx.translate(x,y); ctx.scale(s,s); ctx.fillStyle=color; ctx.strokeStyle='#bcecf0'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.moveTo(-16,-18); ctx.bezierCurveTo(-28,-15,-25,3,-20,15); ctx.bezierCurveTo(-15,30,-7,21,0,12); ctx.bezierCurveTo(7,21,15,30,20,15); ctx.bezierCurveTo(25,3,28,-15,16,-18); ctx.bezierCurveTo(8,-21,6,-14,0,-14); ctx.bezierCurveTo(-6,-14,-8,-21,-16,-18); ctx.fill(); ctx.stroke(); ctx.restore();
}
function drawDentist(){
  const {x,y}=player; ctx.save(); ctx.translate(x,y);
  ctx.fillStyle='#d5f7f5'; ctx.beginPath(); ctx.arc(0,-17,24,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#253163';ctx.beginPath();ctx.arc(0,-13,18,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#f1b08c';ctx.beginPath();ctx.arc(0,-10,15,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#fff';ctx.fillRect(-16,7,32,27);ctx.fillStyle='#2c7eea';ctx.fillRect(-5,8,10,23);
  ctx.fillStyle='#17204c';ctx.beginPath();ctx.arc(-5,-12,2,0,7);ctx.arc(5,-12,2,0,7);ctx.fill();
  ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,-7,6,.2,Math.PI-.2);ctx.stroke();
  ctx.fillStyle='#55d7dc';ctx.fillRect(-27,11,13,7);ctx.fillRect(14,11,13,7);ctx.restore();
}
function drawEnemy(e){
  ctx.save();ctx.translate(e.x,e.y);ctx.rotate(Math.sin(e.phase)*.12);ctx.fillStyle=e.color;ctx.strokeStyle=e.accent;ctx.lineWidth=3;
  if(e.kind==='tartre'){ctx.beginPath();ctx.roundRect(-22,-17,44,34,10);ctx.fill();ctx.stroke();}
  else {ctx.beginPath();for(let i=0;i<8;i++){let a=i*Math.PI/4,r=i%2?22:27;let px=Math.cos(a)*r,py=Math.sin(a)*r;(i?ctx.lineTo(px,py):ctx.moveTo(px,py));}ctx.closePath();ctx.fill();ctx.stroke();}
  ctx.fillStyle='#17204c';ctx.beginPath();ctx.arc(-8,-4,3,0,7);ctx.arc(8,-4,3,0,7);ctx.fill();ctx.strokeStyle='#17204c';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-7,9);ctx.quadraticCurveTo(0,3,7,9);ctx.stroke();ctx.restore();
}
function spawnEnemy(){const d=dimensions(),t=enemyTypes[Math.floor(Math.random()*enemyTypes.length)];enemies.push({...t,speed:t.speed*(.8+Math.random()*.4),x:35+Math.random()*(d.w-70),y:-30,phase:Math.random()*6});}
function shoot(){const now=performance.now();if(now-lastShot<280)return;const angles=[0];if(activeBonuses.triple)angles.push(-75,75);if(activeBonuses.five)angles.push(-75,-55,55,75);const multiplier=activeBonuses.double?2:1;angles.forEach(angle=>{for(let i=0;i<multiplier;i++){const rad=angle*Math.PI/180;shots.push({x:player.x,y:player.y-42,vx:Math.sin(rad)*470,vy:-Math.cos(rad)*470,wide:!!activeBonuses.wide});}});lastShot=now;beep(520,.04);}
function maybeSpawnBonus(x,y){let total=0,r=Math.random();for(const b of bonusTypes){total+=b.chance;if(r<total){bonuses.push({...b,x,y,vy:55});break;}}}
function collectBonus(b){bonuses=bonuses.filter(x=>x!==b);if(b.type==='life')lives=Math.min(5,lives+1);else activeBonuses[b.type]=performance.now()+10000;updateHud();}
function beep(freq,duration){if(!soundOn)return;const AudioCtx=window.AudioContext||window.webkitAudioContext;if(!AudioCtx)return;beep.ctx??=new AudioCtx();const o=beep.ctx.createOscillator(),g=beep.ctx.createGain();o.frequency.value=freq;o.type='sine';g.gain.setValueAtTime(.025,beep.ctx.currentTime);g.gain.exponentialRampToValueAtTime(.001,beep.ctx.currentTime+duration);o.connect(g).connect(beep.ctx.destination);o.start();o.stop(beep.ctx.currentTime+duration);}
function update(dt,time){
  const d=dimensions(),now=performance.now();Object.keys(activeBonuses).forEach(type=>{if(activeBonuses[type]<=now)delete activeBonuses[type];});const speed=activeBonuses.speed?440:270;if(keys.ArrowLeft||keys.a)player.x-=speed*dt;if(keys.ArrowRight||keys.d)player.x+=speed*dt;player.x=Math.max(34,Math.min(d.w-34,player.x));if(keys[' '])shoot();
  if(time-lastSpawn>920){spawnEnemy();lastSpawn=time;} shots.forEach(s=>{s.x+=(s.vx||0)*dt;s.y+=(s.vy||-470)*dt});enemies.forEach(e=>{e.y+=e.speed*(1+Math.min(0.32,Math.floor(destroyed/10)*.08))*dt;e.phase+=dt*3});bonuses.forEach(b=>{b.y+=b.vy*dt;if(Math.hypot(b.x-player.x,b.y-player.y)<38)collectBonus(b)});bonuses=bonuses.filter(b=>b.y<d.h+30);
  for(let i=enemies.length-1;i>=0;i--){const e=enemies[i];for(let j=shots.length-1;j>=0;j--){const s=shots[j];if(Math.hypot(e.x-s.x,e.y-s.y)<(s.wide?42:29)){score+=e.points;destroyed++;for(let p=0;p<10;p++)particles.push({x:e.x,y:e.y,vx:(Math.random()-.5)*130,vy:(Math.random()-.5)*130,life:1,color:e.color});enemies.splice(i,1);shots.splice(j,1);maybeSpawnBonus(e.x,e.y);beep(760,.08);updateHud();break;}}if(enemies[i]&&enemies[i].y>d.h-35){enemies.splice(i,1);lives--;updateHud();beep(150,.15);if(lives<=0)endGame();}}
  shots=shots.filter(s=>s.y>-20);particles.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt*1.8});particles=particles.filter(p=>p.life>0);
}
function render(){const d=dimensions();ctx.clearRect(0,0,d.w,d.h);for(let x=50;x<d.w;x+=130)drawTooth(x,120+Math.sin(x)*8,.55,'#182458');enemies.forEach(drawEnemy);ctx.fillStyle='#62e4e5';shots.forEach(s=>{ctx.beginPath();ctx.roundRect(s.x-(s.wide?7:3),s.y-12,s.wide?14:6,20,4);ctx.fill();});bonuses.forEach(b=>{ctx.fillStyle=b.color;ctx.beginPath();ctx.arc(b.x,b.y,16,0,Math.PI*2);ctx.fill();ctx.fillStyle='#17204c';ctx.font='900 11px sans-serif';ctx.textAlign='center';ctx.fillText(b.type==='life'?'♥':b.type==='speed'?'»':b.type==='wide'?'▰':b.type==='double'?'Ⅱ':b.type==='triple'?'Ⅲ':'Ⅴ',b.x,b.y+4);});particles.forEach(p=>{ctx.globalAlpha=p.life;ctx.fillStyle=p.color;ctx.fillRect(p.x,p.y,4,4)});ctx.globalAlpha=1;drawDentist();}
let previous=performance.now();function loop(time){const dt=Math.min((time-previous)/1000,.035);previous=time;if(running&&!paused)update(dt,time);render();requestAnimationFrame(loop);}
function updateHud(){document.querySelector('#score').textContent=score.toLocaleString('fr-FR');document.querySelector('#lives').textContent='♥ '.repeat(Math.max(0,lives));document.querySelector('#lives').setAttribute('aria-label',`${lives} vies`);document.querySelector('#progressText').textContent=`${Math.min(destroyed,30)} / 30`;document.querySelector('#progressBar').style.width=`${Math.min(destroyed/30*100,100)}%`;document.querySelector('#wave').textContent=Math.min(5,Math.floor((destroyed-1)/10)+1);const status=document.querySelector('#bonusStatus');if(status)status.textContent=Object.keys(activeBonuses).length?Object.keys(activeBonuses).map(type=>bonusTypes.find(b=>b.type===type)?.label).join(' + '):'BONUS : —';}
function startGame(){running=true;paused=false;overlay.classList.add('hidden');pauseButton.innerHTML='<span>Ⅱ</span> PAUSE';gameArea.focus();}
function endGame(){running=false;overlay.classList.remove('hidden');overlay.querySelector('h2').textContent='Fin de garde !';overlay.querySelector('p').textContent=`Bravo ! Votre score est de ${score.toLocaleString('fr-FR')} points.`;startButton.innerHTML='REJOUER <span>↻</span>';startButton.onclick=()=>{score=0;destroyed=0;lives=3;enemies=[];shots=[];bonuses=[];activeBonuses={};updateHud();startGame();};}
touchControls.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button!==0)return;pointerActive=true;gameArea.setPointerCapture?.(e.pointerId);movePlayerToPointer(e);keys[' ']=true;});
touchControls.addEventListener('pointermove',e=>{if(pointerActive)movePlayerToPointer(e);});
const stopPointer=()=>{pointerActive=false;keys[' ']=false;};
touchControls.addEventListener('pointerup',stopPointer);touchControls.addEventListener('pointercancel',stopPointer);touchControls.addEventListener('lostpointercapture',stopPointer);
gameArea.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button!==0)return;pointerActive=true;movePlayerToPointer(e);keys[' ']=true;});
gameArea.addEventListener('pointermove',e=>{if(pointerActive)movePlayerToPointer(e);});
gameArea.addEventListener('pointerup',stopPointer);gameArea.addEventListener('pointercancel',stopPointer);
startButton.addEventListener('click',startGame);pauseButton.addEventListener('click',()=>{if(!running)return;paused=!paused;pauseButton.innerHTML=paused?'<span>▶</span> REPRENDRE':'<span>Ⅱ</span> PAUSE';});soundButton.addEventListener('click',()=>{soundOn=!soundOn;soundButton.setAttribute('aria-pressed',soundOn);soundButton.setAttribute('aria-label',soundOn?'Désactiver le son':'Activer le son');soundButton.querySelector('.sound-waves').style.display=soundOn?'':'none';});
window.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight',' '].includes(e.key))e.preventDefault();keys[e.key]=true;});window.addEventListener('keyup',e=>keys[e.key]=false);window.addEventListener('resize',resizeCanvas);resizeCanvas();render();requestAnimationFrame(loop);
