import { ChangeDetectionStrategy, Component, Inject, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { LOCAL_STORAGE } from '@ng-web-apis/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { AuthorizationService } from '../../../../../../modules/auth/services/authorization/authorization.service'
import { User } from '../../../../../domain'
import { BrowserStorage, DEFAULT_AVATAR, takeBrowserStorageKey } from '../../../../../models'
import { UserStoreService } from '../../../../../services'
import { TuiHostedDropdownComponent } from '@taiga-ui/core'
import { isEmpty } from '../../../../../utils'

@Component({
  selector: 'cy-header',
  templateUrl: './header.component.html',
  styleUrls: [ './header.component.scss' ],
  changeDetection: ChangeDetectionStrategy.Default
})
export class HeaderComponent {
  public isOpenedDropdown: boolean = false

  public isUserAuthorized$: Observable<boolean> = this.userStoreService.isAuthChanges

  public isUserUnauthorized$: Observable<boolean> = this.isUserAuthorized$.pipe(
    map((isUserAuthorized: boolean) => !isUserAuthorized)
  )

  public userAvatar$: Observable<string> = this.userStoreService.validUserChanges.pipe(
    map((user: User) => {
      if (user.avatar !== null) {
        return `${ user.avatar }`
      }

      return DEFAULT_AVATAR
    })
  )

  public userFirstName$: Observable<string | null> = this.userStoreService.validUserChanges.pipe(
    map((user: User) => user.firstName)
  )

  public profileRouterLink$: Observable<string> = this.userStoreService.validUserChanges.pipe(
    map((user: User) => user.login),
    map((userLogin: string) => `/users/${ userLogin }`)
  )

  @ViewChild(TuiHostedDropdownComponent)
  private dropdownComponent?: TuiHostedDropdownComponent

  constructor(private userStoreService: UserStoreService,
              @Inject(LOCAL_STORAGE)
              private localStorage: Storage,
              private router: Router,
              private authorizationService: AuthorizationService) {
  }

  public onClickLogoutButton(): void {
    this.isOpenedDropdown = false
    this.localStorage.removeItem(takeBrowserStorageKey(BrowserStorage.accessToken))
    this.userStoreService.reset()
  }

  /**
   * Метод, который закрывает выпадающее меню после клика по элементу списка.
   */
  public onClickDropdownItem(): void {
    this.isOpenedDropdown = false

    if (!isEmpty(this.dropdownComponent)) {
      if (!isEmpty(this.dropdownComponent.nativeFocusableElement)) {
        this.dropdownComponent.nativeFocusableElement!.focus()
      }
    }
  }

  /**
   * Метод для определения активного роута.
   */
  public isActiveRoute(url: string): boolean {
    if (this.router.url.includes(url + '?')) {
      const index: number = this.router.url.indexOf('?')

      return url === this.router.url.slice(0, index)
    }

    return this.router.url === url
  }

  public captureRedirectUrl(): void {
    this.authorizationService.redirectAfterAuthUrl = this.router.url
  }
}
