import { ChangeDetectionStrategy, Component } from '@angular/core'
import { Observable } from 'rxjs'
import { switchMap } from 'rxjs/operators'
import { Community, User } from '../../../../../global/domain'
import { CommunityService } from '../../../../../global/domain/services/community/community.service'
import { CommunityStoreService } from '../../../services'

@Component({
  selector: 'cy-community-single-users',
  templateUrl: './community-single-users.component.html',
  styleUrls: ['./community-single-users.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommunitySingleUsersComponent {

  public users: Observable<User[]> = this.communityStoreService.communityChanges.pipe(
    switchMap((community: Community) => this.communityService.getUsersByCommunity(community.nickname).pipe(

    ))
  )

  constructor(private communityStoreService: CommunityStoreService,
              private communityService: CommunityService) {
  }

}
