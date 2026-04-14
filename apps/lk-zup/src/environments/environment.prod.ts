// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import env from '../../../../../prod.env.json';

export const environment = {
  production: true,
  api: env.url,
  jsonApi: 'http://localhost:3000',
  mockApi: '',
  baseHref: env.baseUrl,
  title: 'TITLE_APP',
  apiRoot: '',
  authType: '',
  sk: 'MO2DRCg48pGM8mQB5xDV',
};
