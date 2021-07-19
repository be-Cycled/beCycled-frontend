import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { TuiIslandModule } from '@taiga-ui/kit'
import { RouterModule } from '@angular/router'
import { TuiLetModule } from '@taiga-ui/cdk'
import { EventInfoComponent } from './event-info/event-info.component'
import { TuiButtonModule } from '@taiga-ui/core'
import { EventCardComponent } from './event-card/event-card.component'

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
    TuiButtonModule
  ],
  exports: [
    EventInfoComponent,
    EventCardComponent
  ]
})
export class EventCardModule {
}
