import { ChangeDetectionStrategy, Component, Inject } from '@angular/core'
import { LOCAL_STORAGE } from '@ng-web-apis/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { User } from '../../../../../domain'
import { BrowserStorage, DEFAULT_AVATAR, takeBrowserStorageKey } from '../../../../../models'
import { UserHolderService } from '../../../../../services'

@Component({
  selector: 'cy-header',
  templateUrl: './header.component.html',
  styleUrls: [ './header.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {

  public isUserAuthorized: Observable<boolean> = this.userHolderService.isUserAuthorizedChanges

  public isUserUnauthorized: Observable<boolean> = this.isUserAuthorized.pipe(
    map((isUserAuthorized: boolean) => !isUserAuthorized)
  )

  public userAvatar: Observable<string> = this.userHolderService.userChanges.pipe(
    map((user: User) => {
      if (user.avatar !== null) {
        return `${ user.avatar }`
      }

      return DEFAULT_AVATAR
    })
  )

  public profileRouterLink: Observable<string> = this.userHolderService.userChanges.pipe(
    map((user: User) => user.login),
    map((userLogin: string) => `/users/${ userLogin }`)
  )

  constructor(private userHolderService: UserHolderService,
              @Inject(LOCAL_STORAGE)
              private localStorage: Storage) {
  }

  public onClickLogoutButton(): void {
    this.localStorage.removeItem(takeBrowserStorageKey(BrowserStorage.accessToken))
    this.userHolderService.updateUser(null)
  }
}
