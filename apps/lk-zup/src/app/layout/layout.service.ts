import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  layout = signal<string>(localStorage.getItem('layout') || 'default');

  setLayout(layout: string) {
    this.layout.set(layout);
    localStorage.setItem('layout', layout);
  }
}
