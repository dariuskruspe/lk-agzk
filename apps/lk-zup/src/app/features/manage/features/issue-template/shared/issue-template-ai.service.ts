import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { AppService } from '@app/shared/services/app.service';
import { GlobalSettingsStateService } from '@app/shared/states/global-settings-state.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class IssueTemplateAiService {
  private http = inject(HttpClient);
  private app = inject(AppService);
  private globalSettings = inject(GlobalSettingsStateService);

  private baseUrl = computed(() => {
    const settings = this.globalSettings.state();

    const assistantUrl =
      settings.assistant?.aiApiUrl || 'http://localhost:8000';

    return `${assistantUrl}/issue_template_builder`;
  });

  generateIssueTemplate(request: AiApiIssueTemplateBuilderRequest) {
    return this.http.post<AiApiIssueTemplateBuilderResponse>(
      `${this.baseUrl()}/generate`,
      {
        ...request,
      },
    );
  }
}

interface AiApiIssueTemplateBuilderRequest {
  message: string;
  current_form_json: string;
  session_id: string;
}

interface AiApiIssueTemplateBuilderResponse {
  result: {
    json: string;
    changes: string;
  };
  session_id: string;
}
