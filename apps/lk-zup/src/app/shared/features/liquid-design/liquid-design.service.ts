import { Injectable, signal } from '@angular/core';

export interface LiquidDesignConfig {
  refractionStrength: number;
  edgeThreshold: number;
  blur: number;
  contrast: number;
  brightness: number;
  saturate: number;
  borderRadius: number;
}

const DEFAULT_CONFIG: LiquidDesignConfig = {
  refractionStrength: 0.5,
  edgeThreshold: 0.1,
  blur: 0.25,
  contrast: 1.2,
  brightness: 1.05,
  saturate: 1.1,
  borderRadius: 150,
};

@Injectable({
  providedIn: 'root',
})
export class LiquidDesignService {
  private configSignal = signal<LiquidDesignConfig>(DEFAULT_CONFIG);

  get config() {
    return this.configSignal.asReadonly();
  }

  updateConfig(partial: Partial<LiquidDesignConfig>): void {
    this.configSignal.update((current) => ({
      ...current,
      ...partial,
    }));
  }

  resetConfig(): void {
    this.configSignal.set(DEFAULT_CONFIG);
  }
}
