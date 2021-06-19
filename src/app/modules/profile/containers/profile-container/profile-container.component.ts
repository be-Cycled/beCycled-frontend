import { ChangeDetectionStrategy, Component } from '@angular/core'
import { FormBuilder, FormControl } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { BehaviorSubject, forkJoin, Observable } from 'rxjs'
import { map, pluck, switchMap } from 'rxjs/operators'
import { Community, Competition, User, Workout } from '../../../../global/domain'
import { CommunityService } from '../../../../global/domain/services/community/community.service'
import { CompetitionService } from '../../../../global/domain/services/competition/competition.service'
import { WorkoutService } from '../../../../global/domain/services/workout/workout.service'
import { EventType, SomeWrappedEvent, WrappedEvent } from '../../../../global/models'

@Component({
  selector: 'cy-profile-container',
  templateUrl: './profile-container.component.html',
  styleUrls: ['./profile-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileContainerComponent {

  public activitiesFilterControl: FormControl = this.fb.control([ 'Тренировки' ])

  public user: BehaviorSubject<User> = new BehaviorSubject(
    this.activatedRoute.snapshot.data.user
  )

  public avatarUrl: Observable<string> = this.user.pipe(
    pluck('avatar'),
    map((avatar: string | null) => {
      return avatar!
    })
  )

  public fullName: Observable<string | null> = this.user.pipe(
    map((user: User) => {
      if (user.firstName === null && user.lastName === null) {
        return null
      }

      return Array.of(user.firstName, user.lastName).join(' ')
    })
  )

  public login: Observable<string> = this.user.pipe(
    pluck('login')
  )

  public about: Observable<string | null> = this.user.pipe(
    pluck('about')
  )

  public phone: Observable<string | null> = this.user.pipe(
    pluck('phone')
  )

  public email: Observable<string | null> = this.user.pipe(
    pluck('email')
  )

  public userCommunities: Observable<Community[]> = this.user.pipe(
    switchMap((user: User) => this.communityService.getCommunitiesByUser(user.login))
  )

  public events: Observable<SomeWrappedEvent[]> = this.user.pipe(
    switchMap((user: User) => forkJoin([
      this.workoutService.getByUser(user.login),
      this.competitionService.getByUser(user.login)
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
    ))
  )

  constructor(private fb: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private communityService: CommunityService,
              private workoutService: WorkoutService,
              private competitionService: CompetitionService) {
  }

}
