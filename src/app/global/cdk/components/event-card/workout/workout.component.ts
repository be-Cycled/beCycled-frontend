import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { MapboxRouteInfo, Route, Workout } from '../../../../domain'
import { map, shareReplay, tap } from 'rxjs/operators'
import { defer, Observable } from 'rxjs'
import { AbstractEventCard } from '../abstract-event-card'
import { RouteService } from '../../../../domain/services/route/route.service'
import { generateBounds, generateGeoJsonFeature } from '../../../../utils'

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

  constructor(private routeService: RouteService) {
    super()
  }
}
