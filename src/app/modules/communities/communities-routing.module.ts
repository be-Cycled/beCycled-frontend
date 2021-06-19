import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { CommunitiesContainerComponent } from './containers/communities-container/communities-container.component'
import { SingleCommunityContainerComponent } from './containers/single-community-container/single-community-container.component'

const routes: Routes = [
  {
    path: '',
    component: CommunitiesContainerComponent
  },
  {
    path: ':nickname',
    component: SingleCommunityContainerComponent
  }
]

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class CommunitiesRoutingModule {
}
