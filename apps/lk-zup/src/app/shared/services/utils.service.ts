import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  getEmployeeShortName = (name: string): string => {
    let [lastName, firstName, patronymic] = name.split(' ');
    lastName = `${lastName.charAt(0).toUpperCase()}${lastName.slice(1)}`;
    firstName = `${firstName.charAt(0).toUpperCase()}.`;
    patronymic = patronymic ? ` ${patronymic.charAt(0).toUpperCase()}.` : '';

    return `${lastName} ${firstName}${patronymic}`;
  };
}
