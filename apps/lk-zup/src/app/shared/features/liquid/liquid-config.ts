import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LiquidConfig {
  enabled = signal(false);
}
