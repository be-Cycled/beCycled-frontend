import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { WorkoutPageRoutingModule } from './workout-page-routing.module'
import { WorkoutPageComponent } from './workout-page/workout-page.component'
import { TuiIslandModule } from '@taiga-ui/kit'
import { NgxMapboxGLModule } from 'ngx-mapbox-gl'
import { TuiLetModule } from '@taiga-ui/cdk'


@NgModule({
  declarations: [
    WorkoutPageComponent
  ],
  imports: [
    CommonModule,
    WorkoutPageRoutingModule,
    TuiIslandModule,
    NgxMapboxGLModule,
    TuiLetModule
  ]
})
export class WorkoutPageModule {
}
