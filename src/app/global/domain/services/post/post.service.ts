import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { ConfigService } from '../../../services'
import { Post } from '../../models/post'

@Injectable()
export class PostService {
  constructor(private httpClient: HttpClient,
              private config: ConfigService) {
  }

  public getAll(): Observable<Post[]> {
    return this.httpClient.get<Post[]>(`${ this.config.baseApiUrl }/posts/all`)
  }

  public get(id: number): Observable<Post> {
    return this.httpClient.get<Post>(`${ this.config.baseApiUrl }/posts/${ id }`)
  }
}
