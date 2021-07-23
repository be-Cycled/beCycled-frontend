import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'

@Injectable()
export class ToolbarService {
  private isShowToolbar$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true)

  public isShowToolbarChanges$: Observable<boolean> = this.isShowToolbar$.pipe()

  public show(): void {
    this.isShowToolbar$.next(true)
  }

  public hide(): void {
    this.isShowToolbar$.next(false)
  }
}
