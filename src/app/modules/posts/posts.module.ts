import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { TuiButtonModule, TuiLinkModule } from '@taiga-ui/core'
import { TuiIslandModule } from '@taiga-ui/kit'
import { PostsContainerComponent } from './containers/posts-container/posts-container.component'
import { SinglePostComponent } from './containers/single-post/single-post.component'

import { PostsRoutingModule } from './posts-routing.module'
import { SinglePostResolver } from './resolvers/single-post/single-post.resolver'

@NgModule({
  declarations: [
    PostsContainerComponent,
    SinglePostComponent
  ],
  imports: [
    CommonModule,
    PostsRoutingModule,
    TuiIslandModule,
    TuiLinkModule,
    TuiButtonModule
  ],
  providers: [
    SinglePostResolver
  ]
})
export class PostsModule { }
