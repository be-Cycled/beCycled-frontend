import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { WorkoutComponent } from './workout/workout.component'
import { CompetitionComponent } from './competition/competition.component'
import { TuiIslandModule } from '@taiga-ui/kit'
import { RouterModule } from '@angular/router'
import { TuiLetModule } from '@taiga-ui/cdk'

@NgModule({
  declarations: [
    WorkoutComponent,
    CompetitionComponent
  ],
  imports: [
    CommonModule,
    TuiIslandModule,
    RouterModule,
    TuiLetModule
  ],
  exports: [
    WorkoutComponent,
    CompetitionComponent
  ]
})
export class EventCardModule {
}
