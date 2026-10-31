import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const q = (s, r = document) => r.querySelector(s);
const qa = (s, r = document) => [...r.querySelectorAll(s)];
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Prefills the message from the two choices. Runs with or without motion.
const form = q('#brief');
const mail = q('#send-mail');
const wa = q('#send-wa');
const writeBrief = () => {
  const d = new FormData(form);
  const text = `Hi Sattvik, I'm ${d.get('who')} and I need ${d.get('need')}. Can we talk?`;
  mail.href = `${mail.href.split('?')[0]}?subject=${encodeURIComponent('A project for you')}&body=${encodeURIComponent(text)}`;
  wa.href = `${wa.href.split('?')[0]}?text=${encodeURIComponent(text)}`;
};
form.addEventListener('change', writeBrief);
writeBrief();

// "Need an app?" links arrive at the form with that answer already picked.
qa('[data-need]').forEach((a) => a.addEventListener('click', () => {
  const pick = q(`input[data-id="${a.dataset.need}"]`);
  if (pick) pick.checked = true;
  writeBrief();
}));

q('#copy').addEventListener('click', async ({ currentTarget: b }) => {
  const address = q('#address');
  try {
    await navigator.clipboard.writeText(address.textContent);
    b.textContent = 'Copied';
  } catch {
    getSelection().selectAllChildren(address);
    b.textContent = 'Selected, press copy';
  }
});

q('#approve').addEventListener('click', ({ currentTarget: b }) => {
  b.disabled = true;
  b.textContent = 'Refund approved';
  q('#approved').textContent = 'That was you. The agent recommended it, and only a person can spend the money.';
});

// The bar steps aside once the form it points at is on screen.
new IntersectionObserver(([e]) => q('.dock').classList.toggle('away', e.isIntersecting), { threshold: 0.2 }).observe(q('#close'));

// The hero has its own big button, so the small one waits until it's gone.
new IntersectionObserver(([e]) => q('.dock').classList.toggle('at-top', e.isIntersecting), { threshold: 0.5 }).observe(q('#top'));

// A tap fires the flash on its own, so it can't fight the scrubbed flash on the timeline.
q('#shutter').addEventListener('click', () => {
  if (!calm) q('.flash').animate({ opacity: [1, 0] }, { duration: 500, easing: 'ease-out' });
});

// Scrubbed timeline across a sticky stage.
const stage = (trigger, onUpdate) => gsap.timeline({
  defaults: { ease: 'none' },
  scrollTrigger: { trigger, start: 'top top', end: 'bottom bottom', scrub: 0.3, invalidateOnRefresh: true, onUpdate },
});

function smoothScroll() {
  const lenis = new Lenis({ anchors: true, lerp: 0.12 });
  lenis.on('scroll', ScrollTrigger.update);
  const tick = (t) => lenis.raf(t * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  return () => {
    gsap.ticker.remove(tick);
    lenis.destroy();
  };
}

// The camera opens out of the shutter, then the ghost walks onto him as you scroll.
function poseCam() {
  const cues = [['move left', '1/3'], ['step back', '2/3'], ['hold it there', '3/3'], ['got it', '3/3']];
  const text = q('#cue-text');
  const step = q('#cue-step');
  const shutter = q('#shutter');
  gsap.fromTo('.p-pin', { clipPath: 'circle(0% at 50% 84%)' }, {
    clipPath: 'circle(125% at 50% 84%)', ease: 'none',
    scrollTrigger: { trigger: '.p-stage', start: 'top 70%', end: 'top top', scrub: 0.2 },
  });
  let shown = 0;
  [text.textContent, step.textContent] = cues[0];
  stage('.p-stage', ({ progress: p }) => {
    const i = p < 0.34 ? 0 : p < 0.6 ? 1 : p < 0.82 ? 2 : 3;
    if (i !== shown) {
      shown = i;
      [text.textContent, step.textContent] = cues[i];
    }
    shutter.classList.toggle('locked', p > 0.66);
  })
    .fromTo('.ghost', { xPercent: 62, yPercent: 3, scale: 1.2 }, { xPercent: 24, yPercent: 2, scale: 1.2, duration: 0.34 }, 0)
    .to('.ghost', { xPercent: 0, yPercent: 0, scale: 1, duration: 0.3, ease: 'power1.inOut' }, 0.34)
    .to('.flash', { opacity: 1, duration: 0.03 }, 0.8)
    .to('.flash', { opacity: 0, duration: 0.12 }, 0.83)
    .to('.ghost', { opacity: 0, duration: 0.01 }, 0.82)
    .to({}, { duration: 0.05 }, 0.95);
}

// The walls draw themselves, then the drawing hands over to the real home rising out of it.
function planToHome() {
  const count = 72;
  const canvas = q('.t-seq');
  const ctx = canvas.getContext('2d');
  const size = innerWidth < 900 ? 'sm' : 'lg';
  const side = size === 'sm' ? 700 : 1000;
  canvas.width = canvas.height = side;
  const frames = new Array(count);
  let wanted = 0;
  const draw = () => {
    let i = wanted;
    while (i > 0 && !frames[i]) i--;
    if (!frames[i]) return;
    ctx.clearRect(0, 0, side, side);
    ctx.drawImage(frames[i], 0, 0, side, side);
  };
  const load = (i) => new Promise((done) => {
    if (frames[i]) return done();
    const img = new Image();
    img.onload = () => {
      frames[i] = img;
      if (Math.abs(i - wanted) < 3) draw();
      done();
    };
    img.onerror = done;
    img.src = `/seq/${size}/${String(i).padStart(2, '0')}.webp`;
  });
  // Every sixth frame first so the scrub works early, then the gaps, a few at a time.
  const fetchAll = async () => {
    const coarse = [...Array(count).keys()].filter((i) => i % 6 === 0).concat(count - 1);
    const rest = [...Array(count).keys()].filter((i) => !coarse.includes(i));
    await Promise.all(coarse.map(load));
    while (rest.length) await Promise.all(rest.splice(0, 8).map(load));
  };
  const near = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return;
    near.disconnect();
    fetchAll();
  }, { rootMargin: '150% 0px' });
  near.observe(q('.t-stage'));

  const seq = { f: 0 };
  gsap.set('.walls path, .openings path', { strokeDasharray: 1, strokeDashoffset: 1 });
  gsap.set('.labels text, .dims', { autoAlpha: 0 });
  stage('.t-stage')
    .to('.walls path', { strokeDashoffset: 0, duration: 0.2, stagger: 0.004 }, 0)
    .to('.openings path', { strokeDashoffset: 0, duration: 0.06, stagger: 0.002 }, 0.2)
    .to('.labels text', { autoAlpha: 1, duration: 0.04, stagger: 0.006 }, 0.22)
    .to('.dims', { autoAlpha: 1, duration: 0.04 }, 0.26)
    .to('.t-seq', { opacity: 1, duration: 0.06 }, 0.36)
    .to('.plan', { opacity: 0, duration: 0.08 }, 0.4)
    .to(seq, {
      f: count - 1, duration: 0.5, snap: 'f', ease: 'none',
      onUpdate() {
        wanted = seq.f;
        draw();
      },
    }, 0.42)
    .to({}, { duration: 0.08 }, 0.92);
}

