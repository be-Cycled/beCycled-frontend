import { Component, Inject } from '@angular/core'
import { defer, Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { IS_MOBILE } from './global/tokens'

@Component({
  selector: 'cy-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
})
export class AppComponent {

  public isMobileChanges: Observable<boolean> = this.isMobile

  public isDesktop: Observable<boolean> = defer(() => this.isMobileChanges.pipe(
    map((isMobile: boolean) => !isMobile)
  ))

  constructor(@Inject(IS_MOBILE)
              private isMobile: Observable<boolean>) {
  }
}
