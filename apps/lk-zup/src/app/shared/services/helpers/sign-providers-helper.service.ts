import { Injectable } from '@angular/core';
import { BulkDocumentSigningMode } from '@shared/features/signature-validation-form/models/providers.interface';

/**
 * Вспомогательный сервис для работы с провайдерами ЭЦП.
 */
@Injectable({ providedIn: 'root' })
export class SignProvidersHelperService {
  /**
   * Получаем доступные для текущей страницы режимы массового подписания документов.
   *
   * @param pageName название страницы или раздела в ЛКС (обычно — это первый сегмент URL'а маршрута, например: 'documents')
   */
  getAvailableMassSignModesForPage(
    pageName: string
  ): BulkDocumentSigningMode[] {
    const modesForPage: BulkDocumentSigningMode[] = [];

    const orgModePageNames: string[] = ['documents'];
    const employeeModePageNames: string[] = ['my-documents'];

    const orgAndEmployeeModePageNames: string[] = [
      ...orgModePageNames,
      ...employeeModePageNames,
    ];

    if (orgModePageNames.includes(pageName)) {
      modesForPage.push('org');
    }

    if (employeeModePageNames.includes(pageName)) {
      modesForPage.push('employee');
    }

    if (orgAndEmployeeModePageNames.includes(pageName)) {
      modesForPage.push('orgAndEmployee');
    }

    return modesForPage;
  }
}
