const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*+<>?/';

function collectTargets(root) {
  const targets = [];
  for (const node of root.childNodes) {
    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
      targets.push({ node, text: node.textContent });
    } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'BR') {
      for (const inner of node.childNodes) {
        if (inner.nodeType === Node.TEXT_NODE && inner.textContent.trim()) {
          targets.push({ node: inner, text: inner.textContent });
        }
      }
    }
  }
  return targets;
}

function scrambleNode(target, duration) {
  const start = performance.now();
  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const fixed = Math.floor(progress * target.text.length);
    let out = '';
    for (let i = 0; i < target.text.length; i++) {
      out += target.text[i] === ' ' ? ' ' : (i < fixed ? target.text[i] : CHARS[Math.floor(Math.random() * CHARS.length)]);
    }
    target.node.nodeValue = out;
    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      target.node.nodeValue = target.text;
    }
  };
  requestAnimationFrame(tick);
}

export function initScramble(selector = '[data-scramble]') {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const headings = [...document.querySelectorAll(selector)];
  const states = new Map();

  for (const el of headings) {
    states.set(el, { targets: collectTargets(el), playing: false });
  }

  const play = (el) => {
    const state = states.get(el);
    if (!state || state.playing) return;
    state.playing = true;
    for (const t of state.targets) {
      t.node.nodeValue = t.text;
    }
    state.targets.forEach((t, i) => {
      setTimeout(() => scrambleNode(t, 2100 + i * 350), 900 + i * 500);
    });
    const total = 900 + state.targets.length * 500 + 2100 + (state.targets.length - 1) * 350;
    setTimeout(() => { state.playing = false; }, total + 300);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) play(entry.target);
    });
  }, { threshold: 0.5 });

  headings.forEach((el) => observer.observe(el));
}