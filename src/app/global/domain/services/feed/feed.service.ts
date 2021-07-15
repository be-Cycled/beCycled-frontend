import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { ConfigService } from '../../../services'
import { Observable } from 'rxjs'
import { Competition, Workout } from '../../models'

@Injectable()
export class FeedService {
  constructor(private httpClient: HttpClient,
              private configService: ConfigService) {
  }

  public readAll(): Observable<(Workout | Competition)[]> {
    return this.httpClient.get<(Workout | Competition)[]>(`${ this.configService.baseApiUrl }/events/feed`)
  }
}
