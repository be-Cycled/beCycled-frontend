import { ChangeDetectionStrategy, Component, Inject } from '@angular/core'
import { APP_VERSION } from '../../../../global/tokens'

@Component({
  selector: 'cy-auth-container',
  templateUrl: './auth-container.component.html',
  styleUrls: ['./auth-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: `cy-auth-container`
  }
})
export class AuthContainerComponent {
  constructor(@Inject(APP_VERSION)
              public readonly appVersion: string) {
  }
}
