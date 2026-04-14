import {
  Component, Input,
  OnInit,
} from '@angular/core';

export interface GridCellInterface {
  employees?: {
    photo: string;
    name: string;
    id: string;
  }[];
  color: string;
}

@Component({
    selector: 'app-talents-9-grid',
    templateUrl: './talents-9-grid.component.html',
    styleUrls: ['./talents-9-grid.component.scss'],
    standalone: false
})
export class Talents9GridComponent {
  @Input() grid: GridCellInterface[][] = [];
}
