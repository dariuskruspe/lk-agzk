import { Component, input } from '@angular/core';

@Component({
  selector: 'app-logo',
  imports: [],
  templateUrl: './logo.component.html',
  styleUrl: './logo.component.scss',
  host: {
    class: 'block app-logo',
  },
})
export class LogoComponent {
  full = input(false);
}
