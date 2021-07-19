import { HttpErrorResponse } from '@angular/common/http'
import { ChangeDetectionStrategy, Component } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { TuiNotification, TuiNotificationsService } from '@taiga-ui/core'
import { Observable, of } from 'rxjs'
import { catchError, map, pluck, switchMap, tap } from 'rxjs/operators'
import { Community, CommunityType, User } from '../../../../global/domain'
import { CommunityService } from '../../../../global/domain/services/community/community.service'
import { UserStoreService } from '../../../../global/services'

@Component({
  selector: 'cy-community-create-container',
  templateUrl: './community-create-container.component.html',
  styleUrls: ['./community-create-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommunityCreateContainerComponent {

  public communityType: typeof CommunityType = CommunityType

  public createForm: FormGroup = this.fb.group({
    name: this.fb.control(null, Validators.required),
    nickname: this.fb.control(null, Validators.required),
    communityType: this.fb.control(CommunityType.club, Validators.required)
  })

  public nicknamePreview: Observable<string> = this.createForm.valueChanges.pipe(
    pluck('nickname')
  )

  constructor(private fb: FormBuilder,
              private communityService: CommunityService,
              private router: Router,
              private userStoreService: UserStoreService,
              private notificationService: TuiNotificationsService) {
  }

  public onClickSaveButton(): void {
    if (this.createForm.invalid) {
      return
    }

    const { name, nickname, communityType } = this.createForm.value

    this.userStoreService.validUserChanges.pipe(
      switchMap((user: User) => this.communityService.create({
        name,
        nickname,
        communityType,
        avatar: null,
        id: null,
        ownerUserId: user.id,
        sportTypes: [],
        userIds: [],
        description: null,
        url: null,
        createdAt: null
      }).pipe(
        tap((community: Community) => this.router.navigateByUrl(`/communities/${ community.nickname }`)),
        catchError((httpErrorResponse: HttpErrorResponse) => of(httpErrorResponse).pipe(
          pluck('error'),
          map((error: string) => {
            if (error === `Community is already exist`) {
              return `Никнейм должен быть уникален`
            }

            return `Не удалось создать сообщество`
          }),
          switchMap((errorMessage: string) => this.notificationService.show(errorMessage, { status: TuiNotification.Error }))
        ))
      ))
    ).subscribe()
  }
}
