import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { ConfigService } from '../../../services'
import { BaseWorkout } from '../../models'
import { WorkoutDto } from '../../../dto'

@Injectable()
export class WorkoutService {
  constructor(private httpClient: HttpClient,
              private configService: ConfigService) {
  }

  public create(entity: WorkoutDto): Observable<BaseWorkout> {
    return this.httpClient.post<BaseWorkout>(`${ this.configService.baseApiUrl }/workouts`, entity)
  }

  public readWorkoutsByCommunity(nickname: string): Observable<BaseWorkout[]> {
    return this.httpClient.get<BaseWorkout[]>(`${ this.configService.baseApiUrl }/workouts/community/${ nickname }`)
  }

  public readByUser(login: string): Observable<BaseWorkout[]> {
    return this.httpClient.get<BaseWorkout[]>(`${ this.configService.baseApiUrl }/workouts/user/${ login }`)
  }

  public readWorkouts(): Observable<BaseWorkout[]> {
    return this.httpClient.get<BaseWorkout[]>(`${ this.configService.baseApiUrl }/workouts/all`)
  }

  public readById(id: number): Observable<BaseWorkout> {
    return this.httpClient.get<BaseWorkout>(`${ this.configService.baseApiUrl }/workouts/${ id }`)
  }
}
