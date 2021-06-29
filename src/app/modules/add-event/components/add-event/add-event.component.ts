import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'
import { TuiDay } from '@taiga-ui/cdk'
import { FormControl, FormGroup } from '@angular/forms'
import mapboxgl, { AnyLayer, LngLat } from 'mapbox-gl'
import { MapboxNetworkService } from '../../../../global/services/mapbox-network/mapbox-network.service'
import { DirectionType, MapboxRouteInfo } from '../../../../global/domain'
import { take } from 'rxjs/operators'

const blankGeoJson: any = {
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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddEventComponent implements OnInit {
  public coordinates: LngLat[] = []
  public map: mapboxgl.Map | null = null
  public startPoint: mapboxgl.Marker | null = null
  public endPoint: mapboxgl.Marker | null = null
  public routeInfo: MapboxRouteInfo | null = null
  public geoJson: any = blankGeoJson
  public preview: string = ''
  private firstClick: boolean = true

  public form: FormGroup = new FormGroup({
    date: new FormControl()
  })

  constructor(private mapboxNetworkService: MapboxNetworkService) {
  }

  public ngOnInit(): void {
  }

  public buildCurrentDate(): TuiDay {
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

  private updateDirection(): void {
    if (this.map !== null) {
      this.startPoint?.setLngLat(this.coordinates[ 0 ]).addTo(this.map)
      this.endPoint?.setLngLat(this.coordinates[ this.coordinates.length - 1 ]).addTo(this.map)

      this.mapboxNetworkService
        .buildDirection(this.coordinates, DirectionType.cycling)
        .pipe(take(1))
        .subscribe((response: MapboxRouteInfo) => {
          this.routeInfo = response
          this.geoJson = this.generateGeoJson(response.routes[ 0 ].geometry.coordinates)

          if (this.map !== null) {
            (this.map.getSource('geojson-route') as mapboxgl.GeoJSONSource).setData(this.geoJson)
          }
        })
    }
  }

  private resetDirection(): void {
    if (this.map !== null) {
      this.geoJson = blankGeoJson;
      (this.map.getSource('geojson-route') as mapboxgl.GeoJSONSource).setData(this.geoJson)
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

  /**
   * TODO: Стандартизировать маркеры. Обдумать вариант рисовать стартовый маркер на canvas, а не через DOM.
   */
  public onDblMapClick(): void {
    if (this.firstClick) {
      this.map?.loadImage(
        'https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png',
        (error: Error | undefined, image: any) => {
          if (error) {
            throw error
          }

          this.map?.addImage('custom-marker', image)

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
                    title: 'Старт'
                  }
                },
                {
                  type: 'Feature',
                  geometry: {
                    type: 'Point',
                    coordinates: endPoint
                  },
                  properties: {
                    title: 'Финиш'
                  }
                }
              ]
            }
          })

          this.map?.addLayer({
            id: 'points',
            type: 'symbol',
            source: 'points',
            layout: {
              'icon-image': 'custom-marker',
              'text-field': [ 'get', 'title' ],
              'text-font': [
                'Open Sans Semibold',
                'Arial Unicode MS Bold'
              ],
              'text-offset': [ 0, 1.25 ],
              'text-anchor': 'top'
            }
          })
        }
      )

      this.firstClick = false
    } else {
      if (this.map !== null) {
        this.preview = this.map.getCanvas().toDataURL()
      }
    }
  }
}