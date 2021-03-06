import { ChangeDetectionStrategy, Component } from '@angular/core'
import { Title } from '@angular/platform-browser'
import { ActivatedRoute, ParamMap, Router } from '@angular/router'
import { combineLatest, Observable } from 'rxjs'
import { map, shareReplay, switchMap, tap } from 'rxjs/operators'
import { AbstractEventPage } from '../../../../global/cdk/components/abstract-event-page'
import { BaseCompetition, BaseWorkout, Community, Route, User, UserService } from '../../../../global/domain'
import { RouteService } from '../../../../global/domain/services/route/route.service'
import { generateStartTime, getWorkoutListDate } from '../../../../global/utils'
import { EventService } from '../../../../global/domain/services/event/event.service'
import { UserStoreService } from '../../../../global/services'
import { TuiDialogContext, TuiDialogService, TuiNotificationsService } from '@taiga-ui/core'
import { PolymorpheusContent } from '@tinkoff/ng-polymorpheus'
import { CommunityStoreService } from '../../../communities/services'

@Component({
  selector: 'cy-competition-page',
  templateUrl: './competition-page.component.html',
  styleUrls: [ './competition-page.component.scss' ],
  host: { class: 'event-page event-card' },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompetitionPageComponent extends AbstractEventPage {
  public competition$: Observable<BaseCompetition> = this.activatedRoute.paramMap.pipe(
    map((paramMap: ParamMap) => paramMap.get('id')),
    switchMap((id: string | null) => this.eventService.readEventById(Number.parseInt(id!, 10))),
    shareReplay(1),
    tap((competition: BaseCompetition) => {
      this.title.setTitle(`Соревнование ${ getWorkoutListDate(competition.startDate) } ${ generateStartTime(competition.startDate) }`)
      this.venueCoordinates = JSON.parse(competition.venueGeoData)
    })
  )

  public route$: Observable<Route> = this.competition$.pipe(
    switchMap((workout: BaseWorkout) => this.routeService.readById(workout.routeId)),
    shareReplay(1)
  )

  public currentCommunity$: Observable<Community | null> = combineLatest([
    this.competition$,
    this.communityStoreService.allCommunities$
  ]).pipe(
    map(([ competition, communities ]: [ BaseCompetition, Community[] ]) => {
      if (competition.communityId !== null) {
        const community: Community | undefined = communities.find((community: Community) =>
          community.id === competition.communityId)

        if (typeof community !== 'undefined') {
          return community
        }
      }

      return null
    })
  )

  public isCanEdit$: Observable<boolean> = this.competition$.pipe(
    map((competition: BaseCompetition) => competition.ownerUserId === this.userStoreService.user?.id)
  )

  public lastFourMembers$: Observable<User[]> = this.competition$.pipe(
    switchMap((workout: BaseWorkout) => this.userService.readUsersByIds(workout.memberUserIds))
  )

  constructor(private routeService: RouteService,
              private activatedRoute: ActivatedRoute,
              private title: Title,
              private userService: UserService,
              private userStoreService: UserStoreService,
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
