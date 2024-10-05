import {ApplicationConfig, importProvidersFrom, LOCALE_ID, provideZoneChangeDetection} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {provideHttpClient} from "@angular/common/http";
import localeEs from '@angular/common/locales/es';
import {registerLocaleData} from "@angular/common";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {icons, LucideAngularModule} from "lucide-angular";
import {environment} from "../environments/environment";

registerLocaleData(localeEs, 'es');

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    { provide: LOCALE_ID, useValue: 'es' },
    provideAnimationsAsync(),
    importProvidersFrom(LucideAngularModule.pick(icons)),
    {provide: 'googleTagManagerId',  useValue: environment.googleTagManagerId }
  ],
};
