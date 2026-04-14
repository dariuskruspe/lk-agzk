import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  model,
} from '@angular/core';
import { cva, type VariantProps } from 'class-variance-authority';
import { AppSelectButtonService } from './app-select-button.service';

const selectButtonVariants = cva([
  'app-select-button'
], {
  variants: {
    size: {
      xs: 'app-select-button--xs',
      sm: 'app-select-button--sm',
      md: 'app-select-button--md',
      lg: 'app-select-button--lg',
      xl: 'app-select-button--xl',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export type SelectButtonVariants = VariantProps<typeof selectButtonVariants>;

@Component({
  selector: 'app-select-button',
  imports: [],
  templateUrl: './app-select-button.component.html',
  styleUrl: './app-select-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AppSelectButtonService],
})
export class AppSelectButtonComponent {
  private appSelectButtonService = inject(AppSelectButtonService);

  // Входные параметры
  size = input<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('md');
  
  // Модель данных
  value = model<any>();

  // Вычисляемые свойства
  classNames = computed(() => {
    return selectButtonVariants({
      size: this.size(),
    });
  });

  constructor() {
    effect(() => {
      const value = this.value();
      this.appSelectButtonService.value.set(value);
    });

    effect(() => {
      const value = this.appSelectButtonService.value();
      this.value.set(value);
    });
  }
}
