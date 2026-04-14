import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IssueTemplateApiService } from '../shared/issue-template-api.service';
import { signalProcess } from '@app/shared/services/signal-helpers/signal-process';
import {
  IssueTypeGroups,
  IssueTypes,
  IssuesTypesInterface,
} from '@app/features/issues/models/issues-types.interface';

@Component({
    selector: 'app-issue-template-list',
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './issue-template-list.component.html',
    styleUrl: './issue-template-list.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminIssueTemplateListComponent {
  private issueTemplateApiService = inject(IssueTemplateApiService);

  issueTemplatesResource = signalProcess(() =>
    this.issueTemplateApiService.getIssueTemplates(),
  );

  groups = signal<IssueTypeGroups[]>([]);
  filteredGroups = signal<IssueTypeGroups[]>([]);
  searchQuery = signal<string>('');

  constructor() {
    this.issueTemplatesResource.exec();

    effect(
      () => {
        const data = this.issueTemplatesResource.data();
        if (data && data.issueTypeGroups) {
          this.groups.set(data.issueTypeGroups);
          this.filteredGroups.set(data.issueTypeGroups);
        }
      },
      { allowSignalWrites: true },
    );

    effect(
      () => {
        const query = this.searchQuery();
        this.applySearch(query);
      },
      { allowSignalWrites: true },
    );
  }

  getTotalTemplates(): number {
    return this.groups().reduce((total, group) => {
      return total + (group.issueTypes?.length || 0);
    }, 0);
  }

  getFilteredTemplatesCount(): number {
    return this.filteredGroups().reduce((total, group) => {
      return total + (group.issueTypes?.length || 0);
    }, 0);
  }

  updateSearch(query: string): void {
    this.searchQuery.set(query);
  }

  applySearch(query: string): void {
    if (!query || query.trim() === '') {
      this.filteredGroups.set(this.groups());
      return;
    }

    const normalizedQuery = query.toLowerCase().trim();

    const filtered = this.groups().map((group) => {
      const matchesInGroup =
        group.groupName.toLowerCase().includes(normalizedQuery) ||
        (group.groupAlias &&
          group.groupAlias.toLowerCase().includes(normalizedQuery));

      const filteredTypes = group.issueTypes.filter(
        (type) =>
          (type.issueTypeFullName &&
            type.issueTypeFullName.toLowerCase().includes(normalizedQuery)) ||
          (type.issueTypeShortName &&
            type.issueTypeShortName.toLowerCase().includes(normalizedQuery)) ||
          (type.issueTypeAlias &&
            type.issueTypeAlias.toLowerCase().includes(normalizedQuery)),
      );

      const newGroup = { ...group };

      if (matchesInGroup) {
        return newGroup;
      } else if (filteredTypes.length > 0) {
        return {
          ...newGroup,
          issueTypes: filteredTypes,
        };
      }

      return {
        ...newGroup,
        issueTypes: [],
      };
    });

    const result = filtered.filter((group) => group.issueTypes.length > 0);

    this.filteredGroups.set(result);
  }

  truncateText(text: string, maxLength: number = 50): string {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }
}
