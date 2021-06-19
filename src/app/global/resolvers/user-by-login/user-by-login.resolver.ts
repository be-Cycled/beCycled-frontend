import { Inject, Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router'
import { LOCAL_STORAGE } from '@ng-web-apis/common'
import { Observable, of } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'
import { User, UserService } from '../../domain'
import { UserHolderService } from '../../services'

@Injectable({ providedIn: 'root' })
export class UserByLoginResolver implements Resolve<User | null> {
  constructor(private userService: UserService,
              private userHolderService: UserHolderService,
              @Inject(LOCAL_STORAGE)
              private localStorage: Storage) {
  }

  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User | null> {
    const login: string | null = route.paramMap.get('login')

    if (login === null) {
      throw new Error(`Login not specified`)
    }

    const user: User | null = this.userHolderService.getUser()

    if (user !== null) {
      return of(user)
    }

    return this.userService.getUserByLogin(login).pipe(
      tap((user: User) => this.userHolderService.updateUser(user)),
      catchError(() => of(null))
    )
  }
}
