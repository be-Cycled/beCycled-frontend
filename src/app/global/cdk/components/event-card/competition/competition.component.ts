import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { Competition, MapboxRouteInfo, Route } from '../../../../domain'
import { defer, Observable } from 'rxjs'
import { map, shareReplay } from 'rxjs/operators'
import { RouteService } from '../../../../domain/services/route/route.service'
import { AbstractEventCard } from '../abstract-event-card'

@Component({
  selector: 'cy-competition',
  templateUrl: './competition.component.html',
  styleUrls: [ './competition.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompetitionComponent extends AbstractEventCard {
  @Input()
  public competition: Competition | null = null

  public route$: Observable<Route> = defer(() => this.routeService.readById(this.competition?.routeId!)).pipe(
    shareReplay(1)
  )

  public routePreview$: Observable<string> = defer(() => this.route$.pipe(
    map((route: Route) => route.routePreview)
  ))

  public routeInfos$: Observable<MapboxRouteInfo[]> = this.route$.pipe(
    map((route: Route) => (JSON.parse(route.routeInfo) as MapboxRouteInfo[]))
  )

  public distance$: Observable<number> = this.routeInfos$.pipe(
    map((routeInfos: MapboxRouteInfo[]) => {
      let distance: number = 0
      routeInfos.forEach((routeInfo: MapboxRouteInfo) => distance += routeInfo.routes[ 0 ].distance)

      return distance
    })
  )

  constructor(private routeService: RouteService) {
    super()
  }
}
