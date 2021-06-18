import { Injectable } from '@angular/core'

@Injectable({ providedIn: 'root' })
export class ConfigService {
  public readonly baseApiUrl: string = `https://api.becycled.me`
}
