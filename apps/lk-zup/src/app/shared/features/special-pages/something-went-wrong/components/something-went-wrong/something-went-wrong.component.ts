import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LangModule } from '@shared/features/lang/lang.module';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-something-went-wrong',
    templateUrl: './something-went-wrong.component.html',
    styleUrl: './something-went-wrong.component.scss',
    imports: [CommonModule, ButtonModule, RouterLink, LangModule]
})
export class SomethingWentWrongComponent {}
