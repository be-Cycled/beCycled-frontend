import { ChangeDetectionStrategy, Component } from '@angular/core'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { User } from '../../../../../domain'
import { DEFAULT_AVATAR } from '../../../../../models'
import { UserHolderService } from '../../../../../services'

@Component({
  selector: 'cy-header',
  templateUrl: './header.component.html',
  styleUrls: [ './header.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {

  public isUserAuthorized: Observable<boolean> = this.userHolderService.isUserAuthorizedChanges

  public isUserUnauthorized: Observable<boolean> = this.isUserAuthorized.pipe(
    map((isUserAuthorized: boolean) => !isUserAuthorized)
  )

  public userAvatar: Observable<string> = this.userHolderService.userChanges.pipe(
    map((user: User) => {
      if (user.avatar !== null) {
        return `${ user.avatar }`
      }

      return DEFAULT_AVATAR
    })
  )

  public profileRouterLink: Observable<string> = this.userHolderService.userChanges.pipe(
    map((user: User) => user.login),
    map((userLogin: string) => `/users/${ userLogin }`)
  )

  constructor(private userHolderService: UserHolderService) {
  }

  public onClickLogoutButton(): void {

  }
}
