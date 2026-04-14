/**
 * Liquid Glass Displacement Map Generator
 * Generates displacement and specular maps for creating glass refraction effects
 * Based on physical light refraction principles (Snell's Law)
 */

export interface LiquidGlassConfig {
  /** Width of the glass object in pixels */
  width: number;
  /** Height of the glass object in pixels */
  height: number;
  /** Corner radius for rounded rectangles (0 for sharp corners) */
  cornerRadius: number;
  /** Width of the bezel/refraction zone in pixels */
  bezelWidth: number;
  /** Height/thickness of the glass material */
  glassHeight: number;
  /** Refractive index of the material (1.5 for glass, 1.33 for water) */
  refractiveIndex: number;
  /** Smoothness of the surface transition (0.1 to 2) */
  smoothness: number;
  /** Intensity of specular highlights (0 to 1) */
  specularIntensity: number;
  /** Light direction for specular highlights */
  lightDirection?: { x: number; y: number };
  /** Padding around the object for edge effects */
  padding?: number;
}

export interface GeneratorResult {
  /** Canvas containing the displacement map */
  displacementMap: HTMLCanvasElement;
  /** Canvas containing the specular map */
  specularMap: HTMLCanvasElement;
  /** Maximum displacement value in pixels */
  maxDisplacement: number;
  /** Actual canvas dimensions */
  dimensions: {
    width: number;
    height: number;
  };
}

export interface Vector2D {
  x: number;
  y: number;
}

export class LiquidGlassGenerator {
  private config: LiquidGlassConfig;
  private maxDisplacementValue: number = 0;
  private displacementLUT: number[] = [];

  constructor(config: Partial<LiquidGlassConfig> = {}) {
    this.config = this.mergeConfig(config);
  }

  /**
   * Merge user config with defaults
   */
  private mergeConfig(
    userConfig: Partial<LiquidGlassConfig>,
  ): LiquidGlassConfig {
    return {
      width: 250,
      height: 150,
      cornerRadius: 30,
      bezelWidth: 15,
      glassHeight: 20,
      refractiveIndex: 1.5,
      smoothness: 1,
      specularIntensity: 0.4,
      lightDirection: { x: 0.707, y: 0.707 },
      padding: undefined,
      ...userConfig,
    };
  }

