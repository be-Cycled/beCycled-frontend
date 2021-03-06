import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { MAPBOX_API_URL, MAPBOX_TOKEN } from '../../models'
import { LngLat } from 'mapbox-gl'
import { Observable } from 'rxjs'
import { DirectionType, MapboxRouteGeoData } from '../../domain'

@Injectable()
export class MapboxNetworkService {

  constructor(private httpClient: HttpClient) {
  }

  public buildDirection(coordinates: LngLat[], type: DirectionType): Observable<MapboxRouteGeoData> {
    const preparedCoordinates: string = coordinates.map(({ lng, lat }: LngLat) => `${ lng },${ lat }`).join(';')

    return this.httpClient.get<MapboxRouteGeoData>(`${ MAPBOX_API_URL }/directions/v5/mapbox/${ type }/${ preparedCoordinates }?geometries=geojson&access_token=${ MAPBOX_TOKEN }`)
  }
}
