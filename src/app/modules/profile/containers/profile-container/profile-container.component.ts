import { ChangeDetectionStrategy, Component } from '@angular/core'
import { Observable } from 'rxjs'
import { map, pluck } from 'rxjs/operators'
import { User } from '../../../../global/domain'
import { DEFAULT_AVATAR } from '../../../../global/models'
import { UserHolderService } from '../../../../global/services'

@Component({
  selector: 'cy-profile-container',
  templateUrl: './profile-container.component.html',
  styleUrls: ['./profile-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileContainerComponent {
  public avatarUrl: Observable<string> = this.userHolderService.userChanges.pipe(
    pluck('avatar'),
    map((avatar: string | null) => {
      if (avatar !== null) {
        return avatar
      }

      return DEFAULT_AVATAR
    })
  )

  public fullName: Observable<string | null> = this.userHolderService.userChanges.pipe(
    map((user: User) => {
      if (user.firstName === null && user.lastName === null) {
        return null
      }

      return Array.of(user.firstName, user.lastName).join(' ')
    })
  )

  public login: Observable<string> = this.userHolderService.userChanges.pipe(
    pluck('login')
  )

  public about: Observable<string | null> = this.userHolderService.userChanges.pipe(
    pluck('about')
  )

  public phone: Observable<string | null> = this.userHolderService.userChanges.pipe(
    pluck('phone')
  )

  constructor(private userHolderService: UserHolderService) {
  }

}
