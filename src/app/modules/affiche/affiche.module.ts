import { CommonModule } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { TuiFilterModule } from '@taiga-ui/kit'
import { EventCardModule } from '../../global/cdk/components/event-card/event-card.module'
import { EventFilterModule } from '../../global/cdk/components/event-filter/event-filter.module'
import { RouteService } from '../../global/domain/services/route/route.service'

import { AfficheRoutingModule } from './affiche-routing.module'
import { AfficheContainerComponent } from './containers/affiche-container/affiche-container.component'
import { TuiButtonModule, TuiLinkModule, TuiLoaderModule } from '@taiga-ui/core'
import { EventService } from '../../global/domain/services/event/event.service'

@NgModule({
  declarations: [
    AfficheContainerComponent
  ],
  imports: [
    CommonModule,
    AfficheRoutingModule,
    EventCardModule,
    HttpClientModule,
    TuiFilterModule,
    ReactiveFormsModule,
    EventFilterModule,
    TuiButtonModule,
    TuiLinkModule,
    TuiLoaderModule
  ],
  providers: [
    RouteService,
    EventService
  ]
})
export class AfficheModule {
}
