import { Injectable } from '@angular/core'

@Injectable({ providedIn: 'root' })
export class ConfigService {
  public readonly baseApiUrl: string = `https://api.becycled.me`

  public readonly apiImageUrl: string = `${ this.baseApiUrl }/images`
}
