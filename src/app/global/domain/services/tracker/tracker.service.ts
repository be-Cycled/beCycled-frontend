import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { ConfigService } from '../../../services'
import { Tracker } from '../../models/tracker'

@Injectable()
export class TrackerService {
  constructor(private httpClient: HttpClient,
              private config: ConfigService) {
  }

  public getByUser(login: string): Observable<Tracker> {
    return this.httpClient.get<Tracker>(`${ this.config.baseApiUrl }/trackers/user/${ login }`)
  }
}
