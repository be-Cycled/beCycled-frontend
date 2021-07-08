import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'
import { TUI_IS_ANDROID, TUI_IS_IOS, TuiDay, TuiTime } from '@taiga-ui/cdk'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import mapboxgl, { AnyLayer, LngLat, LngLatBoundsLike } from 'mapbox-gl'
import { MapboxNetworkService } from '../../../../global/services/mapbox-network/mapbox-network.service'
import { DirectionType, MapboxRouteInfo, SportType, User, Workout } from '../../../../global/domain'
import { map, startWith, take } from 'rxjs/operators'
import { generateBounds, generateGeoJsonFeature } from '../../../../global/utils'
import { TUI_MOBILE_AWARE } from '@taiga-ui/kit'
import { EventType, ISO8601 } from '../../../../global/models'
import { Observable } from 'rxjs'
import { UserHolderService } from '../../../../global/services'
import { WorkoutService } from '../../../../global/domain/services/workout/workout.service'
import { CompetitionService } from '../../../../global/domain/services/competition/competition.service'

const blankGeoJsonFeature: GeoJSON.Feature<GeoJSON.Geometry> = {
  type: 'Feature',
  properties: {},
  geometry: {
    type: 'LineString',
    coordinates: []
  }
}

@Component({
  selector: 'cy-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: [ './add-event.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: TUI_MOBILE_AWARE,
      useValue: true
    },
    {
      provide: TUI_IS_IOS,
      useValue: false
    },
    {
      provide: TUI_IS_ANDROID,
      useValue: true
    }
  ]
})
export class AddEventComponent implements OnInit {
  public readonly tabs: any = [
    {
      text: 'Вид спорта',
      icon: 'emoji_people'
    },
    {
      text: 'Дата',
      icon: 'event'
    },
    {
      text: 'Маршрут',
      icon: 'map'
    },
    {
      text: 'Место сбора',
      icon: 'place'
    },
    {
      text: 'Описание',
      icon: 'description'
    }
  ]

  public activeTabIndex: number = 0

  public map: mapboxgl.Map | null = null

  public venueCoordinates: LngLat | null = null
  public venuePoint: mapboxgl.Marker | null = null

  public trackCoordinates: LngLat[] = []
  public startPoint: mapboxgl.Marker | null = null
  public endPoint: mapboxgl.Marker | null = null

  public routeInfos: MapboxRouteInfo[] = []
  public geoJsonFeature: GeoJSON.Feature<GeoJSON.Geometry> = blankGeoJsonFeature

  public preview: string = ''

  public eventForm: FormGroup = new FormGroup({
    eventType: new FormControl(EventType.workout, Validators.required),
    /**
     * TODO: Валидация проходит, даже если не заполнено поле времени
     */
    startDate: new FormControl(null, Validators.required),
    sportType: new FormControl(SportType.bicycle, Validators.required),
    description: new FormControl(),
    durationHour: new FormControl(),
    durationMinutes: new FormControl()
  })

  public isPublishButtonDisabled: Observable<boolean> = this.eventForm.valueChanges.pipe(
    startWith(false),
    map(() => this.eventForm.invalid || this.trackCoordinates.length < 2 || this.venuePoint === null)
  )

  constructor(private mapboxNetworkService: MapboxNetworkService,
              private userHolderService: UserHolderService,
              private workoutService: WorkoutService,
              private competitionService: CompetitionService) {
  }

  public ngOnInit(): void {
  }

  public buildCurrentTuiDay(): TuiDay {
    const currentDate: Date = new Date()

    return new TuiDay(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())
  }

  public onMapboxLoad(map: mapboxgl.Map): void {
    this.map = map

    /**
     * Русская локализация
     */
    this.map.getStyle().layers!.forEach((layer: AnyLayer) => {
      if (layer.id.indexOf('-label') > 0) {
        map.setLayoutProperty(layer.id, 'text-field', [ 'get', 'name_ru' ])
      }
    })

    const startPoint: HTMLElement = document.createElement('div')
    startPoint.className = 'start-point'

    const endPoint: HTMLElement = document.createElement('div')
    endPoint.className = 'end-point'

    this.startPoint = new mapboxgl.Marker(startPoint)
    this.endPoint = new mapboxgl.Marker(endPoint)
    this.venuePoint = new mapboxgl.Marker({ color: '#FF6639' })
  }

