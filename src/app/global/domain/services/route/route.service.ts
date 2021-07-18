import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Route } from '../../models'
import { Observable } from 'rxjs'
import { ConfigService } from '../../../services'
import { RouteDto } from '../../../dto'

@Injectable()
export class RouteService {

  constructor(private httpClient: HttpClient,
              private configService: ConfigService) {
  }

  public create(entity: RouteDto): Observable<Route> {
    return this.httpClient.post<Route>(`${ this.configService.baseApiUrl }/routes`, entity)
  }

  public readById(id: number): Observable<Route> {
    return this.httpClient.get<Route>(`${ this.configService.baseApiUrl }/routes/${ id }`)
  }

  public readAll(): Observable<Route[]> {
    return this.httpClient.get<Route[]>(`${ this.configService.baseApiUrl }/routes/all`)
  }
}
