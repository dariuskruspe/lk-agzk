import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeFormat',
  standalone: false,
})
export class TimeFormatPipe implements PipeTransform {
  transform(value: string | Date | null | undefined): string {
    if (!value) {
      return '';
    }

    // Если значение уже в формате 'HH:mm' - возвращаем как есть
    if (typeof value === 'string') {
      const timeRegex = /^\d{2}:\d{2}$/;
      if (timeRegex.test(value)) {
        return value;
      }

      // Пробуем распарсить как Date
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return this.formatTime(date);
      }

      return value;
    }

    // Если это объект Date
    if (value instanceof Date && !isNaN(value.getTime())) {
      return this.formatTime(value);
    }

    return '';
  }

  private formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
}

