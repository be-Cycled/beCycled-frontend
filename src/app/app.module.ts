import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { TuiDialogModule, TuiNotificationsModule, TuiRootModule } from '@taiga-ui/core'
import { NgxMapboxGLModule } from 'ngx-mapbox-gl'
import { TUI_LANGUAGE, TUI_RUSSIAN_LANGUAGE } from '@taiga-ui/i18n'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { HeaderModule } from './global/cdk/components/header/header.module'
import { MenuModule } from './global/cdk/components/menu/menu.module'
import { DomainModule } from './global/domain/domain.module'
import { ServiceWorkerModule } from '@angular/service-worker'
import { environment } from '../environments/environment'
import { of } from 'rxjs'
import { MAPBOX_TOKEN } from './global/models'

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    TuiRootModule,
    NgxMapboxGLModule.withConfig({
      accessToken: MAPBOX_TOKEN,
      geocoderAccessToken: MAPBOX_TOKEN
    }),
    HeaderModule,
    MenuModule,
    TuiNotificationsModule,
    DomainModule,
    TuiDialogModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [
    {
      provide: TUI_LANGUAGE,
      useValue: of(TUI_RUSSIAN_LANGUAGE)
    }
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}
