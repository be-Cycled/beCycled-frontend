import { Directive } from '@angular/core'
import { AbstractEventCard } from './event-card/abstract-event-card'
import mapboxgl, { AnyLayer } from 'mapbox-gl'

@Directive()
export abstract class AbstractEventPage extends AbstractEventCard {
  public onMapboxLoad(map: mapboxgl.Map): void {
    this.map = map
    this.map.getStyle().layers!.forEach((layer: AnyLayer) => {
      if (layer.id.indexOf('-label') > 0) {
        map.setLayoutProperty(layer.id, 'text-field', [ 'get', 'name_ru' ])
      }
    })

    this.map.addControl(new mapboxgl.NavigationControl())

    const marker1: mapboxgl.Marker = new mapboxgl.Marker({ color: 'green' })
      .setLngLat(this.currentCoords![ 0 ] as any)
      .addTo(this.map)

    const marker2: mapboxgl.Marker = new mapboxgl.Marker({ color: 'red' })
      .setLngLat(this.currentCoords![ this.currentCoords!.length - 1 ] as any)
      .addTo(this.map)
  }
}
