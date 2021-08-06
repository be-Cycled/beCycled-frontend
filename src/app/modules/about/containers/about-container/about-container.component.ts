import { ChangeDetectionStrategy, Component, Inject } from '@angular/core'
import { APP_VERSION } from '../../../../global/tokens'

@Component({
  selector: 'cy-about-container',
  templateUrl: './about-container.component.html',
  styleUrls: [ './about-container.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutContainerComponent {
  public year: number = new Date().getFullYear()

  constructor(@Inject(APP_VERSION) public readonly appVersion: string) {
  }
}
