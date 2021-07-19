import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http'
import { Inject, Injectable } from '@angular/core'
import { LOCAL_STORAGE } from '@ng-web-apis/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { BrowserStorage, takeBrowserStorageKey } from '../../models'
import { UserStoreService } from '../../services'

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(@Inject(LOCAL_STORAGE)
              private localStorage: Storage,
              private userStoreService: UserStoreService) {
  }

  public intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const key: string = takeBrowserStorageKey(BrowserStorage.accessToken)
    const accessToken: string | null = this.localStorage.getItem(key)

    if (accessToken !== null) {
      return next.handle(
        request.clone({
          headers: request.headers.set(`Authorization`, `Bearer ${ accessToken }`)
        })
      ).pipe(
        tap({
          error: (error: HttpErrorResponse) => {
            if (error.status === 401) {
              this.localStorage.removeItem(key)
              this.userStoreService.reset()
            }
          }
        })
      )
    }

    return next.handle(request)
  }
}
