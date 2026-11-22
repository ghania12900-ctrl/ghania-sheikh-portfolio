(() => {
  const editButton = document.querySelector('#edit-toggle');
  const soundButton = document.querySelector('#sound-toggle');
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-header nav');
  let editing = false;
  let soundOn = false;
  let audioContext = null;

  // Reveal sections gently as they enter the viewport.
  const sections = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    sections.forEach(section => observer.observe(section));
  } else {
    sections.forEach(section => section.classList.add('is-visible'));
  }

  // Text editing is intentionally local to the current browser session.
  editButton.addEventListener('click', () => {
    editing = !editing;
    document.body.classList.toggle('editing', editing);
    document.querySelectorAll('[data-editable]').forEach(el => {
      el.contentEditable = editing ? 'true' : 'false';
      el.spellcheck = editing;
    });
    editButton.textContent = editing ? '✓ DONE EDITING' : '✎ EDIT TEXT';
    if (editing) document.querySelector('[data-editable]')?.focus();
  });

  function beep(frequency = 560, duration = 0.07) {
    if (!soundOn) return;
    try {
      audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
      if (audioContext.state === 'suspended') audioContext.resume();
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = 'square';
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.035, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + duration);
    } catch (_) { /* Audio is optional; the site works without it. */ }
  }

  soundButton.addEventListener('click', () => {
    soundOn = !soundOn;
    soundButton.textContent = soundOn ? '♫ SOUND ON' : '♫ SOUND OFF';
    soundButton.setAttribute('aria-pressed', String(soundOn));
    if (soundOn) beep(760, 0.12);
  });

  document.querySelectorAll('.game-card, .power, .social-grid a, .button').forEach((item, index) => {
    item.addEventListener('pointerenter', () => beep(420 + (index % 5) * 90, 0.045), { passive: true });
  });

  menuButton.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  }));
})();
