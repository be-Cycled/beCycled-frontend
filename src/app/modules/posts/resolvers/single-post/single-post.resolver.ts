import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router'
import { Observable } from 'rxjs'
import { Post } from '../../../../global/domain/models/post'
import { PostService } from '../../../../global/domain/services/post/post.service'

@Injectable()
export class SinglePostResolver implements Resolve<Post> {
  constructor(private postService: PostService) {
  }

  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Post> {
    const postId: string | null = route.paramMap.get('id')

    if (postId === null) {
      throw new Error('Post id does not exist')
    }

    return this.postService.get(parseInt(postId, 10))
  }
}
