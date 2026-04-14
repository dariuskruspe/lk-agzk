import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'iconPack',
    pure: true,
    standalone: false
})
export class IconPackPipe implements PipeTransform {
  transform(icon: string): string {
    if (!icon || typeof icon !== 'string') return '';
    let prefix = 'hrm-icons';
    switch (true) {
      case icon.startsWith('pi'):
        prefix = 'pi';
        break;
      default:
        break;
    }
    return `${prefix} ${icon}`;
  }
}
