import { ChangeDetectionStrategy, Component, Input, SimpleChanges } from '@angular/core'
import { BaseCompetition, MapboxRouteGeoData, Route, User, UserService } from '../../../../domain'
import { defer, Observable } from 'rxjs'
import { map, shareReplay } from 'rxjs/operators'
import { RouteService } from '../../../../domain/services/route/route.service'
import { AbstractEventCard } from '../abstract-event-card'

@Component({
  selector: 'cy-competition',
  templateUrl: './competition.component.html',
  styleUrls: [ './competition.component.scss' ],
  host: { class: 'event-card' },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompetitionComponent extends AbstractEventCard {
  @Input()
  public competition: BaseCompetition | null = null

  public route$: Observable<Route> = defer(() => this.routeService.readById(this.competition?.routeId!)).pipe(
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

  public ngOnChanges({ competition }: SimpleChanges): void {
    if (typeof competition.currentValue !== 'undefined') {
      this.memberAvatars$ = this.userService.readUsersByIds(this.competition!.memberUserIds).pipe(
        map((users: User[]) => users.map((user: User) => user.avatar))
      )
    }
  }
}
