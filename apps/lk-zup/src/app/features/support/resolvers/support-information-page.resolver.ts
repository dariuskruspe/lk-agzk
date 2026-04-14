import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { SupportHelpMainInterface } from '../models/support-help.interface';
import { SupportHelpService } from '../services/support-help.service';

@Injectable({
  providedIn: 'root',
})
export class SupportInformationPageResolver
  implements Resolve<SupportHelpMainInterface>
{
  constructor(private supportHelpService: SupportHelpService) {}

  resolve(
    activatedRoute: ActivatedRouteSnapshot
  ): Observable<SupportHelpMainInterface> {
    const params = new HttpParams().set('attributeName', 'title');
    return this.supportHelpService.getSupportHelpBlock(
      activatedRoute.paramMap.get('pageId'),
      params
    );
  }
}
