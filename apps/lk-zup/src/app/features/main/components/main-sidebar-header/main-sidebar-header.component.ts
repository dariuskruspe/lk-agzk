import {
  Component,
  TemplateRef,
  inject,
  input,
  output,
  computed,
  DestroyRef,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ConnectedPosition,
  Overlay,
  OverlayRef,
  GlobalPositionStrategy,
  FlexibleConnectedPositionStrategy,
} from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { ViewContainerRef } from '@angular/core';
import { Employees } from '../../models/main-current-user.interface';
import { ChevronsUpDownIcon } from 'lucide-angular';
import { MainSidebarService } from '../../services/main-sidebar.service';

const DESKTOP_MENU_POSITION: ConnectedPosition[] = [
  {
    originX: 'end',
    originY: 'top',
    overlayX: 'start',
    overlayY: 'top',
    offsetX: 8,
  },
  {
    originX: 'end',
    originY: 'center',
    overlayX: 'start',
    overlayY: 'center',
    offsetX: 8,
  },
  {
    originX: 'end',
    originY: 'bottom',
    overlayX: 'start',
    overlayY: 'bottom',
    offsetX: 8,
  },
];

const MOBILE_BREAKPOINT = 768;

@Component({
  selector: 'app-main-sidebar-header',
  templateUrl: './main-sidebar-header.component.html',
  styleUrls: ['./main-sidebar-header.component.scss'],
  standalone: false,
})
export class MainSidebarHeaderComponent {
  sidebarService = inject(MainSidebarService);

  employees = input<Employees[]>([]);
  selectedEmployeeId = input.required<string>();
  changeEmployee = output<string>();

  private readonly overlay = inject(Overlay);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly destroyRef = inject(DestroyRef);

  companyMenuTemplate = viewChild.required<TemplateRef<unknown>>(
    'companyMenuTemplate',
  );

  private companyMenuOverlayRef: OverlayRef | null = null;

  readonly ChevronsUpDownIcon = ChevronsUpDownIcon;

  selectedEmployee = computed(() =>
    this.employees().find(
      (emp) => emp.employeeID === this.selectedEmployeeId(),
    ),
  );

  isCollapsed = computed(() => this.sidebarService.isCollapsed());

  showCompanyMenu(event: Event): void {
    if (this.employees().length <= 1) {
      return;
    }

    const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
    const triggerElement = event.currentTarget as HTMLElement;

    let positionStrategy:
      | GlobalPositionStrategy
      | FlexibleConnectedPositionStrategy;
    let overlayWidth: string;

    if (isMobile) {
      // Для мобильной версии - глобальное позиционирование на весь экран
      positionStrategy = this.overlay
        .position()
        .global()
        .centerHorizontally()
        .centerVertically();
      overlayWidth = '100vw';
    } else {
      // Для десктопа - позиционирование относительно триггера
      positionStrategy = this.overlay
        .position()
        .flexibleConnectedTo(triggerElement)
        .withPositions(DESKTOP_MENU_POSITION);
      overlayWidth = '375px';
    }

    this.companyMenuOverlayRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: true,
      backdropClass: isMobile
        ? 'cdk-overlay-dark-backdrop'
        : 'cdk-overlay-transparent-backdrop',
      scrollStrategy: this.overlay.scrollStrategies.block(),
      width: overlayWidth,
      maxHeight: isMobile ? '100vh' : '80vh',
      panelClass: isMobile ? 'company-menu--mobile' : 'company-menu--desktop',
    });

    this.companyMenuOverlayRef
      .backdropClick()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.companyMenuOverlayRef?.dispose();
      });

    const templatePortal = new TemplatePortal(
      this.companyMenuTemplate(),
      this.viewContainerRef,
    );

    this.companyMenuOverlayRef.attach(templatePortal);
  }

  selectEmployee(employee: Employees): void {
    this.changeEmployee.emit(employee.employeeID);
    this.companyMenuOverlayRef?.dispose();
  }

  trackByEmployeeId(_index: number, employee: Employees): string {
    return employee.employeeID;
  }
}
