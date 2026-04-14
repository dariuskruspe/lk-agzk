import { OverlayPanelModule } from 'primeng/overlaypanel';
import {
  ChangeDetectionStrategy,
  Component,
  contentChild,
  inject,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-button-filter',
  imports: [OverlayPanelModule, NgTemplateOutlet],
  templateUrl: './app-button-filter.component.html',
  styleUrl: './app-button-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AppButtonFilterComponent {
  filterTemplateRef = contentChild.required<TemplateRef<any>>('filter');
}
