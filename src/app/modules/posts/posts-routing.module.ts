import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { PostsContainerComponent } from './containers/posts-container/posts-container.component'

const routes: Routes = [
  {
    path: '',
    component: PostsContainerComponent
  }
]

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class PostsRoutingModule {
}
