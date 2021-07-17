import { ChangeDetectionStrategy, Component, Inject } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { TuiDestroyService, TuiStringHandler } from '@taiga-ui/cdk'
import { TuiNotification, TuiNotificationsService } from '@taiga-ui/core'
import { EMPTY, fromEvent, Observable } from 'rxjs'
import { catchError, pluck, startWith, take, takeUntil, tap } from 'rxjs/operators'
import { Community, CommunityType, SportType, User } from '../../../../global/domain'
import { CommunityService } from '../../../../global/domain/services/community/community.service'
import { UserStoreService } from '../../../../global/services'
import { MAX_AVATAR_FILE_SIZE } from '../../../../global/tokens/max-avatar-size'

@Component({
  selector: 'cy-community-create-container',
  templateUrl: './community-create-container.component.html',
  styleUrls: [ './community-create-container.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ TuiDestroyService ]
})
export class CommunityCreateContainerComponent {

  public readonly communityTypesMap: Readonly<Record<CommunityType, string>> = {
    [ CommunityType.organization ]: `Организация`,
    [ CommunityType.club ]: `Клуб`
  }

  public readonly sportTypesMap: Readonly<Record<SportType, string>> = {
    [ SportType.bicycle ]: `Велосипед`,
    [ SportType.rollerblade ]: `Ролики`,
    [ SportType.run ]: `Бег`,
    [ SportType.ski ]: `Лыжи`
  }

  public readonly sportTypeKeys: readonly string[] = Object.values(SportType)

  public readonly communityTypeKeys: readonly string[] = Object.values(CommunityType)

  public form: FormGroup = new FormGroup({
    name: new FormControl(null, [ Validators.required ]),
    nickname: new FormControl(null, [ Validators.required ]),
    communityType: new FormControl(null, [ Validators.required ]),
    description: new FormControl(),
    sportTypes: new FormControl([], [ Validators.minLength(1) ]),
    url: new FormControl(),
    avatar: new FormControl()
  })

  public avatarChanges: Observable<string> = this.form.valueChanges.pipe(
    pluck('avatar'),
    startWith(this.form.value.avatar)
  )

  public avatarInputFileControl: FormControl = new FormControl()

  public avatarInputFileChanges: Observable<File | null> = this.avatarInputFileControl.valueChanges.pipe(
    takeUntil(this.destroyService),
    tap((file: File | null) => {
      if (file === null) {
        return
      }

      const fileReader: FileReader = new FileReader()

      fromEvent(fileReader, 'load').pipe(
        take(1),
        tap((event: Event) => this.form.get('avatar')!.patchValue((event.target as FileReader).result as string))
      ).subscribe()

      fileReader.readAsDataURL(file)
    })
  )

  constructor(private activatedRoute: ActivatedRoute,
              private destroyService: TuiDestroyService,
              private router: Router,
              @Inject(MAX_AVATAR_FILE_SIZE)
              public readonly maxAvatarFileSize: number,
              private communityService: CommunityService,
              private notificationService: TuiNotificationsService,
              private userStoreService: UserStoreService) {
    this.avatarInputFileChanges.subscribe()
  }

  public sportTypeStringify: TuiStringHandler<SportType> = (sportType: SportType) => this.sportTypesMap[ sportType ]

  public onClickSaveButton(): void {
    if (this.form.invalid) {
      this.notificationService.show('Поля заполнены не правильно', { status: TuiNotification.Warning }).subscribe()
      return
    }

    const user: User | null = this.userStoreService.user

    if (user === null) {
      throw new Error('User does not exist')
    }

    this.communityService.create({
      id: null,
      userIds: null,
      ownerUserId: user.id,
      createdAt: null,
      ...this.form.value
    }).pipe(
      tap((community: Community) => {
        this.notificationService.show('Сообщество успешно создано', { status: TuiNotification.Success }).subscribe()
        this.router.navigate([ '/', 'communities', community.nickname ])
      }),
      catchError(() => {
        this.notificationService.show('Не удалось создать сообщество', { status: TuiNotification.Error }).subscribe()
        return EMPTY
      })
    ).subscribe()
  }
}
