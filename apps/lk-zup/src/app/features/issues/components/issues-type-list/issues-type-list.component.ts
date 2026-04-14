import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  WritableSignal,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { PageStorageInterface } from '@shared/interfaces/storage/page/page-storage.interface';
import { AppService } from '@shared/services/app.service';
import { debounceTime } from 'rxjs/operators';
import { GroupedListGroup } from '../../../../shared/features/grouped-list/interfaces/grouped-list-type.interface';
import { MainCurrentUserFacade } from '../../../main/facades/main-current-user.facade';
import {
  IssuesTypesInterface,
  IssueTypeGroups,
  IssueTypes,
} from '../../models/issues-types.interface';

@Component({
    selector: 'app-issues-type-list',
    templateUrl: './issues-type-list.component.html',
    styleUrls: ['./issues-type-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class IssuesTypeListComponent implements OnInit, OnChanges {
  app: AppService = inject(AppService);

  currentPageStorage: PageStorageInterface = this.app.storage.page.current;

  isCurrentPageDataLoaded: WritableSignal<boolean> =
    this.currentPageStorage.data.frontend.signal.isDataLoaded;

  filterForm: FormGroup;

  issueTypeGroups: IssueTypeGroups[];

  @Input() issuesTypeList: IssuesTypesInterface;

  @Input() filterIssuesTypeList: IssuesTypesInterface;

  @Output() filter = new EventEmitter();

  @Output() backPage = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public currentUser: MainCurrentUserFacade
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.issuesTypeList && changes.issuesTypeList.currentValue) {
      this.issueTypeGroups =
        changes.issuesTypeList.currentValue.issueTypeGroups;
      this.isCurrentPageDataLoaded.set(true);
    }
    if (
      changes.filterIssuesTypeList &&
      changes.filterIssuesTypeList.currentValue
    ) {
      this.issueTypeGroups =
        changes.filterIssuesTypeList.currentValue.issueTypeGroups;
    }
  }

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      name: [''],
    });
    this.filterForm
      .get('name')
      .valueChanges.pipe(debounceTime(500))
      .subscribe((value) => {
        this.filter.emit(value);
      });
  }

  issueShowRouting(issueType: IssueTypes): void {
    if (issueType.useAsCustomTemplate) {
      this.goToCustomIssueAlias(
        issueType.issueTypeAlias,
        issueType.issueTypeID
      );
    } else if (issueType.useAsLink) {
      this.goToIssueAlias(issueType.issueTypeAlias);
    } else {
      this.goToIssue(issueType.issueTypeID);
    }
  }

  goToIssue(id: string): void {
    this.router.navigate(['', 'issues', 'types', id]).then();
  }

  goToIssueAlias(alias: string): void {
    this.router.navigate(['', 'issues', 'types', alias, 'alias']).then();
  }

  goToCustomIssueAlias(alias: string, typeId: string): void {
    this.router
      .navigate(['', 'issues', 'types', alias, 'custom'], {
        queryParams: { typeId },
      })
      .then();
  }

  onBackPage(): void {
    this.backPage.emit();
  }

  get listSource(): GroupedListGroup<IssueTypes, IssueTypeGroups>[] {
    return (this.issueTypeGroups || [])
      .filter((item) => item.groupIsInList)
      .map((item) => ({
        group: item,
        items: item.issueTypes.filter((v) => v.issueTypeIsInList),
      }));
  }

  asItem(item: any): IssueTypes {
    return item;
  }
}
