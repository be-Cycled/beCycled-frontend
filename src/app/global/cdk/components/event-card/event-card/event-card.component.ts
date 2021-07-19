import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { AbstractEventCard } from '../abstract-event-card'
import { BaseEvent, BaseEventType, EventType, MapboxRouteGeoData, Route, UserService } from '../../../../domain'
import { defer, Observable } from 'rxjs'
import { map, shareReplay } from 'rxjs/operators'
import { RouteService } from '../../../../domain/services/route/route.service'
import { detectBaseEventTypeByEventType } from 'src/app/global/utils'

@Component({
  selector: 'cy-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: [ './event-card.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventCardComponent extends AbstractEventCard {
  @Input()
  public event: BaseEvent | null = null

  public route$: Observable<Route> = defer(() => this.routeService.readById(this.event?.routeId!)).pipe(
    shareReplay(1)
  )

  public routePreview$: Observable<string> = defer(() => this.route$.pipe(
    map((route: Route) => route.routePreview)
  ))

  public routeInfos$: Observable<MapboxRouteGeoData[]> = this.route$.pipe(
    map((route: Route) => (JSON.parse(route.routeGeoData) as MapboxRouteGeoData[]))
  )

  public distance$: Observable<number> = this.routeInfos$.pipe(
    map((routeInfos: MapboxRouteGeoData[]) => {
      let distance: number = 0
      routeInfos.forEach((routeInfo: MapboxRouteGeoData) => distance += routeInfo.routes[ 0 ].distance)

      return distance
    })
  )

  constructor(private routeService: RouteService,
              private userService: UserService) {
    super()
  }

  public detectBaseEventTypeByEventType(eventType: EventType): BaseEventType {
    return detectBaseEventTypeByEventType(eventType)
  }

  public generateRouterLinkUri(): string {
    if (this.event === null) {
      throw new Error('Событие не определено')
    }

    if (this.detectBaseEventTypeByEventType(this.event.eventType) === BaseEventType.workout) {
      return `/workouts/${ this.event.id }`
    }

    if (this.detectBaseEventTypeByEventType(this.event.eventType) === BaseEventType.competition) {
      return `/competitions/${ this.event.id }`
    }

    throw new Error('Не удалось определить базовый тип события')
  }
}
