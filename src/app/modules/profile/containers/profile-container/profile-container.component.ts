import { ChangeDetectionStrategy, Component } from '@angular/core'
import { FormBuilder, FormControl, FormGroup } from '@angular/forms'
import { Title } from '@angular/platform-browser'
import { ActivatedRoute, ParamMap } from '@angular/router'
import { TuiDestroyService } from '@taiga-ui/cdk'
import { BehaviorSubject, combineLatest, EMPTY, forkJoin, fromEvent, iif, Observable, of } from 'rxjs'
import { catchError, filter, finalize, map, pluck, shareReplay, startWith, switchMap, take, takeUntil, tap } from 'rxjs/operators'
import { Community, Competition, User, UserService, Workout } from '../../../../global/domain'
import { Telemetry } from '../../../../global/domain/models/telemetry'
import { Tracker } from '../../../../global/domain/models/tracker'
import { CommunityService } from '../../../../global/domain/services/community/community.service'
import { CompetitionService } from '../../../../global/domain/services/competition/competition.service'
import { TelemetryService } from '../../../../global/domain/services/telemetry/telemetry.service'
import { TrackerService } from '../../../../global/domain/services/tracker/tracker.service'
import { WorkoutService } from '../../../../global/domain/services/workout/workout.service'
import { EventType, SomeWrappedEvent, WrappedEvent } from '../../../../global/models'
import { UserHolderService } from '../../../../global/services'

@Component({
  selector: 'cy-profile-container',
  templateUrl: './profile-container.component.html',
  styleUrls: [ './profile-container.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ TuiDestroyService ]
})
export class ProfileContainerComponent {

  // 1Mb
  public maxFileSize: number = 1_000_000

  public activitiesFilterControl: FormControl = this.fb.control([ 'Тренировки' ])

  public user: BehaviorSubject<User> = new BehaviorSubject(
    this.activatedRoute.snapshot.data.profileUser
  )

  public avatarUrl: Observable<string | null> = this.user.pipe(
    pluck('avatar')
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
        const competitionEvents: WrappedEvent<EventType.competition, Competition>[] = competitions.map((competition: Competition) => ({
          type: EventType.competition,
          value: competition
        }))

        result.push(...workoutEvents)
        result.push(...competitionEvents)

        return result.sort((a: SomeWrappedEvent, b: SomeWrappedEvent) => {
          return new Date(a.value.createdAd).getTime() - new Date(b.value.startDate).getTime()
        })
      })
    ))
  )

  public isActiveProfileYours: Observable<boolean> = combineLatest([
    this.activatedRoute.paramMap.pipe(
      startWith((this.activatedRoute.snapshot.paramMap)),
      map((paramMap: ParamMap) => paramMap.get('login'))
    ),
    this.userHolderService.userChanges.pipe()
  ]).pipe(
    map(([ userLogin, user ]: [ string | null, User ]) => userLogin === user.login),
    shareReplay(1)
  )

  public isEditMode: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

  public editForm: FormGroup = this.fb.group({
    avatar: this.fb.control(null),
    firstName: this.fb.control(null),
    lastName: this.fb.control(null),
    about: this.fb.control(null),
    phone: this.fb.control(null),
    email: this.fb.control(null)
  })

  public avatarFileReader: FormControl = this.fb.control(null)

  public avatar: Observable<string> = this.isEditMode.pipe(
    switchMap((isEditMode: boolean) => {
      const inEditCase: Observable<string> = this.editForm.get('avatar')!.valueChanges.pipe(
        shareReplay(1)
      )

      const inReadCase: Observable<string> = this.avatarUrl as Observable<string>

      return iif(() => isEditMode, inEditCase, inReadCase)
    })
  )

  private previewAvatarCalc: Observable<any> = this.avatarFileReader.valueChanges.pipe(
    tap((file: File | null) => {
      if (file === null) {
        this.editForm.patchValue({ avatar: this.userHolderService.getUser()!.avatar })
        return
      }

      const fileReader: FileReader = new FileReader()

      fromEvent(fileReader, 'load').pipe(
        take(1),
        tap((event: Event) => this.editForm.get('avatar')!.patchValue((event.target as FileReader).result as string))
      ).subscribe()

      fileReader.readAsDataURL(file)
    })
  )

  public userTracker: Observable<Tracker | null> = this.userHolderService.userChanges.pipe(
    switchMap((user: User) => {
      return this.trackerService.getByUser(user.login).pipe(
        catchError(() => of(null))
      )
    }),
    shareReplay(1)
  )

  public trackerLastTelemetry: Observable<Telemetry | null> = this.userTracker.pipe(
    switchMap((tracker: Tracker | null) => {
      if (tracker === null) {
        return of(null)
      }

      return this.telemetryService.getLast(tracker.id)
    }),
    shareReplay(1)
  )

  public trackerLastPosition: Observable<[ number, number ]> = this.trackerLastTelemetry.pipe(
    filter((telemetry: Telemetry | null): telemetry is Telemetry => telemetry !== null),
    map((telemetry: Telemetry) => [ telemetry.longitude, telemetry.latitude ] as [ number, number ])
  )

  public isTrackerDoesNotExist: Observable<boolean> = this.userTracker.pipe(
    map((tracker: Tracker | null) => tracker === null)
  )

  public showMap: Observable<boolean> = combineLatest([
    this.userTracker,
    this.trackerLastTelemetry
  ]).pipe(
    map(([ tracker, lastTelemetry ]: [ Tracker | null, Telemetry | null ]) => tracker !== null && lastTelemetry !== null),
    shareReplay(1)
  )

  private titleSetter: Observable<User> = this.user.pipe(
    takeUntil(this.destroyService),
    tap((user: User) => {
      if (user.firstName !== null && user.firstName !== '' && user.lastName !== null && user.lastName !== '') {
        this.title.setTitle(`${ user.login } (${ user.firstName } ${ user.lastName })`)
        return
      }

      if (user.firstName !== null && user.firstName !== '') {
        this.title.setTitle(`${ user.login } (${ user.firstName })`)
        return
      }

      this.title.setTitle(user.login)
    })
  )

  constructor(private fb: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private communityService: CommunityService,
              private workoutService: WorkoutService,
              private competitionService: CompetitionService,
              private userHolderService: UserHolderService,
              private userService: UserService,
              private trackerService: TrackerService,
              private telemetryService: TelemetryService,
              private title: Title,
              private destroyService: TuiDestroyService) {
    this.previewAvatarCalc.subscribe()
    this.titleSetter.subscribe()
  }

  public onClickEditButton(): void {
    this.isEditMode.next(true)

    const user: User | null = this.userHolderService.getUser()

    if (user === null) {
      throw new Error(`User not found`)
    }

    this.editForm.patchValue(user)
  }

  public onClickCancelButton(): void {
    this.isEditMode.next(false)
  }

  public onClickSaveButton(): void {
    const result: User = {
      ...this.userHolderService.getUser()!,
      ...this.editForm.value
    }

    this.userService.updateUser(result.id, result).pipe(
      finalize(() => this.onClickCancelButton()),
      tap((user: User) => {
        this.user.next(user)
        this.userHolderService.updateUser(user)
      }),
      catchError(() => EMPTY)
    ).subscribe()
  }

}
