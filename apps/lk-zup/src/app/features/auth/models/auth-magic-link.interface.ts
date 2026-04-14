export interface AuthMagicLinkInterface {
  type?: 'login' | 'token';
  token?: string;
  login?: string;
  pass?: string;
}
