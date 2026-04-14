import { DatePipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { TranslatePipe } from '@shared/features/lang/pipes/lang.pipe';
import { MessageSnackbarService } from '@shared/features/message-snackbar/message-snackbar.service';
import { MessageType } from '@shared/features/message-snackbar/models/message-type.enum';
import {
  Preloader,
  providePreloader,
} from '@shared/services/preloader.service';
import { getObjDifference } from '@shared/utilits/obj-difference.util';
import { FpcInterface } from '@wafpc/base/models/fpc.interface';
import { ProgressBar } from 'primeng/progressbar';
import { Observable, Subject } from 'rxjs';
import { EmployeeDataRelativesInterface, EmployeesInterface } from '../../../employees/models/employees.interface';
import { IssuesTypesTemplateInterface } from '../../../issues/models/issues-types.interface';
import { MainCurrentUserFacade } from '../../../main/facades/main-current-user.facade';
import { MainCurrentUserInterface } from '../../../main/models/main-current-user.interface';
import {
  UserProfileDialogActualAddressInterface,
  UserProfileDialogAddressInterface,
  UserProfileDialogCitizenshipInterface,
  UserProfileDialogContactsInterface,
  UserProfileDialogOtherInterface,
  UserProfileDialogPassportInterface,
  UserProfileDialogRegistrationAddressInterface,
} from '../../models/user-profile-dialog.interface';

@Component({
    selector: 'app-user-profile-dialog',
    templateUrl: './user-profile-dialog.component.html',
    styleUrls: ['./user-profile-dialog.component.scss'],
    providers: [DatePipe, providePreloader(ProgressBar)],
    standalone: false
})
export class UserProfileDialogComponent implements OnChanges {
  fpcData$ = new Subject<FpcInterface>();

  @Input() issueType: IssuesTypesTemplateInterface;

  @Input() employeeData: EmployeesInterface;

  @Input() userData: MainCurrentUserInterface;

  @Input() loading: boolean;

  @Input() loading$: Observable<boolean>;

  @Input() submit$: Subject<void>;

  @Input() alias: string;

  @Input() relativeIndex: number;

  @Output() formSubmitOut = new EventEmitter();

  constructor(
    public currentUserFacade: MainCurrentUserFacade,
    private snackbarService: MessageSnackbarService,
    private translatePipe: TranslatePipe,
    private preloader: Preloader
  ) {}

  ngOnChanges({ issueType }: SimpleChanges): void {
    if (issueType?.currentValue) {
      const fpcData = { ...issueType?.currentValue };
      if (this.relativeIndex) {
        const relative = { ...this.employeeData } as {
          relatives: EmployeeDataRelativesInterface[];
        };
        relative.relatives = [
          relative.relatives[this.relativeIndex - 1],
        ];
        fpcData.data = Object.assign(relative, this.userData);
        fpcData.options.hideAddButton = true;
      } else if (this.alias === 'relatives') {
        fpcData.data = {};
      } else {
        fpcData.data = Object.assign(this.employeeData, this.userData);
      }
      this.fpcData$.next(fpcData);
    }

    if (this.loading$) {
      this.preloader.setCondition(this.loading$);
    }
  }

  submitEventOut(
    value:
      | UserProfileDialogOtherInterface
      | UserProfileDialogContactsInterface
      | UserProfileDialogPassportInterface
      | UserProfileDialogAddressInterface
      | UserProfileDialogCitizenshipInterface
      | UserProfileDialogRegistrationAddressInterface
      | UserProfileDialogActualAddressInterface
  ): void {
    const modValue: any = value;
    modValue.issueTypeID = this.issueType.issueTypeID;

    if (
      this.alias === 'contacts' &&
      !(modValue as UserProfileDialogContactsInterface).contacts.length
    ) {
      this.snackbarService.show(
        this.translatePipe.transform('ERROR_UNMODIFIED_CONTACTS'),
        MessageType.success
      );
      return;
    }

    if (this.alias === 'relatives' && this.relativeIndex) {
      if (modValue.relatives.length) {
        const relative = modValue.relatives[0];
        const prevRelative = [
          ...(
            this.employeeData as {
              relatives: EmployeeDataRelativesInterface[];
            }
          ).relatives,
        ][this.relativeIndex - 1];
        if ( relative.fullName !== prevRelative.fullName) {
          relative.fullName = `${relative.fullName} - ИЗМЕНЕН (До изменения: ${prevRelative.fullName})`;
        } else {
          relative.fullName = `${relative.fullName} - ИЗМЕНЕН`;
        }
        modValue.relatives = [relative];
      } else {
        const prevRelative = [
          ...(
            this.employeeData as {
              relatives: EmployeeDataRelativesInterface[];
            }
          ).relatives,
        ][this.relativeIndex - 1];
        modValue.relatives = [
          {
            ...prevRelative,
            fullName: `${prevRelative.fullName} - УДАЛЕН`,
            relation: prevRelative.relation ? prevRelative.relation : 'УДАЛЕН',
            files: prevRelative.files?.length
              ? prevRelative.files
              : [{ fileName: 'УДАЛЕН', file64: 'УДАЛЕН' }],
          },
        ];
      }
    }

    this.formSubmitOut.emit(modValue);
  }

  getRelativesDifference(
    prev: EmployeeDataRelativesInterface[],
    curr: EmployeeDataRelativesInterface[]
  ): EmployeeDataRelativesInterface[] {
    let result = [];
    const modCurr = [...curr];
    prev.forEach((prevRelative) => {
      const index = modCurr.findIndex(
        (currRelative) => currRelative.fullName === prevRelative.fullName
      );
      let coincidence: EmployeeDataRelativesInterface;
      if (index >= 0) {
        coincidence = modCurr.splice(index, 1)?.[0];
      }

      if (coincidence) {
        const diff = getObjDifference<EmployeeDataRelativesInterface>(
          prevRelative,
          coincidence,
          false
        );
        if (diff) {
          result.push({
            ...coincidence,
            fullName: `${coincidence.fullName} - ИЗМЕНЕН`,
          });
        }
      } else {
        const deleted = {
          ...prevRelative,
          fullName: `${prevRelative.fullName} - УДАЛЕН`,
          relation: prevRelative.relation ? prevRelative.relation : 'УДАЛЕН',
          files: prevRelative.files?.length
            ? prevRelative.files
            : [{ fileName: 'УДАЛЕН', file64: 'УДАЛЕН' }],
        };
        result.push(deleted);
      }
    });
    result = [
      ...result,
      ...modCurr.map((relative) => ({
        ...relative,
        fullName: `${relative.fullName} - ДОБАВЛЕН`,
      })),
    ];
    return result;
  }
}
