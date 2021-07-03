import { DOCUMENT } from '@angular/common'
import { Inject, Injectable, NgModule } from '@angular/core'
import { BrowserModule, Title } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { ServiceWorkerModule } from '@angular/service-worker'
import { TuiDialogModule, TuiNotificationsModule, TuiRootModule } from '@taiga-ui/core'
import { TUI_INPUT_FILE_TEXTS } from '@taiga-ui/kit'
import { NgxMapboxGLModule } from 'ngx-mapbox-gl'
import { of } from 'rxjs'
import { version } from '../../package.json'

import { environment } from '../environments/environment'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { HeaderModule } from './global/cdk/components/header/header.module'
import { MenuModule } from './global/cdk/components/menu/menu.module'
import { DomainModule } from './global/domain/domain.module'
import { APP_VERSION } from './global/tokens'
import { titleBuilder } from './global/utils'

@Injectable()
class BeCycledTitle {
  constructor(@Inject(DOCUMENT) private document: Document) {
  }

  public getTitle(): string {
    return this.document.title
  }

  public setTitle(newTitle: string): void {
    this.document.title = titleBuilder(newTitle)
  }
}

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
      accessToken: 'pk.eyJ1IjoiYXZrb2x0b3ZpY2giLCJhIjoiY2twazRzamx2M2hoODJvbnhjZzB6eHJlayJ9.e5IMZ_ELx1EPzucgUlIH8g',
      geocoderAccessToken: 'pk.eyJ1IjoiYXZrb2x0b3ZpY2giLCJhIjoiY2twazRzamx2M2hoODJvbnhjZzB6eHJlayJ9.e5IMZ_ELx1EPzucgUlIH8g'
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
      provide: Title,
      useClass: BeCycledTitle
    },
    {
      provide: APP_VERSION,
      useValue: version
    },
    {
      provide: TUI_INPUT_FILE_TEXTS,
      useValue: of({
        defaultLabelSingle: 'или перетащите его сюда',
        defaultLabelMultiple: 'или перетащите их сюда',
        defaultLinkSingle: 'Выберите файл',
        defaultLinkMultiple: 'Выберите файлы',
        maxSizeRejectionReason: 'Размер файла превышает ',
        formatRejectionReason: 'Неправильный формат ',
        drop: 'Перетащите файл сюда',
        dropMultiple: 'Перетащите файлы сюда'
      })
    }
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
  constructor(@Inject(APP_VERSION)
              private appVersion: string) {
    // tslint:disable-next-line:no-console
    console.debug(`App version: ${ appVersion }`)
  }
}
