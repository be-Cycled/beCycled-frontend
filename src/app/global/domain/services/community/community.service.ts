import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { ConfigService } from '../../../services'
import { Community, User } from '../../models'

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

  public create(community: Community): Observable<Community> {
    return this.httpClient.post<Community>(`${ this.config.baseApiUrl }/communities`, community)
  }

  public update(id: number, community: Community): Observable<Community> {
    return this.httpClient.put<Community>(`${ this.config.baseApiUrl }/communities/${ id }`, community)
  }

  public join(userId: number, community: Community): Observable<Community> {
    return this.update(community.id, {
      ...community,
      userIds: [
        ...community.userIds,
        userId
      ]
    })
  }

  public unjoin(userId: number, community: Community): Observable<Community> {
    return this.update(community.id, {
      ...community,
      userIds: community.userIds.filter((id: number) => id !== userId)
    })
  }

  public getUsersByCommunity(nickname: string): Observable<User[]> {
    return this.httpClient.get<User[]>(`${ this.config.baseApiUrl }/communities/nickname/${ nickname }/users`)
  }

  public getCommunitiesByUser(login: string): Observable<Community[]> {
    return this.httpClient.get<Community[]>(`${ this.config.baseApiUrl }/communities/user/${ login }`)
  }
}
