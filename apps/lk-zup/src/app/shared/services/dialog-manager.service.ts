import { Injectable } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { take } from 'rxjs/operators';

@Injectable()
export class DialogManagerService {
  private refs = new Set<DynamicDialogRef>();

  add(ref: DynamicDialogRef): void {
    this.refs.add(ref);
    ref?.onClose
      .pipe(take(1))
      .toPromise()
      .then(() => {
        this.refs.delete(ref);
      });
  }

  last(): DynamicDialogRef | null {
    return Array.from(this.refs)?.pop() || null;
  }
}
