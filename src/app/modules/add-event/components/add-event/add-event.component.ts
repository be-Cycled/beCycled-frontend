import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { Title } from '@angular/platform-browser'
import { Router } from '@angular/router'
import {
  TUI_IS_ANDROID,
  TUI_IS_IOS,
  TUI_IS_MOBILE,
  TuiContextWithImplicit,
  TuiDay,
  tuiPure,
  TuiStringHandler,
  TuiTime
} from '@taiga-ui/cdk'
import { TuiNotification, TuiNotificationsService } from '@taiga-ui/core'
import { TUI_MOBILE_AWARE } from '@taiga-ui/kit'
import mapboxgl, { AnyLayer, LngLat, LngLatBoundsLike } from 'mapbox-gl'
import { Observable } from 'rxjs'
import { map, startWith, switchMap, take, tap } from 'rxjs/operators'
import {
  BaseEventType,
  BicycleCompetitionType,
  BicycleType,
  DirectionType,
  EventType,
  MapboxRouteGeoData,
  Route,
  SportType,
  User
} from '../../../../global/domain'
import { EventService } from '../../../../global/domain/services/event/event.service'
import { RouteService } from '../../../../global/domain/services/route/route.service'
import { BaseEventDto, BicycleCompetitionDto } from '../../../../global/dto'
import { BicycleWorkoutDto } from '../../../../global/dto/event/bicycle-workout-dto'
import { ISO8601 } from '../../../../global/models'
import { ConfigService, ImageNetworkService, UserStoreService } from '../../../../global/services'
import { MapboxNetworkService } from '../../../../global/services/mapbox-network/mapbox-network.service'
import { detectEventTypeBySportType, generateBounds, generateGeoJsonFeature } from '../../../../global/utils'

const blankGeoJsonFeature: GeoJSON.Feature<GeoJSON.Geometry> = {
  type: 'Feature',
  properties: {},
  geometry: {
    type: 'LineString',
    coordinates: []
  }
}

interface EnumValueWithLabel<T> {
  value: T
  label: string
}

type BicycleEventDto = BicycleWorkoutDto | BicycleCompetitionDto

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
    },
    {
      provide: TUI_IS_MOBILE,
      useValue: false
    }
  ]
})
export class AddEventComponent implements OnInit {
  public isUserAuthorized$: Observable<boolean> = this.userStoreService.isAuthChanges

  public isLoading: boolean = false

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

  public readonly eventTypesWithLabels: EnumValueWithLabel<BaseEventType>[] = [
    {
      value: BaseEventType.workout,
      label: 'Тренировка'
    },
    {
      value: BaseEventType.competition,
      label: 'Соревнование'
    }
  ]

  public readonly sportTypesWithLabels: EnumValueWithLabel<SportType>[] = [
    {
      value: SportType.bicycle,
      label: 'Велосипед'
    },
    {
      value: SportType.run,
      label: 'Бег'
    },
    {
      value: SportType.rollerblade,
      label: 'Роликовые коньки'
    }
  ]

  public readonly bicycleCompetitionTypesWithLabels: EnumValueWithLabel<BicycleCompetitionType>[] = [
    {
      value: BicycleCompetitionType.individual,
      label: 'ITT'
    },
    {
      value: BicycleCompetitionType.group,
      label: 'Групповая'
    }
  ]

  public readonly bicycleTypesWithLabels: EnumValueWithLabel<BicycleType>[] = [
    {
      value: BicycleType.any,
      label: 'Любой'
    },
    {
      value: BicycleType.road,
      label: 'Шоссейный'
    },
    {
      value: BicycleType.mountain,
      label: 'Горный'
    },
    {
      value: BicycleType.gravel,
      label: 'Гревел'
    }
  ]

  public activeTabIndex: number = 0

  public map: mapboxgl.Map | null = null

  public venueCoordinates: LngLat | null = null
  public venueMarker: mapboxgl.Marker | null = null

  public trackCoordinates: LngLat[] = []
  public startPoint: mapboxgl.Marker | null = null
  public endPoint: mapboxgl.Marker | null = null

