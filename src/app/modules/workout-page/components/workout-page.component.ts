import { ChangeDetectionStrategy, Component } from '@angular/core'
import { Title } from '@angular/platform-browser'
import { ActivatedRoute, ParamMap, Router } from '@angular/router'
import { combineLatest, Observable } from 'rxjs'
import { map, shareReplay, switchMap, tap } from 'rxjs/operators'
import { AbstractEventPage } from '../../../global/cdk/components/abstract-event-page'
import { BaseWorkout, Community, Route, User, UserService } from '../../../global/domain'
import { RouteService } from '../../../global/domain/services/route/route.service'
import { generateStartTime, getWorkoutListDate } from '../../../global/utils'
import { EventService } from '../../../global/domain/services/event/event.service'
import { TuiDialogContext, TuiDialogService, TuiNotificationsService } from '@taiga-ui/core'
import { PolymorpheusContent } from '@tinkoff/ng-polymorpheus'
import { UserStoreService } from '../../../global/services'
import { CommunityStoreService } from '../../communities/services'

@Component({
  selector: 'cy-workout-page',
  templateUrl: './workout-page.component.html',
  styleUrls: [ './workout-page.component.scss' ],
  host: { class: 'event-page event-card' },
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

  public currentCommunity$: Observable<Community | null> = combineLatest([
    this.workout$,
    this.communityStoreService.allCommunities$
  ]).pipe(
    map(([ workout, communities ]: [ BaseWorkout, Community[] ]) => {
      if (workout.communityId !== null) {
        const community: Community | undefined = communities.find((community: Community) =>
          community.id === workout.communityId)

        if (typeof community !== 'undefined') {
          return community
        }
      }

      return null
    })
  )

  public isCanEdit$: Observable<boolean> = this.workout$.pipe(
    map((workout: BaseWorkout) => workout.ownerUserId === this.userStoreService.user?.id)
  )

  public lastFourMembers$: Observable<User[]> = this.workout$.pipe(
    switchMap((workout: BaseWorkout) => this.userService.readUsersByIds(workout.memberUserIds))
  )

  constructor(private routeService: RouteService,
              private activatedRoute: ActivatedRoute,
              private title: Title,
              private userStoreService: UserStoreService,
              private userService: UserService,
              private dialogService: TuiDialogService,
              private communityStoreService: CommunityStoreService,
              notificationsService: TuiNotificationsService,
              eventService: EventService,
              router: Router) {
    super(eventService, notificationsService, router)
  }

  public showDeleteDialog(content: PolymorpheusContent<TuiDialogContext>): void {
    this.dialogService.open(content, { size: 's' }).subscribe()
  }
}
