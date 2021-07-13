import { ChangeDetectionStrategy, Component } from '@angular/core'
import { forkJoin, Observable } from 'rxjs'
import { map, pluck, switchMap } from 'rxjs/operators'
import { Community, Competition, SportType, Workout } from '../../../../../global/domain'
import { CompetitionService } from '../../../../../global/domain/services/competition/competition.service'
import { WorkoutService } from '../../../../../global/domain/services/workout/workout.service'
import { EventType, SomeWrappedEvent, WrappedEvent } from '../../../../../global/models'
import { CommunityStoreService } from '../../../services'

@Component({
  selector: 'cy-community-single-main',
  templateUrl: './community-single-main.component.html',
  styleUrls: ['./community-single-main.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommunitySingleMainComponent {

  public events: Observable<SomeWrappedEvent[]> = this.communityStoreService.communityChanges.pipe(
    switchMap((community: Community) => forkJoin([
      this.workoutService.readWorkoutsByCommunity(community.nickname),
      this.competitionService.readCompetitionsByCommunity(community.nickname)
    ]).pipe(
      map(([ workouts, competitions ]: [ Workout[], Competition[] ]) => {
        const result: SomeWrappedEvent[] = []

        const workoutEvents: WrappedEvent<EventType.workout, Workout>[] = workouts.map((workout: Workout) => ({ type: EventType.workout, value: workout }))
        const competitionEvents: WrappedEvent<EventType.competition, Competition>[] = competitions.map((competition: Competition) => ({ type: EventType.competition, value: competition }))

        result.push(...workoutEvents)
        result.push(...competitionEvents)

        return result.sort((a: SomeWrappedEvent, b: SomeWrappedEvent) => {
          return new Date(a.value.createdAd).getTime() - new Date(b.value.startDate).getTime()
        })
      })
    ))
  )

  public sportTypes: Observable<SportType[]> = this.communityStoreService.communityChanges.pipe(
    pluck('sportTypes')
  )

  public sportTypesMap: Record<SportType, string> = {
    [ SportType.bicycle ]: `Велосипед`,
    [ SportType.rollerblade ]: `Ролики`,
    [ SportType.run ]: `Бег`,
    [ SportType.ski ]: `Лыжи`
  }

  constructor(private communityStoreService: CommunityStoreService,
              private workoutService: WorkoutService,
              private competitionService: CompetitionService) {
  }
}
