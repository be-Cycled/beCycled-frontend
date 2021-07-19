import { Directive } from '@angular/core'
import { AbstractEventCard } from './event-card/abstract-event-card'
import mapboxgl, { AnyLayer, LngLat } from 'mapbox-gl'
import { combineLatest, defer, Observable, of, Subject } from 'rxjs'
import { MapboxRouteGeoData, Route } from '../../domain'
import { filter, map, take, tap } from 'rxjs/operators'
import { generateBounds, generateGeoJsonFeature } from '../../utils'
import { EventService } from '../../domain/services/event/event.service'
import { TuiNotification, TuiNotificationsService } from '@taiga-ui/core'
import { Router } from '@angular/router'

@Directive()
export abstract class AbstractEventPage extends AbstractEventCard {
  protected mapIsReady$: Subject<void> = new Subject()
  public isLoading: boolean = false

  public startPoint: mapboxgl.Marker | null = null
  public endPoint: mapboxgl.Marker | null = null
  public venuePoint: mapboxgl.Marker | null = null

  public venueCoordinates: LngLat | null = null

  public route$: Observable<null | Route> = of(null)

  public routeInfos$: Observable<MapboxRouteGeoData[]> = defer(() => this.route$.pipe(
    filter((route: Route | null) => route !== null),
    map((route: Route | null) => (JSON.parse(route!.routeGeoData) as MapboxRouteGeoData[]))
  ))

  public distance$: Observable<number> = this.routeInfos$.pipe(
    map((routeInfos: MapboxRouteGeoData[]) => {
      let distance: number = 0
      routeInfos.forEach((routeInfo: MapboxRouteGeoData) => distance += routeInfo.routes[ 0 ].distance)

      return distance
    })
  )

  public coordinates$: Observable<number[][]> = combineLatest([
    this.mapIsReady$,
    this.routeInfos$
  ]).pipe(
    map(([ , routeInfos ]: [ void, MapboxRouteGeoData[] ]) => {
      let coordinatesFromRouteInfos: number[][] = []
      routeInfos.forEach((routeInfo: MapboxRouteGeoData) => coordinatesFromRouteInfos = [ ...coordinatesFromRouteInfos, ...routeInfo.routes[ 0 ].geometry.coordinates ])

      return coordinatesFromRouteInfos
    }),
    tap((coordinates: number[][]) => {
      this.currentCoords = coordinates

      const startPoint: HTMLElement = document.createElement('div')
      startPoint.className = 'start-point'

      const endPoint: HTMLElement = document.createElement('div')
      endPoint.className = 'end-point'

      new mapboxgl.Marker({ color: '#FF6639' })
        .setLngLat(this.venueCoordinates!)
        .addTo(this.map!)

      new mapboxgl.Marker(startPoint)
        .setLngLat(this.currentCoords![ 0 ] as any)
        .addTo(this.map!)

      new mapboxgl.Marker(endPoint)
        .setLngLat(this.currentCoords![ this.currentCoords!.length - 1 ] as any)
        .addTo(this.map!)
    })
  )

  public bounds$: Observable<any> = this.coordinates$.pipe(
    map((coordinates: number[][]) => generateBounds(coordinates))
  )

  public geoJson$: Observable<any> = this.coordinates$.pipe(
    map((coordinates: number[][]) => generateGeoJsonFeature(coordinates))
  )

  protected constructor(private abstractEventService: EventService,
                        private abstractNotificationsService: TuiNotificationsService,
                        private abstractRouterService: Router) {
    super()
  }

  public onMapboxLoad(map: mapboxgl.Map): void {
    this.map = map

    this.map.getStyle().layers!.forEach((layer: AnyLayer) => {
      if (layer.id.indexOf('-label') > 0) {
        map.setLayoutProperty(layer.id, 'text-field', [ 'get', 'name_ru' ])
      }
    })

    this.mapIsReady$.next()
  }

  public onDeleteButtonClick(id: number): void {
    this.isLoading = true

    this.abstractEventService.delete(id).pipe(
      tap(() => {
        this.abstractNotificationsService
          .show('Событие успешно удалено', {
            status: TuiNotification.Success
          }).subscribe()

        this.isLoading = false

        this.abstractRouterService.navigate([ '' ])
      }),
      take(1)
    ).subscribe()
  }
}
