import { Location, PlatformLocation } from '@angular/common'
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core'
import { Title } from '@angular/platform-browser'
import { Router } from '@angular/router'
import { NAVIGATOR } from '@ng-web-apis/common'
import { TuiDialogContext, TuiDialogService, TuiNotification, TuiNotificationsService } from '@taiga-ui/core'
import { PolymorpheusContent } from '@tinkoff/ng-polymorpheus'

@Component({
  selector: 'cy-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: [ './toolbar.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolbarComponent {

  constructor(private readonly dialogService: TuiDialogService,
              @Inject(NAVIGATOR)
              private navigator: Navigator,
              private router: Router,
              private notificationService: TuiNotificationsService,
              private titleService: Title,
              private location: Location,
              private platformLocation: PlatformLocation) {
  }

  public onClickBackButton(): void {
    this.location.back()
  }

  public onClickShareButton(templateRef: PolymorpheusContent<TuiDialogContext<void>>): void {
    this.dialogService.open(templateRef, {
      closeable: false,
      size: 's'
    }).subscribe()
  }

  public onClickShareCopyButton(): void {
    this.navigator.clipboard.writeText(this.platformLocation.href)
      .then(() => this.notificationService.show(`Успешно скопировано`, { status: TuiNotification.Success }).subscribe())
      .catch(() => this.notificationService.show(`Не удалось скопировать`, { status: TuiNotification.Error }).subscribe())
  }

  public onClickShareNativeButton(): void {
    this.navigator
      .share({
        url: this.platformLocation.href,
        title: this.titleService.getTitle()
      })
      .then()
  }
}
