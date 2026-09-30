/* Mae & Sha. No network, libraries, or build step required. */
(() => {
  'use strict';
  // Replace this one relative path for another MP3, WAV, or OGG file.
  const AMBIENT_AUDIO_PATH = 'assets/Lana Del Rey - Chemtrails Over The Country Club (Official Music Video).mp3';
  document.documentElement.classList.add('js');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const constrained = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
  const chapters = [...document.querySelectorAll('.chapter')];
  const header = document.querySelector('.header');
  const nav = document.querySelector('#navigation');
  const menu = document.querySelector('.menu-toggle');
  const progress = document.querySelector('.reading-progress span');
  let mood = 'ocean';
  let lastScroll = window.scrollY;
  let scrollQueued = false;

  // Content is visible by default if JavaScript is unavailable.
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));
  } else document.querySelectorAll('.reveal').forEach(element => element.classList.add('visible'));

  document.querySelectorAll('.memory-image img').forEach(img => {
    const loaded = () => img.parentElement.classList.add('loaded');
    const missing = () => { img.style.visibility = 'hidden'; img.parentElement.classList.remove('loaded'); };
    img.addEventListener('load', loaded);
    img.addEventListener('error', missing);
    if (img.complete) (img.naturalWidth ? loaded : missing)();
  });

  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('open', open);
  });
  function closeMenu() { menu.setAttribute('aria-expanded', 'false'); nav.classList.remove('open'); }
  nav.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav.classList.contains('open')) { closeMenu(); menu.focus(); }
  });
  document.addEventListener('click', event => { if (!header.contains(event.target)) closeMenu(); });

  function updateScroll() {
    const y = window.scrollY;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleY(${height > 0 ? y / height : 0})`;
    if (Math.abs(y - lastScroll) > 5) {
      header.classList.toggle('hidden', y > lastScroll && y > 180 && !nav.classList.contains('open'));
      lastScroll = y;
    }
    let current = chapters[0];
    chapters.forEach(chapter => { if (chapter.getBoundingClientRect().top < window.innerHeight * .5) current = chapter; });
    mood = current.dataset.mood;
    document.querySelector('#chapter-number').textContent = current.dataset.number;
    document.querySelector('#chapter-name').textContent = current.dataset.name;
    const currentLink = current.id === 'mae-room' ? '#mae'
      : ['wrong', 'mysha', 'sorry'].includes(current.id) ? '#sha' : `#${current.id}`;
    nav.querySelectorAll('a').forEach(link => {
      if (link.getAttribute('href') === currentLink) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    scrollQueued = false;
  }
  window.addEventListener('scroll', () => {
    if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(updateScroll); }
  }, { passive: true });
  updateScroll();

  const cursor = document.querySelector('.cursor');
  let mouseX = 0, mouseY = 0;
  document.addEventListener('pointermove', event => {
    if (!finePointer.matches || reduced.matches) return;
    mouseX = event.clientX / innerWidth - .5;
    mouseY = event.clientY / innerHeight - .5;
    cursor.style.opacity = '1';
    cursor.style.transform = `translate3d(${event.clientX - 14}px,${event.clientY - 14}px,0)`;
    cursor.classList.toggle('active', Boolean(event.target.closest('a,button,summary,.memory-image')));
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', () => { cursor.style.opacity = '0'; });
  document.querySelectorAll('.memory-object').forEach(card => {
    card.addEventListener('pointermove', event => {
      if (!finePointer.matches || reduced.matches) return;
      const rect = card.getBoundingClientRect();
      card.style.transform = `rotateX(${-(event.clientY - rect.top - rect.height / 2) / 40}deg) rotateY(${(event.clientX - rect.left - rect.width / 2) / 35}deg) translateY(-3px)`;
    });
    card.addEventListener('pointerleave', () => { card.style.transform = ''; });
  });
  document.addEventListener('pointerdown', event => {
    if (reduced.matches || event.target.closest('a,button,summary')) return;
    const ripple = document.createElement('span');
    ripple.className = 'ripple'; ripple.setAttribute('aria-hidden', 'true');
    ripple.style.left = `${event.clientX - 10}px`; ripple.style.top = `${event.clientY - 10}px`;
    document.body.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
  });

  // Procedural ocean: bounded line count and resolution, no textures to download.
  const canvas = document.querySelector('#ocean');
  const ctx = canvas.getContext('2d', { alpha: false });
  let width = 0, height = 0, frame = 0, previousTime = 0;
  let storm = 0, warmth = 0, light = .5, moonTexture;
  const stars = Array.from({ length: constrained ? 32 : 62 }, (_, i) => ({
    x: ((i * 7919) % 1000) / 1000, y: ((i * 3571) % 1000) / 1000,
    size: .35 + (i % 4) * .24, phase: i * 2.34
  }));
  function createMoon() {
    moonTexture = document.createElement('canvas'); moonTexture.width = moonTexture.height = 360;
    const m = moonTexture.getContext('2d');
    const gradient = m.createRadialGradient(135, 110, 8, 180, 180, 180);
    gradient.addColorStop(0, '#e2e8e9'); gradient.addColorStop(.7, '#c2d0d5'); gradient.addColorStop(1, '#849aa7');
    m.fillStyle = gradient; m.beginPath(); m.arc(180,180,178,0,Math.PI*2); m.fill();
    m.save(); m.clip();
    for (let i=0;i<100;i++) {
      const x=(i*137.5)%360, y=(i*91.7)%360, r=4+(i*17)%30;
      const crater=m.createRadialGradient(x,y,0,x,y,r);
      crater.addColorStop(0,'rgba(76,97,111,.12)'); crater.addColorStop(1,'rgba(76,97,111,0)');
      m.fillStyle=crater; m.fillRect(x-r,y-r,r*2,r*2);
    }
    m.restore();
  }
  function resize() {
    width = innerWidth; height = innerHeight;
    const scale = Math.min(devicePixelRatio || 1, constrained || width < 650 ? 1 : 1.5);
    canvas.width = Math.round(width * scale); canvas.height = Math.round(height * scale);
    ctx.setTransform(scale,0,0,scale,0,0);
    if (reduced.matches) draw(0);
  }
  function draw(milliseconds) {
    const t = reduced.matches ? 0 : milliseconds * .00022;
    storm += ((mood === 'storm' ? 1 : 0) - storm) * .025;
    warmth += ((mood === 'warm' ? 1 : 0) - warmth) * .025;
    light += ((mood === 'home' || mood === 'hope' ? .85 : .5) - light) * .02;
    const horizon = height * .57;
    const sky = ctx.createLinearGradient(0,0,0,height);
    sky.addColorStop(0,'#040b15'); sky.addColorStop(.49,`rgb(${13+warmth*6},${28+light*9},${44+light*12})`); sky.addColorStop(.58,'#162c3d'); sky.addColorStop(1,'#040c16');
    ctx.fillStyle = sky; ctx.fillRect(0,0,width,height);
    stars.forEach(star => {
      const x=(star.x*width + Math.sin(t*.3+star.phase)*9+width)%width;
      const y=star.y*height*.55;
      ctx.fillStyle=`rgba(194,215,230,${.15+.18*(1+Math.sin(t+star.phase))/2})`;
      ctx.beginPath();ctx.arc(x,y,star.size,0,Math.PI*2);ctx.fill();
    });
    const mx = width * .69 + mouseX * 7;
    const my = height * .24 + Math.sin(t*.2)*4 + mouseY*4;
    const radius = Math.min(width*.11,height*.155);
    const glow=ctx.createRadialGradient(mx,my,radius*.7,mx,my,radius*3.1);
    glow.addColorStop(0,'rgba(152,185,209,.18)');glow.addColorStop(1,'rgba(152,185,209,0)');
    ctx.fillStyle=glow;ctx.fillRect(mx-radius*3.1,my-radius*3.1,radius*6.2,radius*6.2);
    ctx.globalAlpha=.65-storm*.32;ctx.drawImage(moonTexture,mx-radius,my-radius,radius*2,radius*2);ctx.globalAlpha=1;
    // Abandoned silhouettes dissolve into the horizon.
    ctx.fillStyle='#09121cd9';
    for(let i=0;i<13;i++) {
      const x=i*width/12+(i%2)*17, h=13+(i*29)%60;
      if(x>width*.31 && x<width*.78) continue;
      ctx.fillRect(x,horizon-h,12+(i%3)*12,h);
      ctx.fillRect(x+4,horizon-h-14,2,20);
      if(i%3===0){ctx.fillRect(x-13,horizon-h+7,55,3);ctx.fillRect(x+31,horizon-h+7,2,h-7);}
    }
    // Perspective wave bands: distant fine lines to wide foreground swells.
    const rows = constrained || width < 650 ? 72 : 110;
    for(let row=0;row<rows;row++) {
      const depth=row/rows, y=horizon+Math.pow(depth,1.8)*(height-horizon);
      const amplitude=(.4+depth*8)*(1+storm*1.7);
      ctx.beginPath();
      for(let x=0;x<=width+12;x+=12){
        const displacement=Math.sin(x*(.009+depth*.012)+t*(1.7+depth)+row*1.8)*amplitude+Math.sin(x*.031-t*1.5+row)*amplitude*.3;
        if(x===0)ctx.moveTo(x,y+displacement);else ctx.lineTo(x,y+displacement);
      }
      ctx.strokeStyle=`rgba(66,108,138,${.06+depth*.10})`;ctx.lineWidth=.6+depth;ctx.stroke();
      const reflectedX=mx+Math.sin(row*2.1+t*1.5)*(8+depth*34);
      const half=(9+Math.pow(depth,1.25)*width*.12)*(.45+.55*Math.abs(Math.sin(row*3.3+t)));
      const reflection=ctx.createLinearGradient(reflectedX-half,y,reflectedX+half,y);
      reflection.addColorStop(0,'rgba(133,174,201,0)');reflection.addColorStop(.5,`rgba(167,198,218,${(.14+.17*(1-depth))*(1-storm*.55)})`);reflection.addColorStop(1,'rgba(133,174,201,0)');
      ctx.strokeStyle=reflection;ctx.lineWidth=.8+depth*1.5;ctx.beginPath();
      ctx.moveTo(reflectedX-half,y);ctx.quadraticCurveTo(reflectedX,y+Math.sin(row+t)*amplitude,reflectedX+half,y+1);ctx.stroke();
    }
    // Clouds partly obscure the moon in the accountability chapter.
    const cloud=ctx.createLinearGradient(0,my-radius*.2,0,my+radius);
    cloud.addColorStop(0,'rgba(4,11,20,0)');cloud.addColorStop(.5,`rgba(4,11,20,${.14+storm*.65})`);cloud.addColorStop(1,'rgba(4,11,20,0)');
    ctx.fillStyle=cloud;ctx.fillRect(0,my-radius*.2,width,radius*1.2);
    if(mood==='final'){
      [width*.35,width*.64].forEach((x,i)=>{const g=ctx.createRadialGradient(x,horizon-3,0,x,horizon-3,13);g.addColorStop(0,i?'#bfd8eb':'#e1c19a');g.addColorStop(.1,i?'#bfd8eb88':'#e1c19a88');g.addColorStop(1,'transparent');ctx.fillStyle=g;ctx.fillRect(x-13,horizon-16,26,26);});
    }
  }
  function animate(time) {
    if(document.hidden || reduced.matches){frame=0;return;}
    if(time-previousTime> (constrained ? 40 : 30)){draw(time);previousTime=time;}
    frame=requestAnimationFrame(animate);
  }
  function startAnimation(){if(!frame && !reduced.matches && !document.hidden)frame=requestAnimationFrame(animate);}
  if(ctx){createMoon();resize();draw(0);startAnimation();window.addEventListener('resize',resize,{passive:true});
    document.addEventListener('visibilitychange',startAnimation);
    reduced.addEventListener('change',()=>{if(reduced.matches){cancelAnimationFrame(frame);frame=0;draw(0);}else startAnimation();});
  }

  // Real HTML5 audio. Autoplay can be refused; reading never depends on playback.
  const soundButton=document.querySelector('#sound');
  const soundLabel=document.querySelector('#sound-label');
  const soundStatus=document.querySelector('#sound-status');
  const soundtrack = new Audio();
  soundtrack.loop = true;
  soundtrack.volume = .22;
  soundtrack.preload = 'metadata';
  let pending = false;
  let userPaused = false;
  let unavailable = false;
  let retryListening = false;
  const retryEvents = ['pointerdown', 'touchstart', 'click', 'keydown', 'scroll'];

  function showSound(playing, message) {
    soundButton.setAttribute('aria-pressed', String(playing));
    soundButton.setAttribute('aria-label', playing ? 'Pause soundtrack' : 'Play soundtrack');
    soundLabel.textContent = playing ? 'SOUND ON' : 'SOUND OFF';
    if (message) soundStatus.textContent = message;
  }
  function stopRetries() {
    retryEvents.forEach(type => window.removeEventListener(type, retryPlayback, true));
    retryListening = false;
  }
  function allowRetries() {
    if (retryListening || userPaused || unavailable) return;
    retryEvents.forEach(type => window.addEventListener(type, retryPlayback, { capture: true, passive: true }));
    retryListening = true;
  }
  function retryPlayback(event) {
    // The HUD button owns its own click/keyboard action; never fight a manual pause.
    if (event.target instanceof Element && event.target.closest('#sound')) return;
    if (!userPaused && !unavailable) void playSoundtrack();
  }
  async function playSoundtrack() {
    if (pending || unavailable || userPaused) return;
    pending = true;
    try {
      await soundtrack.play();
      if (userPaused) soundtrack.pause();
      // Only the actual playing event turns on the HUD and removes retries.
    } catch (error) {
      showSound(false);
      if (error.name === 'NotAllowedError') {
        soundStatus.textContent = 'Sound is off. Interact with the page or use the sound button to start it.';
        allowRetries();
      } else if (error.name !== 'AbortError') {
        unavailable = true;
        stopRetries();
        soundStatus.textContent = 'The soundtrack could not be loaded. You can continue reading in silence.';
      }
    } finally { pending = false; }
  }
  soundtrack.addEventListener('playing', () => {
    if (userPaused) { soundtrack.pause(); return; }
    stopRetries();
    showSound(true, 'Soundtrack playing.');
  });
  soundtrack.addEventListener('pause', () => showSound(false, 'Soundtrack paused.'));
  soundtrack.addEventListener('waiting', () => showSound(false, 'Soundtrack buffering.'));
  soundtrack.addEventListener('error', () => {
    unavailable = true;
    stopRetries();
    showSound(false, 'The soundtrack could not be loaded. You can continue reading in silence.');
  });
  soundButton.addEventListener('click', () => {
    if (!soundtrack.paused || pending) {
      userPaused = true;
      stopRetries();
      soundtrack.pause();
      showSound(false, 'Soundtrack paused.');
    } else {
      userPaused = false;
      if (unavailable) {
        unavailable = false;
        soundtrack.load();
      }
      void playSoundtrack();
    }
  });
  soundtrack.src = AMBIENT_AUDIO_PATH;
  allowRetries();
  void playSoundtrack();
})();
