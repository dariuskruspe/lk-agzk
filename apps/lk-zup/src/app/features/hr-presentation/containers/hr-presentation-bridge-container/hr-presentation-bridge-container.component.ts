import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SettingsFacade } from '../../../../shared/features/settings/facades/settings.facade';
import { HrPresentationSsoService } from '../../../../shared/services/hr-presentation-sso.service';

@Component({
  selector: 'app-hr-presentation-bridge-container',
  templateUrl: './hr-presentation-bridge-container.component.html',
  styleUrls: ['./hr-presentation-bridge-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class HrPresentationBridgeContainerComponent implements OnInit {
  private settingsFacade = inject(SettingsFacade);

  private route = inject(ActivatedRoute);

  hrPresentationSsoService = inject(HrPresentationSsoService);

  ngOnInit() {
    const { presentation } = this.settingsFacade.getData();
    const queryParams = new URLSearchParams(this.route.snapshot.queryParams);

    // todo: нужно ли проверять есть ли у пользователя доступ
    if (presentation.enabled) {
      this.hrPresentationSsoService.requestAuth().then((data) => {
        window.location.href =
          data.redirectUrl + `&page=presentation&${queryParams.toString()}`;
      });
    }
  }
}
