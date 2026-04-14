import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PingService {
  private pingSubj = new Subject<boolean>();

  ping$ = this.pingSubj.asObservable();

  setPing(value: boolean): void {
    this.pingSubj.next(value);
  }
}
