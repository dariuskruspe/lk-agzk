import {
  ChangeDetectionStrategy,
  Component,
  signal,
  computed,
  inject,
  effect,
  TemplateRef,
  ViewChild,
  output,
} from '@angular/core';
import {
  MainSidebarService,
  SidebarItem,
} from '@app/features/main/services/main-sidebar.service';
import {
  BellIcon,
  ChevronRightIcon,
  SettingsIcon,
  ChevronsUpDownIcon,
  CopyIcon,
  CircleUserIcon,
  PaletteIcon,
  XIcon,
  GlobeIcon,
} from 'lucide-angular';
import { ConnectedPosition, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal, ComponentPortal } from '@angular/cdk/portal';
import { ViewContainerRef, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-main-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
  encapsulation: ViewEncapsulation.None,
})
export class MainSidebarComponent {
  sidebarService = inject(MainSidebarService);
  overlay = inject(Overlay);
  viewContainerRef = inject(ViewContainerRef);

  logout = output<string>();

  items = this.sidebarService.items;

  isCollapsed = this.sidebarService.isCollapsed;
  isMobile = this.sidebarService.isMobile;
  isMobileMenuOpen = this.sidebarService.isMobileMenuOpen;
  expandedItems = signal(new Set<string>());

  isCollapsable = computed(() => !this.isMobile());

  @ViewChild('popoverTemplate', { static: true })
  popoverTemplate!: TemplateRef<any>;

  @ViewChild('themeMenuTemplate', { static: true })
  themeMenuTemplate!: TemplateRef<any>;

  @ViewChild('langMenuTemplate', { static: true })
  langMenuTemplate!: TemplateRef<any>;

  private overlayRef: OverlayRef | null = null;
  private themeMenuOverlayRef: OverlayRef | null = null;
  private langMenuOverlayRef: OverlayRef | null = null;
  private notificationsOverlayRef: OverlayRef | null = null;
  currentPopoverItem = signal<SidebarItem | null>(null);
  private currentTriggerElement: HTMLElement | null = null;
  private mouseMoveListener: ((event: MouseEvent) => void) | null = null;
  private closeTimeoutId: number | null = null;

