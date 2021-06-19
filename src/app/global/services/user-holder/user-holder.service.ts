import { Inject, Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { LOCAL_STORAGE, WINDOW } from '@ng-web-apis/common'
import { BehaviorSubject, Observable } from 'rxjs'
import { filter, map } from 'rxjs/operators'
import { Community, User } from '../../domain'
import { BrowserStorage, takeBrowserStorageKey } from '../../models'

@Injectable({ providedIn: 'root' })
export class UserHolderService {

  private user: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null)

  public userChanges: Observable<User> = this.user.pipe(
    filter((user: User | null): user is User => user !== null)
  )

  public isUserAuthorizedChanges: Observable<boolean> = this.user.pipe(
    map((user: User | null) => user !== null)
  )

  constructor(@Inject(LOCAL_STORAGE)
              private localStorage: Storage,
              @Inject(WINDOW)
              private window: Window,
              private router: Router) {
    console.log(this)
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
