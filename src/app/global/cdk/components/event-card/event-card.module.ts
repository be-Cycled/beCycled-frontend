import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { WorkoutComponent } from './workout/workout.component'
import { CompetitionComponent } from './competition/competition.component'
import { TuiIslandModule } from '@taiga-ui/kit'
import { RouterModule } from '@angular/router'
import { TuiLetModule } from '@taiga-ui/cdk'
import { EventInfoComponent } from './event-info/event-info.component'
import { TuiButtonModule } from '@taiga-ui/core'

@NgModule({
  declarations: [
    WorkoutComponent,
    CompetitionComponent,
    EventInfoComponent
  ],
  imports: [
    CommonModule,
    TuiIslandModule,
    RouterModule,
    TuiLetModule,
    TuiButtonModule
  ],
  exports: [
    WorkoutComponent,
    CompetitionComponent
  ]
})
export class EventCardModule {
}
