import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AboutContainerComponent } from './containers/about-container/about-container.component'

const routes: Routes = [
  {
    path: '',
    component: AboutContainerComponent
  }
]

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class AboutRoutingModule {
}
