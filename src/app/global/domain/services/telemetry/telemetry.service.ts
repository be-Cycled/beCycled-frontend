import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { ConfigService } from '../../../services'
import { Telemetry } from '../../models/telemetry'

@Injectable()
export class TelemetryService {
  constructor(private httpClient: HttpClient,
              private config: ConfigService) {
  }

  public getLast(trackerId: number): Observable<Telemetry> {
    return this.httpClient.get<Telemetry>(`${ this.config.baseApiUrl }/telemetries/last/${ trackerId }`)
  }
}
