import { ChangeDetectionStrategy, Component } from '@angular/core'
import { Competition, MapboxRouteInfo, Route, Workout } from '../../../../global/domain'
import { Observable, ObservedValueOf } from 'rxjs'
import { ActivatedRoute, ParamMap } from '@angular/router'
import { map, shareReplay, switchMap, tap } from 'rxjs/operators'
import { RouteService } from '../../../../global/domain/services/route/route.service'
import { CompetitionService } from '../../../../global/domain/services/competition/competition.service'
import { AbstractEventPage } from '../../../../global/components/cdk/AbstractEventPage'

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
    shareReplay(1)
  )

  public route: Observable<Route> = this.competition$.pipe(
    switchMap((workout: Workout) => this.routeService.getById(workout.routeId)),
    shareReplay(1)
  )

  public routeInfo: Observable<MapboxRouteInfo> = this.route.pipe(
    map((route: Route) => (JSON.parse(route.routeInfo) as MapboxRouteInfo))
  )

  public distance: Observable<number> = this.routeInfo.pipe(
    map((routeInfo: MapboxRouteInfo) => routeInfo.routes[ 0 ].distance)
  )

  public coordinates: Observable<ObservedValueOf<Observable<number[][]>>> = this.routeInfo.pipe(
    map((routeInfo: MapboxRouteInfo) => routeInfo.routes[ 0 ].geometry.coordinates),
    tap((coordinates: number[][]) => {
      this.currentCoords = coordinates
    })
  )

  public bounds: Observable<any> = this.coordinates.pipe(
    map((coordinates: number[][]) => this.generateBounds(coordinates))
  )

  public geoJson: Observable<any> = this.coordinates.pipe(
    map((coordinates: number[][]) => this.generateGeoJson(coordinates))
  )

  constructor(private routeService: RouteService,
              private activatedRoute: ActivatedRoute,
              private competitionService: CompetitionService) {
    super()
  }
}
