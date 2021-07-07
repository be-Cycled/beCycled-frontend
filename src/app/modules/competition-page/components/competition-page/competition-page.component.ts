import { ChangeDetectionStrategy, Component } from '@angular/core'
import { Title } from '@angular/platform-browser'
import { ActivatedRoute, ParamMap } from '@angular/router'
import { Observable } from 'rxjs'
import { map, shareReplay, switchMap, tap } from 'rxjs/operators'
import { AbstractEventPage } from '../../../../global/cdk/components/abstract-event-page'
import { Competition, MapboxRouteInfo, Route, Workout } from '../../../../global/domain'
import { CompetitionService } from '../../../../global/domain/services/competition/competition.service'
import { RouteService } from '../../../../global/domain/services/route/route.service'
import { generateBounds, generateGeoJsonFeature, generateStartTime, getWorkoutListDate } from '../../../../global/utils'

@Component({
  selector: 'cy-competition-page',
  templateUrl: './competition-page.component.html',
  styleUrls: [ './competition-page.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompetitionPageComponent extends AbstractEventPage {
  public competition$: Observable<Competition> = this.activatedRoute.paramMap.pipe(
    map((paramMap: ParamMap) => paramMap.get('id')),
    switchMap((id: string | null) => this.competitionService.getById(Number.parseInt(id!, 10))),
    shareReplay(1),
    tap((competition: Competition) => {
      this.title.setTitle(`Соревнование ${ getWorkoutListDate(competition.startDate) } ${ generateStartTime(competition.startDate) }`)
    })
  )

  public route: Observable<Route> = this.competition$.pipe(
    switchMap((workout: Workout) => this.routeService.getById(workout.routeId)),
    shareReplay(1)
  )

  public routeInfos: Observable<MapboxRouteInfo[]> = this.route.pipe(
    map((route: Route) => (JSON.parse(route.routeInfo) as MapboxRouteInfo[]))
  )

  public distance: Observable<number> = this.routeInfos.pipe(
    map((routeInfos: MapboxRouteInfo[]) => {
      let distance: number = 0
      routeInfos.forEach((routeInfo: MapboxRouteInfo) => distance += routeInfo.routes[ 0 ].distance)

      return distance
    })
  )

  public coordinates: Observable<number[][]> = this.routeInfos.pipe(
    map((routeInfos: MapboxRouteInfo[]) => {
      let coordinatesFromRouteInfos: number[][] = []
      routeInfos.forEach((routeInfo: MapboxRouteInfo) => coordinatesFromRouteInfos = [ ...coordinatesFromRouteInfos, ...routeInfo.routes[ 0 ].geometry.coordinates ])

      return coordinatesFromRouteInfos
    }),
    tap((coordinates: number[][]) => {
      this.currentCoords = coordinates
    })
  )

  public bounds: Observable<any> = this.coordinates.pipe(
    map((coordinates: number[][]) => generateBounds(coordinates))
  )

  public geoJson: Observable<any> = this.coordinates.pipe(
    map((coordinates: number[][]) => generateGeoJsonFeature(coordinates))
  )

  constructor(private routeService: RouteService,
              private activatedRoute: ActivatedRoute,
              private competitionService: CompetitionService,
              private title: Title) {
    super()
  }
}
