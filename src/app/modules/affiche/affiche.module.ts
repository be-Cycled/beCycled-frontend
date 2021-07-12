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
import { TuiButtonModule } from '@taiga-ui/core'

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
    TuiButtonModule
  ],
  providers: [
    RouteService
  ]
})
export class AfficheModule {
}
