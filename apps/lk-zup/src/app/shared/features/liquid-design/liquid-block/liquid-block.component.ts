import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  signal,
  AfterViewInit,
  OnDestroy,
  computed,
  effect,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-liquid-block',
  imports: [],
  templateUrl: './liquid-block.component.html',
  styleUrl: './liquid-block.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LiquidBlockComponent implements AfterViewInit, OnDestroy {
  private el = inject(ElementRef);
  private destroyRef = inject(DestroyRef);
  private observer: ResizeObserver;
  private animationFrameId: number | null = null;
  private updateEffectId: number | null = null;

  // Входные параметры как сигналы (аналог React props)
  px = input<number>(0);
  py = input<number>(0);
  radius = input<number>(16);
  depth = input<number>(0.1);
  blur = input<number>(0.3);
  dispersion = input<number | false>(0.3);

  // Внутренние сигналы
  uid = signal<string>(`liquid-${Math.random().toString(36).substring(2, 11)}`);
  filterId = computed(() => `${this.uid()}_filter`);
  canvasRef = viewChild<ElementRef<HTMLCanvasElement> | null>('canvas');
  feImageRef = viewChild<ElementRef<SVGFEImageElement> | null>('feImage');
  feDisplacementMapRef =
    viewChild<ElementRef<SVGFEDisplacementMapElement> | null>(
      'feDisplacementMap',
    );

  private sizeSubj = new Subject<DOMRectReadOnly>();
  size = toSignal(this.sizeSubj);

  // Константы из React версии
  private readonly distortionIntensity = 0.15;
  private readonly roundness = 0.6;
  private readonly shapeWidth = 0.3;
  private readonly shapeHeight = 0.2;
  private readonly rAF =
    (typeof window !== 'undefined'
      ? window.requestAnimationFrame
      : setTimeout) || ((fn: () => void) => setTimeout(fn, 16));

  // Кеш для displacement данных
  private displacementCache = new Map<
    string,
    { data: Uint8ClampedArray; maxScale: number }
  >();

  constructor() {
    // Эффект для обновления при изменении параметров - только после инициализации
    effect(() => {
      // Проверяем, что компонент инициализирован
      if (
        this.canvasRef() &&
        this.feImageRef() &&
        this.feDisplacementMapRef()
      ) {
        this.scheduleUpdate();
      }
    });
  }

  ngAfterViewInit() {
    this.observer = new ResizeObserver((entries) => {
      this.sizeSubj.next(entries[0].contentRect);
    });
    this.observer.observe(this.el.nativeElement);
    // Первоначальное обновление после инициализации всех элементов
    this.scheduleUpdate();

    // todo: subscribe size change
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.updateEffectId) {
      cancelAnimationFrame(this.updateEffectId);
    }
  }

  private scheduleUpdate() {
    if (this.updateEffectId) {
      cancelAnimationFrame(this.updateEffectId);
    }

    this.updateEffectId = this.rAF(() => {
      this.updateEffect();
    }) as number;
  }

  private updateEffect() {
    const targetEl = this.el.nativeElement;
    const canvas = this.canvasRef()?.nativeElement;
    const feImage = this.feImageRef()?.nativeElement;
    const feDisplacementMap = this.feDisplacementMapRef()?.nativeElement;

    if (!targetEl || !canvas || !feImage || !feDisplacementMap) {
      return;
    }

    const rect = targetEl.getBoundingClientRect();
    const finalWidth = Math.max(1, rect.width + 2 * this.px());
    const finalHeight = Math.max(1, rect.height + 2 * this.py());

    this.el.nativeElement.style.width = `${finalWidth}px`;
    this.el.nativeElement.style.height = `${finalHeight}px`;

    // Рассчитываем тень
    const shadowScale =
      Math.min(Math.max(finalWidth + finalHeight, 100), 800) / 400;
    const blurRadius = Math.round(4 * shadowScale);
    const spreadRadius = Math.round(8 * shadowScale);
    const insetBlur = Math.round(20 * shadowScale);
    const insetOffset = Math.round(-10 * shadowScale);

    this.setHostVariables({
      '--liquid-shadow': `0 ${blurRadius}px ${spreadRadius}px rgba(0, 0, 0, 0.2), 0 ${insetOffset}px ${insetBlur}px inset rgba(0, 0, 0, 0.15)`,
    });

    // Обновляем канвас
    const canvasDPI = 0.75;
    const canvasWidth = Math.max(1, Math.floor(finalWidth * canvasDPI));
    const canvasHeight = Math.max(1, Math.floor(finalHeight * canvasDPI));

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    const context = canvas.getContext('2d');
    if (!context) return;

    try {
      const { data, maxScale } = this.generateDisplacementData(
        canvasWidth,
        canvasHeight,
        this.distortionIntensity,
        this.shapeWidth,
        this.shapeHeight,
        this.depth(),
      );

      if (data.length >= 4 && canvasWidth > 0 && canvasHeight > 0) {
        const imageData = new ImageData(
          new Uint8ClampedArray(data),
          canvasWidth,
          canvasHeight,
        );
        context.putImageData(imageData, 0, 0);

        feImage.setAttribute('href', canvas.toDataURL());
        feImage.setAttribute('width', `${finalWidth}`);
        feImage.setAttribute('height', `${finalHeight}`);

        // Используем фиксированный небольшой масштаб для тонкого эффекта стекла
        // SVG feDisplacementMap работает с нормализованными значениями (0-1)
        const finalScale = Math.abs(this.depth()) * 10; // масштаб для тонкого эффекта
        feDisplacementMap.setAttribute('scale', finalScale.toString());
        feDisplacementMap.parentElement?.setAttribute('width', `${finalWidth}`);
        feDisplacementMap.parentElement?.setAttribute(
          'height',
          `${finalHeight}`,
        );

        this.setHostVariables({
          '--liquid-filter': this.createBackdropFilter(this.uid(), this.blur()),
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  private createBackdropFilter(_uid: string, blur: number): string {
    return `url(#${this.filterId()}) blur(${blur}px) contrast(1.1) brightness(1.05) saturate(1.1)`;
  }

  // Математические утилиты из React версии
  private smoothStep(a: number, b: number, t: number): number {
    t = Math.max(0, Math.min(1, (t - a) / (b - a)));
    return t * t * (3 - 2 * t);
  }

  private length(x: number, y: number): number {
    return Math.sqrt(x * x + y * y);
  }

  private roundedRectSDF(
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
  ): number {
    const absWidth = Math.abs(width);
    const absHeight = Math.abs(height);
    const absRadius = Math.abs(radius);

    const qx = Math.abs(x) - absWidth + absRadius;
    const qy = Math.abs(y) - absHeight + absRadius;
    const distance =
      Math.min(Math.max(qx, qy), 0) +
      this.length(Math.max(qx, 0), Math.max(qy, 0)) -
      absRadius;

    return width < 0 || height < 0 ? -distance : distance;
  }

  private createDisplacementFragment(
    uv: { x: number; y: number },
    intensity = 0.15,
    depth = 0,
  ) {
    const ix = uv.x - 0.5;
    const iy = uv.y - 0.5;

    // Calculate distance to edge using SDF
    const distanceToEdge = this.roundedRectSDF(
      ix,
      iy,
      this.shapeWidth,
      this.shapeHeight,
      this.roundness,
    );
    const displacement = this.smoothStep(0.8, 0, distanceToEdge - intensity);
    const scaled = this.smoothStep(0, 1, displacement);

    // Calculate displacement vector pointing towards center (glass effect)
    const centerX = -ix;
    const centerY = -iy;
    const centerLength = this.length(centerX, centerY);
    
    // Normalize direction vector and apply depth
    const normalizedX = centerLength > 0 ? centerX / centerLength : 0;
    const normalizedY = centerLength > 0 ? centerY / centerLength : 0;
    
    // Apply displacement based on depth and scaled intensity
    const displacementStrength = scaled * depth * intensity * 0.1;
    const dx = normalizedX * displacementStrength;
    const dy = normalizedY * displacementStrength;

    return { x: dx, y: dy };
  }

  private generateDisplacementData(
    width: number,
    height: number,
    intensity = 0.15,
    shapeWidth = 0.3,
    shapeHeight = 0.2,
    depth = 1.0,
  ): { data: Uint8ClampedArray; maxScale: number } {
    const key = `${width}-${height}-${intensity}-${shapeWidth}-${shapeHeight}-${depth}`;

    if (this.displacementCache.has(key)) {
      const cached = this.displacementCache.get(key);
      if (cached) {
        return cached;
      }
    }

    if (
      !width ||
      !height ||
      width <= 0 ||
      height <= 0 ||
      !Number.isFinite(width) ||
      !Number.isFinite(height)
    ) {
      console.warn('Invalid canvas dimensions:', { width, height });
      return { data: new Uint8ClampedArray(4), maxScale: 0 };
    }

    const w = Math.floor(width);
    const h = Math.floor(height);
    const data = new Uint8ClampedArray(w * h * 4);
    const rawValues: number[] = [];

    let maxScale = 0;

    for (let i = 0; i < data.length; i += 4) {
      const x = (i / 4) % w;
      const y = Math.floor(i / 4 / w);
      const uv = { x: x / w, y: y / h };

      const displacement = this.createDisplacementFragment(uv, intensity, depth);
      const dx = displacement.x * w; // уже относительное смещение в пикселях
      const dy = displacement.y * h; // уже относительное смещение в пикселях

      maxScale = Math.max(maxScale, Math.abs(dx), Math.abs(dy));
      rawValues.push(dx, dy);
    }

    // Нормализуем значения для SVG feDisplacementMap (0.5 = нет смещения)
    if (maxScale === 0) maxScale = 1; // избегаем деления на ноль

    let index = 0;
    for (let i = 0; i < data.length; i += 4) {
      // Нормализация в диапазон 0.5 ± displacement для SVG
      const r = Math.max(0, Math.min(1, rawValues[index++] / (maxScale * 2) + 0.5));
      const g = Math.max(0, Math.min(1, rawValues[index++] / (maxScale * 2) + 0.5));
      data[i] = r * 255;
      data[i + 1] = g * 255;
      data[i + 2] = 0;
      data[i + 3] = 255;
    }

    const result = { data, maxScale };

    if (this.displacementCache.size > 10) {
      const firstKey = this.displacementCache.keys().next().value;
      this.displacementCache.delete(firstKey);
    }

    this.displacementCache.set(key, result);
    return result;
  }

  private setHostVariables(variables: Record<string, string>) {
    Object.entries(variables).forEach(([key, value]) => {
      this.el.nativeElement.style.setProperty(key, value);
    });
  }
}
