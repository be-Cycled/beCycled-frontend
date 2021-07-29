import { Inject, Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { ConfigService, UserStoreService } from '../../../services'
import { Observable } from 'rxjs'
import { BaseEvent } from '../../models'
import { BaseCompetitionDto, BaseWorkoutDto } from '../../../dto'
import { BrowserStorage, takeBrowserStorageKey } from '../../../models'
import { LOCAL_STORAGE } from '@ng-web-apis/common'

@Injectable()
export class EventService {
  constructor(@Inject(LOCAL_STORAGE)
              private localStorage: Storage,
              private userStoreService: UserStoreService,
              private httpClient: HttpClient,
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

  public joinByEventId(id: number): Observable<BaseEvent> {
    const key: string = takeBrowserStorageKey(BrowserStorage.accessToken)
    const accessToken: string | null = this.localStorage.getItem(key)

    return this.httpClient.post<BaseEvent>(`${ this.configService.baseApiUrl }/events/join/${ id }`, null, {
      headers: new HttpHeaders().set(`Authorization`, `Bearer ${ accessToken }`)
    })
  }

  public leaveByEventId(id: number): Observable<BaseEvent> {
    const key: string = takeBrowserStorageKey(BrowserStorage.accessToken)
    const accessToken: string | null = this.localStorage.getItem(key)

    return this.httpClient.post<BaseEvent>(`${ this.configService.baseApiUrl }/events/leave/${ id }`, null, {
      headers: new HttpHeaders().set(`Authorization`, `Bearer ${ accessToken }`)
    })
  }
}