  private getCurrentDirectionType(): DirectionType {
    switch (this.eventForm.get('sportType')?.value) {
      case SportType.bicycle:
        return DirectionType.driving
      case SportType.rollerblade:
        return DirectionType.walking
      case SportType.run:
        return DirectionType.driving
      default:
        return DirectionType.driving
    }
  }

  private updateDirection(): void {
    if (this.map !== null) {
      this.startPoint?.setLngLat(this.trackCoordinates[ 0 ]).addTo(this.map)
      this.endPoint?.setLngLat(this.trackCoordinates[ this.trackCoordinates.length - 1 ]).addTo(this.map)

      /**
       * Т.к. запрос на Directions API может содержать не больше, чем 25 точек,
       * то мы делим массив всех точек на запросы по 25 точки.
       */
      const currentRouteInfoIndex: number = Math.floor((this.trackCoordinates.length - 1) / 25)
      let coordinatesForDirectionApi: mapboxgl.LngLat[] = this.trackCoordinates.slice(currentRouteInfoIndex * 25)

      /**
       * Условие, чтобы отправлялся запрос минимум с двумя точками.
       * Ведь после слайса массив может быть пустой.
       */
      if (coordinatesForDirectionApi.length < 2) {
        coordinatesForDirectionApi = this.trackCoordinates.slice(-2)
      }

      this.mapboxNetworkService
        .buildDirection(coordinatesForDirectionApi, this.getCurrentDirectionType())
        .pipe(take(1))
        .subscribe((response: MapboxRouteInfo) => {

          /**
           * Это нужно для очистки элементов, когда идет удаление точек.
           */
          if (this.routeInfos.length > currentRouteInfoIndex + 1) {
            this.routeInfos = this.routeInfos.slice(0, currentRouteInfoIndex + 1)
          }

          this.routeInfos[ currentRouteInfoIndex ] = response

          let coordinatesFromRouteInfos: number[][] = []
          this.routeInfos.forEach((routeInfo: MapboxRouteInfo) => coordinatesFromRouteInfos = [ ...coordinatesFromRouteInfos, ...routeInfo.routes[ 0 ].geometry.coordinates ])

          this.geoJsonFeature = generateGeoJsonFeature(coordinatesFromRouteInfos)

          if (this.map !== null) {
            (this.map.getSource('geojson-route') as mapboxgl.GeoJSONSource).setData(this.geoJsonFeature)
          }
        })
    }
  }

  private resetDirection(): void {
    if (this.map !== null) {
      this.geoJsonFeature = blankGeoJsonFeature;
      (this.map.getSource('geojson-route') as mapboxgl.GeoJSONSource).setData(this.geoJsonFeature)
    }
  }

  public onMapClick(point: mapboxgl.MapMouseEvent & mapboxgl.EventData): void {
    const coordinates: mapboxgl.LngLat = point.lngLat
    if (this.map !== null) {

      /**
       * Логика добавления точки сбора
       */
      if (this.activeTabIndex === 3) {

        this.venueCoordinates = coordinates
        this.venuePoint?.setLngLat(coordinates).addTo(this.map)
      } else {

        /**
         * Удаление точек маршрута по клику
         */
        if ((point.originalEvent.target as HTMLElement).className.includes('end-point')) {

          if (this.trackCoordinates.length > 2) {
            this.trackCoordinates.pop()
            this.updateDirection()
          } else if (this.trackCoordinates.length === 2) {
            this.trackCoordinates.pop()
            this.endPoint?.setLngLat(this.trackCoordinates[ this.trackCoordinates.length - 1 ]).addTo(this.map)
            this.resetDirection()
            this.startPoint?.remove()
          } else if (this.trackCoordinates.length === 1) {
            this.trackCoordinates.pop()
            this.resetDirection()
            this.endPoint?.remove()
          }
        } else {

          /**
           * Логика добавления точек маршрута
           */
          this.trackCoordinates.push(point.lngLat)

          if (this.trackCoordinates.length > 1 && this.startPoint !== null) {
            this.updateDirection()
          } else {
            this.endPoint?.setLngLat(coordinates).addTo(this.map)
          }
        }
      }
    }
  }

