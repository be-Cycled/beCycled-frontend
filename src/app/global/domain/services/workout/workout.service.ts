import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { ConfigService } from '../../../services'
import { Workout } from '../../models'

@Injectable()
export class WorkoutService {
  constructor(private httpClient: HttpClient,
              private config: ConfigService) {
  }

  public getWorkoutsByCommunity(nickname: string): Observable<Workout[]> {
    return this.httpClient.get<Workout[]>(`${ this.config.baseApiUrl }/workouts/community/${ nickname }`)
  }
}
