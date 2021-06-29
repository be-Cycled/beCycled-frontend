import { ChangeDetectionStrategy, Component } from '@angular/core'
import { Title } from '@angular/platform-browser'
import { ActivatedRoute } from '@angular/router'
import { Post } from '../../../../global/domain/models/post'

@Component({
  selector: 'cy-single-post',
  templateUrl: './single-post.component.html',
  styleUrls: [ './single-post.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SinglePostComponent {

  public post: Post = this.activatedRoute.snapshot.data.post

  constructor(private activatedRoute: ActivatedRoute,
              private title: Title) {
    this.title.setTitle(this.post.title)
  }

}
