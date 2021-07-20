import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { TuiAvatarModule, TuiIslandModule } from '@taiga-ui/kit'
import { RouterModule } from '@angular/router'
import { TuiLetModule } from '@taiga-ui/cdk'
import { EventInfoComponent } from './event-info/event-info.component'
import { TuiButtonModule } from '@taiga-ui/core'
import { EventCardComponent } from './event-card/event-card.component'
import { HTTP_INTERCEPTORS } from '@angular/common/http'
import { AuthInterceptor } from '../../../interceptors'

@NgModule({
  declarations: [
    EventInfoComponent,
    EventCardComponent
  ],
  imports: [
    CommonModule,
    TuiIslandModule,
    RouterModule,
    TuiLetModule,
    TuiButtonModule,
    TuiAvatarModule
  ],
  exports: [
    EventInfoComponent,
    EventCardComponent
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
})
export class EventCardModule {
}
