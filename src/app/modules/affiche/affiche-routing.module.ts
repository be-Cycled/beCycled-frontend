import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AfficheContainerComponent } from './containers/affiche-container/affiche-container.component'

const routes: Routes = [
  {
    path: '',
    component: AfficheContainerComponent
  }
]

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class AfficheRoutingModule {
}
