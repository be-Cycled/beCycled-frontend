import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { TuiRootModule } from '@taiga-ui/core'
import { NgxMapboxGLModule } from 'ngx-mapbox-gl'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { HeaderModule } from './global/cdk/components/header/header.module'
import { MenuModule } from './global/cdk/components/menu/menu.module'

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
    MenuModule
  ],
  providers: [],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}
