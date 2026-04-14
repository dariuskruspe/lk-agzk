import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ListboxModule } from 'primeng/listbox';
import { ToastModule } from 'primeng/toast';
import { DocSingArchDownloadModule } from '../../shared/components/doc-sing-arch-download/doc-sing-arch-download.module';
import { FooterModule } from '../../shared/components/footer/footer.module';
import { LangModule } from '../../shared/features/lang/lang.module';
import { IconPackModule } from '../../shared/pipes/icon-pack.module';
import { MainModule } from '../main/main.module';
import { MainAuthHeaderComponent } from './components/main-auth-header/main-auth-header.component';
import { MainAuthTemplateContainerComponent } from './containers/main-auth-template-container/main-auth-template-container.component';
import { MainAuthRoutingModule } from './main-auth-routing.module';

@NgModule({
  declarations: [MainAuthTemplateContainerComponent, MainAuthHeaderComponent],
  imports: [
    CommonModule,
    MainAuthRoutingModule,
    MainModule,
    FooterModule,
    DocSingArchDownloadModule,
    LangModule,
    ListboxModule,
    ToastModule,
    ButtonModule,
    IconPackModule,
  ],
})
export class MainAuthModule {}