  /**
   * Update configuration
   */
  public updateConfig(config: Partial<LiquidGlassConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Generate both displacement and specular maps
   */
  public generate(): GeneratorResult {
    // Auto-calculate padding if not provided
    const padding = this.config.padding ?? this.config.bezelWidth + 20;

    const displacementMap = this.generateDisplacementMap(padding);
    const specularMap = this.generateSpecularMap(padding);

    return {
      displacementMap,
      specularMap,
      maxDisplacement: this.maxDisplacementValue,
      dimensions: {
        width: displacementMap.width,
        height: displacementMap.height,
      },
    };
  }

  /**
   * Convex surface function using smooth step interpolation
   */
  private convexSurface(
    t: number,
    height: number,
    smoothness: number = 1,
  ): number {
    if (t <= 0) return 0;
    if (t >= 1) return height;

    // Use smoothed power function for smoother transition
    const n = 2 + smoothness * 2;
    const value = Math.pow(1 - Math.pow(1 - t, n), 1 / n);
    return height * value;
  }

  /**
   * Calculate signed distance for rounded rectangle
   */
  private sdRoundedBox(
    px: number,
    py: number,
    centerX: number,
    centerY: number,
    width: number,
    height: number,
    radius: number,
  ): number {
    const dx = Math.abs(px - centerX) - width / 2 + radius;
    const dy = Math.abs(py - centerY) - height / 2 + radius;

    return (
      Math.min(Math.max(dx, dy), 0) +
      Math.sqrt(
        Math.max(0, dx) * Math.max(0, dx) + Math.max(0, dy) * Math.max(0, dy),
      ) -
      radius
    );
  }

  /**
   * Calculate gradient (direction to nearest edge point)
   */
  private gradientRoundedBox(
    px: number,
    py: number,
    centerX: number,
    centerY: number,
    width: number,
    height: number,
    radius: number,
  ): Vector2D {
    const eps = 0.5;
    const d0 = this.sdRoundedBox(
      px,
      py,
      centerX,
      centerY,
      width,
      height,
      radius,
    );
    const dx =
      this.sdRoundedBox(px + eps, py, centerX, centerY, width, height, radius) -
      d0;
    const dy =
      this.sdRoundedBox(px, py + eps, centerX, centerY, width, height, radius) -
      d0;

    const len = Math.sqrt(dx * dx + dy * dy);
    if (len < 0.0001) return { x: 0, y: 0 };

    return { x: dx / len, y: dy / len };
  }

  /**
   * Calculate refraction using Snell's Law
   */
  private calculateRefraction(
    incidentAngle: number,
    n1: number,
    n2: number,
  ): number | null {
    const sinTheta1 = Math.sin(incidentAngle);
    const sinTheta2 = (n1 / n2) * sinTheta1;

    if (Math.abs(sinTheta2) > 1) {
      // Total internal reflection
      return null;
    }

    return Math.asin(sinTheta2);
  }

  /**
   * Pre-calculate displacement lookup table
   */
  private precalculateDisplacements(): void {
    const samples = 100;
    this.displacementLUT = [];
    this.maxDisplacementValue = 0;

    for (let i = 0; i <= samples; i++) {
      const t = i / samples;
      const heightAtT = this.convexSurface(
        t,
        this.config.glassHeight,
        this.config.smoothness,
      );

      // Calculate derivative for normal
      const dt = 0.001;
      const h1 = this.convexSurface(
        Math.max(0, t - dt),
        this.config.glassHeight,
        this.config.smoothness,
      );
      const h2 = this.convexSurface(
        Math.min(1, t + dt),
        this.config.glassHeight,
        this.config.smoothness,
      );
      const derivative = (h2 - h1) / (2 * dt);

      // Surface angle (derivative relative to bezel)
      const surfaceAngle = Math.atan(derivative / this.config.bezelWidth);

      // Refraction calculation
      const refractedAngle = this.calculateRefraction(
        surfaceAngle,
        1.0,
        this.config.refractiveIndex,
      );

      let displacement = 0;
      if (refractedAngle !== null) {
        displacement = heightAtT * Math.tan(refractedAngle - surfaceAngle);
      }

      this.displacementLUT[i] = displacement;
      this.maxDisplacementValue = Math.max(
        this.maxDisplacementValue,
        Math.abs(displacement),
      );
    }
  }

  /**
   * Generate displacement map
   */
  private generateDisplacementMap(padding: number): HTMLCanvasElement {
    const canvasWidth = this.config.width + padding * 2;
    const canvasHeight = this.config.height + padding * 2;

    const canvas = document.createElement('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Failed to get canvas 2D context');
    }

    // Precalculate displacement values
    this.precalculateDisplacements();

    const imageData = ctx.createImageData(canvasWidth, canvasHeight, {
      colorSpace: 'srgb',
    });

    ctx.fillStyle = 'rgb(128,128,0)';
    ctx.fill();

    const data = imageData.data;

    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;
    const samples = this.displacementLUT.length - 1;

    // Fill displacement map
    for (let y = 0; y < canvasHeight; y++) {
      for (let x = 0; x < canvasWidth; x++) {
        const distance = -this.sdRoundedBox(
          x,
          y,
          centerX,
          centerY,
          this.config.width,
          this.config.height,
          this.config.cornerRadius,
        );

        const idx = (y * canvasWidth + x) * 4;

        if (distance >= 0) {
          // Inside the object
          const t = Math.min(1, Math.max(0, distance / this.config.bezelWidth));
          const lutIndex = Math.floor(t * samples);
          const displacement = this.displacementLUT[lutIndex] || 0;

          // Get gradient direction (inward)
          const grad = this.gradientRoundedBox(
            x,
            y,
            centerX,
            centerY,
            this.config.width,
            this.config.height,
            this.config.cornerRadius,
          );

          // Normalize displacement
          const normalizedDisplacement =
            displacement / this.maxDisplacementValue;

          // Encode to colors (R for X, G for Y)
          // Displacement direction is opposite to gradient (inward)
          data[idx] = Math.floor(128 - grad.x * normalizedDisplacement * 127);
          data[idx + 1] = Math.floor(
            128 - grad.y * normalizedDisplacement * 127,
          );
          data[idx + 2] = 128;
          data[idx + 3] = 255;
        } else {
          // Outside the object - neutral values
          data[idx] = 128;
          data[idx + 1] = 128;
          data[idx + 2] = 0;
          data[idx + 3] = 255;
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas;
  }

  /**
   * Generate specular map for rim lighting effect
   */
  private generateSpecularMap(padding: number): HTMLCanvasElement {
    const canvasWidth = this.config.width + padding * 2;
    const canvasHeight = this.config.height + padding * 2;

    const canvas = document.createElement('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Failed to get canvas 2D context');
    }

    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;

    const lightDir = this.config.lightDirection || { x: 0.707, y: 0.707 };

    ctx.fillStyle = 'rgba(0, 0, 0, 0)';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Create gradient highlight on edges
    for (let y = 0; y < canvasHeight; y++) {
      for (let x = 0; x < canvasWidth; x++) {
        const distance = -this.sdRoundedBox(
          x,
          y,
          centerX,
          centerY,
          this.config.width,
          this.config.height,
          this.config.cornerRadius,
        );

        if (distance >= 0 && distance <= this.config.bezelWidth) {
          const edgeFactor = 1 - distance / this.config.bezelWidth;

          // Gradient direction (normal at edge)
          const grad = this.gradientRoundedBox(
            x,
            y,
            centerX,
            centerY,
            this.config.width,
            this.config.height,
            this.config.cornerRadius,
          );

          // Dot product with light direction
          const dotProduct = Math.max(
            0,
            -grad.x * lightDir.x - grad.y * lightDir.y,
          );

          // Specular intensity with sharper falloff
          const specular =
            Math.pow(dotProduct, 3) *
            Math.pow(edgeFactor, 1.5) *
            this.config.specularIntensity;

          if (specular > 0.01) {
            ctx.fillStyle = `rgba(255, 255, 255, ${specular})`;
            ctx.fillRect(x, y, 1, 1);
          }
        }
      }
    }

    // Add subtle glow across the bezel
    const gradient = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
    gradient.addColorStop(
      0.5,
      `rgba(255, 255, 255, ${this.config.specularIntensity * 0.1})`,
    );
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = gradient;

    // Mask for bezel area
    for (let y = 0; y < canvasHeight; y += 2) {
      for (let x = 0; x < canvasWidth; x += 2) {
        const distance = -this.sdRoundedBox(
          x,
          y,
          centerX,
          centerY,
          this.config.width,
          this.config.height,
          this.config.cornerRadius,
        );
        if (distance >= 0 && distance <= this.config.bezelWidth) {
          ctx.fillRect(x, y, 2, 2);
        }
      }
    }

    return canvas;
  }

  /**
   * Create SVG filter element for applying the effect
   */
  public createSVGFilter(
    filterId: string,
    displacementScale?: number,
  ): SVGElement {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.display = 'none';

    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const filter = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'filter',
    );

    filter.setAttribute('id', filterId);
    filter.setAttribute('x', '-50%');
    filter.setAttribute('y', '-50%');
    filter.setAttribute('width', '200%');
    filter.setAttribute('height', '200%');
    filter.setAttribute('color-interpolation-filters', 'sRGB');

    // Displacement map image
    const feImageDisplacement = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'feImage',
    );
    feImageDisplacement.setAttribute('id', `${filterId}-displacement`);
    feImageDisplacement.setAttribute('x', '0');
    feImageDisplacement.setAttribute('y', '0');
    feImageDisplacement.setAttribute('width', '100%');
    feImageDisplacement.setAttribute('height', '100%');
    feImageDisplacement.setAttribute('result', 'displacementMap');

    // Displacement map filter
    const feDisplacementMap = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'feDisplacementMap',
    );
    feDisplacementMap.setAttribute('in', 'SourceGraphic');
    feDisplacementMap.setAttribute('in2', 'displacementMap');
    feDisplacementMap.setAttribute(
      'scale',
      String(displacementScale || this.maxDisplacementValue),
    );
    feDisplacementMap.setAttribute('xChannelSelector', 'R');
    feDisplacementMap.setAttribute('yChannelSelector', 'G');
    feDisplacementMap.setAttribute('result', 'displaced');

