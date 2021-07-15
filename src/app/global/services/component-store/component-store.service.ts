import { Inject, Injectable, OnDestroy, Optional } from '@angular/core'
import { isObservable, Observable, of, ReplaySubject, Subject, Subscription, throwError } from 'rxjs'
import { concatMap, take, takeUntil, withLatestFrom } from 'rxjs/operators'
import { INITIAL_STATE_TOKEN } from './initial-state-token'

export type StateDispatcher<T> = (observableOrValue?: T | Observable<T>) => Subscription

/**
 * Хранитель данных
 *
 * Класс предназначений для хранения данных.
 */

@Injectable()
export class ComponentStore<T> implements OnDestroy {

  private isInitialized: boolean = false

  private destroySubj: Subject<void> = new Subject<void>()

  private readonly state: ReplaySubject<T> = new ReplaySubject<T>(1)

  private noInitializedError: Error = new Error(`${ this.constructor.name } has not been initialized yet.`)

  constructor(@Optional() @Inject(INITIAL_STATE_TOKEN) defaultState?: T) {
    if (typeof defaultState !== 'undefined') {
      this.initState(defaultState)
    }
  }

  /**
   * Получить последнее актуальное состояние
   */
  public takeState(): T {
    if (!this.isInitialized) {
      throw this.noInitializedError
    }

    let value: T

    this.state.pipe(take(1)).subscribe((state: T) => {
      value = state
    })

    return value!
  }

  /**
   * Инициализировать состояния
   *
   * @param defaultState Начальное состояния
   */
  public initState(defaultState: T): void {
    this.state.next(defaultState)
    this.isInitialized = true
  }

  /**
   * Устанавливает состояние
   *
   * @param stateOrUpdater Значение или функция возвращающаяя значение
   */
  public setState(stateOrUpdater: T | ((state: T) => T)): void {
    if (typeof stateOrUpdater !== 'function') {
      this.initState(stateOrUpdater)
    } else {
      this.createUpdater(stateOrUpdater as (state: T) => T)()
    }
  }

  /**
   * @internal
   */
  public ngOnDestroy(): void {
    this.state.complete()
    this.destroySubj.next()
    this.destroySubj.complete()
  }

  /**
   * Получить поток изменений состояния
   */
  public select(): Observable<T> {
    return this.state.pipe()
  }

  /**
   * Создать поток для обработки сайд-эффектов
   *
   * @param generate Функция возвращающая логику выполнения сайд-эффекта
   */
  public createEffect<T>(generate: (origin: Observable<T>) => Observable<any>): StateDispatcher<T> {
    const origin: Subject<T> = new Subject<T>()

    generate(origin)
      .pipe(takeUntil(this.destroySubj))
      .subscribe()

    return (observableOrValue: T | Observable<T> = of()): Subscription => {
      const  value: Observable<T> = isObservable(observableOrValue)
        ? observableOrValue
        : of(observableOrValue)

      return value
        .pipe(takeUntil(this.destroySubj))
        .subscribe((value: T) => origin.next(value))
    }
  }

  /**
   * Возвращает функцию для обновления состояния
   *
   * @param updater Функция обновляющая состояние
   */
  public createUpdater<R>(updater: (currentState: T, value: R) => T): any {
    return (observableOrValue: R | Observable<R>): Subscription => {
      const value: Observable<R> = isObservable(observableOrValue)
        ? observableOrValue
        : of(observableOrValue)

      const resultSubscription: Subscription = value
        .pipe(
          takeUntil(this.destroySubj),
          concatMap((value: R) => {
            if (this.isInitialized) {
              return of(value)
            }

            return throwError(this.noInitializedError)
          }),
          withLatestFrom(this.state)
        )
        .subscribe({
          next: ([ value, currentState ]: [ R, T ]) => {
            this.state.next(
              updater(currentState, value)
            )
          },
          error: (error: Error) => {
            this.state.error(error)
          }
        })

      return resultSubscription
    }
  }

  /**
   * Частичное обновление состояния состояния.
   *
   * NOTE: Применимо в основном для объектов. Если хранится
   * массив, то лучше использовать {@link createUpdater}
   *
   * @param partialStateOrUpdater Частичное состояния
   */
  public patchState(partialStateOrUpdater: Partial<T> | Observable<Partial<T>> | ((state: T) => Partial<T>)): void {
    const patchedState: Partial<T> | Observable<Partial<T>> = typeof partialStateOrUpdater === 'function'
      ? partialStateOrUpdater(this.takeState())
      : partialStateOrUpdater

    const partialUpdater: StateDispatcher<Partial<T>> = this.createUpdater((state: T, partialState: Partial<T>) => {
      return {
        ...state,
        ...partialState
      }
    })

    partialUpdater(patchedState)
  }
}