  public routeGeoData: MapboxRouteGeoData[] = []
  public geoJsonFeature: GeoJSON.Feature<GeoJSON.Geometry> = blankGeoJsonFeature

  public preview: string = ''

  public eventForm: FormGroup = new FormGroup({
    eventType: new FormControl(BaseEventType.workout, Validators.required),
    bicycleCompetitionType: new FormControl(BicycleCompetitionType.individual),
    startDay: new FormControl(null, Validators.required),
    startTime: new FormControl(null, Validators.required),
    sportType: new FormControl(SportType.bicycle, Validators.required),
    bicycleType: new FormControl(BicycleType.any),
    description: new FormControl(),
    durationHours: new FormControl(),
    durationMinutes: new FormControl(),
    url: new FormControl('')
  })

  public isPublishButtonDisabled: Observable<boolean> = this.eventForm.valueChanges.pipe(
    startWith(false),
    map(() => this.eventForm.invalid
      || this.trackCoordinates.length < 2
      || this.venueMarker === null)
  )

  constructor(private mapboxNetworkService: MapboxNetworkService,
              private userStoreService: UserStoreService,
              private eventService: EventService,
              private routeService: RouteService,
              private routerService: Router,
              private title: Title,
              private notificationsService: TuiNotificationsService,
              private imageNetworkService: ImageNetworkService,
              private configService: ConfigService) {
    this.title.setTitle(`Новое событие`)
  }

  private generateStartDateIsoString(): ISO8601 {
    const startDay: TuiDay = this.eventForm.value.startDay
    const startTime: TuiTime = this.eventForm.value.startTime
    const startDateUtc: Date = startDay.toUtcNativeDate()
    startDateUtc.setHours(startTime.hours, startTime.minutes)

    return startDateUtc.toISOString() as ISO8601
  }

  private generateDurationInSeconds(): number {
    const durationHours: number = this.eventForm.value.durationHours
      ? this.eventForm.value.durationHours
      : 0

    const durationMinutes: number = this.eventForm.value.durationMinutes
      ? this.eventForm.value.durationMinutes
      : 0

    return (durationHours * 60 + durationMinutes) * 60
  }

  private generateEventBodyByRouteAndUserId(route: Route, userId: number): BaseEventDto | BicycleEventDto {
    const eventType: EventType | null = detectEventTypeBySportType(this.eventForm.value.eventType, this.eventForm.value.sportType)

    if (eventType !== null) {
      const baseEventProperties: BaseEventDto = {
        id: null,
        ownerUserId: userId,
        communityId: null,
        startDate: this.generateStartDateIsoString(),
        routeId: route.id,
        venueGeoData: JSON.stringify(this.venueCoordinates),
        memberUserIds: [ userId ],
        duration: this.generateDurationInSeconds(),
        description: this.eventForm.value.description,
        url: this.eventForm.value.url,
        createdAd: null,
        eventType
      }

      /**
       * Если выбрано соревнование и велосипед.
       * @link BicycleCompetitionDto
       */
      if (this.eventForm.value.eventType === BaseEventType.competition
        && this.eventForm.value.sportType === SportType.bicycle) {
        return {
          ...baseEventProperties,
          bicycleType: this.eventForm.value.bicycleType,
          bicycleCompetitionType: this.eventForm.value.bicycleCompetitionType
        }
      }

      /**
       * Если выбрана тренировка и велосипед.
       * @link BicycleWorkoutDto
       */
      if (this.eventForm.value.eventType === BaseEventType.workout
        && this.eventForm.value.sportType === SportType.bicycle) {
        return {
          ...baseEventProperties,
          bicycleType: this.eventForm.value.bicycleType
        }
      }

      /**
       * Базовое тело события.
       * @link BaseEventDto
       */
      return baseEventProperties
    }

    throw new Error('Не удалось определить тип события')
  }

