import { ChangeDetectionStrategy, Component } from '@angular/core'
import { Title } from '@angular/platform-browser'
import { ActivatedRoute } from '@angular/router'
import { TuiDestroyService } from '@taiga-ui/cdk'
import { BehaviorSubject, defer, Observable, of } from 'rxjs'
import { catchError, map, shareReplay, switchMap, take, takeUntil, tap } from 'rxjs/operators'
import {
  BaseEvent,
  BaseEventType,
  Community,
  CommunityType,
  EventType,
  SportType,
  User
} from '../../../../global/domain'
import { CommunityService } from '../../../../global/domain/services/community/community.service'
import { UserHolderService } from '../../../../global/services'
import { EventService } from '../../../../global/domain/services/event/event.service'
import { detectBaseEventTypeByEventType } from 'src/app/global/utils'

@Component({
  selector: 'cy-single-community-container',
  templateUrl: './single-community-container.component.html',
  styleUrls: [ './single-community-container.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    TuiDestroyService
  ]
})
export class SingleCommunityContainerComponent {

  public communityHolder: BehaviorSubject<Community> = new BehaviorSubject<Community>(this.activatedRoute.snapshot.data.community)

  public sportTypesMap: Record<SportType, string> = {
    [ SportType.bicycle ]: `Велосипед`,
    [ SportType.rollerblade ]: `Ролики`,
    [ SportType.run ]: `Бег`
  }

  public communityTypesMap: Record<CommunityType, string> = {
    [ CommunityType.organization ]: `Организация`,
    [ CommunityType.club ]: `Клуб`
  }

  public events: Observable<BaseEvent[]> = this.eventService.readEventByCommunity(this.communityHolder.value.nickname)

  public isAuthorizedUser: Observable<boolean> = this.userHolderService.isUserAuthorizedChanges.pipe()

  public isUserJoined: Observable<boolean> = this.communityHolder.pipe(
    map((community: Community) => {
      const user: User | null = this.userHolderService.getUser()

      if (user === null) {
        throw new Error(`User does not exist`)
      }

      return community.userIds.includes(user.id)
    })
  )

  public iconRightIcon: Observable<'tuiIconCheck' | 'tuiIconPlus'> = this.isUserJoined.pipe(
    map((isUserJoined: boolean) => isUserJoined ? 'tuiIconCheck' : 'tuiIconPlus')
  )

  public joinButtonLabel: Observable<string> = this.isUserJoined.pipe(
    map((isUserJoined: boolean) => isUserJoined ? 'Уже участник' : 'Присоединиться')
  )

  public showJoinButtonLoader: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

  public sportTypes: Observable<SportType[]> = this.communityHolder.pipe(
    map((community: Community) => community.sportTypes)
  )

  public communityUsers: Observable<User[]> = this.communityHolder.pipe(
    // distinctUntilChanged((a: Community, b: Community) => a.userIds.every((value: number) => b.userIds.includes(value)))
    switchMap(({ nickname }: Community) => this.communityService.getUsersByCommunity(nickname)),
    shareReplay(1)
  )

  public someFirstUsers: Observable<User[]> = this.communityUsers.pipe(
    map((users: User[]) => users.slice(0, 6))
  )

  public userCount: Observable<number> = this.communityUsers.pipe(
    map((users: User[]) => users.length)
  )

  public showMoreUsers: Observable<boolean> = this.userCount.pipe(
    map((userCount: number) => userCount > 6)
  )

  public moreUserCount: Observable<number> = this.userCount.pipe(
    map((userCount: number) => userCount - 6)
  )

  private titleSetter: Observable<Community> = defer(() => this.communityHolder.pipe(
    takeUntil(this.destroyService),
    tap((community: Community) => this.title.setTitle(community.name))
  ))

  constructor(private activatedRoute: ActivatedRoute,
              private eventService: EventService,
              private userHolderService: UserHolderService,
              private communityService: CommunityService,
              private title: Title,
              private destroyService: TuiDestroyService) {
    this.titleSetter.subscribe()
  }

  public onClickJoinButton(): void {
    const user: User | null = this.userHolderService.getUser()

    if (user === null) {
      throw new Error(`User does not exist`)
    }

    this.showJoinButtonLoader.next(true)

    const community: Community = this.communityHolder.value

    if (!this.userHolderService.isUserJoinedCommunity(community)) {
      this.communityService.join(community).pipe(
        take(1),
        tap((community: Community) => {
          this.showJoinButtonLoader.next(false)
          this.communityHolder.next(community)
        }),
        catchError(() => of(null))
      ).subscribe()
    } else {
      this.communityService.leave(community).pipe(
        take(1),
        tap((community: Community) => {
          this.showJoinButtonLoader.next(false)
          this.communityHolder.next(community)
        }),
        catchError(() => of(null))
      ).subscribe()
    }
  }

  public detectBaseEventTypeByEventType(eventType: EventType): BaseEventType {
    return detectBaseEventTypeByEventType(eventType)
  }
}
