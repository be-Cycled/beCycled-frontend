import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { ProfileContainerComponent } from './containers/profile-container/profile-container.component'

import { ProfileRoutingModule } from './profile-routing.module'


@NgModule({
  declarations: [
    ProfileContainerComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule
  ]
})
export class ProfileModule { }
