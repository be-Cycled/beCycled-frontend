import { Inject, Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { LOCAL_STORAGE, WINDOW } from '@ng-web-apis/common'
import { BehaviorSubject, defer, fromEvent, Observable } from 'rxjs'
import { filter, map, startWith } from 'rxjs/operators'
import { User } from '../../domain'
import { BrowserStorage, takeBrowserStorageKey } from '../../models'

@Injectable({ providedIn: 'root' })
export class UserHolderService {

  private user: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null)

  public userChanges: Observable<User> = this.user.pipe(
    filter((user: User | null): user is User => user !== null)
  )

  public isUserAuthorizedChanges: Observable<boolean> = defer(() => fromEvent<StorageEvent>(this.window, 'storage').pipe(
    filter((event: StorageEvent) => event.key === takeBrowserStorageKey(BrowserStorage.accessToken)),
    startWith(null),
    map(() => this.isUserAuthorized())
  ))

  constructor(@Inject(LOCAL_STORAGE)
              private localStorage: Storage,
              @Inject(WINDOW)
              private window: Window,
              private router: Router) {
  }

  public updateUser(user: User): void {
    this.user.next(user)
  }

  public getUser(): User | null {
    return this.user.value
  }

  public isUserAuthorized(): boolean {
    return !!this.localStorage.getItem(takeBrowserStorageKey(BrowserStorage.accessToken))
  }

  public logout(): void {
    this.localStorage.removeItem(takeBrowserStorageKey(BrowserStorage.accessToken))
    this.router.navigate([ `/auth/login` ]).then(() => {
      this.user.next(null)
    })
  }
}
