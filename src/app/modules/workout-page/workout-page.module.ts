import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { TuiLetModule } from '@taiga-ui/cdk'
import { TuiIslandModule } from '@taiga-ui/kit'
import { NgxMapboxGLModule } from 'ngx-mapbox-gl'
import { WorkoutPageComponent } from './components/workout-page.component'

import { WorkoutPageRoutingModule } from './workout-page-routing.module'

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
