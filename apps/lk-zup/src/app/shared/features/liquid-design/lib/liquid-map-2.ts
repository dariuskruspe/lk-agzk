// liquidGlassMap.ts
// Генератор displacement map (R=X, G=Y, B=128, A=255) для эффекта "liquid glass"
// Фигура: прямоугольник с закругленными углами, центрированный по карте.
// Рекомендованный scale для <feDisplacementMap> равен result.recommendedScale (px).

export type LiquidProfile = 'circle' | 'squircle' | 'concave' | 'lip';

export interface DisplacementMapParams {
  // Размер карты (в пикселях)
  mapWidth: number;
  mapHeight: number;

  // Размер стеклянного прямоугольника (в пикселях)
  rectWidth: number;
  rectHeight: number;

  // Радиус скругления углов (в пикселях)
  radius: number;

  // Ширина "борта" (зона профиля кривизны от края внутрь), px
  bezel: number;

  // Базовая толщина стекла, px
  thickBase: number;

  // Доп. амплитуда толщины (в центре борта), px
  thickAmp: number;

  // Показатель преломления стекла (обычно ~1.5)
  ior: number;

  // Профиль формы борта
   profile: LiquidProfile;
}

export interface DisplacementMapResult {
  data: Uint8ClampedArray; // RGBA (R→X, G→Y, B=128, A=255)
  width: number;
  height: number;
  // Максимальный вычисленный боковой сдвиг в px — ставьте это число в filter scale
  recommendedScale: number;
}

/** Утилиты */
const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x));
const smootherstep = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

/** Нормированный профиль высоты (u∈[0..1] — от внешнего края внутрь) */
function heightProfile(u: number, type: LiquidProfile): number {
  u = clamp(u, 0, 1);
  const convexCircle = 1 - Math.pow(1 - u, 2); // 1 - (1-u)^2
  const convexSquircle = 1 - Math.pow(1 - u, 4); // 1 - (1-u)^4
  const concave = 1 - convexCircle; // комплементарный

  if (type === 'circle') return convexCircle;
  if (type === 'squircle') return convexSquircle;
  if (type === 'concave') return concave;

  // "lip": плавный переход от convex к concave
  const t = smootherstep(u);
  return convexCircle * (1 - t) + concave * t;
}

/** Производная профиля по u (численно) */
function heightProfileDeriv(u: number, type: LiquidProfile): number {
  const eps = 1e-3;
  return (
    (heightProfile(u + eps, type) - heightProfile(u - eps, type)) / (2 * eps)
  );
}

/** Signed distance до скругленного прямоугольника (центр в (0,0)) */
function sdRoundRect(
  px: number,
  py: number,
  hx: number,
  hy: number,
  r: number,
): number {
  // iq SDF: length(max(abs(p)-b,0))+min(max(q.x,q.y),0)-r
  const ax = Math.abs(px);
  const ay = Math.abs(py);
  const qx = ax - (hx - r);
  const qy = ay - (hy - r);
  const mx = Math.max(qx, 0.0);
  const my = Math.max(qy, 0.0);
  const outside = Math.hypot(mx, my);
  const inside = Math.min(Math.max(qx, qy), 0.0);
  return outside + inside - r;
}

/** Нормаль (градиент) SDF (центр. разности), нормированная */
function gradSDF(
  x: number,
  y: number,
  hx: number,
  hy: number,
  r: number,
): { x: number; y: number } {
  const d1 =
    sdRoundRect(x + 1, y, hx, hy, r) - sdRoundRect(x - 1, y, hx, hy, r);
  const d2 =
    sdRoundRect(x, y + 1, hx, hy, r) - sdRoundRect(x, y - 1, hx, hy, r);
  let gx = d1 * 0.5,
    gy = d2 * 0.5;
  const len = Math.hypot(gx, gy) || 1e-6;
  return { x: gx / len, y: gy / len };
}

/**
 * Главная функция: генерирует displacement-карту под rounded-rect.
 * R=смещение по X, G=смещение по Y, B=128 (нейтраль), A=255.
 * recommendedScale == maxShift (px) — используйте как значение <feDisplacementMap scale>.
 */
