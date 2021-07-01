import { ChangeDetectionStrategy, Component } from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { TuiStringHandler } from '@taiga-ui/cdk'
import { Community, CommunityType, SportType } from '../../../../global/domain'

@Component({
  selector: 'cy-community-settings',
  templateUrl: './community-settings.component.html',
  styleUrls: [ './community-settings.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommunitySettingsComponent {

  public form: FormGroup = new FormGroup({
    name: new FormControl(),
    nickname: new FormControl(),
    communityType: new FormControl(),
    description: new FormControl(),
    sportTypes: new FormControl(),
    url: new FormControl(),
    avatar: new FormControl()
  })

  public communityTypesMap: Record<CommunityType, string> = {
    [ CommunityType.organization ]: `Организация`,
    [ CommunityType.club ]: `Клуб`
  }

  public sportTypesMap: Record<SportType, string> = {
    [ SportType.bicycle ]: `Велосипед`,
    [ SportType.rollerblade ]: `Ролики`,
    [ SportType.run ]: `Бег`,
    [ SportType.ski ]: `Лыжи`
  }

  public sportTypeKeys: string[] = Object.values(SportType)

  public communityTypeKeys: string[] = Object.values(CommunityType)

  constructor(private activatedRoute: ActivatedRoute) {
    const community: Community = this.activatedRoute.snapshot.data.community
    debugger
    this.form.patchValue(community)
  }

  public sportTypeStringify: TuiStringHandler<SportType> = (sportType: SportType) => this.sportTypesMap[ sportType ]
}
