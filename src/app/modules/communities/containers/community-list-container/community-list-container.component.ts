import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'

@Component({
  selector: 'cy-community-list-container',
  templateUrl: './community-list-container.component.html',
  styleUrls: ['./community-list-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommunityListContainerComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
