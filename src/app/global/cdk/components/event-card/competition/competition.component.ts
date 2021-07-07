import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { Competition, MapboxRouteInfo, Route } from '../../../../domain'
import { defer, Observable, ObservedValueOf } from 'rxjs'
import { map, shareReplay, tap } from 'rxjs/operators'
import { RouteService } from '../../../../domain/services/route/route.service'
import { AbstractEventCard } from '../abstract-event-card'
import { generateBounds, generateGeoJsonFeature } from '../../../../utils'

@Component({
  selector: 'cy-competition',
  templateUrl: './competition.component.html',
  styleUrls: [ './competition.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompetitionComponent extends AbstractEventCard {
  @Input()
  public competition: Competition | null = null

  public route: Observable<Route> = defer(() => this.routeService.getById(this.competition?.routeId!)).pipe(
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
    map((coordinates: number[][]) => generateBounds(coordinates))
  )

  public geoJson: Observable<any> = this.coordinates.pipe(
    map((coordinates: number[][]) => generateGeoJsonFeature(coordinates))
  )

  constructor(private routeService: RouteService) {
    super()
  }
}
