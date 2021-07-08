import { Directive } from '@angular/core'
import mapboxgl, { AnyLayer } from 'mapbox-gl'
import { SportType } from '../../../domain'
import { ISO8601 } from '../../../models'
import { buildCountString } from '../../../utils'

@Directive()
export abstract class AbstractEventCard {
  protected currentCoords: number[][] | null = null

  public sportTypeMap: Record<SportType, string> = {
    [ SportType.bicycle ]: 'Велосипед',
    [ SportType.rollerblade ]: 'Роликовые коньки',
    [ SportType.run ]: 'Бег',
    [ SportType.ski ]: 'Лыжи'
  }

  public map: mapboxgl.Map | null = null

  public generateStartTime(date: ISO8601): string {
    const parsedDate: Date = new Date(date)
    return new Intl.DateTimeFormat('ru-RU', { hour: 'numeric', minute: 'numeric' }).format(parsedDate)
  }

  public generateDistanceString(distance: number): string {
    const distanceInKilometres: number = Math.ceil(distance / 1000)

    return `${ distanceInKilometres } км`
  }

  public generateDurationString(duration: number): string {
    let hours: number = 0
    let minutes: number = 0

    if (duration < 60) {
      return `${ buildCountString(duration, [ 'минута', 'минуты', 'минут' ]) }`
    }

    hours = Math.floor(duration / 60)
    minutes = duration - (hours * 60)

    return `${ buildCountString(hours, [ 'час', 'часа', 'часов' ]) }
     ${ minutes === 0
      ? ''
      : buildCountString(minutes, [ 'минута', 'минуты', 'минут' ]) }`
  }

  public onMapboxLoad(map: mapboxgl.Map): void {
    this.map = map
    this.map.getStyle().layers!.forEach((layer: AnyLayer) => {
      if (layer.id.indexOf('-label') > 0) {
        map.setLayoutProperty(layer.id, 'text-field', [ 'get', 'name_ru' ])
      }
    })

    if (this.currentCoords !== null) {
      new mapboxgl.Marker({ color: 'green' })
        .setLngLat(this.currentCoords![ 0 ] as any)
        .addTo(this.map)

      new mapboxgl.Marker({ color: 'red' })
        .setLngLat(this.currentCoords![ this.currentCoords!.length - 1 ] as any)
        .addTo(this.map)
    }
  }
}
