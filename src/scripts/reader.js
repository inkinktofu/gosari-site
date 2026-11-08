import { PageFlip } from 'page-flip';
const root = document.querySelector('.reader');
const stage = document.getElementById('stage');
const src = document.getElementById('source');
const btn = document.getElementById('mode');
const [prevB, nextB, count] = ['pprev', 'pnext', 'count'].map((i) => document.getElementById(i));
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
let pf = null, wasMobile = null;

function paginate(W, H) {
  const box = document.createElement('div');
  box.style.cssText = 'position:absolute;left:-9999px;top:0;visibility:hidden';
  document.body.append(box);
  const pages = [];
  const newPage = () => {
    const p = document.createElement('div'); p.className = 'page';
    p.style.cssText = `width:${W}px;height:${H}px`;
    const i = document.createElement('div'); i.className = 'page-in prose'; p.append(i);
    box.append(p); pages.push(p); return i;
  };
  let cur = newPage();
  [...src.children].forEach((el) => {
    const c = el.cloneNode(true);
    const own = el.classList.contains('essay-head') || el.classList.contains('essay-nav');
    if (own && cur.children.length) cur = newPage();
    cur.append(c);
    if (!own && cur.scrollHeight > cur.clientHeight && cur.children.length > 1) { c.remove(); cur = newPage(); cur.append(c); }
    if (own) cur = newPage();
  });
  if (!pages[pages.length - 1].firstChild.children.length) pages.pop();
  if (pages.length % 2) newPage();
  pages.forEach((p, i) => { const n = document.createElement('span'); n.className = 'pno'; n.textContent = i + 1; p.append(n); });
  return { pages, box };
}

function startBook() {
  const mobile = innerWidth < 760;
  wasMobile = mobile;
  pf?.destroy(); stage.innerHTML = '';
  const W = mobile ? Math.min(innerWidth - 24, 440) : Math.min(500, Math.floor((innerWidth - 48) / 2));
  const H = Math.min(Math.round(W * 1.42), innerHeight - 140);
  const { pages, box } = paginate(W, H);
  pf = new PageFlip(stage, { width: W, height: H, size: 'fixed', showCover: false, usePortrait: mobile, mobileScrollSupport: false, maxShadowOpacity: reduce ? 0 : 0.4, drawShadow: !reduce, flippingTime: reduce ? 1 : 750 });
  pf.loadFromHTML(pages);
  box.remove();
  const upd = () => (count.textContent = `${pf.getCurrentPageIndex() + 1} / ${pf.getPageCount()}`);
  pf.on('flip', upd); upd();
}

function setMode(mode) {
  root.dataset.mode = mode;
  const book = mode === 'book';
  btn.setAttribute('aria-pressed', book);
  btn.textContent = book ? '스크롤로 읽기' : '책장 넘기기로 보기';
  prevB.hidden = nextB.hidden = !book; count.hidden = !book;
  stage.setAttribute('aria-hidden', !book);
  try { localStorage.setItem('mode', mode); } catch {}
  if (book) startBook(); else { pf?.destroy(); pf = null; stage.innerHTML = ''; }
}
btn.addEventListener('click', () => setMode(root.dataset.mode === 'book' ? 'scroll' : 'book'));
prevB.addEventListener('click', () => pf?.flipPrev());
nextB.addEventListener('click', () => pf?.flipNext());
addEventListener('keydown', (e) => { if (!pf) return; if (e.key === 'ArrowRight') pf.flipNext(); if (e.key === 'ArrowLeft') pf.flipPrev(); });
let t; addEventListener('resize', () => { clearTimeout(t); t = setTimeout(() => { if (pf && (innerWidth < 760) !== wasMobile) startBook(); }, 250); });
let saved = null; try { saved = localStorage.getItem('mode'); } catch {}
setMode(saved || (reduce ? 'scroll' : 'book'));
