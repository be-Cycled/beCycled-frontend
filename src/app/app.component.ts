import { Component, Inject } from '@angular/core'
import { WINDOW } from '@ng-web-apis/common'
import { defer, fromEvent, Observable } from 'rxjs'
import { map, shareReplay, startWith } from 'rxjs/operators'

@Component({
  selector: 'cy-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
})
export class AppComponent {

  public isMobile: Observable<boolean> = defer(() => fromEvent(this.window, 'resize').pipe(
    startWith(null),
    map(() => this.window.innerWidth),
    map((windowWidth: number) => windowWidth <= 599),
    shareReplay(1)
  ))

  public isDesktop: Observable<boolean> = defer(() => this.isMobile.pipe(
    map((isMobile: boolean) => !isMobile)
  ))

  constructor(@Inject(WINDOW)
              private window: Window) {
  }
}
