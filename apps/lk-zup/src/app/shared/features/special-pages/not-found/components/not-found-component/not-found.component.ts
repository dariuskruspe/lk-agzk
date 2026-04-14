import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LangModule } from '@shared/features/lang/lang.module';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-not-found',
    templateUrl: './not-found.component.html',
    styleUrls: ['./not-found.component.scss'],
    imports: [CommonModule, ButtonModule, RouterLink, LangModule]
})
export class NotFoundComponent {}
