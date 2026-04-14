import {
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Optional,
  Output,
  SimpleChanges,
  Type,
  ViewContainerRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject } from 'rxjs';
import { switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { SignatureResponseInterface } from '../../../../models/signature-response.interface';
import { SignatureProviderInterface } from '../../../signature-validation-form/models/providers.interface';
import { SignatureValidationFormInterfaces } from '../../../signature-validation-form/models/signature-validation-form.interfaces';
import { filterSuccessOnly } from '../../../signature-validation-form/utils/filter-success-only.util';
import { AbstractCreationComponent } from '../../components/abstract-creation/abstract-creation.component';
import { getSignatureCreationType } from '../../constants/signature-creation';
import { CreationSignatureFacade } from '../../facades/creation-signature.facade';
import { getSecondStepComponent } from '../../utils/get-second-step.util';

@Component({
    selector: 'app-signature-creation-form-container',
    templateUrl: './signature-creation-form-container.component.html',
    styleUrls: ['./signature-creation-form-container.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class SignatureCreationFormContainerComponent
  implements OnChanges, OnDestroy
{
  @Input() provider: SignatureProviderInterface;

  @Output() onclose = new EventEmitter<void>();

  @Output() onsubmit = new EventEmitter<SignatureResponseInterface>();

  private internalComponentRef: ComponentRef<AbstractCreationComponent>;

  private readonly submit$: Subject<{
    signInfo: SignatureValidationFormInterfaces;
  }> = new Subject<{ signInfo: SignatureValidationFormInterfaces }>();

  private destroy$ = new Subject<void>();

  constructor(
    private creationSignatureFacade: CreationSignatureFacade,
    @Optional() private config: DynamicDialogConfig,
    @Optional() private dialogRef: DynamicDialogRef,
    private vcr: ViewContainerRef,
    private router: Router
  ) {
    if (this.config) {
      this.provider = this.config.data?.provider;
      this.submit$ = this.config.data?.submit$ ?? this.submit$;
      this.initCreation();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.submit$?.currentValue && changes.provider?.currentValue) {
      this.initCreation();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  private initCreation(
    type: Type<AbstractCreationComponent> = getSignatureCreationType(
      this.provider
    ),
    response?: SignatureResponseInterface
  ): void {
    this.internalComponentRef = this.vcr.createComponent(type);
    this.internalComponentRef.instance.submit$ = this.submit$;
    this.internalComponentRef.instance.provider = this.provider;
    this.internalComponentRef.instance.response = response;
    this.internalComponentRef.instance.onChanged();
    this.internalComponentRef.changeDetectorRef.detectChanges();

    this.internalComponentRef.instance.onclose
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.dialogRef) {
          this.dialogRef.close();
        }
        this.onclose.emit();
      });

    this.submit$
      .pipe(
        filterSuccessOnly(),
        tap((result) => this.creationSignatureFacade.add(result)),
        switchMap(() => this.creationSignatureFacade.getSignatureResponse$()),
        takeUntil(this.destroy$)
      )
      .subscribe((result: SignatureResponseInterface) => {
        this.destroyExistingContainer();
        const secondStepComponent = getSecondStepComponent(
          this.provider,
          result
        );
        if (secondStepComponent) {
          this.initCreation(secondStepComponent, result);
        } else {
          if (result.releaseIssueID) {
            this.redirectToIssue(result.releaseIssueID);
          }
          if (this.dialogRef) {
            this.dialogRef.close(true);
          }
          this.onsubmit.emit(result);
        }
      });
  }

  private destroyExistingContainer(): void {
    if (this.internalComponentRef) {
      this.vcr.detach(this.vcr.indexOf(this.internalComponentRef.hostView));
      this.internalComponentRef.destroy();
    }
  }

  private redirectToIssue(issueId: string): void {
    this.router.navigate(['', 'issues', 'list', issueId], {
      queryParams: { draft: true },
    });
  }
}
