import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MembersClass {
  hasMembers(memberId: string, memberList: string[]): boolean {
    if (memberList && memberList.length) {
      return memberList.indexOf(memberId) > -1;
    }
    return true;
  }
}
