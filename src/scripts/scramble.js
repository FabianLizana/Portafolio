const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*+<>?/';

const BASE_DURATION = 2600;
const DURATION_STAGGER = 300;
const BASE_DELAY = 1000;
const DELAY_STAGGER = 400;
const FRAME_INTERVAL = 40;

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

function splitIntoChars(target) {
  const parent = target.node.parentNode;
  if (!parent) return null;

  const styles = getComputedStyle(parent);
  const fontSize = parseFloat(styles.fontSize) || 16;
  const lineHeight = parseFloat(styles.lineHeight) || fontSize * 1.2;

  const range = document.createRange();
  range.selectNodeContents(target.node);
  const textRect = range.getBoundingClientRect();
  const singleLine = textRect.height <= lineHeight * 1.6;

  const measurer = document.createElement('span');
  measurer.setAttribute('aria-hidden', 'true');
  measurer.style.cssText = 'position:absolute;visibility:hidden;white-space:pre;pointer-events:none;';
  parent.insertBefore(measurer, target.node);

  const chars = Array.from(target.text);
  const fragment = document.createDocumentFragment();
  const entries = [];
  const widths = [];

  for (const char of chars) {
    measurer.textContent = char;
    widths.push(measurer.getBoundingClientRect().width);
  }

  const totalWidth = widths.reduce((sum, width) => sum + width, 0);
  const scale = singleLine && totalWidth > 0 ? textRect.width / totalWidth : 1;

  // Cada palabra va en un bloque indivisible y los espacios quedan como
  // texto normal: así el texto solo puede cortar entre palabras, igual
  // que el original, y no a mitad de una.
  let word = null;
  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];

    if (char === ' ') {
      word = null;
      fragment.appendChild(document.createTextNode(' '));
      entries.push(null);
      continue;
    }

    if (!word) {
      word = document.createElement('span');
      word.className = 'scramble-word';
      fragment.appendChild(word);
    }

    const span = document.createElement('span');
    span.className = 'scramble-char';
    span.setAttribute('aria-hidden', 'true');
    span.textContent = char;
    span.style.width = `${((widths[i] * scale) / fontSize).toFixed(4)}em`;
    word.appendChild(span);
    entries.push({ span, char });
  }

  parent.removeChild(measurer);
  parent.replaceChild(fragment, target.node);

  return { entries };
}

function scrambleTarget(target, duration) {
  const start = performance.now();
  let lastFrame = 0;

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const fixed = Math.floor(progress * target.entries.length);

    if (now - lastFrame >= FRAME_INTERVAL || progress >= 1) {
      lastFrame = now;
      for (let i = 0; i < target.entries.length; i++) {
        const entry = target.entries[i];
        if (!entry) continue;
        if (i < fixed) {
          if (entry.span.textContent !== entry.char) entry.span.textContent = entry.char;
        } else {
          entry.span.textContent = CHARS[Math.floor(Math.random() * CHARS.length)];
        }
      }
    }

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      for (const entry of target.entries) {
        if (entry) entry.span.textContent = entry.char;
      }
    }
  };

  requestAnimationFrame(tick);
}

function init(selector) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const headings = [...document.querySelectorAll(selector)];
  if (!headings.length) return;

  const states = new Map();

  for (const el of headings) {
    const targets = collectTargets(el);
    if (!targets.length) continue;

    const label = targets.map((t) => t.text.trim()).join(' ').replace(/\s+/g, ' ');
    el.setAttribute('aria-label', label);

    const prepared = targets.map(splitIntoChars).filter(Boolean);
    states.set(el, { prepared, playing: false });
  }

  const play = (el) => {
    const state = states.get(el);
    if (!state || state.playing || !state.prepared.length) return;
    state.playing = true;

    state.prepared.forEach((target, i) => {
      setTimeout(() => scrambleTarget(target, BASE_DURATION + i * DURATION_STAGGER), BASE_DELAY + i * DELAY_STAGGER);
    });

    const total = BASE_DELAY + state.prepared.length * DELAY_STAGGER + BASE_DURATION + (state.prepared.length - 1) * DURATION_STAGGER;
    setTimeout(() => { state.playing = false; }, total + 400);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) play(entry.target);
    });
  }, { threshold: 0.5 });

  headings.forEach((el) => {
    if (states.has(el)) observer.observe(el);
  });
}

export function initScramble(selector = '[data-scramble]') {
  if (document.fonts?.ready) {
    document.fonts.ready.then(() => init(selector));
  } else {
    init(selector);
  }
}
