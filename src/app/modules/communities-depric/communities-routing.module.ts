import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { CommunityReviewComponent } from './components/community-review/community-review.component'
import { CommunityUsersComponent } from './components/community-users/community-users.component'
import { CommunitiesContainerComponent } from './containers/communities-container/communities-container.component'
import { CommunityCreateContainerComponent } from './containers/community-create-container/community-create-container.component'
import { CommunitySettingContainerComponent } from './containers/community-setting-container/community-setting-container.component'
import { SingleCommunityContainerComponent } from './containers/single-community-container/single-community-container.component'

const routes: Routes = [
  {
    path: '',
    component: CommunitiesContainerComponent
  },
  {
    path: 'create',
    component: CommunityCreateContainerComponent
  },
  {
    path: ':nickname',
    component: SingleCommunityContainerComponent,
    children: [
      {
        path: '',
        component: CommunityReviewComponent
      },
/*      {
        path: 'settings',
        component: CommunitySettingsComponent,
        data: {
          showHeader: false,
          showTabs: false
        }
      },*/
      {
        path: 'users',
        component: CommunityUsersComponent
      }
    ]
  },
  {
    path: ':nickname/settings',
    component: CommunitySettingContainerComponent
  }
]

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class CommunitiesRoutingModule {
}
