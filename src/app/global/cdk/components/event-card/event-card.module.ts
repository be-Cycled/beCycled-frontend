import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { WorkoutComponent } from './workout/workout.component'
import { CompetitionComponent } from './competition/competition.component'
import { TuiIslandModule } from '@taiga-ui/kit'
import { NgxMapboxGLModule } from 'ngx-mapbox-gl'
import { RouterModule } from '@angular/router'

@NgModule({
  declarations: [
    WorkoutComponent,
    CompetitionComponent
  ],
  imports: [
    CommonModule,
    TuiIslandModule,
    NgxMapboxGLModule,
    RouterModule
  ],
  exports: [
    WorkoutComponent,
    CompetitionComponent
  ]
})
export class EventCardModule {
}
