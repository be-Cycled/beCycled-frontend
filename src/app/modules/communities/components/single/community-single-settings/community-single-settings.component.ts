import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { CommunityStoreService } from '../../../services'

@Component({
  selector: 'cy-community-single-settings',
  templateUrl: './community-single-settings.component.html',
  styleUrls: [ './community-single-settings.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommunitySingleSettingsComponent implements OnInit {

  public communityFormGroup: FormGroup = this.fb.group({
    name: this.fb.control(null),
    nickname: this.fb.control(null),
    avatar: this.fb.control(null),
    sportTypes: this.fb.control([]),
    url: this.fb.control(null),
    description: this.fb.control(null),
    communityType: this.fb.control(null)
  })

  constructor(private communityStoreService: CommunityStoreService,
              private fb: FormBuilder) {
  }

  public ngOnInit(): void {
  }

}
