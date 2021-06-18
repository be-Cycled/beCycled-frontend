import { environment } from '../../../environments/environment'

const prefix: string = `be-cycled:${ environment.production ? `` : `dev` }/`

export enum BrowserStorage {
  accessToken = 'access-token'
}

export function takeBrowserStorageKey(key: BrowserStorage): string {
  return prefix + key
}
