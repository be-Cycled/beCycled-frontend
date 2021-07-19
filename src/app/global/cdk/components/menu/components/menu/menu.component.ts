import { ChangeDetectionStrategy, Component } from '@angular/core'
import { TuiDialogService } from '@taiga-ui/core'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { User } from '../../../../../domain'
import { UserStoreService } from '../../../../../services'

@Component({
  selector: 'cy-menu',
  templateUrl: './menu.component.html',
  styleUrls: [ './menu.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuComponent {

  public profileRouterLink: Observable<string> = this.userStoreService.validUserChanges.pipe(
    map((user: User) => user.login),
    map((userLogin: string) => `/users/${ userLogin }`)
  )

  public isUserAuthorized: Observable<boolean> = this.userStoreService.isAuthChanges

  public userAvatar: Observable<string | null> = this.userStoreService.validUserChanges.pipe(
    map((user: User) => user.avatar)
  )

  constructor(private userStoreService: UserStoreService,
              private dialogService: TuiDialogService) {
  }

  public onClickExtraButton(template: any): void {
    this.dialogService.open(template, {
      size: 's',
      closeable: false
    }).subscribe()
  }
}