    // Specular map image
    const feImageSpecular = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'feImage',
    );
    feImageSpecular.setAttribute('id', `${filterId}-specular`);
    feImageSpecular.setAttribute('x', '0');
    feImageSpecular.setAttribute('y', '0');
    feImageSpecular.setAttribute('width', '100%');
    feImageSpecular.setAttribute('height', '100%');
    feImageSpecular.setAttribute('result', 'specularMap');

    // Composite specular over displaced
    const feComposite = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'feComposite',
    );
    feComposite.setAttribute('in', 'specularMap');
    feComposite.setAttribute('in2', 'displaced');
    feComposite.setAttribute('operator', 'over');

    filter.appendChild(feImageDisplacement);
    filter.appendChild(feDisplacementMap);
    filter.appendChild(feImageSpecular);
    filter.appendChild(feComposite);

    defs.appendChild(filter);
    svg.appendChild(defs);

    return svg;
  }

  /**
   * Apply generated maps to an existing SVG filter
   */
  // public applyToSVGFilter(filterId: string, result: GeneratorResult): void {
  //   const displacementImage = document.getElementById(
  //     `${filterId}-displacement`,
  //   ) as SVGFEImageElement;
  //   const specularImage = document.getElementById(
  //     `${filterId}-specular`,
  //   ) as SVGFEImageElement;

  //   if (displacementImage) {
  //     displacementImage.setAttribute(
  //       'href',
  //       result.displacementMap.toDataURL(),
  //     );
  //   }

  //   if (specularImage) {
  //     specularImage.setAttribute('href', result.specularMap.toDataURL());
  //   }
  // }

  /**
   * Export displacement map as data URL
   */
  public static exportAsDataURL(
    canvas: HTMLCanvasElement,
    format: string = 'image/png',
  ): string {
    return canvas.toDataURL(format);
  }

  /**
   * Export displacement map as blob for file download
   */
  public static async exportAsBlob(
    canvas: HTMLCanvasElement,
    format: string = 'image/png',
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create blob from canvas'));
        }
      }, format);
    });
  }

  /**
   * Download canvas as image file
   */
  public static downloadCanvas(
    canvas: HTMLCanvasElement,
    filename: string = 'displacement_map.png',
  ): void {
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL();
    link.click();
  }
}

