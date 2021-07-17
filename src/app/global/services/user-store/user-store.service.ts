import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { filter, map } from 'rxjs/operators'
import { User } from '../../domain'

@Injectable({ providedIn: 'root' })
export class UserStoreService {
  private readonly userStore: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null)

  /**
   * Поток изменений авторизованного пользователя
   */
  public userChanges: Observable<User | null> = this.userStore.pipe()

  /**
   * Поток изменений пользователя (без null)
   */
  public validUserChanges: Observable<User> = this.userStore.pipe(
    filter((user: User | null): user is User => user !== null)
  )

  /**
   * Поток изменений флага авторизации
   */
  public isAuthChanges: Observable<boolean> = this.userStore.pipe(
    map((user: User | null) => user !== null)
  )

  /**
   * Авторизованный пользователь
   */
  public get user(): User | null {
    return this.userStore.value
  }

  /**
   * Авторизован ли пользователь
   */
  public get isAuth(): boolean {
    return this.user !== null
  }

  /**
   * Устанавливает пользователя
   *
   * @param user Пользователь
   */
  public setUser(user: User): void {
    this.userStore.next(user)
  }

  /**
   * Сбрасывает состояние сервиса в изначальное
   */
  public reset(): void {
    this.userStore.next(null)
  }
}
