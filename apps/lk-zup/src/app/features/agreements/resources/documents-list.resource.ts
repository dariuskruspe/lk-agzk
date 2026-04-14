import { createResource } from '../../../shared/services/api-resource';
import { Environment } from '../../../shared/classes/ennvironment/environment';
import { inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  TTL_1_HOUR,
  TTL_1_MINUTE,
} from '../../../shared/services/api-resource/constants';
import {
  DocumentFilterInterface,
  DocumentListInterface,
} from '../models/agreement.interface';

export const DocumentsListResource = createResource(
  (currentEmployeeId: string, filterData: DocumentFilterInterface) =>
    `documents-list-${currentEmployeeId}-${filterData.search}-${filterData.signed}-${filterData.searchTarget}-${filterData.page}-${filterData.count}-${filterData.mandatory}-${filterData.state}-${filterData.forEmployee}-${filterData.days}-${filterData.useSkip}-${filterData.documentsType}-${filterData.role}`,
  (currentEmployeeId: string, filterData: DocumentFilterInterface) => {
    const http = inject(HttpClient);
    let httpParams = new HttpParams();
    if (filterData) {
      for (const key of Object.keys(filterData)) {
        if (
          Array.isArray(filterData[key])
            ? filterData[key].length
            : filterData[key]
        ) {
          httpParams = httpParams.append(key, filterData[key]);
        }
      }
    }
    return http.get<DocumentListInterface>(
      `${Environment.inv().api}/wa_employee/${currentEmployeeId}/documents`,
      { params: httpParams },
    );
  },
  {
    cache: {
      ttl: TTL_1_MINUTE,
    },
  },
);
