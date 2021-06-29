import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'

@Component({
  selector: 'cy-community-settings',
  templateUrl: './community-settings.component.html',
  styleUrls: ['./community-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommunitySettingsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
