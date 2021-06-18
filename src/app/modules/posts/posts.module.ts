import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { PostsContainerComponent } from './containers/posts-container/posts-container.component'

import { PostsRoutingModule } from './posts-routing.module'


@NgModule({
  declarations: [
    PostsContainerComponent
  ],
  imports: [
    CommonModule,
    PostsRoutingModule
  ]
})
export class PostsModule { }
