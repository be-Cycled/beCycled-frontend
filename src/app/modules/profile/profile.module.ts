import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { TuiLetModule } from '@taiga-ui/cdk'
import { TuiButtonModule, TuiFormatPhonePipeModule, TuiGroupModule, TuiLinkModule, TuiNotificationModule, TuiTextfieldControllerModule } from '@taiga-ui/core'
import {
  TuiFieldErrorModule,
  TuiFilterModule,
  TuiInputFileModule,
  TuiInputInlineModule,
  TuiInputModule,
  TuiInputPhoneModule,
  TuiIslandModule,
  TuiTextAreaModule
} from '@taiga-ui/kit'
import { NgxMapboxGLModule } from 'ngx-mapbox-gl'
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
    EventCardModule,
    TuiLetModule,
    TuiInputFileModule,
    TuiInputInlineModule,
    TuiInputModule,
    TuiTextfieldControllerModule,
    TuiGroupModule,
    TuiTextAreaModule,
    TuiInputPhoneModule,
    TuiFieldErrorModule,
    NgxMapboxGLModule,
    TuiNotificationModule
  ]
})
export class ProfileModule { }
