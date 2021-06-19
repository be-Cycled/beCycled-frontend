import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { TuiButtonModule, TuiLinkModule } from '@taiga-ui/core'
import { TuiIslandModule } from '@taiga-ui/kit'
import { PostsContainerComponent } from './containers/posts-container/posts-container.component'

import { PostsRoutingModule } from './posts-routing.module'


@NgModule({
  declarations: [
    PostsContainerComponent
  ],
  imports: [
    CommonModule,
    PostsRoutingModule,
    TuiIslandModule,
    TuiLinkModule,
    TuiButtonModule
  ]
})
export class PostsModule { }
