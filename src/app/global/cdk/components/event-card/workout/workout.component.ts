import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { MapboxRouteInfo, Route, Workout } from '../../../../domain'
import { map, shareReplay } from 'rxjs/operators'
import { defer, Observable } from 'rxjs'
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

  public route$: Observable<Route> = defer(() => this.routeService.readById(this.workout?.routeId!)).pipe(
    shareReplay(1)
  )

  public routePreview$: Observable<string> = defer(() => this.route$.pipe(
    map((route: Route) => route.routePreview)
  ))

  public routeInfos$: Observable<MapboxRouteInfo[]> = this.route$.pipe(
    map((route: Route) => (JSON.parse(route.routeInfo) as MapboxRouteInfo[]))
  )

  public distance$: Observable<number> = this.routeInfos$.pipe(
    map((routeInfos: MapboxRouteInfo[]) => {
      let distance: number = 0
      routeInfos.forEach((routeInfo: MapboxRouteInfo) => distance += routeInfo.routes[ 0 ].distance)

      return distance
    })
  )

  constructor(private routeService: RouteService) {
    super()
  }
}
