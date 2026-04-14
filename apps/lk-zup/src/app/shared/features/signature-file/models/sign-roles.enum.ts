export enum SignRoles {
  'employee' = 'employee',
  'manager' = 'manager',
  'org' = 'org',
}

export function getRole(
  forEmployee: boolean,
  taskId: string | null
): SignRoles {
  let role: SignRoles;
  switch (true) {
    case !forEmployee:
      role = SignRoles.org;
      break;
    case forEmployee && !!taskId:
      role = SignRoles.manager;
      break;
    default:
      role = SignRoles.employee;
      break;
  }
  return role;
}
