import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FpcModule } from '@shared/features/fpc/fpc.module';
import { LangModule } from '@shared/features/lang/lang.module';
import { Button, ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { SidebarModule } from 'primeng/sidebar';
import { ToolbarModule } from 'primeng/toolbar';

@Component({
    selector: 'app-filters-sidebar',
    imports: [
        ButtonDirective,
        CommonModule,
        FpcModule,
        LangModule,
        Ripple,
        SidebarModule,
        ToolbarModule,
        Button,
    ],
    templateUrl: './filters-sidebar.component.html',
    styleUrl: './filters-sidebar.component.scss'
})
export class FiltersSidebarComponent {
  @Input() sidebarTitle: string = 'FILTER';
  @Input() visible: boolean = false;
  @Input() showDefaultHeader: boolean = true;
  @Input() showDefaultHeaderToolbar: boolean = true;
  @Input() showDefaultContentToolbar: boolean = true;
  @Input() showCloseButton: boolean = true;
}
