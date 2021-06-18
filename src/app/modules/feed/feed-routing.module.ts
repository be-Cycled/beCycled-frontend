import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { FeedContainerComponent } from './containers/feed-container/feed-container.component'

const routes: Routes = [
  {
    path: '',
    component: FeedContainerComponent
  }
]

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class FeedRoutingModule {
}
