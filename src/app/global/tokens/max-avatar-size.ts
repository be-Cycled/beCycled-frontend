import { InjectionToken } from '@angular/core'

function maxAvatarSizeFactory(): number {
  return 2_000_000
}

/**
 * Максимальный размер картинки для аватарки
 *
 * NOTE: Измеряется в байтах
 */
export const MAX_AVATAR_FILE_SIZE: InjectionToken<number> = new InjectionToken<number>(`__MAX_AVATAR_FILE_SIZE__`, {
  providedIn: 'root',
  factory: maxAvatarSizeFactory
})
