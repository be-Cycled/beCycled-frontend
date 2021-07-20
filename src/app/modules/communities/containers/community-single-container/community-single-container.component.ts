import { ChangeDetectionStrategy, Component, Inject, OnDestroy } from '@angular/core'
import { Title } from '@angular/platform-browser'
import { ActivatedRoute, ParamMap, Router } from '@angular/router'
import { TuiDestroyService } from '@taiga-ui/cdk'
import { TuiNotification, TuiNotificationsService } from '@taiga-ui/core'
import { BehaviorSubject, combineLatest, EMPTY, iif, Observable } from 'rxjs'
import {
  catchError,
  distinctUntilChanged,
  filter,
  map,
  pluck,
  startWith,
  switchMap,
  take,
  takeUntil,
  tap
} from 'rxjs/operators'
import { Community, CommunityType, User } from '../../../../global/domain'
import { CommunityService } from '../../../../global/domain/services/community/community.service'
import { PATH_PARAMS } from '../../../../global/models'
import { UserStoreService } from '../../../../global/services'
import { IS_MOBILE } from '../../../../global/tokens'
import { CommunityStoreService } from '../../services'

const enum CommunitySingleTab {
  review,
  users,
  settings
}

@Component({
  selector: 'cy-community-single-container',
  templateUrl: './community-single-container.component.html',
  styleUrls: [ './community-single-container.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ TuiDestroyService ]
})
export class CommunitySingleContainerComponent implements OnDestroy {
  public readonly communityType: typeof CommunityType = CommunityType

  public communityShowLoader: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

  public communityChanges: Observable<Community> = this.communityStoreService.communityChanges$

  public activeTab: BehaviorSubject<CommunitySingleTab> = new BehaviorSubject<CommunitySingleTab>(CommunitySingleTab.review)

  public activeTabChanges: Observable<CommunitySingleTab> = this.activeTab.pipe(
    distinctUntilChanged()
  )

  public isSettingsTabActive: Observable<boolean> = this.activeTabChanges.pipe(
    map((activeTab: CommunitySingleTab) => activeTab === CommunitySingleTab.settings)
  )

  public avatar: Observable<string> = this.communityChanges.pipe(
    pluck('avatar')
  )

  public name: Observable<string> = this.communityChanges.pipe(
    pluck('name')
  )

  public type: Observable<CommunityType> = this.communityChanges.pipe(
    pluck('communityType')
  )

  public description: Observable<string | null> = this.communityChanges.pipe(
    pluck('description')
  )

  public isDescriptionShow: Observable<boolean> = combineLatest([
    this.isSettingsTabActive,
    this.description
  ]).pipe(
    map(([ isSettingsTabActive, description ]: [ boolean, string | null ]) => !isSettingsTabActive && description !== null)
  )

  public url: Observable<string | null> = this.communityChanges.pipe(
    pluck('url')
  )

  public isUrlShow: Observable<boolean> = combineLatest([
    this.isSettingsTabActive,
    this.url
  ]).pipe(
    map(([ isSettingsTabActive, url ]: [ boolean, string | null ]) => !isSettingsTabActive && url !== null)
  )

  public isUserExist: Observable<boolean> = this.userStoreService.isAuthChanges

  private userChanges: Observable<User> = this.userStoreService.userChanges.pipe(
    filter((user: User | null): user is User => user !== null)
  )

  public isCurrentUserOwnerCommunity: Observable<boolean> = combineLatest([ this.userChanges, this.communityChanges ]).pipe(
    map(([ user, community ]: [ User, Community ]) => community.ownerUserId === user.id),
    startWith(false)
  )

  public isCurrentUserCommunityMember: Observable<boolean> = combineLatest([ this.userChanges, this.communityChanges ]).pipe(
    map(([ user, community ]: [ User, Community ]) => community.userIds.includes(user.id)),
    startWith(false)
  )

  public joinButtonIconRight: Observable<string> = this.isCurrentUserCommunityMember.pipe(
    map((isJoined: boolean) => isJoined ? 'tuiIconCheck' : 'tuiIconPlus')
  )

  public joinButtonLabel: Observable<string> = this.isCurrentUserCommunityMember.pipe(
    map((isJoined: boolean) => isJoined ? 'Уже участник' : 'Присоединиться')
  )

  public joinButtonShowLoader: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

  public joinButtonIsDisabled: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

  public joinButtonSize: Observable<string> = this.isMobile.pipe(
    map((isMobile: boolean) => isMobile ? 'm' : 's')
  )

  private pageTitle: Observable<string> = combineLatest([
    this.activeTabChanges,
    this.communityChanges
  ]).pipe(
    takeUntil(this.destroyService),
    map(([ activeTab, community ]: [ CommunitySingleTab, Community ]) => {
      switch (activeTab) {
        case CommunitySingleTab.users: return `Участники · ${ community.name }`
        case CommunitySingleTab.settings: return `Настройки · ${ community.name }`
        case CommunitySingleTab.review:
        default: {
          return community.name
        }
      }
    }),
    tap((title: string) => this.titleService.setTitle(title))
  )

  constructor(public readonly activatedRoute: ActivatedRoute,
              private router: Router,
              private communityService: CommunityService,
              private userStoreService: UserStoreService,
              private notificationService: TuiNotificationsService,
              private communityStoreService: CommunityStoreService,
              @Inject(IS_MOBILE)
              private isMobile: Observable<boolean>,
              private destroyService: TuiDestroyService,
              private titleService: Title) {
    this.activatedRoute.paramMap.pipe(
      takeUntil(this.destroyService),
      switchMap((params: ParamMap) => {
        if (this.communityStoreService.takeCommunity() !== null) {
          return EMPTY
        }

        const nickname: string | null = params.get(PATH_PARAMS.communityNickname)

        if (nickname === null) {
          throw new Error(`Parameter "nickname" does not exist`)
        }

        this.communityShowLoader.next(true)
        return this.communityService.getByNickname(nickname).pipe(
          tap((community: Community) => {
            this.communityStoreService.setCommunity(community)
            this.communityShowLoader.next(false)
          })
        )
      })
    ).subscribe()

    this.pageTitle.subscribe()
  }

  public ngOnDestroy(): void {
    this.communityStoreService.reset()
  }

  public onClickJoinButton(isUserJoined: boolean): void {
    this.joinButtonShowLoader.next(true)
    this.joinButtonIsDisabled.next(true)

    this.communityChanges.pipe(
      take(1),
      switchMap((community: Community) => iif(
        () => isUserJoined,
        this.communityService.leave(community.id),
        this.communityService.join(community.id)
      ).pipe(
        tap((community: Community) => {
          this.joinButtonShowLoader.next(false)
          this.joinButtonIsDisabled.next(false)
          this.communityStoreService.setCommunity(community)
        }),
        catchError(() => {
          return this.notificationService.show(
            isUserJoined
              ? `Не удалось покинуть сообщество`
              : `Не удалось присоединиться к сообществу`,
            {
              status: TuiNotification.Error
            }
          ).pipe(
            tap(() => {
              this.joinButtonShowLoader.next(false)
              this.joinButtonIsDisabled.next(false)
            })
          )
        })
      ))
    ).subscribe()
  }

  public onActiveItemIndexChange(event: CommunitySingleTab): void {
    this.activeTab.next(event)
  }
}
