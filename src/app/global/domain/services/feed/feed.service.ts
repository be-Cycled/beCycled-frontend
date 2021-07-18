import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { ConfigService } from '../../../services'
import { Observable } from 'rxjs'
import { BaseCompetition, BaseWorkout } from '../../models'

@Injectable()
export class FeedService {
  constructor(private httpClient: HttpClient,
              private configService: ConfigService) {
  }

  public readAll(): Observable<(BaseWorkout | BaseCompetition)[]> {
    return this.httpClient.get<(BaseWorkout | BaseCompetition)[]>(`${ this.configService.baseApiUrl }/events/feed`)
  }
}
