import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'

@Component({
  selector: 'cy-community-create-container',
  templateUrl: './community-create-container.component.html',
  styleUrls: ['./community-create-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommunityCreateContainerComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
