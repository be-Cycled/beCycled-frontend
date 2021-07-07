import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { AddEventRoutingModule } from './add-event-routing.module'
import { AddEventComponent } from './components/add-event/add-event.component'
import {
  TuiButtonModule,
  TuiCalendarModule,
  TuiDataListModule,
  TuiGroupModule,
  TuiSvgModule,
  TuiTextfieldControllerModule
} from '@taiga-ui/core'
import { ReactiveFormsModule } from '@angular/forms'
import {
  TuiDataListWrapperModule,
  TuiInputDateTimeModule,
  TuiInputNumberModule,
  TuiIslandModule,
  TuiRadioBlockModule,
  TuiSelectModule,
  TuiTabsModule,
  TuiTextAreaModule
} from '@taiga-ui/kit'
import { NgxMapboxGLModule } from 'ngx-mapbox-gl'
import { MapboxNetworkService } from '../../global/services/mapbox-network/mapbox-network.service'
import { TuiRippleModule } from '@taiga-ui/addon-mobile'
import { AddEventService } from './services/add-event.service'

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
    TuiDataListModule
  ],
  providers: [
    MapboxNetworkService,
    AddEventService
  ]
})
export class AddEventModule {
}
