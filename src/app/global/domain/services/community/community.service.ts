import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { ConfigService } from '../../../services'
import { Community } from '../../models'

@Injectable()
export class CommunityService {
  constructor(private httpClient: HttpClient,
              private config: ConfigService) {
  }

  public getAll(): Observable<Community[]> {
    return this.httpClient.get<Community[]>(`${ this.config.baseApiUrl }/communities/all`)
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
}
