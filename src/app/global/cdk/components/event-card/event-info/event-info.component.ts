import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core'
import { AbstractEventCard } from '../abstract-event-card'
import { BaseEvent, MapboxRouteGeoData, Route, User, UserService } from '../../../../domain'
import { RouteService } from '../../../../domain/services/route/route.service'
import { map, switchMap, take, tap } from 'rxjs/operators'
import { UserStoreService } from '../../../../services'
import { EventService } from '../../../../domain/services/event/event.service'
import { BehaviorSubject } from 'rxjs'
import { TuiDialogContext, TuiDialogService } from '@taiga-ui/core'
import { PolymorpheusContent } from '@tinkoff/ng-polymorpheus'
import { Router } from '@angular/router'

@Component({
  selector: 'cy-event-info',
  templateUrl: './event-info.component.html',
  styleUrls: [ './event-info.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventInfoComponent extends AbstractEventCard implements OnChanges {
  public currentUser: User | null = null

  public members: User[] = []

  @Input()
  public event: BaseEvent | null = null

  @Input()
  public route: Route | null = null

  public distance: number = 0

  public isCanJoinEvent: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

  public isJoined: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

  public isJoinButtonLoading: boolean = false

  constructor(private routeService: RouteService,
              private userService: UserService,
              private userStoreService: UserStoreService,
              private eventService: EventService,
              private dialogService: TuiDialogService,
              private router: Router) {
    super()
    this.currentUser = this.userStoreService.user
  }

  public checkIsPastEvent(event: BaseEvent): boolean {
    return new Date(event.startDate).getTime() < Date.now()
  }

  public checkAlreadyExist(event: BaseEvent, userId: number): boolean {
    return event.memberUserIds.includes(userId)
  }

  public onJoinButtonClick(event: BaseEvent): void {
    this.isJoinButtonLoading = true

    if (this.currentUser !== null) {
      if (this.checkAlreadyExist(event, this.currentUser.id)) {
        this.eventService.leaveByEventId(event.id).pipe(
          take(1),
          switchMap((event: BaseEvent) => {
            this.event = event

            return this.lastFourMembers$ = this.userService.readUsersByIds(event.memberUserIds).pipe(
              map((users: User[]) => this.updateUsersAndReturnLastFour(users)),
              tap(() => {
                this.isJoined.next(this.checkAlreadyExist(this.event!, this.currentUser!.id))
                this.isJoinButtonLoading = false
              })
            )
          })
        ).subscribe()
      } else {
        this.eventService.joinByEventId(event.id).pipe(
          take(1),
          switchMap((event: BaseEvent) => {
            this.event = event

            return this.lastFourMembers$ = this.userService.readUsersByIds(event.memberUserIds).pipe(
              map((users: User[]) => this.updateUsersAndReturnLastFour(users)),
              tap(() => {
                this.isJoined.next(this.checkAlreadyExist(this.event!, this.currentUser!.id))
                this.isJoinButtonLoading = false
              })
            )
          })
        ).subscribe()
      }
    } else {
      throw new Error('???????????????????????? ???? ????????????')
    }
  }

  private updateUsersAndReturnLastFour(users: User[]): User[] {
    this.members = users

    let slicedUsers: User[] = users.slice()

    if (users.length > 4) {
      slicedUsers = users.slice(users.length - 4)
    }

    return slicedUsers
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (typeof changes.event !== 'undefined' && changes.event.currentValue !== null) {
      this.lastFourMembers$ = this.userService.readUsersByIds(changes.event.currentValue.memberUserIds).pipe(
        map((users: User[]) => this.updateUsersAndReturnLastFour(users))
      )

      this.isCanJoinEvent.next(this.userStoreService.isAuth && !this.checkIsPastEvent(changes.event.currentValue))

      if (this.currentUser !== null) {
        this.isJoined.next(this.checkAlreadyExist(changes.event.currentValue, this.currentUser.id))
      }
    }

    if (typeof changes.route !== 'undefined' && changes.route.currentValue !== null) {
      const routeGeoData: MapboxRouteGeoData[] = (JSON.parse((changes.route.currentValue as Route).routeGeoData) as MapboxRouteGeoData[])

      let distance: number = 0
      routeGeoData.forEach((routeInfo: MapboxRouteGeoData) => distance += routeInfo.routes[ 0 ].distance)

      this.distance = distance
    }
  }

  public showMembersDialog(content: PolymorpheusContent<TuiDialogContext>): void {
    this.dialogService.open(content, { size: 'm' }).subscribe()
  }

  /**
   * TODO: ??????????????! ?????????? ??????????????, ?????????? ???????????????????? ??????????????!
   */
  public navigateAndRefresh(nickname: string): void {
    this.router.navigateByUrl(`/users`, { skipLocationChange: true }).then(() =>
      this.router.navigate([ '/', 'users', nickname ]))
  }
}
