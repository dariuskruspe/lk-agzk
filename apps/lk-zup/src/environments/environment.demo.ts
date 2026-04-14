// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { LkZupApiProdEnv } from '../../../lk-zup-api.prod.env';

export const environment = {
  production: true,
  jsonApi: 'http://localhost:3000',
  api: LkZupApiProdEnv.url,
  baseHref: LkZupApiProdEnv.baseUrl,
  title: 'TITLE_APP',
  apiRoot: '',
  authType: '',
};
