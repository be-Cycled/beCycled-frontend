import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { ConfigService } from '../../../services'
import { BaseCompetition } from '../../models'
import { CompetitionDto } from '../../../dto'

@Injectable()
export class CompetitionService {
  constructor(private httpClient: HttpClient,
              private configService: ConfigService) {
  }

  public create(entity: CompetitionDto): Observable<BaseCompetition> {
    return this.httpClient.post<BaseCompetition>(`${ this.configService.baseApiUrl }/competitions`, entity)
  }

  public readCompetitionsByCommunity(nickname: string): Observable<BaseCompetition[]> {
    return this.httpClient.get<BaseCompetition[]>(`${ this.configService.baseApiUrl }/competitions/community/${ nickname }`)
  }

  public readByUser(login: string): Observable<BaseCompetition[]> {
    return this.httpClient.get<BaseCompetition[]>(`${ this.configService.baseApiUrl }/competitions/user/${ login }`)
  }

  public readCompetitions(): Observable<BaseCompetition[]> {
    return this.httpClient.get<BaseCompetition[]>(`${ this.configService.baseApiUrl }/competitions/all`)
  }

  public readById(id: number): Observable<BaseCompetition> {
    return this.httpClient.get<BaseCompetition>(`${ this.configService.baseApiUrl }/competitions/${ id }`)
  }
}
