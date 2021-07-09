import { ChangeDetectionStrategy, Component } from '@angular/core'
import { Title } from '@angular/platform-browser'
import { ActivatedRoute, ParamMap } from '@angular/router'
import { Observable } from 'rxjs'
import { map, shareReplay, switchMap, tap } from 'rxjs/operators'
import { AbstractEventPage } from '../../../global/cdk/components/abstract-event-page'
import { Route, Workout } from '../../../global/domain'
import { RouteService } from '../../../global/domain/services/route/route.service'
import { WorkoutService } from '../../../global/domain/services/workout/workout.service'
import { generateStartTime, getWorkoutListDate } from '../../../global/utils'

@Component({
  selector: 'cy-workout-page',
  templateUrl: './workout-page.component.html',
  styleUrls: [ './workout-page.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkoutPageComponent extends AbstractEventPage {
  public workout$: Observable<Workout> = this.activatedRoute.paramMap.pipe(
    map((paramMap: ParamMap) => paramMap.get('id')),
    switchMap((id: string | null) => this.workoutService.readById(Number.parseInt(id!, 10))),
    shareReplay(1),
    tap((workout: Workout) => {
      this.title.setTitle(`Тренировка ${ getWorkoutListDate(workout.startDate) } ${ generateStartTime(workout.startDate) }`)
      this.venueCoordinates = JSON.parse(workout.venue)
    })
  )

  public route$: Observable<Route> = this.workout$.pipe(
    switchMap((workout: Workout) => this.routeService.readById(workout.routeId)),
    shareReplay(1)
  )

  constructor(private routeService: RouteService,
              private activatedRoute: ActivatedRoute,
              private workoutService: WorkoutService,
              private title: Title) {
    super()
  }
}
