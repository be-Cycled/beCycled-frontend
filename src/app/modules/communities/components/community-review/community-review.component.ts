import { ChangeDetectionStrategy, Component } from '@angular/core'
import { Title } from '@angular/platform-browser'
import { ActivatedRoute } from '@angular/router'
import { TuiDestroyService } from '@taiga-ui/cdk'
import { BehaviorSubject, forkJoin, Observable } from 'rxjs'
import { map, shareReplay, switchMap } from 'rxjs/operators'
import { Community, Competition, SportType, User, Workout } from '../../../../global/domain'
import { CommunityService } from '../../../../global/domain/services/community/community.service'
import { CompetitionService } from '../../../../global/domain/services/competition/competition.service'
import { WorkoutService } from '../../../../global/domain/services/workout/workout.service'
import { EventType, SomeWrappedEvent, WrappedEvent } from '../../../../global/models'
import { UserHolderService } from '../../../../global/services'

@Component({
  selector: 'cy-community-review',
  templateUrl: './community-review.component.html',
  styleUrls: ['./community-review.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommunityReviewComponent {

  public sportTypesMap: Record<SportType, string> = {
    [ SportType.bicycle ]: `Велосипед`,
    [ SportType.rollerblade ]: `Ролики`,
    [ SportType.run ]: `Бег`,
    [ SportType.ski ]: `Лыжи`
  }

  public communityHolder: BehaviorSubject<Community> = new BehaviorSubject<Community>(this.activatedRoute.snapshot.data.community)

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

  public firstUsers: Observable<User[]> = this.communityUsers.pipe(
    map((users: User[]) => users.slice(0, 6))
  )

  public userCount: Observable<number> = this.communityUsers.pipe(
    map((users: User[]) => users.length)
  )

  constructor(public readonly activatedRoute: ActivatedRoute,
              private workoutService: WorkoutService,
              private competitionService: CompetitionService,
              private userHolderService: UserHolderService,
              private communityService: CommunityService,
              private title: Title,
              private destroyService: TuiDestroyService) {

  }

}
