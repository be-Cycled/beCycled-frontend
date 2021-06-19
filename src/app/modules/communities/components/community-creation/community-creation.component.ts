import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'

@Component({
  selector: 'cy-community-creation',
  templateUrl: './community-creation.component.html',
  styleUrls: ['./community-creation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommunityCreationComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
