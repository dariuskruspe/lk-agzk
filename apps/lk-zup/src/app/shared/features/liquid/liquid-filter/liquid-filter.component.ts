import {
  ChangeDetectionStrategy,
  Component,
  NO_ERRORS_SCHEMA,
  Signal,
  SimpleChanges,
  computed,
  effect,
  input,
  isSignal,
} from '@angular/core';
import { createImageData, type ImageData as CanvasImageData } from 'canvas';

import {
  CONVEX,
  calculateDisplacementMap,
  calculateDisplacementMap2,
} from './dp';

type ValueOrMotion<T> = T | Signal<T> | MotionValueLike<T>;

interface MotionValueLike<T> {
  get(): T;
}

const IMAGE_SCALE = 2;

@Component({
  selector: 'app-liquid-filter',
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  template: `
    <svg colorInterpolationFilters="sRGB" style="display: none">
      <defs>
        <filter [attr.id]="id()">
          @if (hasMagnifyingScale()) {
            <feImage
              [attr.href]="magnifyingDisplacementMapDataUrl()"
              x="0"
              y="0"
              [attr.width]="canvasWidthValue()"
              [attr.height]="canvasHeightValue()"
              result="magnifying_displacement_map"
            ></feImage>

            <feDisplacementMap
              in="SourceGraphic"
              in2="magnifying_displacement_map"
              [attr.scale]="magnifyingScaleValue()"
              xChannelSelector="R"
              yChannelSelector="G"
              result="magnified_source"
            ></feDisplacementMap>
          }
          @if (colorSchemeValue()) {
            <feColorMatrix
              [attr.in]="colorMatrixInput()"
              type="matrix"
              [attr.values]="colorMatrixValues()"
              result="brightened_source"
            ></feColorMatrix>
          }

          <feGaussianBlur
            [attr.in]="gaussianBlurInput()"
            [attr.stdDeviation]="blurValue()"
            result="blurred_source"
          ></feGaussianBlur>

          <feImage
            [attr.href]="displacementMapDataUrl()"
            x="0"
            y="0"
            [attr.width]="canvasWidthValue()"
            [attr.height]="canvasHeightValue()"
            result="displacement_map"
          ></feImage>

          <feDisplacementMap
            in="blurred_source"
            in2="displacement_map"
            [attr.scale]="scale()"
            xChannelSelector="R"
            yChannelSelector="G"
            result="displaced"
          ></feDisplacementMap>

          <feColorMatrix
            in="displaced"
            type="saturate"
            [attr.values]="specularSaturationString()"
            result="displaced_saturated"
          ></feColorMatrix>

          <feImage
            [attr.href]="specularLayerDataUrl()"
            x="0"
            y="0"
            [attr.width]="canvasWidthValue()"
            [attr.height]="canvasHeightValue()"
            result="specular_layer"
          ></feImage>

          <feComposite
            in="displaced_saturated"
            in2="specular_layer"
            operator="in"
            result="specular_saturated"
          ></feComposite>

          <feComponentTransfer in="specular_layer" result="specular_faded">
            <feFuncA
              type="linear"
              [attr.slope]="specularOpacityValue()"
            ></feFuncA>
          </feComponentTransfer>

          <feBlend
            in="specular_saturated"
            in2="displaced"
            mode="normal"
            result="withSaturation"
          ></feBlend>
          <feBlend
            in="specular_faded"
            in2="withSaturation"
            mode="normal"
          ></feBlend>
        </filter>
      </defs>
    </svg>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LiquidFilterComponent {
  readonly id = input.required<string>();
  readonly scaleRatio = input<ValueOrMotion<number> | undefined>(undefined);
  readonly canvasWidth = input<ValueOrMotion<number> | undefined>(undefined);
  readonly canvasHeight = input<ValueOrMotion<number> | undefined>(undefined);
  readonly blur = input.required<ValueOrMotion<number>>();
  readonly width = input.required<ValueOrMotion<number>>();
  readonly height = input.required<ValueOrMotion<number>>();
  readonly radius = input.required<ValueOrMotion<number>>();
  readonly glassThickness = input.required<ValueOrMotion<number>>();
  readonly bezelWidth = input.required<ValueOrMotion<number>>();
  readonly refractiveIndex = input.required<ValueOrMotion<number>>();
  readonly specularOpacity = input.required<ValueOrMotion<number>>();
  readonly specularSaturation = input<ValueOrMotion<number> | undefined>(
    undefined,
  );
  readonly magnifyingScale = input<ValueOrMotion<number> | undefined>(
    undefined,
  );
  readonly colorScheme = input<ValueOrMotion<'light' | 'dark'> | undefined>(
    undefined,
  );
  readonly dpr = input<number | undefined>(undefined);
  readonly bezelHeightFn = input<(x: number) => number>(CONVEX.fn);

  private readonly glassThicknessValue = computed(() =>
    this.requireNumber(this.glassThickness(), 'glassThickness'),
  );
  private readonly bezelWidthValue = computed(() =>
    this.requireNumber(this.bezelWidth(), 'bezelWidth'),
  );
  private readonly refractiveIndexValue = computed(() =>
    this.requireNumber(this.refractiveIndex(), 'refractiveIndex'),
  );
  private readonly widthValue = computed(() =>
    this.requireNumber(this.width(), 'width'),
  );
  private readonly heightValue = computed(() =>
    this.requireNumber(this.height(), 'height'),
  );
  private readonly radiusValue = computed(() =>
    this.requireNumber(this.radius(), 'radius'),
  );
  readonly blurValue = computed(() => this.requireNumber(this.blur(), 'blur'));
  readonly specularOpacityValue = computed(() =>
    this.requireNumber(this.specularOpacity(), 'specularOpacity'),
  );
  private readonly scaleRatioValue = computed(
    () => this.getOptionalNumber(this.scaleRatio()) ?? 1,
  );
  private readonly specularSaturationValue = computed(
    () => this.getOptionalNumber(this.specularSaturation()) ?? 4,
  );
  private readonly clampedRadiusValue = computed(() => {
    const radius = Math.max(this.radiusValue(), 0);
    const width = Math.max(this.widthValue(), 0);
    const height = Math.max(this.heightValue(), 0);
    return Math.min(radius, width / 2, height / 2);
  });
  private readonly clampedBezelWidthValue = computed(() =>
    Math.min(Math.max(this.bezelWidthValue(), 0), this.clampedRadiusValue()),
  );
  readonly magnifyingScaleValue = computed(() =>
    this.getOptionalNumber(this.magnifyingScale()),
  );
  readonly canvasWidthValue = computed(
    () => this.getOptionalNumber(this.canvasWidth()) ?? this.widthValue(),
  );
  readonly canvasHeightValue = computed(
    () => this.getOptionalNumber(this.canvasHeight()) ?? this.heightValue(),
  );
  readonly colorSchemeValue = computed(() =>
    this.getOptionalValue(this.colorScheme()),
  );

  private readonly map = computed(() =>
    calculateDisplacementMap(
      this.glassThicknessValue(),
      this.clampedBezelWidthValue(),
      this.bezelHeightFn(),
      this.refractiveIndexValue(),
    ),
  );

  private readonly maximumDisplacement = computed(() => {
    const map = this.map();
    if (!map.length) {
      return 0;
    }
    const values = map.map((value) => Math.abs(value));
    return Math.max(...values);
  });

  private readonly displacementMap = computed(() =>
    calculateDisplacementMap2(
      this.canvasWidthValue(),
      this.canvasHeightValue(),
      this.widthValue(),
      this.heightValue(),
      this.clampedRadiusValue(),
      this.clampedBezelWidthValue(),
      this.maximumDisplacement() || 0,
      this.map(),
      this.dpr(),
      IMAGE_SCALE,
    ),
  );

  private readonly specularLayer = computed(() =>
    calculateRefractionSpecular(
      this.widthValue(),
      this.heightValue(),
      this.clampedRadiusValue(),
      this.clampedBezelWidthValue(),
      undefined,
      this.dpr(),
      IMAGE_SCALE,
    ),
  );

  private readonly magnifyingDisplacementMap = computed(() => {
    const scale = this.magnifyingScaleValue();
    if (scale === undefined || scale === null || scale === 0) {
      return undefined;
    }
    return calculateMagnifyingDisplacementMap(
      this.canvasWidthValue(),
      this.canvasHeightValue(),
      this.dpr(),
      IMAGE_SCALE,
    );
  });

  readonly magnifyingDisplacementMapDataUrl = computed(() => {
    const data = this.magnifyingDisplacementMap();
    if (!data) {
      return undefined;
    }
    return imageDataToUrl(data);
  });

  readonly displacementMapDataUrl = computed(() =>
    imageDataToUrl(this.displacementMap()),
  );

  readonly specularLayerDataUrl = computed(() =>
    imageDataToUrl(this.specularLayer()),
  );

  readonly scale = computed(
    () => this.maximumDisplacement() * this.scaleRatioValue(),
  );

  readonly hasMagnifyingScale = computed(() => {
    const scale = this.magnifyingScaleValue();
    return !!scale;
  });

  readonly colorMatrixValues = computed(() => {
    const scheme = this.colorSchemeValue();
    if (!scheme) {
      return undefined;
    }
    return scheme === 'dark'
      ? '0.9 0 0 0 -0.3 0 0.9 0 0 -0.3 0 0 0.9 0 -0.3 0 0 0 1 0'
      : '1.03 0 0 0 0.2 0 1.03 0 0 0.2 0 0 1.03 0 0.2 0 0 0 1 0';
  });

  readonly colorMatrixInput = computed(() =>
    this.magnifyingDisplacementMapDataUrl()
      ? 'magnified_source'
      : 'SourceGraphic',
  );

  readonly gaussianBlurInput = computed(() => {
    if (this.colorSchemeValue()) {
      return 'brightened_source';
    }
    return this.magnifyingDisplacementMapDataUrl()
      ? 'magnified_source'
      : 'SourceGraphic';
  });

  readonly specularSaturationString = computed(() =>
    this.specularSaturationValue().toString(),
  );

  private requireNumber(
    value: ValueOrMotion<number> | undefined,
    name: string,
  ): number {
    const resolved = this.getOptionalNumber(value);
    if (resolved === undefined) {
      throw new Error(`${name} is required`);
    }
    return resolved;
  }

  private getOptionalNumber(
    value: ValueOrMotion<number> | undefined,
  ): number | undefined {
    const resolved = this.getOptionalValue(value);
    return resolved === undefined ? undefined : Number(resolved);
  }

  private getOptionalValue<T>(
    value: ValueOrMotion<T> | undefined,
  ): T | undefined {
    if (value === undefined || value === null) {
      return undefined;
    }
    if (isSignal(value)) {
      return value();
    }
    if (isMotionValueLike(value)) {
      return value.get();
    }
    return value as T;
  }
}

function isMotionValueLike<T>(value: unknown): value is MotionValueLike<T> {
  return (
    !!value &&
    typeof value === 'object' &&
    'get' in value &&
    typeof (value as MotionValueLike<T>).get === 'function'
  );
}

function imageDataToUrl(imageData: CanvasImageData): string {
  if (typeof document === 'undefined') {
    throw new Error('`document` is not available to convert ImageData to URL');
  }
  const canvas = document.createElement('canvas');
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }
  ctx.putImageData(imageData as ImageData, 0, 0);
  return canvas.toDataURL();
}

function calculateMagnifyingDisplacementMap(
  canvasWidth: number,
  canvasHeight: number,
  dpr?: number,
  resolutionScale = 1,
) {
  const baseDevicePixelRatio =
    dpr ?? (typeof window !== 'undefined' ? (window.devicePixelRatio ?? 1) : 1);
  const devicePixelRatio = baseDevicePixelRatio * resolutionScale;
  const bufferWidth = canvasWidth * devicePixelRatio;
  const bufferHeight = canvasHeight * devicePixelRatio;
  const imageData = createImageData(bufferWidth, bufferHeight);

  const ratio = Math.max(bufferWidth / 2, bufferHeight / 2);

  for (let y1 = 0; y1 < bufferHeight; y1++) {
    for (let x1 = 0; x1 < bufferWidth; x1++) {
      const idx = (y1 * bufferWidth + x1) * 4;

      const x = x1 - bufferWidth / 2;
      const y = y1 - bufferHeight / 2;

      const rX = x / ratio;
      const rY = y / ratio;

      imageData.data[idx] = 128 - rX * 127;
      imageData.data[idx + 1] = 128 - rY * 127;
      imageData.data[idx + 2] = 0;
      imageData.data[idx + 3] = 255;
    }
  }
  return imageData;
}

function calculateRefractionSpecular(
  objectWidth: number,
  objectHeight: number,
  radius: number,
  bezelWidth: number,
  specularAngle = Math.PI / 3,
  dpr?: number,
  resolutionScale = 1,
) {
  const baseDevicePixelRatio =
    dpr ?? (typeof window !== 'undefined' ? (window.devicePixelRatio ?? 1) : 1);
  const devicePixelRatio = baseDevicePixelRatio * resolutionScale;
  const bufferWidth = objectWidth * devicePixelRatio;
  const bufferHeight = objectHeight * devicePixelRatio;
  const imageData = createImageData(bufferWidth, bufferHeight);

  const halfWidth = Math.max(objectWidth, 0) / 2;
  const halfHeight = Math.max(objectHeight, 0) / 2;
  const maxRadius = Math.min(halfWidth, halfHeight);
  const radiusClamped = Math.min(Math.max(radius, 0), maxRadius);
  const bezelClamped = Math.min(Math.max(bezelWidth, 0), radiusClamped);

  const radius_ = radiusClamped * devicePixelRatio;
  const bezel_ = bezelClamped * devicePixelRatio;

  const specularVector = [Math.cos(specularAngle), Math.sin(specularAngle)];

  const neutral = 0x00000000;
  new Uint32Array(imageData.data.buffer).fill(neutral);

  const radiusSquared = radius_ ** 2;
  const radiusPlusOneSquared = (radius_ + devicePixelRatio) ** 2;
  const innerRadius = Math.max(radius_ - bezel_, 0);
  const radiusMinusBezelSquared = innerRadius * innerRadius;

  const widthBetweenRadiuses = Math.max(bufferWidth - radius_ * 2, 0);
  const heightBetweenRadiuses = Math.max(bufferHeight - radius_ * 2, 0);

  for (let y1 = 0; y1 < bufferHeight; y1++) {
    for (let x1 = 0; x1 < bufferWidth; x1++) {
      const idx = (y1 * bufferWidth + x1) * 4;

      const isOnLeftSide = x1 < radius_;
      const isOnRightSide = x1 >= bufferWidth - radius_;
      const isOnTopSide = y1 < radius_;
      const isOnBottomSide = y1 >= bufferHeight - radius_;

      const x = isOnLeftSide
        ? x1 - radius_
        : isOnRightSide
          ? x1 - radius_ - widthBetweenRadiuses
          : 0;

      const y = isOnTopSide
        ? y1 - radius_
        : isOnBottomSide
          ? y1 - radius_ - heightBetweenRadiuses
          : 0;

      const distanceToCenterSquared = x * x + y * y;

      const isInBezel =
        distanceToCenterSquared <= radiusPlusOneSquared &&
        distanceToCenterSquared >= radiusMinusBezelSquared;

      if (isInBezel) {
        const distanceFromCenter = Math.sqrt(distanceToCenterSquared);
        const distanceFromSide = radius_ - distanceFromCenter;

        const opacity =
          distanceToCenterSquared < radiusSquared
            ? 1
            : 1 -
              (distanceFromCenter - Math.sqrt(radiusSquared)) /
                (Math.sqrt(radiusPlusOneSquared) - Math.sqrt(radiusSquared));

        const cos = distanceFromCenter === 0 ? 0 : x / distanceFromCenter;
        const sin = distanceFromCenter === 0 ? 0 : -y / distanceFromCenter;

        const dotProduct = Math.abs(
          cos * specularVector[0] + sin * specularVector[1],
        );

        const coefficient =
          dotProduct *
          Math.sqrt(1 - (1 - distanceFromSide / (1 * devicePixelRatio)) ** 2);

        const color = 255 * coefficient;
        const finalOpacity = color * coefficient * opacity;

        imageData.data[idx] = color;
        imageData.data[idx + 1] = color;
        imageData.data[idx + 2] = color;
        imageData.data[idx + 3] = finalOpacity;
      }
    }
  }
  return imageData;
}
