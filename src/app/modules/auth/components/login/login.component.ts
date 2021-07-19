import { HttpErrorResponse } from '@angular/common/http'
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Title } from '@angular/platform-browser'
import { Router } from '@angular/router'
import { LOCAL_STORAGE } from '@ng-web-apis/common'
import { TuiNotification, TuiNotificationsService } from '@taiga-ui/core'
import { BehaviorSubject } from 'rxjs'
import { catchError, finalize, switchMap, take, tap } from 'rxjs/operators'
import { User, UserService } from '../../../../global/domain'
import { BrowserStorage, takeBrowserStorageKey } from '../../../../global/models'
import { UserStoreService } from '../../../../global/services/user-store/user-store.service'
import { AuthError, AuthorizationResult, isAuthError } from '../../models'
import { AuthorizationService } from '../../services/authorization/authorization.service'

@Component({
  selector: 'cy-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: `cy-login form-container`
  }
})
export class LoginComponent {
  public loginForm: FormGroup = this.fb.group({
    login: this.fb.control(null, Validators.required),
    password: this.fb.control(null, Validators.required)
  })

  public isButtonLoaderShow: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

  constructor(private fb: FormBuilder,
              private notificationService: TuiNotificationsService,
              private authorizationService: AuthorizationService,
              @Inject(LOCAL_STORAGE)
              private localStorage: Storage,
              private router: Router,
              private title: Title,
              private userService: UserService,
              private userStoreService: UserStoreService) {
    this.title.setTitle(`Авторизация`)
  }

  public onClickSubmitButton(): void {
    if (this.loginForm.invalid) {
      this.notificationService
          .show(`Форма заполнена не правильно`, { status: TuiNotification.Warning })
          .subscribe()
      return
    }

    this.isButtonLoaderShow.next(true)

    const { login, password } = this.loginForm.value

    this.authorizationService.authorize(login, password).pipe(
      finalize(() => this.isButtonLoaderShow.next(false)),
      switchMap((authorizationResult: AuthorizationResult) => {
        this.localStorage.setItem(takeBrowserStorageKey(BrowserStorage.accessToken), authorizationResult.access_token)

        return this.userService.getMe(authorizationResult.access_token).pipe(
          tap((user: User) => {
            this.userStoreService.setUser(user)
            this.router.navigateByUrl(this.authorizationService.redirectAfterAuthUrl)

            this.notificationService.show(`Авторизация прошла успешно`, { status: TuiNotification.Success }).subscribe()
          })
        )
      }),
      catchError((httpErrorResponse: HttpErrorResponse) => {
        const originalError: AuthError = httpErrorResponse.error

        if (!isAuthError(originalError)) {
          return this.notificationService.show(`Ошибка авторизации`, { status: TuiNotification.Error })
        }

        if (originalError.error_description === 'Bad credentials') {
          return this.notificationService.show(`Указан не правильный пароль`, { status: TuiNotification.Error })
        }

        if (originalError.error_description === 'Username not found') {
          return this.notificationService.show(`Такого пользователя нет`, { status: TuiNotification.Error })
        }

        return this.notificationService.show(`Ошибка авторизации`, { status: TuiNotification.Error })
      }),
      take(1)
    ).subscribe()
  }
}
