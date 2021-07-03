import { ChangeDetectionStrategy, Component } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { TuiDestroyService, TuiStringHandler } from '@taiga-ui/cdk'
import { fromEvent, Observable } from 'rxjs'
import { filter, map, pluck, take, takeUntil, tap } from 'rxjs/operators'
import { Community, CommunityType, SportType } from '../../../../global/domain'
import { CommunityState, CommunityStore } from '../../services/community-store/community-store.service'

@Component({
  selector: 'cy-community-setting-container',
  templateUrl: './community-setting-container.component.html',
  styleUrls: [ './community-setting-container.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [  TuiDestroyService]
})
export class CommunitySettingContainerComponent {

  public readonly communityTypesMap: Readonly<Record<CommunityType, string>> = {
    [ CommunityType.organization ]: `Организация`,
    [ CommunityType.club ]: `Клуб`
  }

  public readonly sportTypesMap: Readonly<Record<SportType, string>> = {
    [ SportType.bicycle ]: `Велосипед`,
    [ SportType.rollerblade ]: `Ролики`,
    [ SportType.run ]: `Бег`,
    [ SportType.ski ]: `Лыжи`
  }

  public readonly sportTypeKeys: readonly string[] = Object.values(SportType)

  public readonly communityTypeKeys: readonly string[] = Object.values(CommunityType)

  public form: FormGroup = new FormGroup({
    name: new FormControl(null, [ Validators.required ]),
    nickname: new FormControl(null, [ Validators.required ]),
    communityType: new FormControl(null, [ Validators.required ]),
    description: new FormControl(),
    sportTypes: new FormControl([], [ Validators.minLength(1) ]),
    url: new FormControl(),
    avatar: new FormControl()
  })

  public avatarChanges: Observable<string> = this.form.valueChanges.pipe(
    pluck('avatar')
  )

  public avatarInputFileControl: FormControl = new FormControl()

  public avatarInputFileChanges: Observable<File | null> = this.avatarInputFileControl.valueChanges.pipe(
    takeUntil(this.destroyService),
    tap((file: File | null) => {
      if (file === null) {
        const origin: CommunityState = this.communityStore.takeState()
        this.form.patchValue({ avatar: origin.community?.avatar })
        return
      }

      const fileReader: FileReader = new FileReader()

      fromEvent(fileReader, 'load').pipe(
        take(1),
        tap((event: Event) => this.form.get('avatar')!.patchValue((event.target as FileReader).result as string))
      ).subscribe()

      fileReader.readAsDataURL(file)
    })
  )

  private communityChanges: Observable<Community> = this.communityStore.select().pipe(
    pluck('community'),
    filter((community: Community | null): community is Community => community !== null)
  )

  public linkToBack: Observable<string> = this.communityChanges.pipe(
    map((community: Community) => `/communities/${ community.nickname }`)
  )

  constructor(private activatedRoute: ActivatedRoute,
              private communityStore: CommunityStore,
              private destroyService: TuiDestroyService,
              private router: Router) {
    const nickname: string | null = this.activatedRoute.snapshot.paramMap.get('nickname')

    if (nickname === null) {
      throw new Error(`${ this.constructor.name } has been open without "nickname" parameter`)
    }

    this.communityChanges.pipe(take(1)).subscribe((community: Community) => this.form.patchValue(community))

    this.communityStore.getCommunity(nickname)

    this.avatarInputFileChanges.subscribe()
  }

  public sportTypeStringify: TuiStringHandler<SportType> = (sportType: SportType) => this.sportTypesMap[ sportType ]

  public onClickSaveButton(): void {
    const formValue: Community = this.form.value
    const origin: CommunityState = this.communityStore.takeState()

    this.communityStore.updateCommunity({
      ...origin.community,
      ...formValue
    })

    this.router.navigate([ '/', 'communities', origin.community?.nickname ])
  }
}
