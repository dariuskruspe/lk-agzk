import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { BusinessTripsMembersService } from '../services/business-trips-members.service';

@Injectable({
  providedIn: 'root',
})
export class BusinessTripsMembersState {
  public entityName = 'businessTripMembers';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.membersService.getMembers.bind(this.membersService),
    },
  };

  constructor(private membersService: BusinessTripsMembersService) {}
}
