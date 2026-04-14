import { Subject } from "rxjs";

export class CalendarGraphMonthService {
  private eventsSubj = new Subject<any>();

  readonly events$ = this.eventsSubj.asObservable();

  emitEvent(event: any) {
    this.eventsSubj.next(event);
  }

}
