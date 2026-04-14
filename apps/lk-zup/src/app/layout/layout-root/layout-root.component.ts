import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LayoutService } from '../layout.service';
import { LayoutMainComponent } from '../layout-main/layout-main.component';
import { LayoutMainV2Component } from '../layout-main-v2/layout-main-v2.component';
import { GlobalSettingsStateService } from '@app/shared/states/global-settings-state.service';

@Component({
  selector: 'app-layout-root',
  imports: [LayoutMainComponent, LayoutMainV2Component],
  templateUrl: './layout-root.component.html',
  styleUrl: './layout-root.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutRootComponent {
  private globalSettings = inject(GlobalSettingsStateService);
  private layoutService = inject(LayoutService);

  settingsState = this.globalSettings.state;
  currentLayout = this.layoutService.layout;

  ngOnInit() {}
}
