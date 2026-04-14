import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';

import { GoalCategory } from '@features/career/shared/types';

@Component({
  selector: 'app-goal-category-progress',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './goal-category-progress.component.html',
  styleUrl: './goal-category-progress.component.scss',
})
export class GoalCategoryProgressComponent {
  category = input.required<GoalCategory>();

  progress = computed(() => {
    const cat = this.category();

    if (!cat.goals.length) {
      return 0;
    }

    const totalCompleted = cat.goals.filter(
      (g) => g.state === 'completed'
    ).length;

    return Math.ceil((totalCompleted / cat.goals.length) * 100);
  });
}
