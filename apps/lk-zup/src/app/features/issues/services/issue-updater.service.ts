import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class IssuesUpdaterService {
  private update$ = new Subject<void>();

  readonly needUpdate$ = this.update$.asObservable().pipe(take(1));

  constructor(private router: Router) {}

  tryToUpdate(): void {
    if (this.router.url.includes('issues')) {
      this.update$.next();
    }
  }
}
