import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'

import { AfficheRoutingModule } from './affiche-routing.module'
import { AfficheContainerComponent } from './containers/affiche-container/affiche-container.component'
import { HttpClientModule } from '@angular/common/http'
import { RouteService } from '../../global/domain/services/route/route.service'
import { TuiFilterModule } from '@taiga-ui/kit'
import { ReactiveFormsModule } from '@angular/forms'
import { EventCardModule } from '../../global/cdk/components/event-card/event-card.module'

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
    ReactiveFormsModule
  ],
  providers: [
    RouteService
  ]
})
export class AfficheModule {
}
