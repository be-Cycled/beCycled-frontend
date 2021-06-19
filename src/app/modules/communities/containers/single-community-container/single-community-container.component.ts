import { ChangeDetectionStrategy, Component } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { BehaviorSubject, forkJoin, Observable, of } from 'rxjs'
import { catchError, map, take, tap } from 'rxjs/operators'
import { Community, CommunityType, Competition, SportType, User, Workout } from '../../../../global/domain'
import { CommunityService } from '../../../../global/domain/services/community/community.service'
import { CompetitionService } from '../../../../global/domain/services/competition/competition.service'
import { WorkoutService } from '../../../../global/domain/services/workout/workout.service'
import { EventType, SomeWrappedEvent, WrappedEvent } from '../../../../global/models'
import { UserHolderService } from '../../../../global/services'

@Component({
  selector: 'cy-single-community-container',
  templateUrl: './single-community-container.component.html',
  styleUrls: [ './single-community-container.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SingleCommunityContainerComponent {

  public communityHolder: BehaviorSubject<Community> = new BehaviorSubject<Community>(this.activatedRoute.snapshot.data.community)

  public sportTypesMap: Record<SportType, string> = {
    [ SportType.bicycle ]: `Велосипед`,
    [ SportType.rollerblade ]: `Ролики`,
    [ SportType.run ]: `Бег`,
    [ SportType.ski ]: `Лыжи`
  }

  public communityTypesMap: Record<CommunityType, string> = {
    [ CommunityType.organization ]: `Организация`,
    [ CommunityType.club ]: `Клуб`
  }

  public events: Observable<SomeWrappedEvent[]> = forkJoin([
    this.workoutService.getWorkoutsByCommunity(this.communityHolder.value.nickname),
    this.competitionService.getCompetitionsByCommunity(this.communityHolder.value.nickname)
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

  constructor(private activatedRoute: ActivatedRoute,
              private workoutService: WorkoutService,
              private competitionService: CompetitionService,
              private userHolderService: UserHolderService,
              private communityService: CommunityService) {
  }

  public onClickJoinButton(): void {
    const user: User | null = this.userHolderService.getUser()

    if (user === null) {
      throw new Error(`User does not exist`)
    }

    this.showJoinButtonLoader.next(true)

    const community: Community = this.communityHolder.value

    if (!this.userHolderService.isUserJoinedCommunity(community)) {
      this.communityService.join(user.id, community).pipe(
        take(1),
        tap((community: Community) => {
          this.showJoinButtonLoader.next(false)
          this.communityHolder.next(community)
        }),
        catchError(() => of(null))
      ).subscribe()
    } else {
      this.communityService.unjoin(user.id, community).pipe(
        take(1),
        tap((community: Community) => {
          this.showJoinButtonLoader.next(false)
          this.communityHolder.next(community)
        }),
        catchError(() => of(null))
      ).subscribe()
    }
  }

}
