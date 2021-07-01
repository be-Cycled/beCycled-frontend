import { Inject, Injectable, OnDestroy, Optional } from '@angular/core'
import { isObservable, Observable, of, ReplaySubject, Subject, Subscription } from 'rxjs'
import { take, takeUntil, tap } from 'rxjs/operators'
import { INITIAL_STATE_TOKEN } from './initial-state-token'

export interface EffectDispatcher<T> {
  (observableOrValue: T | Observable<T>): Subscription
}

@Injectable()
export class ComponentStore<T> implements OnDestroy {

  private isInitialized: boolean = false

  private destroySubj: Subject<void> = new Subject<void>()

  private readonly state: ReplaySubject<T> = new ReplaySubject<T>(1)

  constructor(@Optional() @Inject(INITIAL_STATE_TOKEN) defaultState?: T) {
    if (typeof defaultState !== 'undefined') {
      this.initState(defaultState)
    }
  }

  public takeState(): T {
    if (!this.isInitialized) {
      throw new Error(`${ this.constructor.name } has not been initialized yet.`)
    }

    let value: T

    this.state.pipe(take(1)).subscribe((state: T) => {
      value = state
    })

    return value!
  }

  public initState(defaultState: T): void {
    this.state.next(defaultState)
    this.isInitialized = true
  }

  public ngOnDestroy(): void {
    this.state.complete()
    this.destroySubj.next()
    this.destroySubj.complete()
  }

  public select(): Observable<T> {
    return this.state.pipe()
  }

  public createEffect<T>(generate: (origin: Observable<T>) => Observable<any>): EffectDispatcher<T> {
    const origin: Subject<T> = new Subject<T>()

    generate(origin)
      .pipe(
        takeUntil(this.destroySubj)
      )
      .subscribe()

    return (observableOrValue: T | Observable<T>): Subscription => {
      const  value: Observable<T> = isObservable(observableOrValue)
        ? observableOrValue
        : of(observableOrValue)

      return value
        .pipe(takeUntil(this.destroySubj))
        .subscribe((value: T) => {
          origin.next(value)
        })
    }
  }

  public createUpdater(): void {

  }
}

const ddd: ComponentStore<unknown> = new ComponentStore()

const sss: EffectDispatcher<number> = ddd.createEffect((id: Observable<number>) => {
  return id.pipe(
    tap((id: number) => console.log(`Тип сделал запрос на бек: ${ id }`))
  )
})

const aaa: Subscription = sss(1)
