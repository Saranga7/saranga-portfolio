type Element = "air" | "water" | "earth" | "fire";
type Point = [number, number];

// Stable noise keeps each impact's geometry intact between animation frames.
function random(seed: number, index: number) {
  const value = Math.sin(seed * 127.1 + index * 311.7) * 43758.5453;
  return value - Math.floor(value);
}
const clamp = (n: number) => Math.max(0, Math.min(1, n));
function puff(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, rgb: string, alpha: number) {
  if (radius < .1 || alpha < .001) return;
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
  gradient.addColorStop(0, `rgba(${rgb},${clamp(alpha)})`);
  gradient.addColorStop(.45, `rgba(${rgb},${clamp(alpha * .45)})`);
  gradient.addColorStop(1, `rgba(${rgb},0)`);
  ctx.fillStyle = gradient; ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
}
function stroke(ctx: CanvasRenderingContext2D, points: Point[], progress: number) {
  const end = clamp(progress) * (points.length - 1);
  ctx.beginPath(); ctx.moveTo(...points[0]);
  for (let i = 1; i < points.length && i - 1 < end; i++) {
    const portion = Math.min(1, end - i + 1);
    ctx.lineTo(points[i - 1][0] + (points[i][0] - points[i - 1][0]) * portion,
      points[i - 1][1] + (points[i][1] - points[i - 1][1]) * portion);
  }
  ctx.stroke();
}

