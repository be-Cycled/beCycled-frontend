import { ChangeDetectionStrategy, Component, Inject, OnDestroy } from '@angular/core'
import { ToolbarService } from '../../../../global/cdk/components/toolbar/services/toolbar/toolbar.service'
import { APP_VERSION } from '../../../../global/tokens'

@Component({
  selector: 'cy-auth-container',
  templateUrl: './auth-container.component.html',
  styleUrls: [ './auth-container.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: `cy-auth-container`
  }
})
export class AuthContainerComponent implements OnDestroy {
  constructor(@Inject(APP_VERSION)
              public readonly appVersion: string,
              private toolbarService: ToolbarService) {
    this.toolbarService.hide()
  }

  public ngOnDestroy(): void {
    this.toolbarService.show()
  }
}
