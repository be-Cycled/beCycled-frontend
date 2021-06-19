import { Inject, Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router'
import { LOCAL_STORAGE } from '@ng-web-apis/common'
import { Observable, of } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'
import { User, UserService } from '../../domain'
import { BrowserStorage, takeBrowserStorageKey } from '../../models'
import { UserHolderService } from '../../services'

@Injectable({ providedIn: 'root' })
export class UserByTokenResolver implements Resolve<User | null> {
  constructor(private userService: UserService,
              private userHolderService: UserHolderService,
              @Inject(LOCAL_STORAGE)
              private localStorage: Storage) {
  }

  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User | null> {
    const token: string | null = this.localStorage.getItem(takeBrowserStorageKey(BrowserStorage.accessToken))

    if (token === null) {
      return of(null)
    }

    return this.userService.getMe(token).pipe(
      tap((user: User) => this.userHolderService.updateUser(user)),
      catchError(() => of(null))
    )
  }
}
