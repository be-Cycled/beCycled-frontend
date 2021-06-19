import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { CommunityCreationComponent } from './components/community-creation/community-creation.component'
import { CommunitiesContainerComponent } from './containers/communities-container/communities-container.component'
import { SingleCommunityContainerComponent } from './containers/single-community-container/single-community-container.component'
import { SingleCommunityResolver } from './resolvers/single-community/single-community.resolver'

const routes: Routes = [
  {
    path: '',
    component: CommunitiesContainerComponent
  },
  {
    path: ':nickname',
    component: SingleCommunityContainerComponent,
    resolve: {
      community: SingleCommunityResolver
    }
  },
  {
    path: 'create',
    component: CommunityCreationComponent
  }
]

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class CommunitiesRoutingModule {
}
