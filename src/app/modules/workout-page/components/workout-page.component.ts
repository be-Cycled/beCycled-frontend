import { ChangeDetectionStrategy, Component } from '@angular/core'
import { Title } from '@angular/platform-browser'
import { ActivatedRoute, ParamMap, Router } from '@angular/router'
import { Observable } from 'rxjs'
import { map, shareReplay, switchMap, tap } from 'rxjs/operators'
import { AbstractEventPage } from '../../../global/cdk/components/abstract-event-page'
import { BaseWorkout, Route } from '../../../global/domain'
import { RouteService } from '../../../global/domain/services/route/route.service'
import { generateStartTime, getWorkoutListDate } from '../../../global/utils'
import { EventService } from '../../../global/domain/services/event/event.service'
import { UserHolderService } from '../../../global/services'
import { TuiNotificationsService } from '@taiga-ui/core'

@Component({
  selector: 'cy-workout-page',
  templateUrl: './workout-page.component.html',
  styleUrls: [ './workout-page.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkoutPageComponent extends AbstractEventPage {
  public workout$: Observable<BaseWorkout> = this.activatedRoute.paramMap.pipe(
    map((paramMap: ParamMap) => paramMap.get('id')),
    switchMap((id: string | null) => this.eventService.readEventById(Number.parseInt(id!, 10))),
    shareReplay(1),
    tap((workout: BaseWorkout) => {
      this.title.setTitle(`Тренировка ${ getWorkoutListDate(workout.startDate) } ${ generateStartTime(workout.startDate) }`)
      this.venueCoordinates = JSON.parse(workout.venueGeoData)
    })
  )

  public route$: Observable<Route> = this.workout$.pipe(
    switchMap((workout: BaseWorkout) => this.routeService.readById(workout.routeId)),
    shareReplay(1)
  )

  public isCanEdit$: Observable<boolean> = this.workout$.pipe(
    map((workout: BaseWorkout) => workout.ownerUserId === this.userHolderService.getUser()?.id)
  )

  constructor(private routeService: RouteService,
              private activatedRoute: ActivatedRoute,
              private eventService: EventService,
              private title: Title,
              private userHolderService: UserHolderService,
              private notificationsService: TuiNotificationsService,
              private routerService: Router) {
    super(eventService, notificationsService, routerService)
  }
}
