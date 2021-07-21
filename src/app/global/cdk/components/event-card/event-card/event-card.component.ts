import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core'
import { AbstractEventCard } from '../abstract-event-card'
import { BaseEvent, BaseEventType, Community, EventType, Route } from '../../../../domain'
import { defer, Observable } from 'rxjs'
import { map, shareReplay, take, tap } from 'rxjs/operators'
import { RouteService } from '../../../../domain/services/route/route.service'
import { detectBaseEventTypeByEventType } from 'src/app/global/utils'
import { CommunityStoreService } from '../../../../../modules/communities/services'

@Component({
  selector: 'cy-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: [ './event-card.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventCardComponent extends AbstractEventCard implements OnChanges {
  public currentCommunity: Community | null = null

  @Input()
  public event: BaseEvent | null = null

  @Input()
  public isOnlyTimeShow: boolean = true

  public route$: Observable<Route> = defer(() => this.routeService.readById(this.event?.routeId!)).pipe(
    shareReplay(1)
  )

  public routePreview$: Observable<string> = defer(() => this.route$.pipe(
    map((route: Route) => route.routePreview)
  ))

  constructor(private routeService: RouteService,
              private communityStoreService: CommunityStoreService) {
    super()
  }

  public ngOnChanges({ event }: SimpleChanges): void {
    if (event.currentValue !== null) {
      this.communityStoreService.allCommunities$.pipe(
        take(1),
        tap((communities: Community[]) => {
          const currentCommunity: Community | undefined = communities.find((community: Community) =>
            community.id === (event.currentValue as BaseEvent).communityId)

          if (typeof currentCommunity !== 'undefined') {
            this.currentCommunity = currentCommunity
          }
        })
      ).subscribe()
    }
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
