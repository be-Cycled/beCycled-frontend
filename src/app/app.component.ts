import { Component, Inject } from '@angular/core'
import { LOCAL_STORAGE, WINDOW } from '@ng-web-apis/common'
import { combineLatest, defer, Observable, of } from 'rxjs'
import { catchError, map, shareReplay, startWith, take, tap } from 'rxjs/operators'
import { ToolbarService } from './global/cdk/components/toolbar/services/toolbar/toolbar.service'
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

  /*private isAppInstalledEvent$: Observable<boolean> = fromEvent(this.window, 'appinstalled').pipe(
    mapTo(true),
    startWith(false),
    shareReplay(1)
  )*/

  private isAppInstalledEvent$: Observable<boolean> = of(true).pipe(
    startWith(false)
  )

  public isMobileChanges: Observable<boolean> = this.isMobile

  public isDesktop: Observable<boolean> = defer(() => this.isMobileChanges.pipe(
    map((isMobile: boolean) => !isMobile)
  ))

  public isToolbarShow$: Observable<boolean> = combineLatest([
    this.isMobileChanges,
    this.toolbarService.isShowToolbarChanges$,
    this.isAppInstalledEvent$
  ]).pipe(
    map(([ isMobile, isShowToolbar, isAppInstalled ]: [ boolean, boolean, boolean ]) => isMobile && isShowToolbar && isAppInstalled),
    shareReplay(1)
  )

  constructor(@Inject(IS_MOBILE)
              private isMobile: Observable<boolean>,
              private userService: UserService,
              private userStoreService: UserStoreService,
              @Inject(LOCAL_STORAGE)
              private localStorage: Storage,
              private toolbarService: ToolbarService,
              @Inject(WINDOW)
              private readonly window: Window) {
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
