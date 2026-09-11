const canvas = document.querySelector('#gameCanvas');
const ctx = canvas.getContext('2d');
const gameArea = document.querySelector('#gameArea');
const overlay = document.querySelector('#gameMessage');
const startButton = document.querySelector('#startButton');
const pauseButton = document.querySelector('#pauseButton');
const soundButton = document.querySelector('#soundToggle');
const joystickEl = document.querySelector('#joystick');

let running = false, paused = false, soundOn = true, score = 0, destroyed = 0, lives = 3;
let player = { x: 450, y: 465, width: 60, height: 66 };
let shots = [], enemies = [], particles = [], keys = {}, lastShot = 0, lastSpawn = 0, pointerActive = false;
let bonuses = [], activeBonuses = {};
let joystick = { active:false, pointerId:null, originX:0, originY:0, x:0, y:0 };
const GAME_CONFIG = {
  levels: 12,
  wavesPerLevel: 3,
  enemiesPerWave: 10,
  startingLives: 3,
  maxLives: 5,
  enemySpeedPerLevel: .12,
  spawnIntervalStart: 920,
  spawnIntervalDecreasePerLevel: .06,
  spawnIntervalMinimum: 350,
  playerSpeedStart: 270,
  playerSpeedPerLevel: .03,
  transitionDuration: 2000,
  bossHealthStart: 12,
  bossHealthPerEncounter: 5
};
let level = 1, wave = 1, boss = null, transitionUntil = 0, transitionLabel = '';
const bossTypes = [
  {name:'TARTRE BLINDÉ', color:'#f1bc36', accent:'#ffe28a'},
  {name:'REINE SUCRÉE', color:'#ef628a', accent:'#ff9eb9'},
  {name:'CARIE VOLANTE', color:'#8456d8', accent:'#b28bea'},
  {name:'MÉGAMOLAIRE', color:'#4bbfc8', accent:'#a0f7f1'}
];
const bonusTypes = [{type:'speed',label:'PLUS VITE',color:'#61d9df',chance:.16},{type:'wide',label:'TIR LARGE',color:'#ffd166',chance:.13},{type:'double',label:'DOUBLE TIR',color:'#ff8fab',chance:.09},{type:'triple',label:'TRIPLE TIR',color:'#c9a7ff',chance:.04},{type:'five',label:'CINQ TIRS',color:'#b7a0ff',chance:.02},{type:'life',label:'+1 VIE',color:'#ff5d7b',chance:.025}];

const enemyTypes = [
  { color:'#8456d8', accent:'#b28bea', points:100, speed:34, kind:'carie' },
  { color:'#f1bc36', accent:'#ffe28a', points:200, speed:42, kind:'tartre' },
  { color:'#ef628a', accent:'#ff9eb9', points:300, speed:50, kind:'sucre' }
];

