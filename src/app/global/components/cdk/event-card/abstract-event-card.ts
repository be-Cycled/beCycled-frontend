import { Directive } from '@angular/core'
import { SportType } from '../../../domain'
import mapboxgl, { AnyLayer } from 'mapbox-gl'
import { ISO8601 } from '../../../models'

@Directive()
export abstract class AbstractEventCard {
  protected currentCoords: number[][] | null = null

  public sportTypeMap: any = {
    [ SportType.bicycle ]: 'Велосипед',
    [ SportType.rollerblade ]: 'Роликовые коньки',
    [ SportType.run ]: 'Бег',
    [ SportType.ski ]: 'Лыжи'
  }

  public map: mapboxgl.Map | null = null

  public generateBounds(coordinates: any): any {
    return coordinates.reduce((bounds: mapboxgl.LngLatBounds, coord: any) => {
        return bounds.extend(coord)
      },
      new mapboxgl.LngLatBounds(coordinates[ 0 ], coordinates[ 0 ]))
  }

  public generateStartTime(date: ISO8601): string {
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

  public onMapboxLoad(map: mapboxgl.Map): void {
    this.map = map
    this.map.getStyle().layers!.forEach((layer: AnyLayer) => {
      if (layer.id.indexOf('-label') > 0) {
        map.setLayoutProperty(layer.id, 'text-field', [ 'get', 'name_ru' ])
      }
    })

    if (this.currentCoords !== null) {
      const marker1: mapboxgl.Marker = new mapboxgl.Marker({ color: 'green' })
        .setLngLat(this.currentCoords![ 0 ] as any)
        .addTo(this.map)

      const marker2: mapboxgl.Marker = new mapboxgl.Marker({ color: 'red' })
        .setLngLat(this.currentCoords![ this.currentCoords!.length - 1 ] as any)
        .addTo(this.map)
    }
  }
}