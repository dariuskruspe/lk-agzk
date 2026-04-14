import './lib/cadesplugin-api.js';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import './aaa-set-desktop';
import { AppModule } from './app/app.module';

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  // eslint-disable-next-line no-console
  .catch((err) => console.error(err));
