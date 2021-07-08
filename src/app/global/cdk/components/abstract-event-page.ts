import { Directive } from '@angular/core'
import { AbstractEventCard } from './event-card/abstract-event-card'
import mapboxgl, { AnyLayer, LngLat } from 'mapbox-gl'

@Directive()
export abstract class AbstractEventPage extends AbstractEventCard {
  public startPoint: mapboxgl.Marker | null = null
  public endPoint: mapboxgl.Marker | null = null
  public venuePoint: mapboxgl.Marker | null = null

  public venueCoordinates: LngLat | null = null

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

    /**
     * TODO: Переписать на подписки, т.к. иногда координаты не успевают получиться.
     */
    new mapboxgl.Marker({ color: '#FF6639' })
      .setLngLat(this.venueCoordinates!)
      .addTo(this.map)

    new mapboxgl.Marker(startPoint)
      .setLngLat(this.currentCoords![ 0 ] as any)
      .addTo(this.map)

    new mapboxgl.Marker(endPoint)
      .setLngLat(this.currentCoords![ this.currentCoords!.length - 1 ] as any)
      .addTo(this.map)
  }
}
