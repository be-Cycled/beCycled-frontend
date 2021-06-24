import { ChangeDetectionStrategy, Component } from '@angular/core'
import { MapboxRouteInfo, Route, Workout } from '../../../global/domain'
import { Observable, ObservedValueOf } from 'rxjs'
import { map, shareReplay, switchMap, tap } from 'rxjs/operators'
import { RouteService } from '../../../global/domain/services/route/route.service'
import { ActivatedRoute, ParamMap } from '@angular/router'
import { WorkoutService } from '../../../global/domain/services/workout/workout.service'
import { AbstractEventPage } from '../../../global/cdk/components/abstract-event-page'

@Component({
  selector: 'cy-workout-page',
  templateUrl: './workout-page.component.html',
  styleUrls: [ './workout-page.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkoutPageComponent extends AbstractEventPage {
  public workout$: Observable<Workout> = this.activatedRoute.paramMap.pipe(
    map((paramMap: ParamMap) => paramMap.get('id')),
    switchMap((id: string | null) => this.workoutService.getById(Number.parseInt(id!, 10))),
    shareReplay(1)
  )

  public route: Observable<Route> = this.workout$.pipe(
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
              private workoutService: WorkoutService) {
    super()
  }
}
