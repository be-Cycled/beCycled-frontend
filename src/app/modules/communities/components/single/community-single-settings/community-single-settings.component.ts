import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'

@Component({
  selector: 'cy-community-single-settings',
  templateUrl: './community-single-settings.component.html',
  styleUrls: ['./community-single-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommunitySingleSettingsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
