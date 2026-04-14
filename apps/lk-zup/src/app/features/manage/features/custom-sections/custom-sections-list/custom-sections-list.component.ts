import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { CustomSectionsApiService } from '../shared/custom-sections-api.service';
import { CustomSection } from '../shared/types';
import { finalize } from 'rxjs';
import { AppService } from '@app/shared/services/app.service';

@Component({
    selector: 'app-custom-sections-list',
    imports: [CommonModule, TableModule, ButtonModule, TooltipModule],
    templateUrl: './custom-sections-list.component.html',
    styleUrl: './custom-sections-list.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomSectionsListComponent {
  private apiService = inject(CustomSectionsApiService);
  private router = inject(Router);
  private messageService = inject(MessageService);
  private app = inject(AppService);

  sections = computed(() => {
    const settings = this.app.userSettingsSignal();
    console.log('custom sections', settings);
    return settings.custom;
  });

  constructor() {
    console.log('init');
    effect(() => {
      console.log('custom sections', this.sections());
    });
  }

  editSection(section: CustomSection): void {
    this.router.navigate(['/manage/custom-sections/edit', section.id]);
  }

  createSection(): void {
    this.router.navigate(['/manage/custom-sections/create']);
  }
}
