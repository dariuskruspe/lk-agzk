export interface SuccessorsListInterface {
  employeeID: string;
  employeeList: EmployeeSuccessorInterface[];
  count: number;
}

export interface EmployeeSuccessorInterface {
  employeeID: string;
  userID: string;
  fullName: string;
  position: string;
  division: string;
  editingAvailable: boolean;
  photo: string;
  image64: string;
  imageExt: string;
  appointmentStatus: string;
}
export interface PotentialPositionInterface {
  position: string;
  positionID: string;
  staffingTable: string;
  staffingTableID: string;
  division: string;
  divisionID: string;
  readinessStatus: string;
  readinessStatusID: string;
  bestCandidate: boolean;
  employeeID: string;
  userID: string;
  fullName: string;
  image64: string;
  imageExt: string;
  photo: string;
  editingAvailable: boolean;
  colorReadinessStatus: string;
}
export interface SuccessorEmployeeInterface {
  employeeID: string;
  userID: string;
  fullName: string;
  position: string;
  positionID: string;
  staffingTable: string;
  staffingTableID: string;
  division: string;
  divisionID: string;
  image64: string;
  imageExt: string;
  photo: string;
  readinessStatus: string;
  readinessStatusID: string;
  bestCandidate: boolean;
  editingAvailable: boolean;
  colorReadinessStatus: string;
}

export interface SuccessorItemInterface {
  successionPlan: {
    potentialPositions: PotentialPositionInterface[];
    successors: SuccessorEmployeeInterface[];
  },
  changeHistory: {
    date: string;
    action: string;
    comment: string;
    bestCandidate: boolean;
    employee: string;
    staffingTable: string;
    readinessStatus: string;
  }[];
  employeeInfo: {
    employeeID: string;
    userID: string;
    fullName: string;
    positionID: string;
    staffingTableID: string;
    divisionID: string;
    position: string;
    division: string;
    staffingTable: string;
    editingAvailable: boolean;
    image64: string;
    imageExt: string;
    photo: string;
  }
}
