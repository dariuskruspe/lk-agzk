import { computed, inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { IssuesStatusListFacade } from '@features/issues/facades/issues-status-list.facade';
import { IssuesTypesInterface } from '@features/issues/models/issues-types.interface';
import { IssuesTypeService } from '@features/issues/services/issues-type.service';
import { keyBy } from 'lodash';
import { firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { injectResource } from '../services/api-resource/utils';
import { IssueTypesResource } from '../api-resources/issue-types.resource';
import { IssueStateListResource } from '../api-resources/issue-state-list.resource';
import { VacationsGraphDayOffListFacade } from '@app/features/vacations/facades/vacations-graph-day-off-list.facade';

// в будущем нужно перенести сюда загрузку данных которые используются по всему приложению,
// чтобы не подгружать их каждый раз
@Injectable({
  providedIn: 'root',
})
export class SharedStateService {
  private issueTypesResource = injectResource(IssueTypesResource).asSignal();
  private issueStateListResource = injectResource(
    IssueStateListResource,
  ).asSignal();
  private issueStatusListFacade = inject(IssuesStatusListFacade);
  private daysOffFacade = inject(VacationsGraphDayOffListFacade);

  issueTypes = computed(() => this.issueTypesResource.data());

  // todo: load issueStatusList

  issueStatusList = toSignal(
    this.issueStatusListFacade.getData$().pipe(map((i) => i.states)),
  );
  daysOff = toSignal(this.daysOffFacade.getData$());

  issueStateList = computed(() => this.issueStateListResource.data());

  issueStatusMap = computed(() => keyBy(this.issueStatusList() ?? [], 'id'));

  flatIssueTypes = computed(() => {
    if (!this.issueTypes()) {
      return [];
    }

    return this.issueTypes().issueTypeGroups.flatMap(
      (group) => group.issueTypes,
    );
  });

  async loadOnce() {
    if (this.issueTypes() && this.issueStateList()) {
      return;
    }

    await Promise.all([
      this.issueTypesResource.fetch(),
      this.issueStateListResource.fetch(),
    ]);

    // Загружаем daysOff если еще не загружены
    if (!this.daysOff()) {
      this.daysOffFacade.show({
        startDate: new Date(new Date().getFullYear() - 2, 0, 1).toISOString(),
        stopDate: new Date(new Date().getFullYear() + 2, 11, 31).toISOString(),
      });
    }
  }
}
