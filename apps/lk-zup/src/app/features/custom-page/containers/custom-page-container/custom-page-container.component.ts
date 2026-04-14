import {
  ChangeDetectorRef,
  Component,
  computed,
  effect,
  inject,
  input,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  Preloader,
  providePreloader,
} from '@shared/services/preloader.service';
import { ProgressBar } from 'primeng/progressbar';
import { CustomPageService } from '@features/custom-page/sevices/custom-page.service';
import { firstValueFrom, Observable } from 'rxjs';
import { SupportHelpMainInterface } from '@features/support/models/support-help.interface';
import { toObservable } from '@angular/core/rxjs-interop';
@Component({
    selector: 'app-custom-page-container',
    templateUrl: './custom-page-container.component.html',
    styleUrls: ['./custom-page-container.component.scss'],
    providers: [providePreloader(ProgressBar)],
    standalone: false
})
export class CustomPageContainerComponent implements OnInit {
  private preloader = inject(Preloader);
  private customPageService = inject(CustomPageService);

  id = input.required<string>();

  contentData = signal<SupportHelpMainInterface | null>(null);

  markupData = computed(() => {
    const contentData = this.contentData();

    if (contentData?.markup) {
      return contentData.markup;
    }
    return null;
  });

  templateHtml = computed(() => {
    const contentData = this.contentData();
    if (!contentData?.template) {
      return null;
    }

    try {
      const template = JSON.parse(contentData.template);
      return template.value;
    } catch (error) {
      return null;
    }
  });

  loading = signal(true);

  loading$: Observable<boolean> = toObservable(this.loading);

  constructor() {
    effect(
      () => {
        const id = this.id();
        if (id) {
          this.loadContent(id);
        }
      },
      { allowSignalWrites: true },
    );
  }

  async loadContent(id: string) {
    this.contentData.set(
      await firstValueFrom(this.customPageService.getContent(id)),
    );
    this.loading.set(false);
  }

  ngOnInit(): void {
    this.preloader.setCondition(this.loading$);
  }
}
