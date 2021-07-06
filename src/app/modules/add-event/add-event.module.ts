import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { AddEventRoutingModule } from './add-event-routing.module'
import { AddEventComponent } from './components/add-event/add-event.component'
import { TuiCalendarModule, TuiSvgModule } from '@taiga-ui/core'
import { ReactiveFormsModule } from '@angular/forms'
import { TuiInputDateTimeModule, TuiIslandModule, TuiTabsModule } from '@taiga-ui/kit'
import { NgxMapboxGLModule } from 'ngx-mapbox-gl'
import { MapboxNetworkService } from '../../global/services/mapbox-network/mapbox-network.service'
import { TuiRippleModule } from '@taiga-ui/addon-mobile'

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
    TuiRippleModule
  ],
  providers: [
    MapboxNetworkService
  ]
})
export class AddEventModule {
}
