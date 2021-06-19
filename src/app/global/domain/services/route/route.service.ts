import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Route } from '../../models'
import { Observable } from 'rxjs'
import { BASE_URL } from '../../../models'

@Injectable()
export class RouteService {

  constructor(private http: HttpClient) {
  }

  public getById(id: number): Observable<Route> {
    return this.http.get<Route>(`${ BASE_URL }/routes/${ id }`)
  }

  public getAll(): Observable<Route[]> {
    return this.http.get<Route[]>(`${ BASE_URL }/routes/all`)
  }
}