  private createRouteByUserId(userId: number): Observable<Route> {
    return this.routeService.create({
      id: null,
      userId: userId,
      name: null,
      routeGeoData: JSON.stringify(this.routeGeoData),
      routePreview: this.preview,
      sportTypes: [ this.eventForm.value.sportType ],
      disposable: true,
      description: '',
      popularity: 0,
      createdAt: null
    })
  }

  public ngOnInit(): void {
  }

  /**
   * Взято из примера на сайте Taiga UI. Типизация "подшаманена".
   */
  @tuiPure
  public stringify<T>(items: ReadonlyArray<EnumValueWithLabel<T>>): TuiStringHandler<TuiContextWithImplicit<T>> {
    const map: Map<T, string> = new Map(items.map((item: EnumValueWithLabel<T>) => [ item.value, item.label ]))

    return ({ $implicit }: TuiContextWithImplicit<T>) => {
      const tuiContextWithImplicit: string | undefined = map.get($implicit)

      if (typeof tuiContextWithImplicit !== 'undefined') {
        return tuiContextWithImplicit as any
      }

      return '' as any
    }
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
    this.venueMarker = new mapboxgl.Marker({ color: '#FF6639' })
  }

  private getCurrentDirectionType(): DirectionType {
    switch (this.eventForm.value.sportType) {
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
        .subscribe((response: MapboxRouteGeoData) => {

          /**
           * Это нужно для очистки элементов, когда идет удаление точек.
           */
          if (this.routeGeoData.length > currentRouteInfoIndex + 1) {
            this.routeGeoData = this.routeGeoData.slice(0, currentRouteInfoIndex + 1)
          }

          this.routeGeoData[ currentRouteInfoIndex ] = response

          let coordinatesFromRouteInfos: number[][] = []
          this.routeGeoData.forEach((routeInfo: MapboxRouteGeoData) => coordinatesFromRouteInfos = [ ...coordinatesFromRouteInfos, ...routeInfo.routes[ 0 ].geometry.coordinates ])

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
        this.venueMarker?.setLngLat(coordinates).addTo(this.map)
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

    const currentUser: User | null = this.userStoreService.user
    if (currentUser !== null) {
      this.isLoading = true

      /**
       * Готовим точки для фитинга карты
       */
      let coordinatesFromRouteInfos: number[][] = []
      this.routeGeoData.forEach((routeInfo: MapboxRouteGeoData) =>
        coordinatesFromRouteInfos = [ ...coordinatesFromRouteInfos, ...routeInfo.routes[ 0 ].geometry.coordinates ])

      const bounds: LngLatBoundsLike = generateBounds(coordinatesFromRouteInfos)

      /**
       * Хендлер, который гарантирует, что канвас закончил рендеринг элементов.
       */
      this.map!.on('moveend', (evt: mapboxgl.MapboxEvent<any> & mapboxgl.EventData) => {
        if (evt.fitBoundsEnd) {
          this.map!.once('idle', () => {

            /**
             * Создаем Blob, чтобы загрузить его на наш сервер
             */
            this.map!.getCanvas().toBlob((blob: Blob | null) => {
              if (blob === null) {
                return
              }

              const uploadImageData: FormData = new FormData()

              uploadImageData.append('imageFile', blob, 'route.png')

              /**
               * Загружаем сгенерированное preview на сервер
               */
              this.imageNetworkService.uploadImage(uploadImageData).pipe(
                switchMap((imageName: string) => {
                  this.preview = `${ this.configService.apiImageUrl }/${ imageName }`

                  /**
                   * Создаем маршрут с указанием в preview имени файла с картинкой
                   */
                  return this.createRouteByUserId(currentUser.id).pipe(
                    switchMap((route: Route) => {

                      /**
                       * Создаем событие в зависимости от выбранного типа
                       */
                      return this.eventService.create(this.generateEventBodyByRouteAndUserId(route, currentUser.id)).pipe(
                        tap(() => {
                          this.isLoading = false

                          this.notificationsService
                            .show('Тренировка успешно добавлена', {
                              status: TuiNotification.Success
                            }).subscribe()

                          this.routerService.navigateByUrl('/')
                        })
                      )
                    })
                  )
                }),
                take(1)
              ).subscribe()

            })
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
