import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FeedContainerComponent } from './containers/feed-container/feed-container.component'

import { FeedRoutingModule } from './feed-routing.module'
import { TuiFilterModule } from '@taiga-ui/kit'
import { EventCardModule } from '../../global/components/cdk/event-card/event-card.module'
import { ReactiveFormsModule } from '@angular/forms'


@NgModule({
  declarations: [
    FeedContainerComponent
  ],
  imports: [
    CommonModule,
    FeedRoutingModule,
    TuiFilterModule,
    EventCardModule,
    ReactiveFormsModule
  ]
})
export class FeedModule { }
