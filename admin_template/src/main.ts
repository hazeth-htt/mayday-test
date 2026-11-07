import { bootstrapApplication } from '@angular/platform-browser';
import { enableProdMode } from '@angular/core';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { register as registerSwiperElements } from 'swiper/element/bundle';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
  // Production hardening: disable debug console outputs
  window.console.log = () => {};
  window.console.debug = () => {};
  window.console.info = () => {};
}

registerSwiperElements();

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
