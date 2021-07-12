import { ChangeDetectionStrategy, Component } from '@angular/core'
import { ActivatedRoute, ParamMap } from '@angular/router'
import { defer, Observable } from 'rxjs'
import { pluck, shareReplay, switchMap } from 'rxjs/operators'
import { Community, CommunityType } from '../../../../global/domain'
import { CommunityService } from '../../../../global/domain/services/community/community.service'
import { PATH_PARAMS } from '../../../../global/models'

@Component({
  selector: 'cy-community-single-container',
  templateUrl: './community-single-container.component.html',
  styleUrls: [ './community-single-container.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommunitySingleContainerComponent {
  public readonly communityType: typeof CommunityType = CommunityType

  public community: Observable<Community> = defer(() => {
    return this.activatedRoute.paramMap.pipe(
      switchMap((params: ParamMap) => {
        const nickname: string | null = params.get(PATH_PARAMS.communityNickname)

        if (nickname === null) {
          throw new Error(`Parameter "nickname" does not exist`)
        }

        return this.communityService.getByNickname(nickname).pipe(
          shareReplay({
            refCount: true,
            bufferSize: 1
          })
        )
      })
    )
  })

  public avatar: Observable<string> = this.community.pipe(
    pluck('avatar')
  )

  public name: Observable<string> = this.community.pipe(
    pluck('name')
  )

  public type: Observable<CommunityType> = this.community.pipe(
    pluck('communityType')
  )

  public description: Observable<string> = this.community.pipe(
    pluck('description')
  )

  public url: Observable<string> = this.community.pipe(
    pluck('url')
  )

  constructor(public readonly activatedRoute: ActivatedRoute,
              private communityService: CommunityService) {
  }
}
