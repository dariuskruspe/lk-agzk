import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { BusinessTripsMemberListItem } from '../constants/business-trip-data-config';
import { BusinessTripsMembersState } from '../states/business-trips-members.state';

@Injectable({
  providedIn: 'root',
})
export class BusinessTripsMembersFacade extends AbstractFacade<{
  members: BusinessTripsMemberListItem[];
}> {
  constructor(
    protected geRx: GeRx,
    protected store: BusinessTripsMembersState
  ) {
    super(geRx, store);
  }

  getMembers(sectionId: string): void {
    this.geRx.show(this.store.entityName, sectionId);
  }
}
