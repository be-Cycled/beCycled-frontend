import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { CommunityReviewComponent } from './components/community-review/community-review.component'
import { CommunitySettingsComponent } from './components/community-settings/community-settings.component'
import { CommunityUsersComponent } from './components/community-users/community-users.component'
import { CommunitiesContainerComponent } from './containers/communities-container/communities-container.component'
import { SingleCommunityContainerComponent } from './containers/single-community-container/single-community-container.component'

const routes: Routes = [
  {
    path: '',
    component: CommunitiesContainerComponent
  },
  {
    path: ':nickname',
    component: SingleCommunityContainerComponent,
    children: [
      {
        path: '',
        component: CommunityReviewComponent
      },
      {
        path: 'settings',
        component: CommunitySettingsComponent
      },
      {
        path: 'users',
        component: CommunityUsersComponent
      }
    ]
  }
  /*{
    path: 'create',
    component: CommunityCreationComponent
  }*/
]

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class CommunitiesRoutingModule {
}
