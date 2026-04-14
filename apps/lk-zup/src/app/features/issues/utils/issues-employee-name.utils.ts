import { Injectable } from '@angular/core';
import { TranslatePipe } from '../../../shared/features/lang/pipes/lang.pipe';

@Injectable({
  providedIn: 'root',
})
export class IssuesEmployeeNameUtils {
  constructor(private translatePipe: TranslatePipe) {}

  getName(attr: string): string {
    let translateToken = '';
    switch (attr) {
      case 'fullName':
        translateToken = 'STATIC_DATA_FULL_NAME';
        break;
      case 'position':
        translateToken = 'STATIC_DATA_POSITION';
        break;
      case 'employmentDate':
        translateToken = 'STATIC_DATA_EMPLOYMENT_DATE';
        break;
      case 'salary':
        translateToken = 'STATIC_DATA_SALARY';
        break;
      case 'passRepresentation':
        translateToken = 'STATIC_DATA_PASS_REPRESENTATION';
        break;
      case 'registrationAddress':
        translateToken = 'STATIC_DATA_REGISTRATION_ADDRESS';
        break;
      case 'surname':
        translateToken = 'STATIC_DATA_SURNAME';
        break;
      case 'familyStatus':
        translateToken = 'STATIC_DATA_FAMILY_STATUS';
        break;
      case 'country':
        translateToken = 'STATIC_DATA_COUNTRY';
        break;
      case 'email':
        translateToken = 'STATIC_DATA_EMAIL';
        break;
      case 'cellPhone':
        translateToken = 'STATIC_DATA_CELL_PHONE';
        break;
      case 'inn':
        translateToken = 'STATIC_DATA_INN';
        break;
      case 'dateOfBirth':
        translateToken = 'STATIC_DATA_DATE_OF_BIRTH';
        break;
      case 'vacationBalance':
        translateToken = 'STATIC_DATA_VACATION_BALANCE';
        break;
      case 'additionalVacationBalance':
        translateToken = 'STATIC_DATA_ADDITIONAL_VACATION_BALANCE';
        break;
      case 'dayOffBalance':
        translateToken = 'STATIC_DATA_DAY_OF_BALANCE';
        break;
      default:
        break;
    }

    return this.translatePipe.transform(translateToken);
  }

  getValue(name: string, value: string): string {
    switch (name) {
      case 'employmentDate':
      case 'dateOfBirth':
        return this.getFormatDate(value);
      default:
        return value;
    }
  }

  getFormatDate(date: string): string {
    const dated = new Date(date);
    const day = dated.getDate() <= 9 ? `0${dated.getDate()}` : dated.getDate();
    const month =
      dated.getMonth() < 9 ? `0${dated.getMonth() + 1}` : dated.getMonth() + 1;
    const year = dated.getFullYear();
    return `${day}.${month}.${year}`;
  }
}
