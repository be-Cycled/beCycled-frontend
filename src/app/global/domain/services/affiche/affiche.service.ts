import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { ConfigService } from '../../../services'
import { Competition, Workout } from '../../models'
import { Observable } from 'rxjs'

@Injectable()
export class AfficheService {
  constructor(private httpClient: HttpClient,
              private configService: ConfigService) {
  }

  public readAll(): Observable<(Workout | Competition)[]> {
    return this.httpClient.get<(Workout | Competition)[]>(`${ this.configService.baseApiUrl }/events/affiche`)
  }
}
