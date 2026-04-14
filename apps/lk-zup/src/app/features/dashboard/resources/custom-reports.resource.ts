import { createResource } from '@app/shared/services/api-resource';
import { Environment } from '@app/shared/classes/ennvironment/environment';
import { DashboardWorkPeriod } from '@app/features/dashboard/models/dashboard-payslip.interface';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TTL_1_HOUR } from '@app/shared/services/api-resource/constants';

export const CustomReportsResource = createResource(
  (employeeID: string, reportId: string) =>
    `custom-reports-${employeeID}-${reportId}`,
  (employeeID: string, reportId: string) => {
    const http = inject(HttpClient);
    return http.get<DashboardWorkPeriod>(
      `${Environment.inv().api}/wa_employee/${employeeID}/customReports`,
      { params: { reportId } },
    );
  },
  {
    cache: {
      ttl: TTL_1_HOUR,
    },
  },
);
