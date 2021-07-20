import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { TuiLetModule } from '@taiga-ui/cdk'
import { TuiAvatarModule, TuiIslandModule } from '@taiga-ui/kit'
import { NgxMapboxGLModule } from 'ngx-mapbox-gl'
import { WorkoutPageComponent } from './components/workout-page.component'

import { WorkoutPageRoutingModule } from './workout-page-routing.module'
import { TuiButtonModule, TuiDataListModule, TuiHostedDropdownModule, TuiLoaderModule } from '@taiga-ui/core'
import { EventCardModule } from '../../global/cdk/components/event-card/event-card.module'

@NgModule({
  declarations: [
    WorkoutPageComponent
  ],
  imports: [
    CommonModule,
    WorkoutPageRoutingModule,
    TuiIslandModule,
    NgxMapboxGLModule,
    TuiLetModule,
    TuiButtonModule,
    TuiHostedDropdownModule,
    TuiDataListModule,
    TuiLoaderModule,
    EventCardModule,
    TuiAvatarModule
  ]
})
export class WorkoutPageModule {
}
