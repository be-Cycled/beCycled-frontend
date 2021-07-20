import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { AbstractEventCard } from '../abstract-event-card'
import { BaseEvent, BaseEventType, EventType, Route } from '../../../../domain'
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

  constructor(private routeService: RouteService) {
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
