import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { TuiLetModule } from '@taiga-ui/cdk'
import { TuiButtonModule, TuiFormatPhonePipeModule, TuiGroupModule, TuiHintModule, TuiLinkModule, TuiNotificationModule, TuiTextfieldControllerModule } from '@taiga-ui/core'
import {
  TuiFieldErrorModule,
  TuiFilterModule,
  TuiInputFileModule,
  TuiInputInlineModule,
  TuiInputModule,
  TuiInputPasswordModule,
  TuiInputPhoneModule,
  TuiIslandModule,
  TuiTextAreaModule
} from '@taiga-ui/kit'
import { NgxMapboxGLModule } from 'ngx-mapbox-gl'
import { EventCardModule } from '../../global/cdk/components/event-card/event-card.module'
import { EventFilterModule } from '../../global/cdk/components/event-filter'
import { ImageNetworkService } from '../../global/services'
import { ProfileContainerComponent, ProfileSettingsContainerComponent } from './containers'

import { ProfileRoutingModule } from './profile-routing.module'

@NgModule({
  declarations: [
    ProfileContainerComponent,
    ProfileSettingsContainerComponent
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
    TuiNotificationModule,
    TuiHintModule,
    EventFilterModule,
    TuiInputPasswordModule
  ],
  providers: [
    ImageNetworkService
  ]
})
export class ProfileModule { }
