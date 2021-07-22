import { ChangeDetectionStrategy, Component, Inject } from '@angular/core'
import { FormBuilder, FormControl, FormGroup } from '@angular/forms'
import { Title } from '@angular/platform-browser'
import { ActivatedRoute, ParamMap } from '@angular/router'
import { TuiDestroyService } from '@taiga-ui/cdk'
import { TuiDialogContext, TuiDialogService, TuiNotification, TuiNotificationsService } from '@taiga-ui/core'
import { PolymorpheusContent } from '@tinkoff/ng-polymorpheus'
import { BehaviorSubject, combineLatest, EMPTY, fromEvent, iif, Observable, of } from 'rxjs'
import { catchError, filter, finalize, map, pluck, shareReplay, startWith, switchMap, take, takeUntil, tap } from 'rxjs/operators'
import { FilterTag } from '../../../../global/cdk/components/event-filter'
import { BaseCompetition, BaseEvent, BaseEventType, BaseWorkout, Community, User, UserService } from '../../../../global/domain'
import { Telemetry } from '../../../../global/domain/models/telemetry'
import { Tracker } from '../../../../global/domain/models/tracker'
import { CommunityService } from '../../../../global/domain/services/community/community.service'
import { EventService } from '../../../../global/domain/services/event/event.service'
import { TelemetryService } from '../../../../global/domain/services/telemetry/telemetry.service'
import { TrackerService } from '../../../../global/domain/services/tracker/tracker.service'
import { ConfigService, ImageNetworkService, UserStoreService } from '../../../../global/services'
import { MAX_AVATAR_FILE_SIZE } from '../../../../global/tokens'
import { detectBaseEventTypeByEventType } from '../../../../global/utils'

