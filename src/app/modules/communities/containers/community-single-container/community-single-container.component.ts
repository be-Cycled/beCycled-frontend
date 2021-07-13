import { ChangeDetectionStrategy, Component, Inject } from '@angular/core'
import { ActivatedRoute, ParamMap } from '@angular/router'
import { TuiNotification, TuiNotificationsService } from '@taiga-ui/core'
import { BehaviorSubject, combineLatest, EMPTY, iif, Observable } from 'rxjs'
import { catchError, map, pluck, startWith, switchMap, take, tap } from 'rxjs/operators'
import { Community, CommunityType, User } from '../../../../global/domain'
import { CommunityService } from '../../../../global/domain/services/community/community.service'
import { PATH_PARAMS } from '../../../../global/models'
import { UserHolderService } from '../../../../global/services'
import { IS_MOBILE } from '../../../../global/tokens'
import { CommunityStoreService } from '../../services'

@Component({
  selector: 'cy-community-single-container',
  templateUrl: './community-single-container.component.html',
  styleUrls: [ './community-single-container.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommunitySingleContainerComponent {
  public readonly communityType: typeof CommunityType = CommunityType

  public communityShowLoader: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

  public communityChanges: Observable<Community> = this.communityStoreService.communityChanges

  public avatar: Observable<string> = this.communityChanges.pipe(
    pluck('avatar')
  )

  public name: Observable<string> = this.communityChanges.pipe(
    pluck('name')
  )

  public type: Observable<CommunityType> = this.communityChanges.pipe(
    pluck('communityType')
  )

  public description: Observable<string> = this.communityChanges.pipe(
    pluck('description')
  )

  public url: Observable<string> = this.communityChanges.pipe(
    pluck('url')
  )

  public isUserExist: Observable<boolean> = this.userHolderService.isUserAuthorizedChanges

  public isCurrentUserOwnerCommunity: Observable<boolean> = combineLatest([
    this.userHolderService.userChanges,
    this.communityChanges
  ]).pipe(
    map(([ user, community ]: [ User, Community ]) => community.ownerUserId === user.id),
    startWith(false)
  )

  public isCurrentUserCommunityMember: Observable<boolean> = combineLatest([
    this.userHolderService.userChanges,
    this.communityChanges
  ]).pipe(
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

  constructor(public readonly activatedRoute: ActivatedRoute,
              private communityService: CommunityService,
              private userHolderService: UserHolderService,
              private notificationService: TuiNotificationsService,
              private communityStoreService: CommunityStoreService,
              @Inject(IS_MOBILE)
              private isMobile: Observable<boolean>) {
    this.activatedRoute.paramMap.pipe(
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
}
