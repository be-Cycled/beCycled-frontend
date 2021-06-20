import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { MapboxRouteInfo, Route, Workout } from '../../../../domain'
import { map, shareReplay, tap } from 'rxjs/operators'
import { defer, Observable, ObservedValueOf } from 'rxjs'
import { AbstractEventCard } from '../abstract-event-card'
import { RouteService } from '../../../../domain/services/route/route.service'

@Component({
  selector: 'cy-workout',
  templateUrl: './workout.component.html',
  styleUrls: [ './workout.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkoutComponent extends AbstractEventCard {
  @Input()
  public workout: Workout | null = null

  public route: Observable<Route> = defer(() => this.routeService.getById(this.workout?.routeId!)).pipe(
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

  constructor(private routeService: RouteService) {
    super()
  }
}
