import { Component, Inject } from '@angular/core'
import { LOCAL_STORAGE } from '@ng-web-apis/common'
import { defer, Observable, of } from 'rxjs'
import { catchError, map, take, tap } from 'rxjs/operators'
import { User, UserService } from './global/domain'
import { BrowserStorage, takeBrowserStorageKey } from './global/models'
import { UserStoreService } from './global/services'
import { IS_MOBILE } from './global/tokens'

@Component({
  selector: 'cy-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
})
export class AppComponent {

  public isMobileChanges: Observable<boolean> = this.isMobile

  public isDesktop: Observable<boolean> = defer(() => this.isMobileChanges.pipe(
    map((isMobile: boolean) => !isMobile)
  ))

  constructor(@Inject(IS_MOBILE)
              private isMobile: Observable<boolean>,
              private userService: UserService,
              private userStoreService: UserStoreService,
              @Inject(LOCAL_STORAGE)
              private localStorage: Storage) {
    const token: string | null = this.localStorage.getItem(takeBrowserStorageKey(BrowserStorage.accessToken))

    if (token !== null) {
      this.userService.getMe(token).pipe(
        take(1),
        tap((user: User) => this.userStoreService.setUser(user)),
        catchError(() => of(null))
      ).subscribe()
    }
  }
}
