import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'
import { Competition, MapboxRouteInfo, Route, SportType, Workout } from '../../../../global/domain'
import mapboxgl, { AnyLayer } from 'mapbox-gl'
import { Observable, ObservedValueOf } from 'rxjs'
import { ActivatedRoute, ParamMap } from '@angular/router'
import { map, shareReplay, switchMap } from 'rxjs/operators'
import { RouteService } from '../../../../global/domain/services/route/route.service'
import { ISO8601 } from '../../../../global/models'
import { CompetitionService } from '../../../../global/domain/services/competition/competition.service'

@Component({
  selector: 'cy-competition-page',
  templateUrl: './competition-page.component.html',
  styleUrls: [ './competition-page.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompetitionPageComponent implements OnInit {

  public sportTypeMap: any = {
    [ SportType.bicycle ]: 'Велосипед',
    [ SportType.rollerblade ]: 'Роликовые коньки',
    [ SportType.run ]: 'Бег',
    [ SportType.ski ]: 'Лыжи'
  }

  public map: mapboxgl.Map | null = null

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
    map((routeInfo: MapboxRouteInfo) => routeInfo.routes[ 0 ].geometry.coordinates)
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
    return new Intl.DateTimeFormat('ru-RU', {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(parsedDate)
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

  public generateDistanceString(distance: number): string {
    const distanceInKilometres: number = Math.ceil(distance / 1000)

    return `${ distanceInKilometres } км`
  }

  /**
   * words - массив с тремя формами, например, "час, часа, часов"
   */
  public buildCountString(count: number, words: string[]): string {
    if ((count >= 5 && count <= 19) || (count % 10 >= 5 && count % 10 <= 9) || count % 10 === 0) {
      return `${ count } ${ words[ 2 ] }`
    }

    return (count % 10 === 1) ? `${ count } ${ words[ 0 ] }` : `${ count } ${ words[ 1 ] }`
  }

  public generateDurationString(duration: number): string {
    let hours: number = 0
    let minutes: number = 0

    if (duration < 60) {
      return `${ duration } ${ this.buildCountString(duration, [ 'минута', 'минуты', 'минут' ]) }`
    }

    hours = Math.floor(duration / 60)
    minutes = duration - (hours * 60)

    return `${ this.buildCountString(hours, [ 'час', 'часа', 'часов' ]) }
     ${ minutes === 0
      ? ''
      : this.buildCountString(minutes, [ 'минута', 'минуты', 'минут' ]) }`
  }

  public changeMapLanguage(map: mapboxgl.Map): void {
    this.map = map
    this.map.getStyle().layers!.forEach((layer: AnyLayer) => {
      if (layer.id.indexOf('-label') > 0) {
        map.setLayoutProperty(layer.id, 'text-field', [ 'get', 'name_ru' ])
      }
    })
  }
}
