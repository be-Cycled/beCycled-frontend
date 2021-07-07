import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'

@Component({
  selector: 'cy-community-single-users',
  templateUrl: './community-single-users.component.html',
  styleUrls: ['./community-single-users.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommunitySingleUsersComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
