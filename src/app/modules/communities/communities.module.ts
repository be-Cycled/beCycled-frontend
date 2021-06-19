import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'

import { CommunitiesRoutingModule } from './communities-routing.module'
import { CommunitiesContainerComponent } from './containers/communities-container/communities-container.component'
import { SingleCommunityContainerComponent } from './containers/single-community-container/single-community-container.component'


@NgModule({
  declarations: [
    CommunitiesContainerComponent,
    SingleCommunityContainerComponent
  ],
  imports: [
    CommonModule,
    CommunitiesRoutingModule
  ]
})
export class CommunitiesModule { }