  public generatePreview(): void {
    this.preview = this.map!.getCanvas().toDataURL()
  }

  public drawTrackPointsOnCanvas(): void {
    const startPoint: number[] = [
      this.trackCoordinates[ 0 ].lng,
      this.trackCoordinates[ 0 ].lat
    ]

    const endPoint: number[] = [
      this.trackCoordinates[ this.trackCoordinates.length - 1 ].lng,
      this.trackCoordinates[ this.trackCoordinates.length - 1 ].lat
    ]

    this.map?.addSource('points', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: startPoint
            },
            properties: {
              pointType: 'Start'
            }
          },
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: endPoint
            },
            properties: {
              pointType: 'End'
            }
          }
        ]
      }
    })

    this.map?.addLayer({
      id: 'points',
      type: 'circle',
      source: 'points',
      paint: {
        'circle-radius': 6,
        'circle-color': [
          'match',
          [ 'get', 'pointType' ],
          'Start',
          '#5ABF5A',
          'End',
          '#FF6639',
          '#cccccc'
        ],
        'circle-stroke-color': '#FFFFFF',
        'circle-stroke-width': 2
      }
    })
  }

  public onPublishButtonClick(): void {
    this.drawTrackPointsOnCanvas()
    const currentUser: User | null = this.userHolderService.getUser()
    if (currentUser !== null) {

      /**
       * Готовим точки для фитинга карты
       */
      let coordinatesFromRouteInfos: number[][] = []
      this.routeInfos.forEach((routeInfo: MapboxRouteInfo) =>
        coordinatesFromRouteInfos = [ ...coordinatesFromRouteInfos, ...routeInfo.routes[ 0 ].geometry.coordinates ])

      const bounds: LngLatBoundsLike = generateBounds(coordinatesFromRouteInfos)

      /**
       * Хендлер, который гарантирует, что канвас закончил рендеринг элементов.
       */
      this.map!.on('moveend', (evt: mapboxgl.MapboxEvent<any> & mapboxgl.EventData) => {
        if (evt.fitBoundsEnd) {
          this.map!.once('idle', () => {
            this.generatePreview()

            const startDateValue: [ TuiDay, TuiTime ] = this.eventForm.get('startDate')?.value
            const [ startDay, startTime ]: [ TuiDay, TuiTime ] = startDateValue
            const startDateUtc: Date = startDay.toUtcNativeDate()
            startDateUtc.setHours(startTime.hours, startTime.minutes)

            const workout: Workout = {
              id: null,
              userId: currentUser.id,
              communityId: null,
              private: false,
              startDate: startDateUtc.toISOString() as ISO8601,
              routeId: 0,
              sportType: this.eventForm.get('sportType')?.value,
              venue: JSON.stringify(this.venueCoordinates),
              userIds: [ currentUser.id ],
              duration: 0,
              description: this.eventForm.get('description')?.value,
              createdAd: '' as ISO8601
            }

            console.log(workout)
          })
        }
      })

      /**
       * Подгоняем карту под требуемый размер preview.
       */
      this.map!.getContainer().classList.add('resized')
      this.map!.resize().fitBounds(bounds, { padding: 20, linear: true, animate: false }, { fitBoundsEnd: true })
    }
  }

  public onNextButtonClick(): void {
    this.activeTabIndex += 1
  }

  public onBackButtonClick(): void {
    this.activeTabIndex -= 1
  }
}
