import { computed, inject, Injectable, resource, signal } from '@angular/core';
import {
  AiService,
  AiServiceStaticResponse,
} from '../../../services/ai-service';

@Injectable({
  providedIn: 'root',
})
export class DockyService {
  private aiService = inject(AiService);

  abortController = new AbortController();
  assistantInfo = signal<AiServiceStaticResponse | null>(null);

  readonly info = resource({
    loader: () => this.aiService.getStatic(this.abortController.signal),
  });

  agents = computed(() => {
    const info = this.info.value();
    if (!info) return [];

    return [...info.builtin_agents, ...info.custom_agents];
  });

  tools = computed(() => {
    const info = this.info.value();
    if (!info) return [];

    return info.tools;
  });
}
