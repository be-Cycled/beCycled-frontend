import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { ConfigService } from '../config/config.service'

@Injectable()
export class ImageNetworkService {

  constructor(private httpClient: HttpClient,
              private configService: ConfigService) {
  }

  /**
   * Возвращает имя файла. Поддерживает форматы PNG и JPG
   */
  public uploadImage(uploadImageData: FormData): Observable<string> {
    return this.httpClient.post(`${ this.configService.baseApiUrl }/images/upload`, uploadImageData, { responseType: 'text' })
  }
}
