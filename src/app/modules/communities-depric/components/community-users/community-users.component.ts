import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
  selector: 'cy-community-users',
  templateUrl: './community-users.component.html',
  styleUrls: [ './community-users.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommunityUsersComponent {
}
