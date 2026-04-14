import { Component, Input } from '@angular/core';
import { MainCurrentUserInterface } from '../../models/main-current-user.interface';

@Component({
    selector: 'app-main-welcome',
    templateUrl: './main-welcome.component.html',
    styleUrls: ['./main-welcome.component.scss'],
    standalone: false
})
export class MainWelcomeComponent {
  @Input() user: MainCurrentUserInterface;
}
