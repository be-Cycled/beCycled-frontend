import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'

@Component({
  selector: 'cy-profile-settings-container',
  templateUrl: './profile-settings-container.component.html',
  styleUrls: [ './profile-settings-container.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileSettingsContainerComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }

}
