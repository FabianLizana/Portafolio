(function(){
'use strict';

/* Scroll reveal con IntersectionObserver · respeta prefers-reduced-motion */
const mq = matchMedia('(prefers-reduced-motion: reduce)');
const supportsIO = 'IntersectionObserver' in window;

function revealAll(){
  document.querySelectorAll('.reveal').forEach(el=>{
    el.classList.add('is-in');
    const d = el.dataset.delay;
    if(d) el.style.transitionDelay = d + 'ms';
  });
}

if(mq.matches || !supportsIO){
  revealAll();
} else {
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        const d = e.target.dataset.delay;
        if(d) e.target.style.transitionDelay = d + 'ms';
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      }
    });
  },{rootMargin:'-8% 0px -12% 0px',threshold:.05});

  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
}

/* Navbar · aria-current según archivo activo */
const path = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav__links a, .mobile-menu a').forEach(a=>{
  const href = a.getAttribute('href');
  if(!href) return;
  if(href === path || (path === '' && href === 'index.html')){
    a.setAttribute('aria-current','page');
  }
});

/* Toggle móvil */
const toggle = document.querySelector('.nav__toggle');
const drawer = document.querySelector('.mobile-menu');
if(toggle && drawer){
  toggle.addEventListener('click', () => {
    const open = drawer.getAttribute('data-open') === 'true';
    drawer.setAttribute('data-open', String(!open));
    toggle.setAttribute('aria-expanded', String(!open));
    document.body.style.overflow = !open ? 'hidden' : '';
  });
  drawer.addEventListener('click', e => {
    if(e.target.tagName === 'A'){
      drawer.setAttribute('data-open','false');
      toggle.setAttribute('aria-expanded','false');
      document.body.style.overflow = '';
    }
  });
}

/* Lottie delivery · el web component se reproduce solo con autoplay.
   Aquí solo esperamos a que esté definido para hidratar el atributo de
   accesibilidad y desconectar el observer; nada más. */
const player = document.querySelector('[data-lottie]');
if(player && 'IntersectionObserver' in window){
  const io = new IntersectionObserver((entries)=>{
    for(const e of entries){
      if(!e.isIntersecting) continue;
      io.disconnect();
      customElements.whenDefined('dotlottie-player').then(()=>{
        const el = player; // ya está, sólo hidratamos a11y
        if(!el.hasAttribute('aria-hidden')) el.setAttribute('aria-hidden','false');
      }).catch(()=>{ /* el navegador ignora el custom element si falla */ });
      break;
    }
  },{rootMargin:'200px'});
  io.observe(player);
}

/* Tabs de la carta · navegación por teclado + ARIA */
const tabsRoot = document.querySelector('[data-tabs]');
if(tabsRoot){
  const tabs = tabsRoot.querySelectorAll('[role="tab"]');
  const panels = tabsRoot.querySelectorAll('[role="tabpanel"]');

  function activate(tab){
    tabs.forEach(t=>{
      const active = t === tab;
      t.setAttribute('aria-selected', String(active));
      t.setAttribute('tabindex', active ? '0' : '-1');
    });
    const targetId = tab.getAttribute('aria-controls');
    panels.forEach(p=>{
      const active = p.id === targetId;
      p.classList.toggle('is-active', active);
      if(active){
        p.removeAttribute('hidden');
        // Reinicia la animación "hoja que se voltea" al activar
        const face = p.querySelector('.leaf__face');
        if(face){
          face.style.animation = 'none';
          // forzar reflow para reiniciar la keyframe
          void face.offsetWidth;
          face.style.animation = '';
        }
      } else {
        p.setAttribute('hidden','');
      }
    });
  }

  tabs.forEach((tab)=>{
    tab.addEventListener('click', ()=>activate(tab));
    tab.addEventListener('keydown', e=>{
      const list = Array.from(tabs);
      let idx = list.indexOf(tab);
      if(e.key === 'ArrowRight'){ idx = (idx+1) % list.length; e.preventDefault(); }
      else if(e.key === 'ArrowLeft'){ idx = (idx-1+list.length) % list.length; e.preventDefault(); }
      else if(e.key === 'Home'){ idx = 0; e.preventDefault(); }
      else if(e.key === 'End'){ idx = list.length-1; e.preventDefault(); }
      else return;
      list[idx].focus();
      activate(list[idx]);
    });
  });
}

/* Sticky CTA en página de carta */
const sticky = document.querySelector('.sticky-cta');
const sentinel = document.querySelector('[data-cta-sentinel]');
if(sticky && sentinel){
  const io = new IntersectionObserver(([e])=>{
    sticky.classList.toggle('is-on', !e.isIntersecting);
  },{threshold:0});
  io.observe(sentinel);
}

/* Cerrado / Hoy en horario */
const today = new Date().getDay();
document.querySelectorAll('.schedule__row[data-today]').forEach(row=>{
  if(Number(row.dataset.today) === today){
    row.classList.add('today');
  }
});

/* Formulario · validación + estados */
const form = document.querySelector('form[data-form]');
if(form){
  const status = form.querySelector('.form__status');
  const submit = form.querySelector('button[type="submit"]');

  function setError(input, msg){
    const field = input.closest('.field');
    if(!field) return;
    field.setAttribute('aria-invalid','true');
    const err = field.querySelector('.err');
    if(err){
      err.textContent = msg;
      const key = input.name || input.id;
      const id = key ? 'err-' + key : 'err-' + Math.random().toString(36).slice(2,7);
      err.id = id;
      input.setAttribute('aria-describedby', id);
    }
  }
  function clearError(input){
    const field = input.closest('.field');
    if(field) field.removeAttribute('aria-invalid');
  }

  function validate(){
    let ok = true;
    const data = {};
    form.querySelectorAll('input[name], textarea[name]').forEach(inp=>{
      const v = inp.value.trim();
      if(inp.required && !v){
        setError(inp, 'Requerido');
        ok = false;
      } else if(inp.type === 'email' && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)){
        setError(inp, 'Email no válido');
        ok = false;
      } else {
        clearError(inp);
      }
      data[inp.name] = v;
    });
    return ok ? data : null;
  }

  form.addEventListener('submit', e=>{
    e.preventDefault();
    const data = validate();
    if(!data){
      status.dataset.state = 'error';
      status.textContent = 'Revisá los campos marcados en rojo.';
      return;
    }
    status.dataset.state = 'loading';
    status.textContent = 'Enviando…';
    submit.setAttribute('aria-disabled','true');

    /* Demo local: simula envío exitoso. Reemplazar por fetch al backend real. */
    setTimeout(()=>{
      status.dataset.state = 'success';
      status.textContent = 'Listo, te respondemos pronto. (+56 9 7337 1304)';
      form.reset();
      submit.removeAttribute('aria-disabled');
    }, 900);
  });

  form.addEventListener('input', e=>{
    if(e.target.matches('input, textarea')) clearError(e.target);
  });
}
})();