@Component({
  selector: 'cy-profile-container',
  templateUrl: './profile-container.component.html',
  styleUrls: [ './profile-container.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ TuiDestroyService ]
})
export class ProfileContainerComponent {
  public user$: BehaviorSubject<User> = new BehaviorSubject(
    this.activatedRoute.snapshot.data.profileUser
  )

  public avatarUrl$: Observable<string | null> = this.user$.pipe(
    takeUntil(this.destroy$),
    pluck('avatar')
  )

  public fullName$: Observable<string | null> = this.user$.pipe(
    takeUntil(this.destroy$),
    map((user: User) => {
      if (user.firstName === null && user.lastName === null) {
        return null
      }

      return Array.of(user.firstName, user.lastName).join(' ')
    })
  )

  public login$: Observable<string> = this.user$.pipe(
    takeUntil(this.destroy$),
    pluck('login')
  )

  public about$: Observable<string | null> = this.user$.pipe(
    takeUntil(this.destroy$),
    pluck('about')
  )

  public phone$: Observable<string | null> = this.user$.pipe(
    takeUntil(this.destroy$),
    pluck('phone')
  )

  public email$: Observable<string | null> = this.user$.pipe(
    takeUntil(this.destroy$),
    pluck('email')
  )

  public userCommunities$: Observable<Community[]> = this.user$.pipe(
    takeUntil(this.destroy$),
    switchMap((user: User) => this.communityService.getCommunitiesByUser(user.login))
  )

  public events$: Observable<BaseEvent[]> = this.user$.pipe(
    takeUntil(this.destroy$),
    switchMap((user: User) => this.eventService.readEventByUser(user.login))
  )

  /**
   * @todo Не обновляется поток, после того как пользователь вышел из.
   * Токен удалился, пользователь стал NULL, но страница профиля думает
   * что пользователь авторизован и кнопка "Редактировать" не обновляется
   */
  public isActiveProfileYours$: Observable<boolean> = combineLatest([
    this.activatedRoute.paramMap.pipe(
      startWith((this.activatedRoute.snapshot.paramMap)),
      map((paramMap: ParamMap) => paramMap.get('login'))
    ),
    this.userStoreService.validUserChanges.pipe()
  ]).pipe(
    takeUntil(this.destroy$),
    map(([ userLogin, user ]: [ string | null, User ]) => userLogin === user.login),
    shareReplay(1)
  )

  public isEditMode$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

  public editForm: FormGroup = this.fb.group({
    avatar: this.fb.control(null),
    firstName: this.fb.control(null),
    lastName: this.fb.control(null),
    about: this.fb.control(null),
    phone: this.fb.control(null),
    email: this.fb.control(null)
  })

  public avatarFileReader: FormControl = this.fb.control(null)

  public newPasswordControl: FormControl = this.fb.control(null)

  public avatar$: Observable<string> = this.isEditMode$.pipe(
    takeUntil(this.destroy$),
    switchMap((isEditMode: boolean) => {
      const inEditCase: Observable<string> = this.editForm.get('avatar')!.valueChanges.pipe(
        shareReplay(1)
      )

      const inReadCase: Observable<string> = this.avatarUrl$ as Observable<string>

      return iif(() => isEditMode, inEditCase, inReadCase)
    })
  )

  private previewAvatarCalc$: Observable<any> = this.avatarFileReader.valueChanges.pipe(
    takeUntil(this.destroy$),
    tap((file: File | null) => {
      if (file === null) {
        this.editForm.patchValue({ avatar: this.userStoreService.user!.avatar })
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

  public userTracker$: Observable<Tracker | null> = this.userStoreService.validUserChanges.pipe(
    takeUntil(this.destroy$),
    switchMap((user: User) => {
      return this.trackerService.getByUser(user.login).pipe(
        catchError(() => of(null))
      )
    }),
    shareReplay(1)
  )

  public trackerLastTelemetry$: Observable<Telemetry | null> = this.userTracker$.pipe(
    takeUntil(this.destroy$),
    switchMap((tracker: Tracker | null) => {
      if (tracker === null) {
        return of(null)
      }

      return this.telemetryService.getLast(tracker.id)
    }),
    shareReplay(1)
  )

  public trackerLastPosition$: Observable<[ number, number ]> = this.trackerLastTelemetry$.pipe(
    takeUntil(this.destroy$),
    filter((telemetry: Telemetry | null): telemetry is Telemetry => telemetry !== null),
    map((telemetry: Telemetry) => [ telemetry.longitude, telemetry.latitude ] as [ number, number ])
  )

  public isTrackerDoesNotExist$: Observable<boolean> = this.userTracker$.pipe(
    takeUntil(this.destroy$),
    map((tracker: Tracker | null) => tracker === null)
  )

  public showMap$: Observable<boolean> = combineLatest([
    this.userTracker$,
    this.trackerLastTelemetry$
  ]).pipe(
    takeUntil(this.destroy$),
    map(([ tracker, lastTelemetry ]: [ Tracker | null, Telemetry | null ]) => tracker !== null && lastTelemetry !== null),
    shareReplay(1)
  )

  private titleSetter$: Observable<User> = this.user$.pipe(
    takeUntil(this.destroy$),
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

  public filterFormControl: FormControl = new FormControl([])

  /**
   * TODO: Копипаста. Подумать над DRY.
   */
  public filteredEvents$: Observable<BaseEvent[]> = combineLatest([
    this.events$,
    this.filterFormControl.valueChanges.pipe(
      startWith(this.filterFormControl.value)
    )
  ]).pipe(
    map(([ events, filters ]: [ BaseEvent[], FilterTag[] ]) => {
      let isWorkoutFilterActivated: boolean = false
      let isCompetitionFilterActivated: boolean = false

      filters.forEach((item: FilterTag) => {
        if (item.value === BaseEventType.workout) {
          isWorkoutFilterActivated = true
        }

        if (item.value === BaseEventType.competition) {
          isCompetitionFilterActivated = true
        }
      })

      let sortedEvents: (BaseWorkout | BaseCompetition)[] = events

      if (isWorkoutFilterActivated && !isCompetitionFilterActivated) {
        sortedEvents = events.filter((event: BaseWorkout | BaseCompetition) =>
          detectBaseEventTypeByEventType(event.eventType) === BaseEventType.workout)
      }

      if (isCompetitionFilterActivated && !isWorkoutFilterActivated) {
        sortedEvents = events.filter((event: BaseWorkout | BaseCompetition) =>
          detectBaseEventTypeByEventType(event.eventType) === BaseEventType.competition)
      }

      return sortedEvents
    })
  )

  constructor(private fb: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private communityService: CommunityService,
              private eventService: EventService,
              private userStoreService: UserStoreService,
              private userService: UserService,
              private trackerService: TrackerService,
              private telemetryService: TelemetryService,
              private title: Title,
              private imageNetworkService: ImageNetworkService,
              private configService: ConfigService,
              private notificationService: TuiNotificationsService,
              private destroy$: TuiDestroyService,
              @Inject(MAX_AVATAR_FILE_SIZE)
              public readonly maxFileSize: number,
              private dialogService: TuiDialogService) {
    this.previewAvatarCalc$.subscribe()
    this.titleSetter$.subscribe()
  }

  public updateUser(): void {
    const result: User = {
      ...this.userStoreService.user!,
      ...this.editForm.value
    }

    this.userService.updateUser(result.id, result).pipe(
      finalize(() => this.onClickCancelButton()),
      tap((user: User) => {
        this.user$.next(user)
        this.userStoreService.setUser(user)
      }),
      catchError(() => EMPTY)
    ).subscribe()
  }

  public onClickEditButton(): void {
    this.isEditMode$.next(true)

    const user: User | null = this.userStoreService.user

    if (user === null) {
      throw new Error(`User not found`)
    }

    this.editForm.patchValue(user)
  }

  public onClickPasswordChangeButton(templateRef: PolymorpheusContent<TuiDialogContext<string>>): void {
    this.dialogService.open(templateRef, { size: 's', label: 'Обновление пароля' }).pipe(
      take(1),
      switchMap((value: string | null) => {
        if (value === null) {
          return EMPTY
        }

        return this.userService.updatePassword(value).pipe(
          switchMap(() => this.notificationService.show(`Пароль успешно обновлен`, { status: TuiNotification.Success })),
          catchError(() => this.notificationService.show(`Не удалось обновить пароль`, { status: TuiNotification.Error }))
        )
      })
    ).subscribe()
  }

  public onClickCancelButton(): void {
    this.isEditMode$.next(false)
  }

  public onClickSaveButton(): void {
    const avatarFile: File | null = this.avatarFileReader.value

    if (avatarFile === null) {
      this.updateUser()
      return
    }

    const uploadImageData: FormData = new FormData()

    uploadImageData.append('imageFile', avatarFile, avatarFile.name)

    this.imageNetworkService.uploadImage(uploadImageData).pipe(
      tap((imageName: string) => {
        this.editForm.get('avatar')!.patchValue(`${ this.configService.apiImageUrl }/${ imageName }`)

        this.updateUser()
      }),
      catchError(() => this.notificationService.show('Не удалось сохранить данные пользователя', { status: TuiNotification.Error })),
      take(1)
    ).subscribe()
  }
}
