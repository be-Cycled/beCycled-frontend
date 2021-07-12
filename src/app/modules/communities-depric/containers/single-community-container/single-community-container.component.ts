import { ChangeDetectionStrategy, Component } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { TuiDestroyService } from '@taiga-ui/cdk'
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs'
import { catchError, filter, map, pluck, take, tap } from 'rxjs/operators'
import { Community, CommunityType, User } from '../../../../global/domain'
import { CommunityService } from '../../../../global/domain/services/community/community.service'
import { UserHolderService } from '../../../../global/services'
import { CommunityStore } from '../../services/community-store/community-store.service'

@Component({
  selector: 'cy-single-community-container',
  templateUrl: './single-community-container.component.html',
  styleUrls: [ './single-community-container.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ TuiDestroyService ]
})
export class SingleCommunityContainerComponent {

  public communityChanges: Observable<Community> = this.communityStore.select().pipe(
    pluck('community'),
    filter((community: Community | null): community is Community => community !== null)
  )

  public communityShowLoader: Observable<boolean> = this.communityStore.select().pipe(
    pluck('communityShowLoader')
  )

  public isAuthorizedUser: Observable<boolean> = this.userHolderService.isUserAuthorizedChanges.pipe()

  public communityTypesMap: Record<CommunityType, string> = {
    [ CommunityType.organization ]: `Организация`,
    [ CommunityType.club ]: `Клуб`
  }

  public isUserJoined: Observable<boolean> = this.communityChanges.pipe(
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

  public isUserCanEditCommunity: Observable<boolean> = combineLatest([
    this.isAuthorizedUser,
    this.communityChanges
  ]).pipe(
    map(([ isUserAuthorized, community ]: [ boolean, Community ]) => {
      if (!isUserAuthorized) {
        return false
      }

      const user: User | null = this.userHolderService.getUser()

      if (user === null) {
        return false
      }

      return user.id === community.ownerUserId
    })
  )

  constructor(public readonly activatedRoute: ActivatedRoute,
              private communityStore: CommunityStore,
              private userHolderService: UserHolderService,
              private communityService: CommunityService) {
    const nickname: string | null = this.activatedRoute.snapshot.paramMap.get('nickname')

    if (nickname === null) {
      throw new Error(`${ this.constructor.name } has been open without "nickname" parameter`)
    }

    this.communityStore.getCommunity(nickname)
  }

  public onClickJoinButton(): void {
    const user: User | null = this.userHolderService.getUser()

    if (user === null) {
      throw new Error(`User does not exist`)
    }

    this.showJoinButtonLoader.next(true)

    const community: Community | null = this.communityStore.takeState().community

    if (community === null) {
      throw new Error(`Community does not exist`)
    }

    if (!this.userHolderService.isUserJoinedCommunity(community)) {
      this.communityService.join(community).pipe(
        take(1),
        tap((community: Community) => {
          this.showJoinButtonLoader.next(false)
          this.communityStore.patchState({ community })
        }),
        catchError(() => of(null))
      ).subscribe()
    } else {
      this.communityService.leave(community).pipe(
        take(1),
        tap((community: Community) => {
          this.showJoinButtonLoader.next(false)
          this.communityStore.patchState({ community })
        }),
        catchError(() => of(null))
      ).subscribe()
    }
  }
}

/*export class SingleCommunityContainerComponent {

  public communityHolder: BehaviorSubject<Community> = new BehaviorSubject<Community>(this.activatedRoute.snapshot.data.community)

  public events: Observable<SomeWrappedEvent[]> = forkJoin([
    this.workoutService.readWorkoutsByCommunity(this.communityHolder.value.nickname),
    this.competitionService.readCompetitionsByCommunity(this.communityHolder.value.nickname)
  ]).pipe(
    map(([ workouts, competitions ]: [ Workout[], Competition[] ]) => {
      const result: SomeWrappedEvent[] = []

      const workoutEvents: WrappedEvent<EventType.workout, Workout>[] = workouts.map((workout: Workout) => ({ type: EventType.workout, value: workout }))
      const competitionEvents: WrappedEvent<EventType.competition, Competition>[] = competitions.map((competition: Competition) => ({ type: EventType.competition, value: competition }))

      result.push(...workoutEvents)
      result.push(...competitionEvents)

      return result.sort((a: SomeWrappedEvent, b: SomeWrappedEvent) => {
        return new Date(a.value.createdAd).getTime() - new Date(b.value.startDate).getTime()
      })
    })
  )

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

  public userCount: Observable<number> = this.communityUsers.pipe(
    map((users: User[]) => users.length)
  )

  public showMoreUsers: Observable<boolean> = this.userCount.pipe(
    map((userCount: number) => userCount > 6)
  )

  private titleSetter: Observable<Community> = defer(() => this.communityHolder.pipe(
    takeUntil(this.destroyService),
    tap((community: Community) => this.title.setTitle(community.name))
  ))

  public communityTypesMap: Record<CommunityType, string> = {
    [ CommunityType.organization ]: `Организация`,
    [ CommunityType.club ]: `Клуб`
  }

  public isUserCanEditCommunity: Observable<boolean> = combineLatest([
    this.isAuthorizedUser,
    this.communityHolder
  ]).pipe(
    map(([ isUserAuthorized, community ]: [ boolean, Community ]) => {
      if (!isUserAuthorized) {
        return false
      }

      const user: User | null = this.userHolderService.getUser()

      if (user === null) {
        return false
      }

      return user.id === community.ownerUserId
    })
  )

  constructor(public readonly activatedRoute: ActivatedRoute,
              private workoutService: WorkoutService,
              private competitionService: CompetitionService,
              private userHolderService: UserHolderService,
              private communityService: CommunityService,
              private title: Title,
              private destroyService: TuiDestroyService,
              private communityStore: CommunityStoreService) {
    this.titleSetter.subscribe()

    this.communityStore.select().subscribe(console.log)

    const nickname: string | null = this.activatedRoute.snapshot.paramMap.get('nickname')

    if (nickname === null) {
      throw new Error(`${ this.constructor.name } has been open without "nickname" parameter`)
    }

    this.communityStore.getCommunity(nickname)
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

}*/
