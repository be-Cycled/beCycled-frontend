import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'
import { TUI_IS_ANDROID, TUI_IS_IOS, TuiDay } from '@taiga-ui/cdk'
import { FormControl, FormGroup } from '@angular/forms'
import mapboxgl, { AnyLayer, LngLat } from 'mapbox-gl'
import { MapboxNetworkService } from '../../../../global/services/mapbox-network/mapbox-network.service'
import { DirectionType, MapboxRouteInfo, SportType } from '../../../../global/domain'
import { take } from 'rxjs/operators'
import { generateGeoJsonFeature } from '../../../../global/utils'
import { TUI_MOBILE_AWARE } from '@taiga-ui/kit'
import { EventType } from '../../../../global/models'

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
  public readonly items: any = [
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

  public activeItemIndex: number = 0

  public map: mapboxgl.Map | null = null

  public coordinates: LngLat[] = []
  public startPoint: mapboxgl.Marker | null = null
  public endPoint: mapboxgl.Marker | null = null

  public routeInfos: MapboxRouteInfo[] = []
  public geoJsonFeature: GeoJSON.Feature<GeoJSON.Geometry> = blankGeoJsonFeature

  public preview: string = ''

  public eventForm: FormGroup = new FormGroup({
    eventType: new FormControl(EventType.workout),
    date: new FormControl(),
    sportType: new FormControl(SportType.bicycle),
    venue: new FormControl(),
    description: new FormControl(),
    durationHour: new FormControl(),
    durationMinutes: new FormControl()
  })

  constructor(private mapboxNetworkService: MapboxNetworkService) {
  }

  public ngOnInit(): void {
    this.eventForm.valueChanges.subscribe((data: any) => console.log(data))
  }

  public buildCurrentTuiDay(): TuiDay {
    const currentDate: Date = new Date()

    return new TuiDay(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())
  }

  public onMapboxLoad(map: mapboxgl.Map): void {
    this.map = map

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
  }

  public generateBounds(coordinates: any): any {
    return coordinates.reduce(
      (bounds: mapboxgl.LngLatBounds, coord: any) => {
        return bounds.extend(coord)
      },
      new mapboxgl.LngLatBounds(coordinates[ 0 ], coordinates[ 0 ])
    )
  }

  private updateDirection(): void {
    if (this.map !== null) {
      this.startPoint?.setLngLat(this.coordinates[ 0 ]).addTo(this.map)
      this.endPoint?.setLngLat(this.coordinates[ this.coordinates.length - 1 ]).addTo(this.map)

      /**
       * Т.к. запрос на Directions API может содержать не больше, чем 25 точек,
       * то мы делим массив всех точек на запросы по 25 точки.
       */
      const currentRouteInfoIndex: number = Math.floor((this.coordinates.length - 1) / 25)
      let coordinatesForDirectionApi: mapboxgl.LngLat[] = this.coordinates.slice(currentRouteInfoIndex * 25)

      /**
       * Условие, чтобы отправлялся запрос минимум с двумя точками.
       * Ведь после слайса массив может быть пустой.
       */
      if (coordinatesForDirectionApi.length < 2) {
        coordinatesForDirectionApi = this.coordinates.slice(-2)
      }

      this.mapboxNetworkService
        .buildDirection(coordinatesForDirectionApi, DirectionType.cycling)
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
       * Удаление точек маршрута по клику
       */
      if ((point.originalEvent.target as HTMLElement).className.includes('end-point')) {

        if (this.coordinates.length > 2) {
          this.coordinates.pop()
          this.updateDirection()

        } else if (this.coordinates.length === 2) {

          this.coordinates.pop()
          this.endPoint?.setLngLat(this.coordinates[ this.coordinates.length - 1 ]).addTo(this.map)
          this.resetDirection()
          this.startPoint?.remove()
        } else if (this.coordinates.length === 1) {

          this.coordinates.pop()
          this.resetDirection()
          this.endPoint?.remove()
        }
      } else {

        /**
         * Логика добавления точек маршрута
         */
        this.coordinates.push(point.lngLat)

        if (this.coordinates.length > 1 && this.startPoint !== null) {
          this.updateDirection()
        } else {
          this.endPoint?.setLngLat(coordinates).addTo(this.map)
        }
      }
    }
  }

  public generatePreview(): void {
    this.preview = this.map!.getCanvas().toDataURL()
  }

  public hideMap(): void {
    this.map!.getContainer().classList.add('none')
  }

  public generateTrack(): void {
    const startPoint: number[] = [
      this.coordinates[ 0 ].lng,
      this.coordinates[ 0 ].lat
    ]

    const endPoint: number[] = [
      this.coordinates[ this.coordinates.length - 1 ].lng,
      this.coordinates[ this.coordinates.length - 1 ].lat
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
        'circle-radius': {
          base: 1.75,
          stops: [
            [ 12, 8 ],
            [ 22, 180 ]
          ]
        },
        'circle-color': [
          'match',
          [ 'get', 'pointType' ],
          'Start',
          '#fbb03b',
          'End',
          '#223b53',
          '#cccccc'
        ]
      }
    })
  }

  public onResize(): void {
    /**
     * Готовим точки для фитинга карты
     */
    let coordinatesFromRouteInfos: number[][] = []
    this.routeInfos.forEach((routeInfo: MapboxRouteInfo) => coordinatesFromRouteInfos = [ ...coordinatesFromRouteInfos, ...routeInfo.routes[ 0 ].geometry.coordinates ])

    const bounds: any = this.generateBounds(coordinatesFromRouteInfos)

    /**
     * Вешает хэндлер.
     * Но нужно понимать, что этот хэндлер не гарантирует, что канвас закончил рендеринг.
     */
    this.map!.on('moveend', (evt: mapboxgl.MapboxEvent<any> & mapboxgl.EventData) => {
      if (evt.fitBoundsEnd) {
        this.map!.once('idle', () => {
          this.preview = this.map!.getCanvas().toDataURL()
        })
      }
    })

    this.map!.getContainer().classList.add('resized')
    this.map!.resize().fitBounds(bounds, { padding: 20, linear: true, animate: false }, { fitBoundsEnd: true })
  }

  public onNextButtonClick(): void {
    this.activeItemIndex += 1
  }

  public onBackButtonClick(): void {
    this.activeItemIndex -= 1
  }
}
