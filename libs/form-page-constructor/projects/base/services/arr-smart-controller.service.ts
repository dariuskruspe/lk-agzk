import { Injectable, Type } from '@angular/core';
import { BusinessTripDayoffsController } from '../controllers/business-trip-dayoffs.controller';
import { DefaultArrSmartController } from '../controllers/default-arr-smart.controller';
import {
  FpcArrSmartController,
  IFpcArrSmartControllerInit,
} from '../controllers/shared';

@Injectable({
  providedIn: 'root',
})
export class ArrSmartControllerService {
  private readonly controllers: Record<
    string,
    Type<FpcArrSmartController<any>>
  > = {
    default: DefaultArrSmartController,
    businessTripDayoffs: BusinessTripDayoffsController,
  };

  createController(name: string | undefined, params: IFpcArrSmartControllerInit) {
    const Controller = (name ? this.controllers[name] : null) ?? this.controllers.default;
    return new Controller(params);
  }
}