/**
 * Preset configurations for common use cases
 */
export const LiquidGlassPresets = {
  button: {
    width: 200,
    height: 60,
    cornerRadius: 20,
    bezelWidth: 25,
    glassHeight: 15,
    refractiveIndex: 1.5,
    smoothness: 1,
    specularIntensity: 0.4,
  } as LiquidGlassConfig,

  card: {
    width: 350,
    height: 200,
    cornerRadius: 35,
    bezelWidth: 40,
    glassHeight: 25,
    refractiveIndex: 1.5,
    smoothness: 1.2,
    specularIntensity: 0.35,
  } as LiquidGlassConfig,

  panel: {
    width: 500,
    height: 300,
    cornerRadius: 45,
    bezelWidth: 50,
    glassHeight: 30,
    refractiveIndex: 1.5,
    smoothness: 1.5,
    specularIntensity: 0.3,
  } as LiquidGlassConfig,

  badge: {
    width: 120,
    height: 40,
    cornerRadius: 15,
    bezelWidth: 20,
    glassHeight: 12,
    refractiveIndex: 1.45,
    smoothness: 0.8,
    specularIntensity: 0.5,
  } as LiquidGlassConfig,

  modal: {
    width: 600,
    height: 400,
    cornerRadius: 50,
    bezelWidth: 55,
    glassHeight: 35,
    refractiveIndex: 1.52,
    smoothness: 1.8,
    specularIntensity: 0.25,
  } as LiquidGlassConfig,
};
