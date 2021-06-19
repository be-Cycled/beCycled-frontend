import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { PostsContainerComponent } from './containers/posts-container/posts-container.component'
import { SinglePostComponent } from './containers/single-post/single-post.component'
import { SinglePostResolver } from './resolvers/single-post/single-post.resolver'

const routes: Routes = [
  {
    path: '',
    component: PostsContainerComponent
  },
  {
    path: ':id',
    component: SinglePostComponent,
    resolve: {
      post: SinglePostResolver
    }
  }
]

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class PostsRoutingModule {
}
