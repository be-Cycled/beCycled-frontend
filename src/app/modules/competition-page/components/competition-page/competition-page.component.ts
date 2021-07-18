import { ChangeDetectionStrategy, Component } from '@angular/core'
import { Title } from '@angular/platform-browser'
import { ActivatedRoute, ParamMap } from '@angular/router'
import { Observable } from 'rxjs'
import { map, shareReplay, switchMap, tap } from 'rxjs/operators'
import { AbstractEventPage } from '../../../../global/cdk/components/abstract-event-page'
import { BaseCompetition, BaseWorkout, Route } from '../../../../global/domain'
import { CompetitionService } from '../../../../global/domain/services/competition/competition.service'
import { RouteService } from '../../../../global/domain/services/route/route.service'
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
    switchMap((id: string | null) => this.competitionService.readById(Number.parseInt(id!, 10))),
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

  constructor(private routeService: RouteService,
              private activatedRoute: ActivatedRoute,
              private competitionService: CompetitionService,
              private title: Title) {
    super()
  }
}
