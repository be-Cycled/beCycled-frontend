import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { ConfigService } from '../../../services'
import { Community, CommunityCreateDto, User } from '../../models'

@Injectable()
export class CommunityService {
  constructor(private httpClient: HttpClient,
              private config: ConfigService) {
  }

  public getAll(): Observable<Community[]> {
    return this.httpClient.get<Community[]>(`${ this.config.baseApiUrl }/communities/all`)
  }

  public getByNickname(nickname: string): Observable<Community> {
    return this.httpClient.get<Community>(`${ this.config.baseApiUrl }/communities/nickname/${ nickname }`)
  }

  public getAllByLogin(login: string): Observable<Community[]> {
    return this.httpClient.get<Community[]>(`${ this.config.baseApiUrl }/communities/login/${ login }`)
  }

  public create(community: CommunityCreateDto): Observable<Community> {
    return this.httpClient.post<Community>(`${ this.config.baseApiUrl }/communities`, community)
  }

  public update(id: number, community: Community): Observable<Community> {
    return this.httpClient.put<Community>(`${ this.config.baseApiUrl }/communities/${ id }`, community)
  }

  public join(communityId: number): Observable<Community> {
    return this.httpClient.post<Community>(`${ this.config.baseApiUrl }/communities/join/${ communityId }`, null)
  }

  public leave(communityId: number): Observable<Community> {
    return this.httpClient.post<Community>(`${ this.config.baseApiUrl }/communities/leave/${ communityId }`, null)
  }

  public getUsersByCommunity(nickname: string): Observable<User[]> {
    return this.httpClient.get<User[]>(`${ this.config.baseApiUrl }/communities/nickname/${ nickname }/users`)
  }

  public getCommunitiesByUser(login: string): Observable<Community[]> {
    return this.httpClient.get<Community[]>(`${ this.config.baseApiUrl }/communities/user/${ login }`)
  }
}
