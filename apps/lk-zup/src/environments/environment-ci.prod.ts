// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line import/no-absolute-path
import { LkZupApiProdEnv } from '/var/www/lk-zup/lk-zup-api.prod.env';

export const environment = {
  production: true,
  api: LkZupApiProdEnv.url,
  jsonApi: 'http://localhost:3000',
  baseHref: LkZupApiProdEnv.baseUrl,
  title: 'TITLE_APP',
  apiRoot: '',
  authType: '',
};
