import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { ConfigService } from '../../../services'
import { Observable } from 'rxjs'
import { BaseCompetition, BaseWorkout } from '../../models'

@Injectable()
export class EventService {
  constructor(private httpClient: HttpClient,
              private configService: ConfigService) {
  }

  public readAffiche(): Observable<(BaseWorkout | BaseCompetition)[]> {
    return this.httpClient.get<(BaseWorkout | BaseCompetition)[]>(`${ this.configService.baseApiUrl }/events/affiche`)
  }

  public readFeed(): Observable<(BaseWorkout | BaseCompetition)[]> {
    return this.httpClient.get<(BaseWorkout | BaseCompetition)[]>(`${ this.configService.baseApiUrl }/events/feed`)
  }

  public readEventById(id: number): Observable<(BaseWorkout | BaseCompetition)> {
    return this.httpClient.get<(BaseWorkout | BaseCompetition)>(`${ this.configService.baseApiUrl }/events/${ id }`)
  }
}