function resizeCanvas() { const r=canvas.getBoundingClientRect(); canvas.width=r.width*devicePixelRatio; canvas.height=r.height*devicePixelRatio; ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0); }
function dimensions(){ return {w:canvas.clientWidth,h:canvas.clientHeight}; }
function movePlayerToPointer(event){ const r=canvas.getBoundingClientRect(), d=dimensions(); player.x=Math.max(34,Math.min(d.w-34,event.clientX-r.left)); player.y=Math.max(42,Math.min(d.h-34,event.clientY-r.top)); }
function updateJoystick(event){ const dx=event.clientX-joystick.originX,dy=event.clientY-joystick.originY,len=Math.hypot(dx,dy)||1,max=48,scale=Math.min(1,max/len); joystick.x=dx*scale;joystick.y=dy*scale;joystickEl.querySelector('span').style.transform=	ranslate(px,px); }

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
function drawBoss(b){ctx.save();ctx.translate(b.x,b.y);ctx.fillStyle=b.color;ctx.strokeStyle=b.accent;ctx.lineWidth=5;ctx.beginPath();ctx.arc(0,0,48,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.fillStyle='#17204c';ctx.beginPath();ctx.arc(-15,-8,6,0,7);ctx.arc(15,-8,6,0,7);ctx.fill();ctx.strokeStyle='#17204c';ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,8,16,0,Math.PI);ctx.stroke();ctx.restore();ctx.fillStyle='#17204c';ctx.fillRect(b.x-70,b.y-68,140,8);ctx.fillStyle='#ff5d7b';ctx.fillRect(b.x-70,b.y-68,140*(b.hp/b.maxHp),8);}
function spawnBoss(){enemies=[];const type=bossTypes[(level-1)%bossTypes.length],encounter=Math.floor((level-1)/4);boss={...type,x:dimensions().w/2,y:105,hp:GAME_CONFIG.bossHealthStart+encounter*GAME_CONFIG.bossHealthPerEncounter,maxHp:GAME_CONFIG.bossHealthStart+encounter*GAME_CONFIG.bossHealthPerEncounter,phase:1,dir:1,lastAttack:performance.now()};transitionLabel=`MINI-BOSS — ${type.name}`;transitionUntil=performance.now()+GAME_CONFIG.transitionDuration;}
function bossAttack(now){if(!boss||now-boss.lastAttack<Math.max(650,1100-boss.phase*120))return;const dx=player.x-boss.x,dy=player.y-boss.y,len=Math.hypot(dx,dy)||1;enemies.push({color:boss.color,accent:boss.accent,points:0,speed:0,kind:'tartre',x:boss.x,y:boss.y+40,vx:dx/len*120,vy:dy/len*120,phase:0,bossShot:true});boss.lastAttack=now;}
function spawnEnemy(){const d=dimensions(),t=enemyTypes[Math.floor(Math.random()*enemyTypes.length)];const levelFactor=1+(level-1)*GAME_CONFIG.enemySpeedPerLevel;enemies.push({...t,speed:t.speed*levelFactor*(.8+Math.random()*.4),x:35+Math.random()*(d.w-70),y:-30,phase:Math.random()*6});}
function shoot(){const now=performance.now();if(now-lastShot<280)return;const angles=activeBonuses.five?[0,-30,30]:activeBonuses.triple?[0,-20,20]:[0];const multiplier=activeBonuses.double?2:1;angles.forEach(angle=>{const rad=angle*Math.PI/180;for(let i=0;i<multiplier;i++){const laneOffset=multiplier===2?(i-.5)*14:0;shots.push({x:player.x+laneOffset,y:player.y-42,vx:Math.sin(rad)*470,vy:-Math.cos(rad)*470,wide:!!activeBonuses.wide});}});lastShot=now;beep(520,.04);}
function maybeSpawnBonus(x,y){let total=0,r=Math.random();for(const b of bonusTypes){total+=b.chance;if(r<total){bonuses.push({...b,x,y,vy:55});break;}}}
function collectBonus(b){bonuses=bonuses.filter(x=>x!==b);if(b.type==='life')lives=Math.min(5,lives+1);else activeBonuses[b.type]=performance.now()+10000;updateHud();}
function beep(freq,duration){if(!soundOn)return;const AudioCtx=window.AudioContext||window.webkitAudioContext;if(!AudioCtx)return;beep.ctx??=new AudioCtx();const o=beep.ctx.createOscillator(),g=beep.ctx.createGain();o.frequency.value=freq;o.type='sine';g.gain.setValueAtTime(.025,beep.ctx.currentTime);g.gain.exponentialRampToValueAtTime(.001,beep.ctx.currentTime+duration);o.connect(g).connect(beep.ctx.destination);o.start();o.stop(beep.ctx.currentTime+duration);}
function update(dt,time){
  const d=dimensions(),now=performance.now();if(now<transitionUntil)return;Object.keys(activeBonuses).forEach(type=>{if(activeBonuses[type]<=now)delete activeBonuses[type];});const levelSpeed=GAME_CONFIG.playerSpeedStart*(1+(level-1)*GAME_CONFIG.playerSpeedPerLevel);const speed=activeBonuses.speed?440:levelSpeed;if(keys.ArrowUp||keys.w)player.y-=speed*dt;if(keys.ArrowDown||keys.s)player.y+=speed*dt;if(keys.ArrowLeft||keys.a)player.x-=speed*dt;if(keys.ArrowRight||keys.d)player.x+=speed*dt;player.x=Math.max(34,Math.min(d.w-34,player.x));player.y=Math.max(42,Math.min(d.h-34,player.y));if(keys[' '])shoot();
  shots.forEach(s=>{s.x+=(s.vx||0)*dt;s.y+=(s.vy||-470)*dt});shots=shots.filter(s=>s.y>-20);
  if(boss){boss.x+=boss.dir*(58+boss.phase*22)*dt;bonuses.forEach(b=>{b.y+=b.vy*dt;if(Math.hypot(b.x-player.x,b.y-player.y)<38)collectBonus(b)});bonuses=bonuses.filter(b=>b.y<d.h+30);if(boss.x<70||boss.x>d.w-70)boss.dir*=-1;bossAttack(now);for(let j=enemies.length-1;j>=0;j--){const shot=enemies[j];if(shot.bossShot){shot.x+=shot.vx*dt;shot.y+=shot.vy*dt;if(Math.hypot(shot.x-player.x,shot.y-player.y)<18){lives--;enemies.splice(j,1);updateHud();if(lives<=0)endGame();}else if(shot.y>d.h+30)enemies.splice(j,1);}}for(let j=shots.length-1;j>=0;j--){if(Math.hypot(boss.x-shots[j].x,boss.y-shots[j].y)<55){boss.hp--;shots.splice(j,1);if(boss.hp<=boss.maxHp*.66)boss.phase=2;if(boss.hp<=boss.maxHp*.33)boss.phase=3;if(boss.hp<=0){score+=1000+(boss.maxHp-GAME_CONFIG.bossHealthStart)*100;boss=null;level++;wave=1;transitionLabel=level>GAME_CONFIG.levels?'MISSION ACCOMPLIE':`NIVEAU ${level}`;transitionUntil=now+GAME_CONFIG.transitionDuration;if(level>GAME_CONFIG.levels)endGame();updateHud();}}}return;}
  const spawnInterval=Math.max(GAME_CONFIG.spawnIntervalMinimum,GAME_CONFIG.spawnIntervalStart*(1-(level-1)*GAME_CONFIG.spawnIntervalDecreasePerLevel));
  if(time-lastSpawn>spawnInterval){spawnEnemy();lastSpawn=time;} enemies.forEach(e=>{e.y+=e.speed*dt;e.phase+=dt*3});bonuses.forEach(b=>{b.y+=b.vy*dt;if(Math.hypot(b.x-player.x,b.y-player.y)<38)collectBonus(b)});bonuses=bonuses.filter(b=>b.y<d.h+30);
  for(let i=enemies.length-1;i>=0;i--){const e=enemies[i];for(let j=shots.length-1;j>=0;j--){const s=shots[j];if(Math.hypot(e.x-s.x,e.y-s.y)<(s.wide?42:29)){score+=e.points;destroyed++;for(let p=0;p<10;p++)particles.push({x:e.x,y:e.y,vx:(Math.random()-.5)*130,vy:(Math.random()-.5)*130,life:1,color:e.color});enemies.splice(i,1);shots.splice(j,1);maybeSpawnBonus(e.x,e.y);beep(760,.08);updateHud();break;}}if(enemies[i]&&enemies[i].y>d.h-35){enemies.splice(i,1);lives--;updateHud();beep(150,.15);if(lives<=0)endGame();}}
  particles.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt*1.8});particles=particles.filter(p=>p.life>0);
  const waveTarget=((level-1)*GAME_CONFIG.wavesPerLevel+wave)*GAME_CONFIG.enemiesPerWave;
  if(destroyed>=waveTarget){
    wave++;
    if(wave>GAME_CONFIG.wavesPerLevel){
      spawnBoss();
    } else {transitionLabel=`VAGUE ${wave}`;transitionUntil=now+GAME_CONFIG.transitionDuration;}
  }
}
function render(){const d=dimensions();ctx.clearRect(0,0,d.w,d.h);for(let x=50;x<d.w;x+=130)drawTooth(x,120+Math.sin(x)*8,.55,'#182458');enemies.forEach(e=>{if(e.bossShot){ctx.fillStyle=boss?.accent||'#ff9eb9';ctx.beginPath();ctx.arc(e.x,e.y,8,0,Math.PI*2);ctx.fill();}else drawEnemy(e);});if(boss)drawBoss(boss);ctx.fillStyle='#62e4e5';shots.forEach(s=>{ctx.beginPath();ctx.roundRect(s.x-(s.wide?7:3),s.y-12,s.wide?14:6,20,4);ctx.fill();});bonuses.forEach(b=>{ctx.fillStyle=b.color;ctx.beginPath();ctx.arc(b.x,b.y,16,0,Math.PI*2);ctx.fill();ctx.fillStyle='#17204c';ctx.font='900 11px sans-serif';ctx.textAlign='center';ctx.fillText(b.type==='life'?'♥':b.type==='speed'?'»':b.type==='wide'?'▰':b.type==='double'?'Ⅱ':b.type==='triple'?'Ⅲ':'Ⅴ',b.x,b.y+4);});particles.forEach(p=>{ctx.globalAlpha=p.life;ctx.fillStyle=p.color;ctx.fillRect(p.x,p.y,4,4)});ctx.globalAlpha=1;drawDentist();if(performance.now()<transitionUntil){ctx.fillStyle='rgba(16,25,71,.82)';ctx.fillRect(0,0,d.w,d.h);ctx.fillStyle='#fff';ctx.font='900 34px sans-serif';ctx.textAlign='center';ctx.fillText(transitionLabel,d.w/2,d.h/2);}}
let previous=performance.now();function loop(time){const dt=Math.min((time-previous)/1000,.035);previous=time;if(running&&!paused)update(dt,time);render();requestAnimationFrame(loop);}
function updateHud(){document.querySelector('#score').textContent=score.toLocaleString('fr-FR');document.querySelector('#lives').textContent='♥ '.repeat(Math.max(0,lives));document.querySelector('#lives').setAttribute('aria-label',`${lives} vies`);document.querySelector('#progressText').textContent=`${destroyed} / ${GAME_CONFIG.levels*GAME_CONFIG.enemiesPerWave}`;document.querySelector('#progressBar').style.width=`${Math.min(destroyed/(GAME_CONFIG.levels*GAME_CONFIG.enemiesPerWave)*100,100)}%`;document.querySelector('#wave').textContent=`${level}.${wave}`;const status=document.querySelector('#bonusStatus');if(status)status.textContent=Object.keys(activeBonuses).length?Object.keys(activeBonuses).map(type=>bonusTypes.find(b=>b.type===type)?.label).join(' + '):'BONUS : —';}
function startGame(){running=true;paused=false;overlay.classList.add('hidden');pauseButton.innerHTML='<span>Ⅱ</span> PAUSE';gameArea.focus();}
function endGame(){running=false;overlay.classList.remove('hidden');overlay.querySelector('h2').textContent='Fin de garde !';overlay.querySelector('p').textContent=`Bravo ! Votre score est de ${score.toLocaleString('fr-FR')} points.`;startButton.innerHTML='REJOUER <span>↻</span>';startButton.onclick=()=>{score=0;destroyed=0;level=1;wave=1;lives=GAME_CONFIG.startingLives;boss=null;enemies=[];shots=[];bonuses=[];activeBonuses={};updateHud();startGame();};}
joystickEl.addEventListener('pointerdown',e=>{e.stopPropagation();joystick.active=true;joystick.pointerId=e.pointerId;joystick.originX=e.clientX;joystick.originY=e.clientY;joystickEl.setPointerCapture(e.pointerId);updateJoystick(e);});
joystickEl.addEventListener('pointermove',e=>{if(joystick.active&&e.pointerId===joystick.pointerId)updateJoystick(e);});
const stopJoystick=()=>{joystick.active=false;joystick.pointerId=null;joystick.x=0;joystick.y=0;joystickEl.querySelector('span').style.transform='translate(0,0)';};
joystickEl.addEventListener('pointerup',stopJoystick);joystickEl.addEventListener('pointercancel',stopJoystick);
gameArea.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button!==0)return;pointerActive=true;gameArea.setPointerCapture?.(e.pointerId);movePlayerToPointer(e);keys[' ']=true;});
gameArea.addEventListener('pointermove',e=>{if(pointerActive)movePlayerToPointer(e);});
const stopPointer=()=>{pointerActive=false;keys[' ']=false;};
gameArea.addEventListener('pointerup',stopPointer);gameArea.addEventListener('pointercancel',stopPointer);gameArea.addEventListener('lostpointercapture',stopPointer);
gameArea.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button!==0)return;pointerActive=true;movePlayerToPointer(e);keys[' ']=true;});
gameArea.addEventListener('pointermove',e=>{if(pointerActive)movePlayerToPointer(e);});
gameArea.addEventListener('pointerup',stopPointer);gameArea.addEventListener('pointercancel',stopPointer);
startButton.addEventListener('click',startGame);pauseButton.addEventListener('click',()=>{if(!running)return;paused=!paused;pauseButton.innerHTML=paused?'<span>▶</span> REPRENDRE':'<span>Ⅱ</span> PAUSE';});soundButton.addEventListener('click',()=>{soundOn=!soundOn;soundButton.setAttribute('aria-pressed',soundOn);soundButton.setAttribute('aria-label',soundOn?'Désactiver le son':'Activer le son');soundButton.querySelector('.sound-waves').style.display=soundOn?'':'none';});
window.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight',' '].includes(e.key))e.preventDefault();keys[e.key]=true;});window.addEventListener('keyup',e=>keys[e.key]=false);window.addEventListener('resize',resizeCanvas);resizeCanvas();render();requestAnimationFrame(loop);
