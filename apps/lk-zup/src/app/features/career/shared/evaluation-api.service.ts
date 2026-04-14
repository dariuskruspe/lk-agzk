import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Environment } from '@app/shared/classes/ennvironment/environment';
import { LocalStorageService } from '@shared/services/local-storage.service';
import {
  ApprovalEvaluationInterface,
  EvaluationFormValueInterface,
  EvaluationInterface,
  EvaluationListInterface,
  evaluationRatingsListInterface,
  EvaluationsSubordinateInterface,
  EvaluationsSubordinatesListInterface,
  EvaluationSubordinatesGoalsInterface,
  CreateOrUpdateGeneralGoalRequestInterface,
  GeneralGoalResponseInterface,
} from '@features/career/shared/types';
import { Observable } from 'rxjs';
import { FilterParamsInterface } from '@shared/models/filter-params.interface';
import { FileBase64 } from '@shared/models/files.interface';

@Injectable({
  providedIn: 'root',
})
export class EvaluationApiService {
  private http = inject(HttpClient);

  private localStorageService = inject(LocalStorageService);

  getEvaluations(archive?: boolean): Observable<EvaluationListInterface> {
    let httpParams = new HttpParams();
    if (archive) {
      httpParams = httpParams.append('section', 'archive');
    }
    const currentEmployeeId: string =
      this.localStorageService.getCurrentEmployeeId();
    return this.http.get<EvaluationListInterface>(
      `${Environment.inv().api}/wa_employee/${currentEmployeeId}/evaluation`,
      {
        params: httpParams,
      },
    );
  }

  getEvaluationById(
    id: string,
  ): Observable<{ evaluation: EvaluationInterface }> {
    return this.http.get<{ evaluation: EvaluationInterface }>(
      `${Environment.inv().api}/evaluation/${id}`,
    );
  }

  getEvaluationsSubordinates(
    param: FilterParamsInterface,
  ): Observable<EvaluationsSubordinatesListInterface> {
    const currentEmployeeId: string =
      this.localStorageService.getCurrentEmployeeId();
    return this.http.get<EvaluationsSubordinatesListInterface>(
      `${Environment.inv().api}/wa_employee/${currentEmployeeId}/evaluationSubordinates`,
      {
        params: {
          ...param,
        },
      },
    );
  }

  getSubordinateById(
    id: string,
    isArchive?: boolean,
  ): Observable<EvaluationsSubordinateInterface> {
    return this.http.get<EvaluationsSubordinateInterface>(
      `${Environment.inv().api}/evaluationSubordinates/${id}`,
      {
        params: {
          section: isArchive ? 'archive' : 'general',
        },
      },
    );
  }

  getRatings(): Observable<evaluationRatingsListInterface> {
    return this.http.get<evaluationRatingsListInterface>(
      `${Environment.inv().api}/evaluation/ratings`,
    );
  }

  sendFormValue(
    id: string,
    formValue: EvaluationFormValueInterface,
  ): Observable<{ evaluation: EvaluationInterface }> {
    return this.http.patch<{ evaluation: EvaluationInterface }>(
      `${Environment.inv().api}/evaluation/${id}`,
      formValue,
    );
  }

  approveEvaluation(
    evaluationId: string,
    approveData: ApprovalEvaluationInterface,
  ): Observable<{ evaluation: EvaluationInterface }> {
    return this.http.patch<{ evaluation: EvaluationInterface }>(
      `${Environment.inv().api}/evaluation/${evaluationId}/approve`,
      approveData,
    );
  }

  nextStageEvaluation(
    evaluationId: string,
  ): Observable<{ evaluation: EvaluationInterface }> {
    return this.http.patch<{ evaluation: EvaluationInterface }>(
      `${Environment.inv().api}/evaluation/${evaluationId}/nextStage`,
      {},
    );
  }

  getDownloadFile(fileLink: string): Observable<FileBase64> {
    return this.http.get<FileBase64>(
      `${Environment.inv().api}${fileLink}/base64`,
    );
  }

  getGeneralGoals(): Observable<EvaluationSubordinatesGoalsInterface> {
    const employeeID = this.localStorageService.getCurrentEmployeeId();
    return this.http.get<EvaluationSubordinatesGoalsInterface>(
      `${Environment.inv().api}/wa_employee/${employeeID}/evaluationSubordinates`,
    );
  }

  getGeneralGoalById(goalID: string): Observable<GeneralGoalResponseInterface> {
    return this.http.get<GeneralGoalResponseInterface>(
      `${Environment.inv().api}/generalGoals/${goalID}`,
    );
  }

  createOrUpdateGeneralGoal(
    data: CreateOrUpdateGeneralGoalRequestInterface,
  ): Observable<GeneralGoalResponseInterface> {
    return this.http.post<GeneralGoalResponseInterface>(
      `${Environment.inv().api}/generalGoals`,
      data,
    );
  }

  deleteGeneralGoal(goalID: string): Observable<void> {
    return this.http.delete<void>(
      `${Environment.inv().api}/generalGoals/${goalID}`,
    );
  }
}
