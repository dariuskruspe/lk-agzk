import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { LangFacade } from '../../../../shared/features/lang/facades/lang.facade';
import { LangUtils } from '../../../../shared/features/lang/utils/lang.utils';
import {
  IssuesListInterface,
  IssuesStatusInterface,
  IssuesStatusListInterface,
} from '../../../issues/models/issues.interface';

@Component({
  selector: 'app-business-trips-list-item-dashboard',
  templateUrl: './business-trips-list-item-dashboard.component.html',
  styleUrls: ['./business-trips-list-item-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BusinessTripsListItemDashboardComponent {
  businessTripID: string;

  @Input() dataList: IssuesListInterface;

  @Input() loading: boolean;

  @Input() otherData: {
    businessTripsStatusList: IssuesStatusInterface;
  };

  @Output() clickItem = new EventEmitter<string>();

  constructor(public langFacade: LangFacade, public langUtils: LangUtils) {}

  logIssueDetails(id: number | string): void {
    this.businessTripID = id.toString();
    this.clickItem.emit(this.businessTripID);
  }

  businessTripState(state: string): IssuesStatusListInterface | null {
    return state
      ? this.otherData?.businessTripsStatusList?.states.find(
          (e) => e.id === state
        )
      : null;
  }
}
