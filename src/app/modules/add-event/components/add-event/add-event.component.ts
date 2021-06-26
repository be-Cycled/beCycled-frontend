import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'
import { TuiDay } from '@taiga-ui/cdk'
import { FormControl, FormGroup } from '@angular/forms'
import mapboxgl, { AnyLayer, LngLat } from 'mapbox-gl'
import { MapboxNetworkService } from '../../../../global/services/mapbox-network/mapbox-network.service'
import { DirectionType, MapboxRouteInfo } from '../../../../global/domain'

@Component({
  selector: 'cy-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: [ './add-event.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddEventComponent implements OnInit {
  public coordinates: LngLat[] = []
  public map: mapboxgl.Map | null = null
  public marker: mapboxgl.Marker | null = null
  public geoJson: any = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: []
    }
  }

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

    this.marker = new mapboxgl.Marker()
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

  public onMapClick(point: mapboxgl.MapMouseEvent & mapboxgl.EventData): void {
    const coordinates: mapboxgl.LngLat = point.lngLat

    if (this.marker !== null && this.map !== null) {
      this.marker.setLngLat(coordinates).addTo(this.map)
    }

    this.coordinates.push(point.lngLat)

    if (this.coordinates.length > 1) {
      this.mapboxNetworkService.buildDirection(this.coordinates, DirectionType.cycling).subscribe((response: MapboxRouteInfo) => {
        this.geoJson = this.generateGeoJson(response.routes[ 0 ].geometry.coordinates)

        if (this.map !== null) {
          (this.map.getSource('geojson-route') as mapboxgl.GeoJSONSource).setData(this.geoJson)
        }
      })
    }
  }
}
