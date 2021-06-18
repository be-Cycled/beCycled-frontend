import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { WorkoutComponent } from './workout/workout.component'
import { CompetitionComponent } from './competition/competition.component'

@NgModule({
  declarations: [
    WorkoutComponent,
    CompetitionComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    WorkoutComponent,
    CompetitionComponent
  ]
})
export class EventCardModule {
}
