import { ChangeDetectionStrategy, Component } from '@angular/core'
import { Title } from '@angular/platform-browser'
import { ActivatedRoute, ParamMap, Router } from '@angular/router'
import { TuiDialogContext, TuiDialogService, TuiNotificationsService } from '@taiga-ui/core'
import { PolymorpheusContent } from '@tinkoff/ng-polymorpheus'
import { Observable } from 'rxjs'
import { map, shareReplay, switchMap, tap } from 'rxjs/operators'
import { AbstractEventPage } from '../../../../global/cdk/components/abstract-event-page'
import { BaseCompetition, BaseWorkout, Route } from '../../../../global/domain'
import { EventService } from '../../../../global/domain/services/event/event.service'
import { RouteService } from '../../../../global/domain/services/route/route.service'
import { UserStoreService } from '../../../../global/services'
import { generateStartTime, getWorkoutListDate } from '../../../../global/utils'

@Component({
  selector: 'cy-competition-page',
  templateUrl: './competition-page.component.html',
  styleUrls: [ './competition-page.component.scss' ],
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

  public isCanEdit$: Observable<boolean> = this.competition$.pipe(
    map((competition: BaseCompetition) => competition.ownerUserId === this.userStoreService.user?.id)
  )

  constructor(private routeService: RouteService,
              private activatedRoute: ActivatedRoute,
              private title: Title,
              private userStoreService: UserStoreService,
              private dialogService: TuiDialogService,
              notificationsService: TuiNotificationsService,
              eventService: EventService,
              router: Router) {
    super(eventService, notificationsService, router)
  }

  public showDeleteDialog(content: PolymorpheusContent<TuiDialogContext>): void {
    this.dialogService.open(content, { size: 's' }).subscribe()
  }
}
