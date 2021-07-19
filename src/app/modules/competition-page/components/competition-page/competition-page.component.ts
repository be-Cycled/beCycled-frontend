import { ChangeDetectionStrategy, Component } from '@angular/core'
import { Title } from '@angular/platform-browser'
import { ActivatedRoute, ParamMap, Router } from '@angular/router'
import { Observable } from 'rxjs'
import { map, shareReplay, switchMap, tap } from 'rxjs/operators'
import { AbstractEventPage } from '../../../../global/cdk/components/abstract-event-page'
import { BaseCompetition, BaseWorkout, Route } from '../../../../global/domain'
import { RouteService } from '../../../../global/domain/services/route/route.service'
import { generateStartTime, getWorkoutListDate } from '../../../../global/utils'
import { EventService } from '../../../../global/domain/services/event/event.service'
import { UserHolderService } from '../../../../global/services'
import { TuiDialogContext, TuiDialogService, TuiNotificationsService } from '@taiga-ui/core'
import { PolymorpheusContent } from '@tinkoff/ng-polymorpheus'

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
    map((competition: BaseCompetition) => competition.ownerUserId === this.userHolderService.getUser()?.id)
  )

  constructor(private routeService: RouteService,
              private activatedRoute: ActivatedRoute,
              private eventService: EventService,
              private title: Title,
              private userHolderService: UserHolderService,
              private notificationsService: TuiNotificationsService,
              private routerService: Router,
              private dialogService: TuiDialogService) {
    super(eventService, notificationsService, routerService)
  }

  public showDeleteDialog(content: PolymorpheusContent<TuiDialogContext>): void {
    this.dialogService.open(content, { size: 's' }).subscribe()
  }
}
