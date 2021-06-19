import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core'
import mapboxgl from 'mapbox-gl'
import { MapboxRouteInfo, Route, SportType, Workout } from '../../../../domain'
import { ISO8601 } from '../../../../models'
import { RouteService } from '../../../../domain/services/route/route.service'
import { map, shareReplay } from 'rxjs/operators'
import { defer, Observable, ObservedValueOf } from 'rxjs'

@Component({
  selector: 'cy-workout',
  templateUrl: './workout.component.html',
  styleUrls: [ './workout.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkoutComponent implements OnInit {
  public sportTypeMap: any = {
    [ SportType.bicycle ]: 'Велосипед',
    [ SportType.rollerblade ]: 'Роликовые коньки',
    [ SportType.run ]: 'Бег',
    [ SportType.ski ]: 'Лыжи'
  }

  public map: mapboxgl.Map | null = null

  @Input()
  public workout: Workout | null = null

  // tslint:disable-next-line:no-non-null-assertion
  public coordinates: Observable<ObservedValueOf<Observable<number[][]>>> = defer(() => this.routeService.getById(this.workout?.routeId!).pipe(
    map((route: Route) => (JSON.parse(route.routeInfo) as MapboxRouteInfo).routes[ 0 ].geometry.coordinates),
    shareReplay(1)
  ))

  public bounds: Observable<any> = this.coordinates.pipe(
    map((coordinates: number[][]) => this.generateBounds(coordinates))
  )

  public geoJson: Observable<any> = this.coordinates.pipe(
    map((coordinates: number[][]) => this.generateGeoJson(coordinates))
  )

  constructor(private routeService: RouteService) {
  }

  public ngOnInit(): void {
  }

  public generateBounds(coordinates: any): any {
    return coordinates.reduce((bounds: mapboxgl.LngLatBounds, coord: any) => {
        return bounds.extend(coord)
      },
      new mapboxgl.LngLatBounds(coordinates[ 0 ], coordinates[ 0 ]))
  }

  public generateWorkoutStartTime(date: ISO8601): string {
    const parsedDate: Date = new Date(date)
    return new Intl.DateTimeFormat('ru-RU', { hour: 'numeric', minute: 'numeric' }).format(parsedDate)
  }

  public generateGeoJson(coordinates: number[][]): any {
    return {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates
      }
    }
  }
}
