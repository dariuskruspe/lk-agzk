import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { SupportHelpMenuInterface } from '../models/support-help.interface';
import { SupportHelpService } from '../services/support-help.service';

@Injectable({
  providedIn: 'root',
})
export class SupportInformationGroupResolver
  implements Resolve<SupportHelpMenuInterface[]>
{
  constructor(private supportHelpService: SupportHelpService) {}

  resolve(
    activatedRoute: ActivatedRouteSnapshot
  ): Observable<SupportHelpMenuInterface[]> {
    return this.supportHelpService.getSupportHelpSideMenu(
      activatedRoute.paramMap.get('groupId')
    );
  }
}
