import { HttpErrorResponse } from '@angular/common/http'
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Title } from '@angular/platform-browser'
import { Router } from '@angular/router'
import { LOCAL_STORAGE } from '@ng-web-apis/common'
import { TuiValidationError } from '@taiga-ui/cdk'
import { TuiNotification, TuiNotificationsService } from '@taiga-ui/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { catchError, finalize, map, switchMap, take } from 'rxjs/operators'
import { AuthorizationService } from '../../services/authorization/authorization.service'

function checkPasswordEquality(formGroup: FormGroup): { isPassEquals: false } | null {
  const password: string = formGroup.value.password
  const confirmPassword: string = formGroup.value.confirmPassword

  if (password === confirmPassword) {
    return null
  }

  return {
    isPassEquals: false
  }
}

@Component({
  selector: 'cy-registration',
  templateUrl: './registration.component.html',
  styleUrls: [ './registration.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: `cy-registration form-container`
  }
})
export class RegistrationComponent {

  public errorMessage: TuiValidationError<object> = new TuiValidationError<object>(`Пароли не совпадают`)

  public registrationForm: FormGroup = this.fb.group(
    {
      email: this.fb.control(null, [ Validators.required, Validators.email ]),
      login: this.fb.control(null, [ Validators.required, Validators.pattern(/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i) ]),
      password: this.fb.control(null, Validators.required),
      confirmPassword: this.fb.control(null, Validators.required),
      userAgreement: this.fb.control(false, Validators.requiredTrue)
    },
    { validators: checkPasswordEquality }
  )

  public isPassEqualError: Observable<boolean> = this.registrationForm.statusChanges.pipe(
    map((status: string) =>
      status === 'INVALID'
      && this.registrationForm.errors !== null
      && 'isPassEquals' in this.registrationForm.errors)
  )

  public isButtonLoaderShow: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

  constructor(private fb: FormBuilder,
              private notificationService: TuiNotificationsService,
              private authorizationService: AuthorizationService,
              @Inject(LOCAL_STORAGE)
              private localStorage: Storage,
              private router: Router,
              private title: Title) {
    this.title.setTitle(`Регистрация`)
  }

  public onClickSubmitButton(): void {
    if (this.registrationForm.invalid) {
      this.notificationService
          .show(`Форма заполнена не правильно`, { status: TuiNotification.Warning })
          .subscribe()
      return
    }

    this.isButtonLoaderShow.next(true)

    const { email, login, password } = this.registrationForm.value

    this.authorizationService.register({ email, login, password }).pipe(
      finalize(() => this.isButtonLoaderShow.next(false)),
      switchMap(() => {
        setTimeout(() => this.router.navigateByUrl(`/auth/login`), 1000)
        return this.notificationService.show(`Регистрация прошла успешно`, { status: TuiNotification.Success })
      }),
      catchError((httpErrorResponse: HttpErrorResponse) => {
        const originalError: string = httpErrorResponse.error

        if (typeof originalError !== 'string') {
          return this.notificationService.show(`Ошибка регистрации`, { status: TuiNotification.Error })
        }

        if (originalError === 'Login already using') {
          return this.notificationService.show(`Такой логин уже используется`, { status: TuiNotification.Error })
        }

        if (originalError === 'Email already using') {
          return this.notificationService.show(`Такая эл. почта уже используется`, { status: TuiNotification.Error })
        }

        return this.notificationService.show(`Ошибка авторизации`, { status: TuiNotification.Error })
      }),
      take(1)
    ).subscribe()
  }
}
