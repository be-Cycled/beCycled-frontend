import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { ConfigService } from '../../../services'
import { Workout, WorkoutDto } from '../../models'

@Injectable()
export class WorkoutService {
  constructor(private httpClient: HttpClient,
              private configService: ConfigService) {
  }

  public create(entity: WorkoutDto): Observable<Workout> {
    return this.httpClient.post<Workout>(`${ this.configService.baseApiUrl }/workouts`, entity)
  }

  public readWorkoutsByCommunity(nickname: string): Observable<Workout[]> {
    return this.httpClient.get<Workout[]>(`${ this.configService.baseApiUrl }/workouts/community/${ nickname }`)
  }

  public readByUser(login: string): Observable<Workout[]> {
    return this.httpClient.get<Workout[]>(`${ this.configService.baseApiUrl }/workouts/user/${ login }`)
  }

  public readWorkouts(): Observable<Workout[]> {
    return this.httpClient.get<Workout[]>(`${ this.configService.baseApiUrl }/workouts/all`)
  }

  public readById(id: number): Observable<Workout> {
    return this.httpClient.get<Workout>(`${ this.configService.baseApiUrl }/workouts/${ id }`)
  }
}
