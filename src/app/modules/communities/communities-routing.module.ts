import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { CommunitiesContainerComponent } from './containers/communities-container/communities-container.component'

const routes: Routes = [
  {
    path: '',
    component: CommunitiesContainerComponent
  }
]

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class CommunitiesRoutingModule {
}