export function generateDisplacementMap(
  params: DisplacementMapParams,
): DisplacementMapResult {
  const {
    mapWidth: W,
    mapHeight: H,
    rectWidth,
    rectHeight,
    radius,
    bezel: BEZELin,
    thickBase: T0in,
    thickAmp: HAMPin,
    ior: IORin,
    profile,
  } = params;

  if (W <= 0 || H <= 0) throw new Error('mapWidth/mapHeight must be > 0');
  if (rectWidth <= 0 || rectHeight <= 0)
    throw new Error('rectWidth/rectHeight must be > 0');
  if (BEZELin <= 0) throw new Error('bezel must be > 0');
  if (IORin <= 1.0) throw new Error('ior must be > 1.0');

  const data = new Uint8ClampedArray(W * H * 4);

  // Центр и полуразмеры фигуры
  const cx = W * 0.5,
    cy = H * 0.5;
  const hx = rectWidth * 0.5;
  const hy = rectHeight * 0.5;

  // Клэмпы параметров
  const R = Math.min(
    Math.max(radius, 0),
    Math.min(rectWidth, rectHeight) * 0.5,
  );
  const BEZEL = BEZELin;
  const T0 = Math.max(T0in, 0);
  const HAMP = Math.max(HAMPin, 0);
  const IOR = IORin;

  // Первый проход: считаем направление (внутрь от края) и величину сдвига, ищем максимум
  const mag = new Float32Array(W * H);
  const dirx = new Float32Array(W * H);
  const diry = new Float32Array(W * H);

  let maxShift = 0;

  for (let j = 0; j < H; j++) {
    const yImg = j - cy;
    for (let i = 0; i < W; i++) {
      const idx = j * W + i;
      const xImg = i - cx;

      const d = sdRoundRect(xImg, yImg, hx, hy, R); // signed distance, px

      // Вне фигуры или глубже зоны борта — смещения нет
      if (d > 0 || -d > BEZEL) {
        mag[idx] = 0;
        dirx[idx] = 0;
        diry[idx] = 0;
        continue;
      }

      // distIn: расстояние внутрь от края
      const distIn = -d; // [0..BEZEL]
      const u = clamp(distIn / BEZEL, 0, 1);

      // Профиль высоты и наклон
      const hNorm = heightProfile(u, profile); // [0..1]
      const dhdu = heightProfileDeriv(u, profile); // d/du
      const slope = (dhdu * HAMP) / BEZEL; // dy/dx в px

      // Угол падения к нормали — через арктангенс наклона
      const phi = Math.atan(Math.abs(slope)); // θ1
      const sin2 = Math.sin(phi) / IOR; // закон Снеллиуса
      const theta2 = Math.asin(clamp(sin2, -1, 1));
      const tilt = Math.max(phi - theta2, 0); // отклонение луча от вертикали

      // Локальная толщина стекла
      const thickness = T0 + hNorm * HAMP; // px

      // Боковой сдвиг
      const shift = thickness * Math.tan(tilt); // px

      // Направление сдвига — внутрь перпендикулярно краю (минус нормаль SDF)
      const g = gradSDF(xImg, yImg, hx, hy, R);
      const nx = -g.x,
        ny = -g.y;

      dirx[idx] = nx;
      diry[idx] = ny;
      mag[idx] = shift;

      if (shift > maxShift) maxShift = shift;
    }
  }

  const safeMax = Math.max(maxShift, 1e-6);

  // Второй проход: пишем RGBA (нормируем на safeMax)
  for (let j = 0; j < H; j++) {
    for (let i = 0; i < W; i++) {
      const p = j * W + i;
      const k = p << 2;

      const m = mag[p] / safeMax; // [0..1]
      const rx = dirx[p] * m; // [-1..1]
      const ry = diry[p] * m; // [-1..1]

      data[k + 0] = Math.round(128 + 127 * clamp(rx, -1, 1)); // R: X-shift
      data[k + 1] = Math.round(128 + 127 * clamp(ry, -1, 1)); // G: Y-shift
      data[k + 2] = 128; // B: neutral
      data[k + 3] = 255; // A
    }
  }

  return {
    data,
    width: W,
    height: H,
    recommendedScale: safeMax, // px
  };
}

/* ---------- Необязательные хелперы (для удобной интеграции) ---------- */

/** Вывести карту на канвас (быстро), если вы в браузере */
export function putOnCanvas(
  ctx: CanvasRenderingContext2D,
  result: DisplacementMapResult,
): void {
  const { data, width, height } = result;
  const imgData = new ImageData(data as any, width, height);
  ctx.putImageData(imgData, 0, 0);
}
