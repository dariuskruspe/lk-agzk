import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { Button } from 'primeng/button';
import { LangModule } from '@shared/features/lang/lang.module';
import { ToolbarModule } from 'primeng/toolbar';
import { ActivatedRoute, Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { firstValueFrom, Observable } from 'rxjs';
import { EvaluationApiService } from '@features/career/shared/evaluation-api.service';
import { EvaluationsSubordinateInterface } from '@features/career/shared/types';
import {
  Preloader,
  providePreloader,
} from '@shared/services/preloader.service';
import { ProgressBar } from 'primeng/progressbar';
import { toObservable } from '@angular/core/rxjs-interop';

interface Goal {
  title: string;
  description: string;
}

interface Category {
  open: boolean;
  goals: Goal[];
}

@Component({
    selector: 'app-evaluation-manager-item-container',
    imports: [
        CommonModule,
        Button,
        LangModule,
        ToolbarModule,
        CardModule,
    ],
    templateUrl: './evaluation-manager-item-container.component.html',
    styleUrl: './evaluation-manager-item-container.component.scss',
    providers: [providePreloader(ProgressBar)]
})
export class EvaluationManagerItemContainerComponent implements OnInit {
  private preloader = inject(Preloader);

  subordinateEmployee: EvaluationsSubordinateInterface;

  loading = signal(true);

  loading$: Observable<boolean> = toObservable(this.loading);

  photo: string;

  activeTab: 'MAIN' | 'ARCHIVE' = 'MAIN';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private evaluationApiService: EvaluationApiService,
    private ref: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.preloader.setCondition(this.loading$);
    const employeeId = this.route.snapshot.params.employeeId;
    this.getEmployeeById(employeeId).then(() => {});
  }

  async getEmployeeById(id: string, isArchive?: boolean) {
    this.subordinateEmployee = await firstValueFrom(
      this.evaluationApiService.getSubordinateById(id, isArchive),
    );
    // if (this.subordinateEmployee.image?.image64) {
    //
    //   const { image64, imageExt } = this.subordinateEmployee.image;
    //
    //   const imageMimeType = mime.getType(imageExt);
    //
    //   this.photo = `data:${imageMimeType};base64,${image64}`;
    // }
    this.ref.detectChanges();
    this.loading.set(false);
  }

  onBackPage(): void {
    this.router.navigate(['/evaluation-manager']).then();
  }

  toggle(index: number) {
    this.subordinateEmployee.categories[index].open =
      !this.subordinateEmployee.categories[index].open;
  }

  toEvaluationPage(evaluationId: string) {
    this.router
      .navigate([
        '',
        'evaluation-manager',
        this.subordinateEmployee.employeeID,
        evaluationId,
      ])
      .then();
  }

  changeTab(tabName: 'MAIN' | 'ARCHIVE') {
    this.activeTab = tabName;
    this.preloader.setCondition(this.loading$);
    const employeeId = this.route.snapshot.params.employeeId;
    this.getEmployeeById(employeeId, tabName === 'ARCHIVE').then(() => {});
  }

  protected readonly encodeURI = encodeURI;
}
