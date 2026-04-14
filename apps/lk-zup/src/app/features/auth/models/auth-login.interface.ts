export interface AuthLoginInterface {
  login: string;
  pass: string;
}

export interface AuthTokenInterface {
  token?: string;
  location?: string[];
  locationParams?: { [p: string]: any };
  destination?: string;
  is2FAPassed?: boolean;
  error?: string;
}
