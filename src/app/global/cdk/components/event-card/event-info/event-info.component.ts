import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core'
import { AbstractEventCard } from '../abstract-event-card'
import { BaseEvent, MapboxRouteGeoData, Route, User, UserService } from '../../../../domain'
import { RouteService } from '../../../../domain/services/route/route.service'
import { defer, Observable } from 'rxjs'
import { map, shareReplay } from 'rxjs/operators'

@Component({
  selector: 'cy-event-info',
  templateUrl: './event-info.component.html',
  styleUrls: [ './event-info.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventInfoComponent extends AbstractEventCard implements OnInit, OnChanges {
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

  public ngOnInit(): void {
  }

  public ngOnChanges({ event }: SimpleChanges): void {
    if (typeof event.currentValue !== 'undefined') {
      this.memberAvatars$ = this.userService.readUsersByIds(this.event!.memberUserIds).pipe(
        map((users: User[]) => users.map((user: User) => user.avatar))
      )
    }
  }
}
