import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { cva, type VariantProps } from 'class-variance-authority';
import { LucideAngularModule, type LucideIconData } from 'lucide-angular';

const buttonVariants = cva([
  'app-button',
  'inline-flex',
  'items-center',
  'justify-center',
  'gap-2',
  'font-medium',
  'transition-all',
  'duration-150',
  'disabled:cursor-not-allowed',
  'relative',
  'overflow-hidden'
], {
  variants: {
    variant: {
      default: 'app-button--default',
      outlined: 'app-button--outlined',
    },
    severity: {
      primary: 'app-button--primary',
      secondary: 'app-button--secondary',
      success: 'app-button--success',
      danger: 'app-button--danger',
      warning: 'app-button--warning',
      info: 'app-button--info',
    },
    size: {
      xs: 'app-button--xs',
      sm: 'app-button--sm',
      md: 'app-button--md',
      lg: 'app-button--lg',
      xl: 'app-button--xl',
    },
    loading: {
      true: 'app-button--loading',
    },
  },
  defaultVariants: {
    variant: 'default',
    severity: 'secondary',
    size: 'md',
  },
});

export type ButtonVariants = VariantProps<typeof buttonVariants>;

@Component({
  selector: 'app-button',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './app-button.component.html',
  styleUrl: './app-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppButtonComponent {
  // Основные свойства
  label = input<string>();
  icon = input<string | LucideIconData>();
  iconPosition = input<'left' | 'right'>('left');
  
  // Состояния
  disabled = input<boolean>(false);
  loading = input<boolean>(false);
  
  // Варианты стилизации
  variant = input<'default' | 'outlined'>('default');
  severity = input<'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info'>('secondary');
  size = input<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('md');
  
  // HTML атрибуты
  type = input<'button' | 'submit' | 'reset'>('button');
  
  // События
  clicked = output<Event>();

  // Вычисляемые свойства
  classNames = computed(() => {
    return buttonVariants({
      variant: this.variant(),
      severity: this.severity(),
      size: this.size(),
      loading: this.loading(),
    });
  });

  isLucideIcon = computed(() => typeof this.icon() === 'object');
  
  isDisabled = computed(() => this.disabled() || this.loading());
  
  showIcon = computed(() => Boolean(this.icon()));
  
  showIconLeft = computed(() => this.showIcon() && this.iconPosition() === 'left');
  
  showIconRight = computed(() => this.showIcon() && this.iconPosition() === 'right');

  // Методы
  onClick(event: Event) {
    if (this.isDisabled()) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    
    this.clicked.emit(event);
  }
}
