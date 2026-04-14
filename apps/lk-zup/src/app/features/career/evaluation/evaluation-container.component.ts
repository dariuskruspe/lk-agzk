import { CommonModule } from '@angular/common';
import {Component, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {
  EvaluationListComponent
} from "@features/career/evaluation/components/evaluation-list/evaluation-list.component";
import {EvaluationApiService} from "@features/career/shared/evaluation-api.service";
import {firstValueFrom, Observable} from "rxjs";
import {EvaluationListItemInterface} from "@features/career/shared/types";
import {ActivatedRoute, Router} from "@angular/router";
import {Preloader, providePreloader} from "@shared/services/preloader.service";
import {ProgressBar} from "primeng/progressbar";
import {toObservable} from "@angular/core/rxjs-interop";

@Component({
    selector: 'app-evaluation-container',
    imports: [
        CommonModule,
        EvaluationListComponent,
    ],
    templateUrl: './evaluation-container.component.html',
    styleUrl: './evaluation-container.component.scss',
    providers: [providePreloader(ProgressBar)]
})
export class EvaluationContainerComponent implements OnInit {
  private preloader = inject(Preloader);

  evaluationList: WritableSignal<EvaluationListItemInterface[]> = signal([]);

  loading = signal(true);

  loading$: Observable<boolean> = toObservable(this.loading);

  constructor(
    private evaluationApiService: EvaluationApiService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    ) {
  }
  ngOnInit(): void {
    const archive = this.activatedRoute.parent.snapshot.url[0].path === 'evaluation-archive';
    this.preloader.setCondition(this.loading$);
    this.getEvaluationList(archive).then(() => {
      this.loading.set(false);
    });
  }

  async getEvaluationList(archive?: boolean): Promise<void> {
    const list = await firstValueFrom(this.evaluationApiService.getEvaluations(archive));
    this.evaluationList.set(list.evaluations);
  }

  toEvaluationPage(id: string): void {
    this.router.navigate(['', 'career', 'evaluation', id]).then();
  }
}
