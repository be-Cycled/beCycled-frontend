import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { ConfigService } from '../../../services'
import { Observable } from 'rxjs'
import { BaseEvent } from '../../models'
import { BaseCompetitionDto, BaseWorkoutDto } from '../../../dto'

@Injectable()
export class EventService {
  constructor(private httpClient: HttpClient,
              private configService: ConfigService) {
  }

  public create(entity: (BaseWorkoutDto | BaseCompetitionDto)): Observable<BaseEvent> {
    return this.httpClient.post<BaseEvent>(`${ this.configService.baseApiUrl }/events`, entity)
  }

  public update(id: number, entity: (BaseWorkoutDto | BaseCompetitionDto)): Observable<BaseEvent> {
    return this.httpClient.put<BaseEvent>(`${ this.configService.baseApiUrl }/events/${ id }`, entity)
  }

  public delete(id: number): Observable<number> {
    return this.httpClient.delete<number>(`${ this.configService.baseApiUrl }/events/${ id }`)
  }

  public readAffiche(): Observable<BaseEvent[]> {
    return this.httpClient.get<BaseEvent[]>(`${ this.configService.baseApiUrl }/events/affiche`)
  }

  public readFeed(): Observable<BaseEvent[]> {
    return this.httpClient.get<BaseEvent[]>(`${ this.configService.baseApiUrl }/events/feed`)
  }

  public readAll(): Observable<BaseEvent[]> {
    return this.httpClient.get<BaseEvent[]>(`${ this.configService.baseApiUrl }/events/all`)
  }

  public readEventById(id: number): Observable<BaseEvent> {
    return this.httpClient.get<BaseEvent>(`${ this.configService.baseApiUrl }/events/${ id }`)
  }

  public readEventByCommunity(nickname: string): Observable<BaseEvent[]> {
    return this.httpClient.get<BaseEvent[]>(`${ this.configService.baseApiUrl }/events/community/${ nickname }`)
  }

  public readEventByUser(nickname: string): Observable<BaseEvent[]> {
    return this.httpClient.get<BaseEvent[]>(`${ this.configService.baseApiUrl }/events/user/${ nickname }`)
  }

  /**
   * TODO: Добавить эндпоинты присоединения к событию
   */
}
