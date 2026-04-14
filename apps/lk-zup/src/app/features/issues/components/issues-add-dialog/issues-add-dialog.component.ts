import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  Preloader,
  providePreloader,
} from '@shared/services/preloader.service';
import { FpcInterface } from '@wafpc/base/models/fpc.interface';
import { ProgressSpinner } from 'primeng/progressspinner';
import { Observable, Subject } from 'rxjs';
import { MainCurrentUserInterface } from '../../../main/models/main-current-user.interface';
import { IssuesTypesTemplateInterface } from '../../models/issues-types.interface';

@Component({
    selector: 'app-issues-add-dialog',
    templateUrl: './issues-add-dialog.component.html',
    styleUrls: ['./issues-add-dialog.component.scss'],
    providers: [providePreloader(ProgressSpinner)],
    standalone: false
})
export class IssuesAddDialogComponent implements OnChanges {
  fpcData: FpcInterface;

  fpcData$: Subject<FpcInterface> = new Subject();

  @Input() issueType: IssuesTypesTemplateInterface;

  @Input() issueData: MainCurrentUserInterface;

  @Input() dateLocale: string;

  @Input() loading: boolean;

  @Input() onOtherEmployee: boolean;

  @Input() loading$: Observable<boolean>;

  @Input() submit$: Subject<void>;

  @Output() formSubmitOut = new EventEmitter();

  constructor(private preloader: Preloader) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.issueType?.currentValue) {
      const fpcData = { ...changes.issueType.currentValue };
      fpcData.data = { ...this.issueData };
      this.fpcData = fpcData;
      if (this.onOtherEmployee && this.fpcData.templateOnOtherEmployees) {
        this.fpcData.template = this.fpcData.templateOnOtherEmployees;
      }
      this.fpcData$.next(this.fpcData);
    }
    if (this.loading$) {
      this.preloader.setCondition(this.loading$);
    }
  }

  submitEventOut(form: any): void {
    const modValue = form;
    modValue.issueTypeID = this.issueType.issueTypeID;
    modValue.isOrder = !!this.onOtherEmployee;
    this.formSubmitOut.emit({
      ...modValue,
    });
  }
}
