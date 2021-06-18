import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { Competition, Workout } from '../../../global/domain'

@Injectable()
export class AfficheService {
  constructor(private http: HttpClient) {
  }

  public getWorkouts(): Observable<Workout[]> {
    return this.http.get<Workout[]>('http://localhost:5100/workouts')
  }

  public getCompetitions(): Observable<Competition[]> {
    return this.http.get<Competition[]>('http://localhost:5100/competitions')
  }
}
