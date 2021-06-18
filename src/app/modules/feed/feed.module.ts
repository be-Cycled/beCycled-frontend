import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FeedContainerComponent } from './containers/feed-container/feed-container.component'

import { FeedRoutingModule } from './feed-routing.module'


@NgModule({
  declarations: [
    FeedContainerComponent
  ],
  imports: [
    CommonModule,
    FeedRoutingModule
  ]
})
export class FeedModule { }
