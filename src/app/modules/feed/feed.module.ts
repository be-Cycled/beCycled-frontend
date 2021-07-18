import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FeedContainerComponent } from './containers/feed-container/feed-container.component'

import { FeedRoutingModule } from './feed-routing.module'
import { TuiFilterModule } from '@taiga-ui/kit'
import { ReactiveFormsModule } from '@angular/forms'
import { EventCardModule } from '../../global/cdk/components/event-card/event-card.module'
import { EventFilterModule } from '../../global/cdk/components/event-filter/event-filter.module'
import { EventService } from '../../global/domain/services/event/event.service'

@NgModule({
  declarations: [
    FeedContainerComponent
  ],
  imports: [
    CommonModule,
    FeedRoutingModule,
    TuiFilterModule,
    EventCardModule,
    ReactiveFormsModule,
    EventFilterModule
  ],
  providers: [
    EventService
  ]
})
export class FeedModule { }
