import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { PATH_PARAMS } from '../../global/models'
import { CommunitySingleMainComponent, CommunitySingleSettingsComponent, CommunitySingleUsersComponent } from './components'
import { CommunityCreateContainerComponent, CommunityListContainerComponent, CommunitySingleContainerComponent } from './containers'
import { CommunitySettingsGuard } from './guards'

const routes: Routes = [
  {
    path: ``,
    component: CommunityListContainerComponent
  },
  {
    path: `create`,
    component: CommunityCreateContainerComponent
  },
  {
    path: `:${ PATH_PARAMS.communityNickname }`,
    component: CommunitySingleContainerComponent,
    children: [
      {
        path: ``,
        component: CommunitySingleMainComponent
      },
      {
        path: `users`,
        component: CommunitySingleUsersComponent
      },
      {
        path: `settings`,
        component: CommunitySingleSettingsComponent,
        canActivate: [
          CommunitySettingsGuard
        ]
      }
    ]
  }
]

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class CommunitiesRoutingModule {
}
