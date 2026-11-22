(() => {
  const soundButton=document.querySelector('#sound-toggle');
  const menuButton=document.querySelector('.menu-toggle');
  const nav=document.querySelector('.site-header nav');
  const progress=document.querySelector('.scroll-progress');
  const particles=document.querySelector('.pixel-particles');
  let soundOn=false,audioContext=null;

  const sections=document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}
    }),{threshold:.08});
    sections.forEach(section=>observer.observe(section));
  } else sections.forEach(section=>section.classList.add('is-visible'));

  const updateProgress=()=>{
    const max=document.documentElement.scrollHeight-innerHeight;
    if(progress)progress.style.width=(max>0?scrollY/max*100:0)+'%';
  };
  addEventListener('scroll',updateProgress,{passive:true});updateProgress();

  if(particles&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
    for(let i=0;i<16;i++){
      const spark=document.createElement('i');spark.className='pixel-spark';
      spark.style.left=Math.random()*100+'%';spark.style.top=35+Math.random()*65+'%';
      spark.style.setProperty('--duration',5+Math.random()*8+'s');
      spark.style.animationDelay=Math.random()*9+'s';particles.appendChild(spark);
    }
  }

  function playTone(notes,duration=.065){
    if(!soundOn)return;
    try{
      audioContext=audioContext||(new (window.AudioContext||window.webkitAudioContext)());
      if(audioContext.state==='suspended')audioContext.resume();
      const start=audioContext.currentTime;
      notes.forEach((frequency,index)=>{
        const osc=audioContext.createOscillator(),gain=audioContext.createGain(),t=start+index*duration;
        osc.type='square';osc.frequency.setValueAtTime(frequency,t);
        gain.gain.setValueAtTime(.0001,t);
        gain.gain.exponentialRampToValueAtTime(.045,t+.008);
        gain.gain.exponentialRampToValueAtTime(.0001,t+duration);
        osc.connect(gain);gain.connect(audioContext.destination);osc.start(t);osc.stop(t+duration);
      });
    }catch(_){}
  }

  soundButton?.addEventListener('click',()=>{
    soundOn=!soundOn;soundButton.textContent=soundOn?'♫ SOUND ON':'♫ SOUND OFF';
    soundButton.setAttribute('aria-pressed',String(soundOn));
    if(soundOn)playTone([523,659,784,1047],.075);
  });

  document.querySelectorAll('.game-card,.power,.social-grid a').forEach((item,index)=>
    item.addEventListener('pointerenter',()=>playTone([420+(index%5)*75],.045),{passive:true}));
  document.querySelectorAll('a.button,.social-grid a').forEach(link=>
    link.addEventListener('click',()=>playTone([740,980],.055)));

  menuButton?.addEventListener('click',()=>{
    const open=nav.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open));
    playTone(open?[500,700]:[700,500],.05);
  });
  nav?.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{
    nav.classList.remove('open');menuButton?.setAttribute('aria-expanded','false');
  }));
})();
