import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthRestorePasswordFacade } from '../../facades/auth-restore-password.facade';
import { AuthRestorePasswordNewInterface } from '../../models/auth-restore-password.interface';

@Component({
    selector: 'app-auth-restore-password-new-container',
    templateUrl: './auth-restore-password-new-container.component.html',
    styleUrls: ['./auth-restore-password-new-container.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class AuthRestorePasswordNewContainerComponent implements OnInit {
  userData: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    public authRestorePasswordFacade: AuthRestorePasswordFacade
  ) {}

  ngOnInit(): void {
    this.userData = this.activatedRoute.snapshot.queryParams.data;
    this.authRestorePasswordFacade.checkLinkValidity(this.userData);
  }

  setPass(data: AuthRestorePasswordNewInterface): void {
    this.authRestorePasswordFacade.setPass(data);
  }
}
