import { WorkStatusInterface } from '../../../shared/features/calendar-graph/models/calendar-graph-member-list.interface';
import { VacationsGraphMembersInterface } from './vacations-graph-members.interface';
import { VacationTypeInterface } from './vacations-types.interface';

export interface VacationsInterface {
  // UUID сотрудника
  employeeId: string;
  // ФИО сотрудника
  name: string;
  // Должность сотрудника
  position: string;
  // Периоды отпусков сотрудника
  periods: VacationPeriodInterface[];
  // В подчинении
  subordinated?: boolean;
  // Может согласовывать
  approvingAllowed?: boolean;
  // ID подразделения
  departmentId?: string;
  // Название подразделения
  departmentName?: string;
}

export interface VacationApprovalCommentInterface {
  name: string;
  position: string;
  date: string;
  text: string;
}

export interface VacationPeriodInterface {
  startDate: string;
  endDate: string;
  /**
   * Исходные даты периода до разбиения на месяцы (для month view).
   */
  originalStartDate?: string;
  originalEndDate?: string;
  daysLength?: number;
  approved: null | boolean;
  typeId: string;
  type?: WorkStatusInterface;
  stateId: string;
  lastComment: null | VacationApprovalCommentInterface;
  activeApprovement: boolean;
  vacationTypeId: string;
  vacationType?: VacationTypeInterface;
  disabled?: boolean;
  vacationDocument: string;
  leaveRequest: { id: string; name: string };
  vacationRescheduled: boolean;
  vacationConfirmationAvailable: boolean;
  vacationReshedulingAvailable: boolean;
  issueId: string;
  vacationReshedulingAlias: string;
  status?: 'availible' | 'onApproval' | 'cancelled';
  documentId?: string;
  linkedIssueTypeId: string;
  linkedIssueId: string;
  cancelAccess?: boolean;
  // Метка для отображения в выпадающем списке выбора периодов
  label?: string;
  tooltip?: string;
}

export interface AvailableDaysReponseInterface {
  vacationTypes: AvailableVacationDaysInterface[];
  planEnable: boolean;
}

export interface AvailableVacationDaysInterface {
  daysTotal: number;
  daysPlanned: number;
  daysAvailable: number;
  daysPossible: number;
  vacationTypeId: string;
  vacationType?: VacationTypeInterface;
}

export interface VacationsRequestMembersInterface {
  members: VacationsGraphMembersInterface[];
}

// Интерфейс подчинённого сотрудника
export interface SubordinateInterface {
  // UUID сотрудника
  employeeID?: string;
  // ФИО сотрудника
  fullName?: 'Булатов Игорь Виленович';
  // Должность сотрудника
  position?: string;
  status?: number;
  statusEnds?: null;
  // Фото сотрудника
  photo?: string;
}

export interface SubordinateMinInterface {
  // UUID сотрудника
  id: string;
  // ФИО сотрудника
  fullName: string;
}

export interface SubordinatesMinInterface {
  membersList: SubordinateMinInterface[];
}
