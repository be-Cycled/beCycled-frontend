import { ChangeDetectionStrategy, Component } from '@angular/core'
import { Title } from '@angular/platform-browser'
import { ActivatedRoute, ParamMap } from '@angular/router'
import { Observable } from 'rxjs'
import { map, shareReplay, switchMap, tap } from 'rxjs/operators'
import { AbstractEventPage } from '../../../global/cdk/components/abstract-event-page'
import { MapboxRouteInfo, Route, Workout } from '../../../global/domain'
import { RouteService } from '../../../global/domain/services/route/route.service'
import { WorkoutService } from '../../../global/domain/services/workout/workout.service'
import { generateBounds, generateGeoJsonFeature, generateStartTime, getWorkoutListDate } from '../../../global/utils'

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
    shareReplay(1),
    tap((workout: Workout) => {
      this.title.setTitle(`Тренировка ${ getWorkoutListDate(workout.startDate) } ${ generateStartTime(workout.startDate) }`)
    })
  )

  public route: Observable<Route> = this.workout$.pipe(
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
              private workoutService: WorkoutService,
              private title: Title) {
    super()
  }
}