// Your scroll is the import: the count fills, stalls green at the cap, and then the truth arrives.
function falseTick() {
  const shown = q('#shown');
  const tally = q('#tally');
  const verdict = q('#verdict');
  const final = verdict.textContent;
  const wrong = 'Nothing errored. Supabase stops at 1,000 rows, and the backup export dropped the rest.';
  const n = { v: 0 };
  const show = () => { shown.textContent = Math.round(n.v).toLocaleString('en-US'); };
  show();
  verdict.textContent = '';
  const rows = q('.sheet-rows');
  stage('.c-stage', ({ progress: p }) => {
    const stalled = p > 0.38 && p < 0.7;
    tally.classList.toggle('wrong', stalled);
    const say = stalled ? wrong : p >= 0.7 ? final : '';
    if (verdict.textContent !== say) verdict.textContent = say;
  })
    .to(n, { v: 1000, duration: 0.36, onUpdate: show }, 0)
    .to(rows, { y: () => -rows.offsetHeight * 0.55, duration: 1 }, 0)
    .to(n, { v: 1913, duration: 0.2, ease: 'power1.out', onUpdate: show }, 0.72)
    .to({}, { duration: 0.08 }, 0.92);
}

// Each line of the call lands as it reaches the middle of the screen.
function callPlays() {
  qa('#call li').forEach((li) => ScrollTrigger.create({
    trigger: li, start: 'top 82%', once: true,
    onEnter: () => li.classList.add('said'),
  }));
}

function linesGone() {
  const el = q('[data-count]');
  const end = +el.dataset.count;
  const n = { v: 0 };
  const show = () => { el.textContent = Math.round(n.v).toLocaleString('en-US'); };
  show();
  gsap.to(n, {
    v: end, ease: 'power1.out', onUpdate: show,
    scrollTrigger: { trigger: el, start: 'top 92%', end: 'top 45%', scrub: 0.3 },
  });
}

// What the page says with the stages off. Put back whenever they switch off, like rotating a phone.
const finals = ['#shown', '#verdict', '[data-count]', '#cue-text', '#cue-step'].map((s) => [q(s), q(s).textContent]);
const stages = '(min-height: 500px) and (prefers-reduced-motion: no-preference)';

gsap.matchMedia().add({
  desk: `(min-width: 900px) and ${stages}`,
  phone: `(max-width: 899px) and ${stages}`,
}, ({ conditions: { desk } }) => {
  poseCam();
  planToHome();
  falseTick();
  callPlays();
  linesGone();
  const stopSmooth = desk && smoothScroll();
  return () => {
    if (stopSmooth) stopSmooth();
    finals.forEach(([el, text]) => { el.textContent = text; });
  };
});
document.fonts.ready.then(() => ScrollTrigger.refresh());

// Rotating swaps the layout and ScrollTrigger's refresh leaves the page at the top, so go back to
// the chapter the reader was in.
// ponytail: fixed delay past ScrollTrigger's 200ms resize debounce. Returns to the chapter's top, not the exact pixel.
let here;
const reading = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) here = e.target; });
}, { rootMargin: '-50% 0px' });
qa('main > *').forEach((el) => reading.observe(el));
matchMedia('(orientation: portrait)').addEventListener('change', () => {
  const chapter = here;
  setTimeout(() => chapter?.scrollIntoView({ behavior: 'instant' }), 400);
});
