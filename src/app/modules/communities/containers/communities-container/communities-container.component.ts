import { ChangeDetectionStrategy, Component } from '@angular/core'
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms'
import { defer, Observable } from 'rxjs'
import { map, shareReplay, startWith, switchMap } from 'rxjs/operators'
import { Community, CommunityType, SportType } from '../../../../global/domain'
import { CommunityService } from '../../../../global/domain/services/community/community.service'
import { ViewValue } from '../../../../global/models'

interface CommunityFiltration {
  search: string
  sportTypes: (SportType | 'ALL')[]
  communityType: CommunityType | 'ALL'
}

@Component({
  selector: 'cy-communities-container',
  templateUrl: './communities-container.component.html',
  styleUrls: [ './communities-container.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommunitiesContainerComponent {

  public filtrationForm: FormGroup = this.fb.group({
    search: this.fb.control(''),
    sportTypes: this.fb.control([ 'ALL' ]),
    communityType: this.fb.control('ALL')
  })

  public sportTypesMap: Record<SportType | 'ALL', string> = {
    ALL: `Все`,
    [ SportType.bicycle ]: `Велосипед`,
    [ SportType.rollerblade ]: `Ролики`,
    [ SportType.run ]: `Бег`,
    [ SportType.ski ]: `Лыжи`
  }

  public sportTypes: readonly (SportType | 'ALL')[] = Object.keys(this.sportTypesMap) as readonly (SportType | 'ALL')[]

  public communityTypes: readonly ViewValue<CommunityType | 'ALL'>[] = [
    { value: 'ALL', viewValue: 'Все' },
    { value: CommunityType.club, viewValue: 'Клуб' },
    { value: CommunityType.organization, viewValue: 'Организация' }
  ]

  public communityTypesMap: Record<CommunityType | 'ALL', string> = {
    ALL: `Все`,
    [ CommunityType.organization ]: `Организация`,
    [ CommunityType.club ]: `Клуб`
  }

  public communityTypeViewValue: Observable<string> = defer(() => {
    const control: AbstractControl | null = this.filtrationForm.get(`communityType`)

    if (control === null) {
      throw new Error(`Community type control does not exist`)
    }

    return control.valueChanges.pipe(
      startWith(control.value),
      map((communityType: CommunityType | 'ALL') => {
        const viewValue: ViewValue<any> | undefined = this.communityTypes.find(({ value }: ViewValue<CommunityType | 'ALL'>) => communityType === value)

        if (typeof viewValue === 'undefined') {
          throw new Error(`Community view value does not exist`)
        }

        return viewValue.viewValue
      })
    )
  })

  public communitiesForView: Observable<Community[]> = this.communityService.getAll().pipe(
    shareReplay(1),
    switchMap((communities: Community[]) => this.filtrationForm.valueChanges.pipe(
      startWith(this.filtrationForm.value),
      map((formValue: CommunityFiltration) => {
        return communities.filter((community: Community) => {
          return community.name.includes(formValue.search)
            && community.sportTypes.every((sportType: SportType) => {
              if (formValue.sportTypes.includes('ALL')) {
                return true
              }

              return formValue.sportTypes.includes(sportType)
            })
            && formValue.communityType === 'ALL'
              ? true
              : community.communityType === formValue.communityType
        })
      })
    ))
  )

  public sportTypeTranslate(sportTypes: SportType[], sportTypesMap: Record<SportType | 'ALL', string>): string {
    return sportTypes
      .map((sportType: SportType) => sportTypesMap[ sportType ])
      .join(', ')
  }

  constructor(private fb: FormBuilder,
              private communityService: CommunityService) {
  }

  public onClickCreateButton(): void {

  }
}
