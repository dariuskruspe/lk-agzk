import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, Optional } from '@angular/core';
import { Subject } from "rxjs";
import { debounceTime, switchMap } from "rxjs/operators";

@Injectable()
export class VacationValidateService {
  private deboucer$ = new Subject<{ startDate: string; endDate: string }>();

  private result = new Subject<unknown>();

  constructor(
    private http: HttpClient,
    @Inject('apiToken') @Optional() private readonly url: string,
  ) {
    this.deboucer$.pipe(debounceTime(200), switchMap((params) => {
      return this.http
        .get<void>(`${this.url}/vacationSchedule/isPeriodValid`, {
          params,
        })
    })).subscribe(this.result);
  }

  isPeriodValid(params: { startDate: string; endDate: string }): Promise<unknown> {
    console.log(params);
    this.deboucer$.next(params);
    return this.result.asObservable().toPromise();
  }
}
