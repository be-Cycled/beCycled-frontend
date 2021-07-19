import { InjectionToken } from '@angular/core'
import { fromEvent, Observable } from 'rxjs'
import { map, shareReplay, startWith } from 'rxjs/operators'

export function isMobileFactory(window: Window): Observable<boolean>  {
  return fromEvent(window, 'resize').pipe(
    startWith(null),
    map(() => window.innerWidth),
    map((windowWidth: number) => windowWidth <= 599),
    shareReplay(1)
  )
}

export const IS_MOBILE: InjectionToken<Observable<boolean>> = new InjectionToken<Observable<boolean>>('__IS_MOBILE__')
