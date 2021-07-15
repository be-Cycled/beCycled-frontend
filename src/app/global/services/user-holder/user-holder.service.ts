import { Inject, Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { LOCAL_STORAGE, WINDOW } from '@ng-web-apis/common'
import { BehaviorSubject, Observable } from 'rxjs'
import { filter, map, switchMap, tap } from 'rxjs/operators'
import { Community, User, UserService } from '../../domain'
import { BrowserStorage, takeBrowserStorageKey } from '../../models'
import { ComponentStore } from '../component-store'

@Injectable({ providedIn: 'root' })
/**
 * @deprecated
 * @todo Переписать на {@link ComponentStore}
 */
export class UserHolderService extends ComponentStore<User> {

  private user: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null)

  public userChanges: Observable<User> = this.user.pipe(
    filter((user: User | null): user is User => user !== null)
  )

  public userClearChanges: Observable<User | null> = this.user.pipe()

  public isUserAuthorizedChanges: Observable<boolean> = this.user.pipe(
    map((user: User | null) => user !== null)
  )

  constructor(@Inject(LOCAL_STORAGE)
              private localStorage: Storage,
              @Inject(WINDOW)
              private window: Window,
              private router: Router,
              private userService: UserService) {
    super()
  }

  public updateCurrentUser(): void {
    const token: string | null = this.localStorage.getItem(takeBrowserStorageKey(BrowserStorage.accessToken))

    if (token === null) {
      return
    }

    this.createEffect((token: Observable<string>) => {
      return token.pipe(
        switchMap((token: string) => this.userService.getMe(token).pipe(
          tap((user: User) => this.updateUser(user))
        ))
      )
    })(token)
  }

  public updateUser(user: User | null): void {
    this.user.next(user)
  }

  public getUser(): User | null {
    return this.user.value
  }

  public isUserAuthorized(): boolean {
    return this.getUser() !== null
  }

  public logout(): void {
    this.localStorage.removeItem(takeBrowserStorageKey(BrowserStorage.accessToken))
    this.router.navigate([ `/auth/login` ]).then(() => {
      this.user.next(null)
    })
  }

  public isUserJoinedCommunity(community: Community): boolean {
    const user: User | null = this.getUser()
    if (user === null) {
      throw new Error(`User not exist`)
    }
    return community.userIds.includes(user.id)
  }
}
