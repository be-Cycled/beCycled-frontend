import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { AddEventRoutingModule } from './add-event-routing.module'
import { AddEventComponent } from './components/add-event/add-event.component'
import {
  TuiButtonModule,
  TuiCalendarModule,
  TuiDataListModule,
  TuiGroupModule,
  TuiLoaderModule,
  TuiSvgModule,
  TuiTextfieldControllerModule
} from '@taiga-ui/core'
import { ReactiveFormsModule } from '@angular/forms'
import {
  TuiAvatarModule,
  TuiDataListWrapperModule,
  TuiInputDateModule,
  TuiInputDateTimeModule,
  TuiInputModule,
  TuiInputNumberModule,
  TuiInputTimeModule,
  TuiIslandModule,
  TuiRadioBlockModule,
  TuiSelectModule,
  TuiTabsModule,
  TuiTextAreaModule,
  TuiUnfinishedValidatorModule
} from '@taiga-ui/kit'
import { NgxMapboxGLModule } from 'ngx-mapbox-gl'
import { MapboxNetworkService } from '../../global/services/mapbox-network/mapbox-network.service'
import { TuiRippleModule } from '@taiga-ui/addon-mobile'
import { RouteService } from '../../global/domain/services/route/route.service'
import { ImageNetworkService } from '../../global/services'
import { CommunityStoreService } from '../communities/services'
import { DomainModule } from '../../global/domain/domain.module'

@NgModule({
  declarations: [
    AddEventComponent
  ],
  imports: [
    CommonModule,
    AddEventRoutingModule,
    TuiCalendarModule,
    ReactiveFormsModule,
    TuiInputDateTimeModule,
    NgxMapboxGLModule,
    TuiTabsModule,
    TuiSvgModule,
    TuiIslandModule,
    TuiRippleModule,
    TuiButtonModule,
    TuiGroupModule,
    TuiRadioBlockModule,
    TuiTextAreaModule,
    TuiInputNumberModule,
    TuiSelectModule,
    TuiTextfieldControllerModule,
    TuiDataListWrapperModule,
    TuiDataListModule,
    TuiInputDateModule,
    TuiInputTimeModule,
    TuiUnfinishedValidatorModule,
    TuiLoaderModule,
    TuiInputModule,
    TuiAvatarModule,
    DomainModule
  ],
  providers: [
    MapboxNetworkService,
    RouteService,
    ImageNetworkService,
    CommunityStoreService
  ]
})
export class AddEventModule {
}
