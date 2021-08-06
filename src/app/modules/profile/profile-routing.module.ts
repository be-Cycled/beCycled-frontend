import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { UserByLoginResolver } from '../../global/resolvers'
import { ProfileContainerComponent, ProfileSettingsContainerComponent } from './containers'

const routes: Routes = [
  {
    path: ':login',
    component: ProfileContainerComponent,
    resolve: {
      profileUser: UserByLoginResolver
    }
  },
  {
    path: ':login/settings',
    component: ProfileSettingsContainerComponent
  }
]

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class ProfileRoutingModule {
}
