import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'

import { AfficheRoutingModule } from './affiche-routing.module'
import { AfficheContainerComponent } from './containers/affiche-container/affiche-container.component'
import { EventCardModule } from '../../global/components/cdk/event-card/event-card.module'
import { HttpClientModule } from '@angular/common/http'
import { AfficheService } from './services/affiche.service'
import { RouteService } from '../../global/domain/services/route/route.service'

@NgModule({
  declarations: [
    AfficheContainerComponent
  ],
  imports: [
    CommonModule,
    AfficheRoutingModule,
    EventCardModule,
    HttpClientModule
  ],
  providers: [
    AfficheService,
    RouteService
  ]
})
export class AfficheModule {
}
