import { IssuesStatusListInterface } from '@features/issues/models/issues.interface';

export interface GoalSubmit {
  draft: boolean;
  goals: GoalForm[];
}

export interface GetGoalsResult {
  Goals: GoalCategory[];
  Draft: boolean;
}
export interface GoalCategory {
  category: string;
  categoryID: string;
  goals: GoalItem[];
  min_amount: number;
}

export interface GoalItem {
  goalID: string;
  name: string;
  draft: boolean;
  description: string;
  isDeleted: boolean;
  state?: string;
  isEditable: boolean;
}

export interface GoalForm extends GoalItem {
  categoryID: string;
  isEdited: boolean;
  isAdded: boolean;

  status: IssuesStatusListInterface;
}

export type GoalSubmitItem = Pick<
  GoalForm,
  'goalID' | 'name' | 'description' | 'isDeleted' | 'categoryID'
>;

export interface EvaluationListInterface {
  evaluations: EvaluationListItemInterface[];
  count: number;
}

export interface EvaluationListItemInterface {
  evaluationID: string;
  representation: string;
  stageID: string;
  stageName: string;
  startDate: string;
  endDate: string;
  stateID: string;
  stateName: string;
}

export interface EvaluationInterface {
  evaluationID: string;
  evaluationType: string;
  startDate: string;
  endDate: string;
  description: string;
  employee: string;
  performer: string;
  useRatings: boolean;
  draftAvailable: boolean;
  editingAvailable: boolean;
  approvalAvailable: boolean;
  meetingConfirmationAvailable: boolean;
  meetingConfirmation?: boolean;
  managerComment?: string;
  stages: EvaluationStageInterface[];
  categories: EvaluationCategoryInterface[];
  overallRatings?: OverallRatingInterface[];
  files: EvaluationFileInterface[];
  nextStageAvailable: boolean;
}

export interface EvaluationStageInterface {
  stageName: string;
  description: string;
  isCurrent: boolean;
}

export interface EvaluationCategoryInterface {
  categoryID: string;
  categoryName: string;
  attributeID: string;
  ratingID?: string;
  attributeName: string;
  employeeRating?: CategoryRatingInterface;
  managerRating?: CategoryRatingInterface;
  employeeResult?: CategoryResultInterface;
  managerResult?: CategoryResultInterface;
  goals: CategoryGoalInterface[];
  open?: boolean;
}

export interface CategoryRatingInterface {
  ratingID: string;
  editingAvailable: boolean;
}

export interface CategoryResultInterface {
  result: string;
  editingAvailable: boolean;
}

export interface CategoryGoalInterface {
  goalID: string;
  goalName: string;
  description: string;
  employeeResult: CategoryResultInterface;
  managerResult?: CategoryResultInterface;
  managerRating?: {
    ratingID: string;
    editingAvailable: string;
  };
  employeeRating?: {
    ratingID: string;
    editingAvailable: string;
  };
}

export interface OverallRatingInterface {
  attributeID: string;
  ratingID: string;
}

export interface EvaluationFileInterface {
  fileID: string;
  fileName: string;
  fileLink: string;
}

export interface evaluationRatingsListInterface {
  evaluationRatings: {
    ratingID: string;
    name: string;
    value: number;
  }[];
}
export interface ApprovalEvaluationInterface {
  approved: boolean;
  comment: string;
}
export interface EvaluationFormValueInterface {
  isDraft: boolean;
  files: { fileName: string; file64: string | ArrayBuffer }[];
  filesToDelete?: string[];
  meetingConfirmation?: boolean;
  categories: {
    categoryID: string;
    managerResult?: string;
    employeeResult?: string;
    managerRating?: string;
    employeeRating?: string;
    result?: string;
    ratingID?: string;
    goals: {
      goalID: string;
      employeeResult?: string;
      managerResult?: string;
      result?: string;
    }[];
  }[];
  overallRatings?: {
    attributeID: string;
    ratingID: string;
  }[];
}

export interface EvaluationsSubordinatesListInterface {
  page: number;
  count: number;
  useSkip: boolean;
  subordinates: {
    employeeID: string;
    employeeName: string;
    position: string;
    division: string;
    requiresAttention: boolean;
    image?: {
      image64: string;
      imageExt: string;
    };
  }[];
}

export interface EvaluationsSubordinateInterface {
  position: string;
  division: string;
  employeeID: string;
  employeeName: string;
  image?: {
    image64: string;
    imageExt: string;
  };
  categories: {
    categoryID: string;
    categoryName: string;
    goals: {
      goalID: string;
      goalName: string;
      description: string;
    }[];
    open?: boolean;
  }[];
  evaluations: {
    evaluationID: string;
    representation: string;
    stageID: string;
    stageName: string;
    startDate: string;
    endDate: string;
    year: string;
    stateID: string;
    stateName: string;
  }[];
}

// General Goals Types
export interface GeneralGoalInterface {
  goalID: string;
  goalName: string;
  description: string;
  categoryID: string;
  categoryName: string;
  editingAvailable?: boolean;
  deletionAvailable?: boolean;
}

export interface GeneralGoalsSectionInterface {
  sectionName: string;
  addingAvailable: boolean;
  editingAvailable: boolean;
  deletionAvailable: boolean;
  goals: GeneralGoalInterface[];
  defaultPerformerID: string;
}

export interface EvaluationSubordinatesGoalsInterface {
  sectionName: string;
  organizationGoals?: GeneralGoalsSectionInterface;
  divisionGoals?: GeneralGoalsSectionInterface;
}

export interface CreateOrUpdateGeneralGoalRequestInterface {
  goalID?: string; // обязателен при редактировании
  name: string;
  description: string;
  categoryID: string;
  performerType: 'organization' | 'division';
  performerID: string;
}

export interface GeneralGoalResponseInterface {
  goalID: string;
  goalName: string;
  description: string;
  categoryID: string;
  categoryName: string;
  performerType: 'organization' | 'division';
  performerID: string;
  editingAvailable: boolean;
  deletionAvailable: boolean;
}

