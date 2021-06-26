import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { AddEventRoutingModule } from './add-event-routing.module'
import { AddEventComponent } from './components/add-event/add-event.component'
import { TuiCalendarModule } from '@taiga-ui/core'
import { ReactiveFormsModule } from '@angular/forms'
import { TuiInputDateTimeModule } from '@taiga-ui/kit'
import { NgxMapboxGLModule } from 'ngx-mapbox-gl'
import { MapboxNetworkService } from '../../global/services/mapbox-network/mapbox-network.service'


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
    NgxMapboxGLModule
  ],
  providers: [
    MapboxNetworkService
  ]
})
export class AddEventModule {
}
