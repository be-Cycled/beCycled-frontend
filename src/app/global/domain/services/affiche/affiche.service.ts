import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { ConfigService } from '../../../services'
import { BaseCompetition, BaseWorkout } from '../../models'
import { Observable } from 'rxjs'

@Injectable()
export class AfficheService {
  constructor(private httpClient: HttpClient,
              private configService: ConfigService) {
  }

  public readAll(): Observable<(BaseWorkout | BaseCompetition)[]> {
    return this.httpClient.get<(BaseWorkout | BaseCompetition)[]>(`${ this.configService.baseApiUrl }/events/affiche`)
  }
}
