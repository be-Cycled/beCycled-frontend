import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { TuiButtonModule, TuiFormatPhonePipeModule, TuiLinkModule } from '@taiga-ui/core'
import { TuiFilterModule, TuiIslandModule } from '@taiga-ui/kit'
import { EventCardModule } from '../../global/components/cdk/event-card/event-card.module'
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
    TuiIslandModule,
    TuiFormatPhonePipeModule,
    EventCardModule
  ]
})
export class ProfileModule { }