  private submenuPosition: ConnectedPosition[] = [
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

  readonly BellIcon = BellIcon;
  readonly SettingsIcon = SettingsIcon;
  readonly ChevronRightIcon = ChevronRightIcon;
  readonly ChevronUpDownIcon = ChevronsUpDownIcon;
  readonly CopyIcon = CopyIcon;
  readonly CircleUserIcon = CircleUserIcon;
  readonly PaletteIcon = PaletteIcon;
  readonly GlobeIcon = GlobeIcon;
  readonly XIcon = XIcon;

  sidebarClasses = computed(() => ({
    sidebar: true,
    'sidebar--collapsed': this.isCollapsed(),
    'sidebar--expanded': !this.isCollapsed(),
    'sidebar--mobile': this.isMobile(),
    'sidebar--mobile-open': this.isMobile() && this.isMobileMenuOpen(),
  }));

  constructor() {
    effect(() => {
      const items = this.items();

      if (!items.length) {
        return;
      }

      // при первой загрузке раскрываем активный пункт
      const activeItem = items.find((item) => item.isActive);
      if (activeItem) {
        this.expandedItems.set(new Set([activeItem.id]));
      }
    });
  }

  toggleSidebar(): void {
    this.sidebarService.toggle();
  }

  toggleSubmenu(itemId: string): void {
    if (this.isCollapsed()) {
      // В свернутом режиме игнорируем клики, работаем только по hover
      return;
    }

    this.expandedItems.update((expanded) => {
      const newSet = new Set(expanded);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  }

  onItemHover(item: SidebarItem, triggerElement: HTMLElement): void {
    if (!this.isCollapsed()) return;

    // Показываем попап только если это новый элемент
    if (this.currentPopoverItem()?.id !== item.id) {
      this.showPopover(item, triggerElement);
    }
  }

  isSubmenuExpanded(itemId: string): boolean {
    return this.expandedItems().has(itemId);
  }

  private showPopover(item: SidebarItem, trigger: HTMLElement): void {
    this.closePopover();

    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(trigger)
      .withPositions(this.submenuPosition);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: false,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
    });

    const templatePortal = new TemplatePortal(
      this.popoverTemplate,
      this.viewContainerRef,
    );
    this.currentPopoverItem.set(item);
    this.currentTriggerElement = trigger;

    this.overlayRef.attach(templatePortal);

    // Добавляем глобальный слушатель событий мыши
    this.startMouseTracking();
  }

  private startMouseTracking(): void {
    // Удаляем старый слушатель если есть
    this.stopMouseTracking();

    this.mouseMoveListener = (event: MouseEvent) => {
      this.checkMousePosition(event);
    };

    document.addEventListener('mousemove', this.mouseMoveListener);
  }

  private stopMouseTracking(): void {
    if (this.mouseMoveListener) {
      document.removeEventListener('mousemove', this.mouseMoveListener);
      this.mouseMoveListener = null;
    }
  }

  private checkMousePosition(event: MouseEvent): void {
    if (!this.overlayRef || !this.currentTriggerElement) {
      return;
    }

    const triggerRect = this.currentTriggerElement.getBoundingClientRect();
    const overlayElement = this.overlayRef.overlayElement;
    const popoverRect = overlayElement.getBoundingClientRect();

    const mouseX = event.clientX;
    const mouseY = event.clientY;

    // Проверяем находится ли курсор внутри триггера или попапа
    const isInsideTrigger =
      mouseX >= triggerRect.left &&
      mouseX <= triggerRect.right &&
      mouseY >= triggerRect.top &&
      mouseY <= triggerRect.bottom;

    const isInsidePopover =
      mouseX >= popoverRect.left &&
      mouseX <= popoverRect.right &&
      mouseY >= popoverRect.top &&
      mouseY <= popoverRect.bottom;

    if (isInsideTrigger || isInsidePopover) {
      // Курсор внутри одной из областей - отменяем закрытие
      this.cancelCloseTimeout();
    } else {
      // Курсор вне обеих областей - запускаем отложенное закрытие
      this.scheduleClose();
    }
  }

  private scheduleClose(): void {
    if (this.closeTimeoutId !== null) {
      return; // Таймаут уже запущен
    }

    this.closeTimeoutId = window.setTimeout(() => {
      this.closePopover();
    }, 100); // 100мс задержка для плавного перехода
  }

  private cancelCloseTimeout(): void {
    if (this.closeTimeoutId !== null) {
      clearTimeout(this.closeTimeoutId);
      this.closeTimeoutId = null;
    }
  }

  closePopover(): void {
    this.stopMouseTracking();
    this.cancelCloseTimeout();

    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }

    this.currentPopoverItem.set(null);
    this.currentTriggerElement = null;
  }

  onChildClick(): void {
    this.closePopover();
    // Закрываем мобильное меню при клике на пункт
    if (this.isMobile()) {
      this.sidebarService.closeMobileMenu();
    }
  }

  onMenuItemClick(): void {
    // Закрываем мобильное меню при клике на пункт меню
    if (this.isMobile()) {
      this.sidebarService.closeMobileMenu();
    }
  }

  showThemeMenuPopover(event) {
    const triggerElement = event.target as HTMLElement;
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(triggerElement)
      .withPositions([
        {
          originX: 'end',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'bottom',
          offsetX: 8,
        },
      ]);

    this.themeMenuOverlayRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: true,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
    });

    this.themeMenuOverlayRef.backdropClick().subscribe(() => {
      this.themeMenuOverlayRef?.dispose();
    });

    const templatePortal = new TemplatePortal(
      this.themeMenuTemplate,
      this.viewContainerRef,
    );

    this.themeMenuOverlayRef.attach(templatePortal);
  }

  selectTheme(theme: string): void {
    this.sidebarService.setTheme(theme);
    this.themeMenuOverlayRef?.dispose();
  }

  selectLang(lang: string): void {
    this.sidebarService.setLang(lang);
    this.langMenuOverlayRef?.dispose();
  }

  closeNotifications(): void {
    if (this.notificationsOverlayRef) {
      this.notificationsOverlayRef.dispose();
      this.notificationsOverlayRef = null;
    }
  }

  showLangMenuPopover(event) {
    const triggerElement = event.target as HTMLElement;
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(triggerElement)
      .withPositions([
        {
          originX: 'end',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'bottom',
          offsetX: 8,
        },
      ]);

    this.langMenuOverlayRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: true,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
    });

    this.langMenuOverlayRef.backdropClick().subscribe(() => {
      this.langMenuOverlayRef?.dispose();
    });

    const templatePortal = new TemplatePortal(
      this.langMenuTemplate,
      this.viewContainerRef,
    );

    this.langMenuOverlayRef.attach(templatePortal);
  }
}
