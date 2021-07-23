import { ChangeDetectionStrategy, Component } from '@angular/core'
import { Observable } from 'rxjs'
import { ToolbarService } from '../../services/toolbar/toolbar.service'

@Component({
  selector: 'cy-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: [ './toolbar.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolbarComponent {

  public isShowBackButton$: Observable<boolean> = this.toolbarService.isShowBackButtonChanges$

  constructor(public readonly toolbarService: ToolbarService) {
  }

  public onClickBackButton(): void {
    if (this.toolbarService.backButtonCallback !== null) {
      this.toolbarService.backButtonCallback()
    }
  }

}
