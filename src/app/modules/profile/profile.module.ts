import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { TuiButtonModule, TuiLinkModule } from '@taiga-ui/core'
import { TuiFilterModule, TuiIslandModule } from '@taiga-ui/kit'
import { ProfileContainerComponent } from './containers/profile-container/profile-container.component'

import { ProfileRoutingModule } from './profile-routing.module'


@NgModule({
  declarations: [
    ProfileContainerComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    TuiButtonModule,
    TuiLinkModule,
    TuiFilterModule,
    ReactiveFormsModule,
    TuiIslandModule
  ]
})
export class ProfileModule { }
