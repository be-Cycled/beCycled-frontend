import { Inject, Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router'
import { LOCAL_STORAGE } from '@ng-web-apis/common'
import { Observable, of } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { User, UserService } from '../../domain'

@Injectable({ providedIn: 'root' })
export class UserByLoginResolver implements Resolve<User | null> {
  constructor(private userService: UserService,
              @Inject(LOCAL_STORAGE)
              private localStorage: Storage) {
  }

  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User | null> {
    const login: string | null = route.paramMap.get('login')

    if (login === null) {
      throw new Error(`Login not specified`)
    }

    return this.userService.getUserByLogin(login).pipe(
      catchError(() => of(null))
    )
  }
}