export function drawElementImpact(ctx: CanvasRenderingContext2D, element: Element, t: number, seed: number, dark: boolean, reach: number) {
  const r = (i: number) => random(seed, i);
  const fade = clamp((1 - t) / .25);
  ctx.globalAlpha = 1;
  if (element === "air") {
    // Face-on wind vortex anchored at the click, with no vertical travel.
    const grow = Math.sin(clamp(t / .15) * Math.PI / 2);
    const dissolve = clamp((1 - t) / .3);
    ctx.scale(grow, grow);
    const rotation = t * Math.PI * 5 + seed;
    for (let arm = 0; arm < 3; arm++) {
      const offset = arm * Math.PI * 2 / 3;
      for (let i = 0; i < 60; i++) {
        const h = i / 60, next = (i + 1) / 60;
        const angle = rotation + offset + h * Math.PI * 1.7;
        const nextAngle = rotation + offset + next * Math.PI * 1.7;
        const radius = 5 + h * 38, nextRadius = 5 + next * 38;
        ctx.globalAlpha = dissolve * Math.sin(h * Math.PI) * .48;
        ctx.strokeStyle = dark ? "#d5e9df" : "#638477";
        ctx.lineWidth = .6 + h;
        stroke(ctx, [[Math.cos(angle) * radius, Math.sin(angle) * radius],
          [Math.cos(nextAngle) * nextRadius, Math.sin(nextAngle) * nextRadius]], 1);
      }
      const angle = rotation + offset;
      ctx.globalAlpha = 1;
      puff(ctx, Math.cos(angle) * 24, Math.sin(angle) * 24, 16,
        dark ? "211,230,220" : "102,126,114", dissolve * .07);
    }
    for (let i = 0; i < 14; i++) {
      const angle = rotation + r(i) * Math.PI * 2;
      const radius = 12 + r(i + 20) * 28;
      ctx.globalAlpha = dissolve * .25;
      ctx.fillStyle = dark ? "#dae9de" : "#739082";
      ctx.beginPath(); ctx.ellipse(Math.cos(angle) * radius, Math.sin(angle) * radius,
        1.2, .5, angle + Math.PI / 2, 0, Math.PI * 2); ctx.fill();
    }
  } else if (element === "earth") {
    const growth = clamp(t / .12);
    // Tiny offset highlights give the fissures recessed edges, not line-art spokes.
    for (let i = 0; i < 8; i++) {
      const angle = i * Math.PI / 4 + (r(i) - .5) * .65;
      const length = 24 + r(i + 20) * 64;
      const points: Point[] = [[0, 0]];
      for (let j = 1; j < 6; j++) {
        const distance = length * j / 5;
        const jitter = (r(i * 10 + j + 80) - .5) * 16;
        points.push([Math.cos(angle) * distance - Math.sin(angle) * jitter, Math.sin(angle) * distance + Math.cos(angle) * jitter]);
      }
      ctx.globalAlpha = fade * .7;
      ctx.save(); ctx.translate(1, 1);
      ctx.strokeStyle = dark ? "#a49374" : "#f4e9d3"; ctx.lineWidth = 2.3;
      stroke(ctx, points, growth); ctx.restore();
      ctx.strokeStyle = dark ? "#050706" : "#4b4031"; ctx.lineWidth = .7 + r(i + 40) * 1.5;
      stroke(ctx, points, growth);
      const origin = points[2];
      ctx.lineWidth = .65;
      stroke(ctx, [origin, [origin[0] + Math.cos(angle + .8) * 14, origin[1] + Math.sin(angle + .8) * 14],
        [origin[0] + Math.cos(angle + 1) * 28, origin[1] + Math.sin(angle + 1) * 28]], clamp((t - .04) / .14));
    }
    ctx.globalAlpha = 1;
    for (let i = 0; i < 22; i++) {
      const angle = r(i + 300) * Math.PI * 2, velocity = 20 + r(i + 330) * 70;
      const age = Math.min(t * 3, 1);
      const x = Math.cos(angle) * velocity * age;
      const y = Math.sin(angle) * velocity * age * .65 - Math.sin(age * Math.PI) * 24;
      puff(ctx, x, y, 8 + age * 17, dark ? "158,140,106" : "126,106,76", (1 - age) * .1);
      ctx.globalAlpha = fade * (1 - age * .7) * .7;
      ctx.fillStyle = dark ? "#aa9772" : "#786247";
      ctx.save(); ctx.translate(x, y); ctx.rotate(r(i + 380) * 6 + age * 3);
      const size = 1 + r(i + 410) * 3;
      ctx.beginPath(); ctx.moveTo(-size, 0); ctx.lineTo(0, -size * .7); ctx.lineTo(size, 1); ctx.lineTo(0, size); ctx.fill(); ctx.restore();
      ctx.globalAlpha = 1;
    }
  } else if (element === "water") {
    // Clear-centred waves sweep past even the furthest viewport corner.
    for (let i = 0; i < 3; i++) {
      const delay = i * .075;
      if (t <= delay) continue;
      const progress = clamp((t - delay) / (1 - delay));
      const radius = 2 + Math.pow(progress, .86) * reach * 1.08;
      const alpha = clamp(progress / .035) * (1 - progress ** 3) * (1 - i * .2);
      const circle = (r: number) => {
        ctx.beginPath(); ctx.arc(0, 0, Math.max(.1, r), 0, Math.PI * 2); ctx.stroke();
      };
      ctx.globalAlpha = alpha * .07;
      ctx.strokeStyle = dark ? "#9bddf3" : "#378db1";
      ctx.lineWidth = 12; circle(radius);
      ctx.globalAlpha = alpha * .4;
      ctx.strokeStyle = dark ? "#afdff3" : "#3584a6";
      ctx.lineWidth = 1.5; circle(radius);
      ctx.globalAlpha = alpha * .3;
      ctx.strokeStyle = dark ? "#e0f7ff" : "#effbff";
      ctx.lineWidth = 2; circle(radius - 3);
    }
  } else {
    // Layered soft heat, rising combustion and ballistic embers replace flame icons.
    ctx.save(); ctx.scale(1, .4);
    for (let i = 0; i < 5; i++) puff(ctx, (r(i) - .5) * 24, 12, 17 + r(i + 10) * 16, "40,24,17", fade * .14);
    ctx.restore();
    if (t < .22) {
      const blast = Math.sin(t / .22 * Math.PI);
      puff(ctx, 0, -5, 15 + t * 180, "231,74,16", blast * .48);
      puff(ctx, 0, -5, 7 + t * 70, "255,211,119", blast * .8);
    }
    for (let i = 0; i < 32; i++) {
      const start = r(i + 30) * .52, age = (t - start) / .43;
      if (age < 0 || age > 1) continue;
      const x = (r(i + 70) - .5) * 35 + Math.sin(age * 7 + r(i + 100) * 6) * age * 12;
      const y = 5 - age * (36 + r(i + 140) * 48);
      const alpha = Math.sin(age * Math.PI) * (1 - start) * .5;
      const radius = (6 + r(i + 180) * 10) * (1 - age * .6);
      puff(ctx, x, y, radius * 1.7, "208,61,9", alpha * .55);
      puff(ctx, x, y, radius, age < .45 ? "255,196,86" : "244,99,21", alpha);
    }
    for (let i = 0; i < 15; i++) {
      const age = t * 2, angle = r(i + 230) * Math.PI * 2;
      const velocity = 25 + r(i + 260) * 60;
      const x = Math.cos(angle) * velocity * age;
      const y = Math.sin(angle) * velocity * age - 50 * age + 38 * age * age;
      if (age < 1.3) {
        puff(ctx, x, y, 3, "255,143,48", clamp(1 - age / 1.3) * .8);
        ctx.strokeStyle = dark ? "#ffd894" : "#c95416"; ctx.globalAlpha = clamp(1 - age / 1.3) * .8;
        ctx.lineWidth = .8; stroke(ctx, [[x, y], [x - Math.cos(angle) * 3, y + 3]], 1); ctx.globalAlpha = 1;
      }
    }
    for (let i = 0; i < 6; i++) {
      const age = clamp((t - .2 - i * .04) / .65);
      puff(ctx, (r(i + 310) - .5) * 25 + age * 12, -age * 85, 8 + age * 17,
        dark ? "112,111,105" : "89,82,76", Math.sin(age * Math.PI) * .045);
    }
  }
}
