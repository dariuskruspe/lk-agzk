import {
  // ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  WritableSignal,
} from '@angular/core';
import { AppService } from '@shared/services/app.service';
import { CustomDialogService } from '@shared/services/dialog.service';
import { DialogService } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { SurveysManagementCreateService } from '@features/surveys-management/sevices/surveys-management-create.service';
import { SurveyFieldInterface } from '@features/surveys-management/models/surveys-management.interface';
// import { TranslatePipe } from '@shared/features/lang/pipes/lang.pipe';

@Component({
    selector: 'app-surveys-management-create-container',
    templateUrl: './surveys-management-create-container.component.html',
    styleUrls: ['./surveys-management-create-container.component.scss'],
    providers: [
        {
            provide: DialogService,
            useClass: CustomDialogService,
        },
    ],
    standalone: false
})
export class SurveysManagementCreateContainerComponent implements OnInit {
  app: AppService = inject(AppService);

  router = inject(Router);

  screenSize = this.app.storage.screen.data.frontend.size;

  isMobileV = this.screenSize.signal.isMobileV;

  loading$: Observable<boolean>;

  // visible: boolean = false;

  // fieldTypes: {
  //   name: string;
  //   value: 'text' | 'select' | 'checkbox' | 'divider';
  // }[] = [];
  //
  // selectedType: 'text' | 'select' | 'checkbox' | 'divider';

  surveysManagementCreateService: SurveysManagementCreateService = inject(
    SurveysManagementCreateService,
  );

  surveys: WritableSignal<SurveyFieldInterface[]> =
    this.surveysManagementCreateService.surveyFields;

  constructor(
    public dialog: DialogService,
    // private ref: ChangeDetectorRef,
    // private translatePipe: TranslatePipe,
  ) {
    // this.fieldTypes = [
    //   { name: this.translatePipe.transform('SECTION'), value: 'divider' },
    //   { name: this.translatePipe.transform('TEXT'), value: 'text' },
    //   {
    //     name: this.translatePipe.transform('SEVERAL_OPTIONS'),
    //     value: 'checkbox',
    //   },
    //   { name: this.translatePipe.transform('ONE_OPTIONS'), value: 'select' },
    // ];
  }

  ngOnInit(): void {
    this.clearForm();
  }

  clearForm() {
    this.surveys.set([]);
    this.surveysManagementCreateService.surveyId.set(null);
    this.surveysManagementCreateService.surveySettings.set(null);
    this.surveysManagementCreateService.disableEditForm.set(false);
  }

  // showDialog() {
  //   this.visible = !this.visible;
  // }

  // addField() {
  //   this.visible = false;
  //   const fields = [...this.surveys()];
  //   switch (this.selectedType) {
  //     case 'text':
  //     case 'divider':
  //       fields.push({
  //         type: this.selectedType,
  //         formulation: '',
  //         required: false,
  //       });
  //       this.ref.markForCheck();
  //       break;
  //     case 'checkbox':
  //     case 'select':
  //       fields.push({
  //         type: this.selectedType,
  //         formulation: '',
  //         required: false,
  //         options: [{ formulation: '' }],
  //       });
  //       this.ref.markForCheck();
  //       break;
  //     default:
  //       break;
  //   }
  //   this.resetListBox();
  //   this.surveys.set(fields);
  //   this.ref.detectChanges();
  // }

  // resetListBox() {
  //   this.selectedType = null;
  //   const types = [...this.fieldTypes];
  //   this.fieldTypes = [];
  //   setTimeout(() => {
  //     this.fieldTypes = [...types];
  //   }, 10);
  // }

  back() {
    this.router.navigate(['/surveys-management']);
  }
}
