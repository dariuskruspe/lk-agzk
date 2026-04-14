import { Injectable, signal } from '@angular/core';

@Injectable()
export class CalendarGraphHoverService {
  readonly hoveredGroupId = signal<string | null>(null);
}
