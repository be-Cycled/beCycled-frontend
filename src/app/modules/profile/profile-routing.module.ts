import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { UserByLoginResolver } from '../../global/resolvers'
import { ProfileContainerComponent } from './containers/profile-container/profile-container.component'

const routes: Routes = [
  {
    path: ':login',
    component: ProfileContainerComponent,
    resolve: {
      profileUser: UserByLoginResolver
    }
  }
]

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class ProfileRoutingModule {
}
