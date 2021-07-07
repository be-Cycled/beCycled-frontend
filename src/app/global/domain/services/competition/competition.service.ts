import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { ConfigService } from '../../../services'
import { Competition } from '../../models'

@Injectable()
export class CompetitionService {
  constructor(private httpClient: HttpClient,
              private configService: ConfigService) {
  }

  public create(entity: Competition): Observable<Competition> {
    return this.httpClient.post<Competition>(`${ this.configService.baseApiUrl }/competitions`, entity)
  }

  public readCompetitionsByCommunity(nickname: string): Observable<Competition[]> {
    return this.httpClient.get<Competition[]>(`${ this.configService.baseApiUrl }/competitions/community/${ nickname }`)
  }

  public readByUser(login: string): Observable<Competition[]> {
    return this.httpClient.get<Competition[]>(`${ this.configService.baseApiUrl }/competitions/user/${ login }`)
  }

  public readCompetitions(): Observable<Competition[]> {
    return this.httpClient.get<Competition[]>(`${ this.configService.baseApiUrl }/competitions/all`)
  }

  public readById(id: number): Observable<Competition> {
    return this.httpClient.get<Competition>(`${ this.configService.baseApiUrl }/competitions/${ id }`)
  }
}
