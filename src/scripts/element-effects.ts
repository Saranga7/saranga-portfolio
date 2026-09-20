import { drawElementImpact } from "./element-impacts";

type Element = "air" | "water" | "earth" | "fire";
type Mark = { element: Element; x: number; y: number; angle: number; born: number; life: number; seed: number; click: boolean; reach: number };

export function startElementEffects(canvas: HTMLCanvasElement) {
  const context = canvas.getContext("2d");
  if (!context) return;
  const ctx = context;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const contrast = matchMedia("(forced-colors: active)");
  const checkbox = document.querySelector<HTMLInputElement>("[data-element-effects]");
  let enabled = true;
  try { enabled = localStorage.getItem("blog-cursor-effects") !== "off"; } catch {}
  let marks: Mark[] = [];
  let frame = 0;
  let last: { x: number; y: number; time: number } | null = null;
  let down: { x: number; y: number; time: number; id: number } | null = null;
  let accent = "#315d50";
  let dark = false;
  const element = (): Element | null => {
    const value = document.documentElement.dataset.blogElement;
    return value === "air" || value === "water" || value === "earth" || value === "fire" ? value : null;
  };
  const active = () => enabled && !reduced.matches && !contrast.matches && !document.hidden && !!element();
  const clear = () => {
    cancelAnimationFrame(frame); frame = 0; marks = []; last = null; down = null;
    ctx.clearRect(0, 0, innerWidth, innerHeight);
  };
  const sync = () => {
    clear();
    dark = document.documentElement.dataset.theme === "dark";
    accent = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim();
    if (checkbox) {
      checkbox.checked = enabled && !reduced.matches && !contrast.matches;
      checkbox.disabled = reduced.matches || contrast.matches;
      checkbox.title = checkbox.disabled ? "Disabled by your accessibility preferences" : "Show elemental cursor and click effects";
    }
  };
  const resize = () => {
    clear();
    const ratio = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(innerWidth * ratio); canvas.height = Math.round(innerHeight * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  };
  const ring = (radius: number, squash = 1) => {
    ctx.beginPath(); ctx.ellipse(0, 0, radius, radius * squash, 0, 0, Math.PI * 2); ctx.stroke();
  };
  function draw(mark: Mark, now: number) {
    const t = (now - mark.born) / mark.life;
    const remaining = 1 - t;
    ctx.save(); ctx.translate(mark.x, mark.y - scrollY);
    ctx.strokeStyle = accent; ctx.fillStyle = accent; ctx.lineWidth = 1.4; ctx.lineCap = "round";
    if (mark.click) {
      drawElementImpact(ctx, mark.element, t, mark.seed, dark, mark.reach);
      ctx.restore(); return;
    }
    ctx.globalAlpha = Math.min(1, remaining * 3) * .38;
    if (mark.element === "water") {
      // Preserve the existing water trail.
      ctx.strokeStyle = dark ? "#9bdff5" : "#237797";
      ctx.globalAlpha *= remaining;
      ring(3 + t * 21, .5); ring(1 + t * 13, .5);
    } else if (mark.element === "air") {
      ctx.rotate(mark.angle);
      ctx.strokeStyle = dark ? "#c8dfd5" : "#687e72";
      ctx.globalAlpha = remaining * .24;
      ctx.lineWidth = .6;
      for (let i = 0; i < 2; i++) {
        const y = i * 5 + Math.sin(mark.seed + t * 3) * 4;
        ctx.beginPath(); ctx.moveTo(-18 - t * 18, y);
        ctx.bezierCurveTo(-8, y - 3, 7, y + 2, 14 + t * 12, y - 2); ctx.stroke();
      }
    } else if (mark.element === "earth") {
      ctx.fillStyle = dark ? "#cbb581" : "#8a7046";
      for (let i = 0; i < 5; i++) {
        const a = i * 2.4 + mark.seed;
        ctx.globalAlpha = remaining * remaining * .28;
        ctx.beginPath(); ctx.ellipse(Math.cos(a) * t * 18, Math.sin(a) * t * 8 + t * t * 16,
          .6 + i % 3, .5 + i % 2, a, 0, Math.PI * 2); ctx.fill();
      }
    } else {
      ctx.rotate(mark.angle);
      const gradient = ctx.createLinearGradient(-28 - t * 20, 0, 3, 0);
      gradient.addColorStop(0, "transparent"); gradient.addColorStop(.7, "#ea6020");
      gradient.addColorStop(1, dark ? "#ffe1a0" : "#bd461b");
      ctx.strokeStyle = gradient; ctx.globalAlpha = remaining * .5;
      ctx.lineWidth = 1.6 * remaining + .3;
      ctx.beginPath(); ctx.moveTo(-28 - t * 20, Math.sin(mark.seed) * 4); ctx.quadraticCurveTo(-10, 0, 2, 0); ctx.stroke();
      ctx.fillStyle = dark ? "#ffdb90" : "#d05a1b";
      ctx.beginPath(); ctx.arc(1, 0, 1.4 * remaining + .2, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }
  function tick(now: number) {
    frame = 0;
    if (!active()) { clear(); return; }
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    marks = marks.filter(mark => now - mark.born < mark.life);
    for (const mark of marks) draw(mark, now);
    if (marks.length) frame = requestAnimationFrame(tick);
  }
  function add(x: number, y: number, angle: number, click: boolean) {
    const selected = element();
    if (!active() || !selected) return;
    if (click && marks.filter(m => m.click).length >= 4) marks.splice(marks.findIndex(m => m.click), 1);
    if (marks.length >= 100) marks.shift();
    marks.push({ element: selected, x, y: y + scrollY, angle, click, born: performance.now(),
      life: click ? { air: 1600, water: 2800, earth: 3000, fire: 2400 }[selected] : 650,
      reach: Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y)),
      seed: Math.random() * Math.PI * 2 });
    if (!frame) frame = requestAnimationFrame(tick);
  }
  const blocked = (target: EventTarget | null) => target instanceof globalThis.Element &&
    !!target.closest("a, button, input, textarea, select, [contenteditable], [role=dialog], [data-element-control]");
  document.addEventListener("pointermove", event => {
    if (!active() || event.pointerType === "touch" || event.buttons || blocked(event.target)) { last = null; return; }
    const now = performance.now();
    if (!last) { last = { x: event.clientX, y: event.clientY, time: now }; return; }
    const dx = event.clientX - last.x, dy = event.clientY - last.y;
    if (now - last.time < 35 || Math.hypot(dx, dy) < 6) return;
    add(event.clientX, event.clientY, Math.atan2(dy, dx), false);
    last = { x: event.clientX, y: event.clientY, time: now };
  }, { passive: true });
  document.addEventListener("pointerdown", event => {
    if (active() && event.isPrimary && event.button === 0 && !blocked(event.target))
      down = { x: event.clientX, y: event.clientY, time: performance.now(), id: event.pointerId };
  }, { passive: true });
  document.addEventListener("pointerup", event => {
    if (down && down.id === event.pointerId && performance.now() - down.time < 500 &&
      Math.hypot(event.clientX - down.x, event.clientY - down.y) < 8 && !blocked(event.target) && !getSelection()?.toString())
      add(event.clientX, event.clientY, 0, true);
    down = null;
  }, { passive: true });
  document.addEventListener("pointercancel", () => { down = null; });
  document.addEventListener("pointerout", event => { if (!event.relatedTarget) last = null; });
  checkbox?.addEventListener("change", () => {
    enabled = checkbox.checked;
    try { localStorage.setItem("blog-cursor-effects", enabled ? "on" : "off"); } catch {}
    sync();
  });
  new MutationObserver(sync).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "data-blog-element"] });
  reduced.addEventListener("change", sync); contrast.addEventListener("change", sync);
  document.addEventListener("visibilitychange", sync);
  window.addEventListener("resize", resize, { passive: true });
  window.addEventListener("pagehide", clear);
  resize(); sync();
}
