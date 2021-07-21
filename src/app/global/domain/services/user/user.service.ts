import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { ConfigService } from '../../../services/config/config.service'
import { User } from '../../models'

@Injectable()
export class UserService {
  constructor(private configService: ConfigService,
              private httpClient: HttpClient) {
  }

  public getMe(credentials?: string): Observable<User> {
    if (typeof credentials !== 'undefined') {
      const headers: HttpHeaders = new HttpHeaders()
        .set('Authorization', `Bearer ${ credentials }`)

      return this.httpClient.get<User>(`${ this.configService.baseApiUrl }/users/me`, { headers })
    }

    return this.httpClient.get<User>(`${ this.configService.baseApiUrl }/users/me`)
  }

  public getUserByLogin(login: string): Observable<User> {
    return this.httpClient.get<User>(`${ this.configService.baseApiUrl }/users/login/${ login }`)
  }

  public updateUser(id: number, user: User): Observable<User> {
    return this.httpClient.put<User>(`${ this.configService.baseApiUrl }/users/${ id.toString() }`, user)
  }

  public readUsersByIds(ids: number[]): Observable<User[]> {
    return this.httpClient.post<User[]>(`${ this.configService.baseApiUrl }/users/multiple`, ids)
  }

  public readAllUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(`${ this.configService.baseApiUrl }/users/all`)
  }

  /**
   * @todo Вынести это в отдельный сервис UserAccountsService
   */
  public updatePassword(newPassword: string): Observable<void> {
    return this.httpClient.put<void>(`${ this.configService.baseApiUrl }/user-accounts/password`, newPassword)
  }
}
