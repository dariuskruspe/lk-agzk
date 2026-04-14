import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LangModule } from '@shared/features/lang/lang.module';
import { ButtonModule } from 'primeng/button';
import { Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-temporarily-unavailable',
    templateUrl: './temporarily-unavailable.component.html',
    styleUrls: ['./temporarily-unavailable.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, ButtonModule, RouterLink, LangModule]
})
export class TemporarilyUnavailableComponent implements OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(private router: Router) {
    timer(10000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.router.navigate(['/']);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
