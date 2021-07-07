import { ChangeDetectionStrategy, Component } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { Title } from '@angular/platform-browser'
import { BehaviorSubject, combineLatest, Observable } from 'rxjs'
import { map, shareReplay, startWith, tap } from 'rxjs/operators'
import { Community, CommunityType, SportType } from '../../../../global/domain'
import { CommunityService } from '../../../../global/domain/services/community/community.service'
import { buildCountString } from '../../../../global/utils'

interface CommunityFiltration {
  search: string
  sportTypes: SportType[]
  communityType: CommunityType | 'ALL'
}

@Component({
  selector: 'cy-community-list-container',
  templateUrl: './community-list-container.component.html',
  styleUrls: ['./community-list-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommunityListContainerComponent {

  public filtrationForm: FormGroup = this.fb.group({
    search: this.fb.control(''),
    sportTypes: this.fb.control([]),
    communityType: this.fb.control('ALL')
  })

  public communityTypesMap: Record<CommunityType | 'ALL', string> = {
    ALL: `Все`,
    [ CommunityType.organization ]: `Организация`,
    [ CommunityType.club ]: `Клуб`
  }

  public communityTypeKeys: (CommunityType | 'ALL')[] = Object.keys(this.communityTypesMap) as (CommunityType | 'ALL')[]

  public sportTypesMap: Record<SportType, string> = {
    [ SportType.bicycle ]: `Велосипед`,
    [ SportType.rollerblade ]: `Роликовые коньки`,
    [ SportType.run ]: `Бег`,
    [ SportType.ski ]: `Лыжи`
  }

  public sportTypeKeys: SportType[] = Object.keys(this.sportTypesMap) as SportType[]

  public communityIsLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true)

  public communities: Observable<Community[]> = this.communityService.getAll().pipe(
    shareReplay({ refCount: true, bufferSize: 1 }),
    tap(() => this.communityIsLoading.next(false))
  )

  public communitiesWithFiltration: Observable<Community[]> = combineLatest([
    this.filtrationForm.valueChanges.pipe(
      startWith(this.filtrationForm.value)
    ),
    this.communities
  ]).pipe(
    map(([ formValue, communities ]: [ CommunityFiltration, Community[] ]) => {
      return communities.filter((community: Community) => {
        return community.name.includes(formValue.search)
        && formValue.sportTypes.length === 0
          ? true
          : community.sportTypes.some((sportType: SportType) => formValue.sportTypes.includes(sportType))
          && formValue.communityType === 'ALL'
            ? true
            : community.communityType === formValue.communityType
      })
    }),
    map((communities: Community[]) => communities.slice().sort((a: Community, b: Community) => {
      if (a.name < b.name) { return 1 }
      if (a.name > b.name) { return -1 }
      return 0
    }))
  )

  constructor(private fb: FormBuilder,
              private communityService: CommunityService,
              private title: Title) {
    this.title.setTitle(`Сообщества`)
  }

  public sportTypeTranslate(sportTypes: SportType[], sportTypesMap: Record<SportType | 'ALL', string>): string {
    return sportTypes
      .map((sportType: SportType) => sportTypesMap[ sportType ])
      .join(', ')
  }

  public buildMemberCountString(members: number): string {
    return buildCountString(members, [ 'участник', 'участника', 'участников' ])
  }
}
