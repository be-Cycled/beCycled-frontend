import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Competition, Workout } from '../../../global/domain'
import { ConfigService } from '../../../global/services'
import { Observable } from 'rxjs'

@Injectable()
export class AddEventService {

  constructor(private httpClient: HttpClient,
              private configService: ConfigService) {
  }

  public createWorkout(entity: Workout): Observable<Workout> {
    return this.httpClient.post<Workout>(`${ this.configService.baseApiUrl }/workouts`, entity)
  }

  public createCompetition(entity: Competition): Observable<Competition> {
    return this.httpClient.post<Competition>(`${ this.configService.baseApiUrl }/competitions`, entity)
  }
}
