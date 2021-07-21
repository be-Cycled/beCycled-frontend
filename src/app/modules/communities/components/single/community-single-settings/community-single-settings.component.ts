import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { TuiContextWithImplicit, tuiPure, TuiStringHandler } from '@taiga-ui/cdk'
import { TuiNotification, TuiNotificationsService } from '@taiga-ui/core'
import { BehaviorSubject, Observable, of, Subject } from 'rxjs'
import { catchError, startWith, switchMap, tap } from 'rxjs/operators'
import { Community, CommunityType, SportType } from '../../../../../global/domain'
import { CommunityService } from '../../../../../global/domain/services/community/community.service'
import { ConfigService, ImageNetworkService } from '../../../../../global/services'
import { MAX_AVATAR_FILE_SIZE } from '../../../../../global/tokens'
import { CommunityStoreService } from '../../../services'

@Component({
  selector: 'cy-community-single-settings',
  templateUrl: './community-single-settings.component.html',
  styleUrls: [ './community-single-settings.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommunitySingleSettingsComponent implements OnInit {
  public sportType: typeof SportType = SportType

  public communityType: typeof CommunityType = CommunityType

  public avatarFileControl: FormControl = this.fb.control(null)

  public communityFormGroup: FormGroup = this.fb.group({
    name:          this.fb.control(null, [ Validators.required ]),
    nickname:      this.fb.control(null, [ Validators.required ]),
    avatar:        this.fb.control(null),
    sportTypes:    this.fb.control([]),
    url:           this.fb.control(null),
    description:   this.fb.control(null),
    communityType: this.fb.control(null, [ Validators.required ])
  })

  public avatarUrl: Observable<string> = this.avatarFileControl.valueChanges.pipe(
    startWith(this.avatarFileControl.value),
    switchMap((image: File | null) => {
      if (image === null) {
        return of(this.communityFormGroup.value.avatar)
      }

      const fileReader: FileReader = new FileReader()
      const result: Subject<string> = new Subject<string>()
      fileReader.addEventListener('load', () => result.next(fileReader.result as string), { once: true })
      fileReader.readAsDataURL(image)

      return result
    })
  )

  public saveButtonShowLoader: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

  public communityTypesMap: Record<CommunityType, string> = {
    [ CommunityType.organization ]: `Организация`,
    [ CommunityType.club ]: `Клуб`
  }

  public communityTypeKeys: CommunityType[] = Object.keys(this.communityTypesMap) as CommunityType[]

  constructor(private communityStoreService: CommunityStoreService,
              private communityService: CommunityService,
              private fb: FormBuilder,
              private notificationService: TuiNotificationsService,
              private imagesService: ImageNetworkService,
              private configService: ConfigService,
              @Inject(MAX_AVATAR_FILE_SIZE)
              public readonly maxFileSize: number) {
    const community: Community | null = this.communityStoreService.takeCommunity()

    if (community === null) {
      throw new Error(`Community is null`)
    }

    this.communityFormGroup.patchValue(community)
  }

  public ngOnInit(): void {
  }

  public onClickSaveButton(): void {
    if (this.communityFormGroup.invalid) {
      return
    }

    this.saveButtonShowLoader.next(true)

    const newAvatar: File | null = this.avatarFileControl.value
    const originCommunity: Community | null = this.communityStoreService.takeCommunity()

    if (originCommunity === null) {
      throw new Error(`Community does not exist`)
    }

    const formValue: any = this.communityFormGroup.value

    if (newAvatar === null) {
      const community: Community = {
        ...originCommunity,
        ...formValue
      }

      this.updateCommunity(community)
      return
    }

    const formData: FormData = new FormData()

    formData.append('imageFile', newAvatar, newAvatar.name)

    this.imagesService.uploadImage(formData).pipe(
      tap((image: string) => {
        const community: Community = {
          ...originCommunity,
          ...formValue,
          avatar: `${ this.configService.apiImageUrl }/${ image }`
        }

        this.updateCommunity(community)
        this.avatarFileControl.patchValue(null)
      })
    ).subscribe()
  }

  @tuiPure
  public communityStyleStringify(): TuiStringHandler<TuiContextWithImplicit<CommunityType>> {
    debugger
    return ({ $implicit }: TuiContextWithImplicit<CommunityType>) => {
      if ($implicit === CommunityType.club) {
        return `Клуб`
      }

      if ($implicit === CommunityType.organization) {
        return `Организация`
      }

      return ``
    }
  }

  public onClickDeleteButton(): void {
    /*this.communityStoreService.communityChanges$.pipe(
      switchMap((community: Community) => )
    )*/
  }

  private updateCommunity(community: Community): void {
    this.communityService.update(community.id, community).pipe(
      tap((community: Community) => {
        this.notificationService
          .show(`Сообщество успешно обновлено`, { status: TuiNotification.Success })
          .subscribe()
        this.communityStoreService.setCommunity(community)
        this.communityFormGroup.patchValue(community)
        this.saveButtonShowLoader.next(false)
      }),
      catchError(() => {
        this.saveButtonShowLoader.next(false)
        return this.notificationService.show(`Произошла ошибка`, { status: TuiNotification.Error })
      })
    ).subscribe()
  }

}
