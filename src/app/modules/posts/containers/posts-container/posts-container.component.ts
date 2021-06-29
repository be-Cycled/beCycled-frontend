import { ChangeDetectionStrategy, Component } from '@angular/core'
import { Title } from '@angular/platform-browser'
import { Observable } from 'rxjs'
import { Post } from '../../../../global/domain/models/post'
import { PostService } from '../../../../global/domain/services/post/post.service'

@Component({
  selector: 'cy-posts-container',
  templateUrl: './posts-container.component.html',
  styleUrls: [ './posts-container.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostsContainerComponent {

  public posts: Observable<Post[]> = this.postService.getAll()

  constructor(private postService: PostService,
              private title: Title) {
    this.title.setTitle(`Статьи`)
  }
}
