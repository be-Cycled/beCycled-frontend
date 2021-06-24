import { ChangeDetectionStrategy, Component } from '@angular/core'
import { TuiDialogService } from '@taiga-ui/core'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { User } from '../../../../../domain'
import { UserHolderService } from '../../../../../services'
import { DEFAULT_AVATAR } from '../../../../../models'

@Component({
  selector: 'cy-menu',
  templateUrl: './menu.component.html',
  styleUrls: [ './menu.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuComponent {

  public profileRouterLink: Observable<string> = this.userHolderService.userChanges.pipe(
    map((user: User) => user.login),
    map((userLogin: string) => `/users/${ userLogin }`)
  )

  public isUserAuthorized: Observable<boolean> = this.userHolderService.isUserAuthorizedChanges

  public userAvatar: Observable<string> = this.userHolderService.userChanges.pipe(
    map((user: User) => {
      if (user.avatar !== null) {
        return `${ user.avatar }`
      }

      return DEFAULT_AVATAR
    })
  )

  constructor(private userHolderService: UserHolderService,
              private dialogService: TuiDialogService) {
  }

  public onClickExtraButton(template: any): void {
    this.dialogService.open(template, {
      size: 's',
      closeable: false
    }).subscribe()
  }
}
