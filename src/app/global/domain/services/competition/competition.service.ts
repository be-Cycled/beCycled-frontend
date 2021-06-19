import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { ConfigService } from '../../../services'
import { Competition } from '../../models'

@Injectable()
export class CompetitionService {
  constructor(private httpClient: HttpClient,
              private config: ConfigService) {
  }

  public getCompetitionsByCommunity(nickname: string): Observable<Competition[]> {
    return this.httpClient.get<Competition[]>(`${ this.config.baseApiUrl }/competitions/community/${ nickname }`)
  }

  public getCompetitions(): Observable<Competition[]> {
    return this.httpClient.get<Competition[]>(`${ this.config.baseApiUrl }/competitions/all`)
  }
}
