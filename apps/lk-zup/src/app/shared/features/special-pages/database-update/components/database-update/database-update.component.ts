import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LangModule } from '@shared/features/lang/lang.module';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-database-update',
    templateUrl: './database-update.component.html',
    styleUrl: './database-update.component.scss',
    imports: [CommonModule, ButtonModule, RouterLink, LangModule]
})
export class DatabaseUpdateComponent {}
