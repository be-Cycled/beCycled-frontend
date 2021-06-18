import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'

import { CommunitiesRoutingModule } from './communities-routing.module'
import { CommunitiesContainerComponent } from './containers/communities-container/communities-container.component'


@NgModule({
  declarations: [
    CommunitiesContainerComponent
  ],
  imports: [
    CommonModule,
    CommunitiesRoutingModule
  ]
})
export class CommunitiesModule { }
