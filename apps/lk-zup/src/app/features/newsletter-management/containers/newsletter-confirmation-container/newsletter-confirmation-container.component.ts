import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { provideBreadcrumb } from '@features/main/utils/breadcrumb-provider.utils';
import {
  Preloader,
  providePreloader,
} from '@shared/services/preloader.service';
import { ProgressBar } from 'primeng/progressbar';
import { LangModule } from "../../../../shared/features/lang/lang.module";
import { CardModule } from "primeng/card";
import { firstValueFrom } from 'rxjs';
import { NewsletterService } from '../../services/newsletter.service';

@Component({
  selector: 'app-newsletter-confirmation-container',
  templateUrl: './newsletter-confirmation-container.component.html',
  styleUrls: ['./newsletter-confirmation-container.component.scss'],
  providers: [
    providePreloader(ProgressBar),
    provideBreadcrumb('NEWSLETTER_MANAGEMENT', 0),
  ],
  standalone: true,
  imports: [LangModule, CardModule],
})
export class NewsletterConfirmationContainerComponent implements OnInit {
  private route = inject(ActivatedRoute);

  message = '...';

  constructor(private newsletterService: NewsletterService, private changeDetectorRef: ChangeDetectorRef) {}

  async ngOnInit(): Promise<void> {
    const params = this.route.snapshot.queryParams;
    const response = await firstValueFrom(this.newsletterService.confirmNewsletter(params));
      this.message = response.message;
      this.changeDetectorRef.detectChanges();
  }
}
