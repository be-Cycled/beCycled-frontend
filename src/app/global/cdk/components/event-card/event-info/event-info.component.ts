import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core'
import { AbstractEventCard } from '../abstract-event-card'
import { BaseEvent, MapboxRouteGeoData, Route, User, UserService } from '../../../../domain'
import { RouteService } from '../../../../domain/services/route/route.service'
import { map } from 'rxjs/operators'

@Component({
  selector: 'cy-event-info',
  templateUrl: './event-info.component.html',
  styleUrls: [ './event-info.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventInfoComponent extends AbstractEventCard implements OnChanges {
  @Input()
  public event: BaseEvent | null = null

  @Input()
  public route: Route | null = null

  public distance: number = 0

  constructor(private routeService: RouteService,
              private userService: UserService) {
    super()
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (typeof changes.event !== 'undefined' && changes.event.currentValue !== null) {
      this.memberAvatars$ = this.userService.readUsersByIds(changes.event.currentValue.memberUserIds).pipe(
        map((users: User[]) => users.map((user: User) => user.avatar))
      )
    }

    if (typeof changes.route !== 'undefined' && changes.route.currentValue !== null) {
      const routeGeoData: MapboxRouteGeoData[] = (JSON.parse((changes.route.currentValue as Route).routeGeoData) as MapboxRouteGeoData[])

      let distance: number = 0
      routeGeoData.forEach((routeInfo: MapboxRouteGeoData) => distance += routeInfo.routes[ 0 ].distance)

      this.distance = distance
    }
  }
}
