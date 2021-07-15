import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { UserRegistrationDto } from '../../../../global/domain'
import { ConfigService } from '../../../../global/services'
import { AuthorizationResult } from '../../models'

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {

  public redirectAfterAuthUrl: string = '/'

  constructor(private httpClient: HttpClient,
              private configService: ConfigService) {
  }

  public authorize(login: string, password: string): Observable<AuthorizationResult> {
    const params: HttpParams = new HttpParams()
      .set('username', login)
      .set('password', password)
      .set('grant_type', 'password')

    const headers: HttpHeaders = new HttpHeaders()
      .set('Authorization', 'Basic d2ViOnNlY3JldA==')

    return this.httpClient.post<AuthorizationResult>(`${ this.configService.baseApiUrl }/oauth/token`, null, {
      headers,
      params
    })
  }

  public register(userRegistrationDto: UserRegistrationDto): Observable<void> {
    return this.httpClient.post<void>(`${ this.configService.baseApiUrl }/register`, userRegistrationDto)
  }
}
