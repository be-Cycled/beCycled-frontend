import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'

@Injectable()
export class ToolbarService {

  private isShowToolbar$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true)

  public isShowToolbarChanges$: Observable<boolean> = this.isShowToolbar$.pipe()

  private isShowBackButton$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

  public isShowBackButtonChanges$: Observable<boolean> = this.isShowBackButton$.pipe()

  public backButtonCallback: (() => void) | null = null

  public show(): void {
    this.isShowToolbar$.next(true)
  }

  public hide(): void {
    this.isShowToolbar$.next(false)
  }

  public showBackButton(onclick?: () => void): void {
    this.isShowBackButton$.next(true)

    if (typeof onclick === 'function') {
      this.backButtonCallback = onclick
    }
  }

  public hideBackButton(): void {
    this.isShowBackButton$.next(false)
    this.backButtonCallback = null
  }
}
