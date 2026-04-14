import { UntypedFormGroup } from '@angular/forms';
import { FpcArrSmartController } from './shared';

export class DefaultArrSmartController extends FpcArrSmartController<{}> {
  init() {}

  addItem(): void {
    // default arr-smart behaviour is handled by FpcMain component methods
  }

  updateForm(_form: UntypedFormGroup): void {
    // no-op for default behaviour
  }
}
