import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'

import { AfficheRoutingModule } from './affiche-routing.module'
import { AfficheContainerComponent } from './containers/affiche-container/affiche-container.component'
import { EventCardModule } from '../../global/components/cdk/event-card/event-card.module'

@NgModule({
  declarations: [
    AfficheContainerComponent
  ],
  imports: [
    CommonModule,
    AfficheRoutingModule,
    EventCardModule
  ]
})
export class AfficheModule {
}
