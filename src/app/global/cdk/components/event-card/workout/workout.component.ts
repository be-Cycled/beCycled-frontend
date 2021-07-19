import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core'
import { BaseWorkout, MapboxRouteGeoData, Route, User, UserService } from '../../../../domain'
import { map, shareReplay } from 'rxjs/operators'
import { defer, Observable } from 'rxjs'
import { AbstractEventCard } from '../abstract-event-card'
import { RouteService } from '../../../../domain/services/route/route.service'

@Component({
  selector: 'cy-workout',
  templateUrl: './workout.component.html',
  styleUrls: [ './workout.component.scss' ],
  host: { class: 'event-card' },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkoutComponent extends AbstractEventCard implements OnChanges {
  @Input()
  public workout: BaseWorkout | null = null

  public route$: Observable<Route> = defer(() => this.routeService.readById(this.workout?.routeId!)).pipe(
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

  public ngOnChanges({ workout }: SimpleChanges): void {
    if (typeof workout.currentValue !== 'undefined') {
      this.memberAvatars$ = this.userService.readUsersByIds(this.workout!.memberUserIds).pipe(
        map((users: User[]) => users.map((user: User) => user.avatar))
      )
    }
  }
}
