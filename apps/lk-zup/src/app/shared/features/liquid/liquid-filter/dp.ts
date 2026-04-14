import { createImageData } from 'canvas';

export type SurfaceFnDef = {
  title: string;
  fn: (x: number) => number;
};

export const CONVEX_CIRCLE: SurfaceFnDef = {
  title: 'Convex Circle',
  fn: (x) => Math.sqrt(1 - (1 - x) ** 2),
};

export const CONVEX: SurfaceFnDef = {
  title: 'Convex Squircle',
  fn: (x) => Math.pow(1 - Math.pow(1 - x, 4), 1 / 4),
};

export const CONCAVE: SurfaceFnDef = {
  title: 'Concave',
  fn: (x) => 1 - CONVEX_CIRCLE.fn(x),
};

export const LIP: SurfaceFnDef = {
  title: 'Lip',
  fn: (x) => {
    const convex = CONVEX.fn(x * 2);
    const concave = CONCAVE.fn(x) + 0.1;
    const smootherstep = 6 * x ** 5 - 15 * x ** 4 + 10 * x ** 3;
    return convex * (1 - smootherstep) + concave * smootherstep;
  },
};

export const fns: SurfaceFnDef[] = [CONVEX, CONCAVE, LIP];

export function calculateDisplacementMap(
  glassThickness: number = 200,
  bezelWidth: number = 50,
  bezelHeightFn: (x: number) => number = (x) => x,
  refractiveIndex: number = 1.5,
  samples: number = 128
): number[] {
  // Pre-calculate the distance the ray will be deviated
  // given the distance to border (ratio of bezel)
  // and height of the glass
  const eta = 1 / refractiveIndex;

  // Simplified refraction, which only handles fully vertical incident ray [0, 1]
  function refract(normalX: number, normalY: number): [number, number] | null {
    const dot = normalY;
    const k = 1 - eta * eta * (1 - dot * dot);
    if (k < 0) {
      // Total internal reflection
      return null;
    }
    const kSqrt = Math.sqrt(k);
    return [-(eta * dot + kSqrt) * normalX, eta - (eta * dot + kSqrt) * normalY];
  }

  return Array.from({ length: samples }, (_, i) => {
    const x = i / samples;
    const y = bezelHeightFn(x);

    // Calculate derivative in x
    const dx = x < 1 ? 0.0001 : -0.0001;
    const y2 = bezelHeightFn(x + dx);
    const derivative = (y2 - y) / dx;
    const magnitude = Math.sqrt(derivative * derivative + 1);
    const normal = [-derivative / magnitude, -1 / magnitude];
    const refracted = refract(normal[0], normal[1]);

    if (!refracted) {
      return 0;
    } else {
      const remainingHeightOnBezel = y * bezelWidth;
      const remainingHeight = remainingHeightOnBezel + glassThickness;

      // Return displacement (rest of travel on x-axis, depends on remaining height to hit bottom of glass)
      return refracted[0] * (remainingHeight / refracted[1]);
    }
  });
}

export function calculateDisplacementMap2(
  canvasWidth: number,
  canvasHeight: number,
  objectWidth: number,
  objectHeight: number,
  radius: number,
  bezelWidth: number,
  maximumDisplacement: number,
  precomputedDisplacementMap: number[] = [],
  dpr?: number,
  resolutionScale = 1
) {
  const baseDevicePixelRatio =
    dpr ?? (typeof window !== 'undefined' ? window.devicePixelRatio ?? 1 : 1);
  const devicePixelRatio = baseDevicePixelRatio * resolutionScale;
  const bufferWidth = canvasWidth * devicePixelRatio;
  const bufferHeight = canvasHeight * devicePixelRatio;
  const imageData = createImageData(bufferWidth, bufferHeight);

  // Fill neutral color using buffer
  const neutral = 0xff008080;
  new Uint32Array(imageData.data.buffer).fill(neutral);

  const halfWidth = Math.max(objectWidth, 0) / 2;
  const halfHeight = Math.max(objectHeight, 0) / 2;
  const maxRadius = Math.min(halfWidth, halfHeight);
  const radiusClamped = Math.min(Math.max(radius, 0), maxRadius);
  const bezelClamped = Math.min(Math.max(bezelWidth, 0), radiusClamped);

  const radius_ = radiusClamped * devicePixelRatio;
  const bezel = bezelClamped * devicePixelRatio;

  const radiusSquared = radius_ ** 2;
  const radiusPlusOneSquared = (radius_ + 1) ** 2;
  const innerRadius = Math.max(radius_ - bezel, 0);
  const radiusMinusBezelSquared = innerRadius * innerRadius;

  const objectWidth_ = objectWidth * devicePixelRatio;
  const objectHeight_ = objectHeight * devicePixelRatio;
  const widthBetweenRadiuses = Math.max(objectWidth_ - radius_ * 2, 0);
  const heightBetweenRadiuses = Math.max(objectHeight_ - radius_ * 2, 0);

  const objectX = (bufferWidth - objectWidth_) / 2;
  const objectY = (bufferHeight - objectHeight_) / 2;

  for (let y1 = 0; y1 < objectHeight_; y1++) {
    for (let x1 = 0; x1 < objectWidth_; x1++) {
      const idx = ((objectY + y1) * bufferWidth + objectX + x1) * 4;

      const isOnLeftSide = x1 < radius_;
      const isOnRightSide = x1 >= objectWidth_ - radius_;
      const isOnTopSide = y1 < radius_;
      const isOnBottomSide = y1 >= objectHeight_ - radius_;

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

      // Only write non-neutral displacements (when isInBezel)
      if (isInBezel) {
        const opacity =
          distanceToCenterSquared < radiusSquared
            ? 1
            : 1 -
              (Math.sqrt(distanceToCenterSquared) - Math.sqrt(radiusSquared)) /
                (Math.sqrt(radiusPlusOneSquared) - Math.sqrt(radiusSquared));

        const distanceFromCenter = Math.sqrt(distanceToCenterSquared);
        const distanceFromSide = radius_ - distanceFromCenter;

        // Viewed from top
        const cos = distanceFromCenter === 0 ? 0 : x / distanceFromCenter;
        const sin = distanceFromCenter === 0 ? 0 : y / distanceFromCenter;

        const cappedDistanceFromSide = Math.min(Math.max(distanceFromSide, 0), bezel);
        const bezelRatio =
          bezel > 0 ? cappedDistanceFromSide / bezel : 0;
        const mapLength = precomputedDisplacementMap.length;
        const bezelIndex =
          mapLength > 0 ? Math.min(mapLength - 1, Math.floor(bezelRatio * mapLength)) : 0;
        const distance = mapLength > 0 ? precomputedDisplacementMap[bezelIndex] ?? 0 : 0;

        const normalizedDistance = maximumDisplacement
          ? distance / maximumDisplacement
          : 0;
        const dX = -cos * normalizedDistance;
        const dY = -sin * normalizedDistance;

        imageData.data[idx] = 128 + dX * 127 * opacity; // R
        imageData.data[idx + 1] = 128 + dY * 127 * opacity; // G
        imageData.data[idx + 2] = 0; // B
        imageData.data[idx + 3] = 255; // A
      }
    }
  }
  return imageData;
}
