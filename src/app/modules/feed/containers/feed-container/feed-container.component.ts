import { ChangeDetectionStrategy, Component } from '@angular/core'
import { FormControl } from '@angular/forms'
import { Title } from '@angular/platform-browser'
import { Observable } from 'rxjs'
import { shareReplay, tap } from 'rxjs/operators'
import { BaseCompetition, BaseWorkout } from '../../../../global/domain'
import { AbstractEventListPage } from '../../../../global/cdk/components/abstract-event-list-page'
import { EventService } from '../../../../global/domain/services/event/event.service'

@Component({
  selector: 'cy-feed-container',
  templateUrl: './feed-container.component.html',
  styleUrls: [ './feed-container.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeedContainerComponent extends AbstractEventListPage {
  public filters: FormControl = new FormControl()

  public events$: Observable<(BaseWorkout | BaseCompetition)[]> = this.eventService.readFeed().pipe(
    tap(() => this.isLoading = false),
    shareReplay(1)
  )

  constructor(private eventService: EventService,
              private title: Title) {
    super()
    this.title.setTitle('Лента')
  }
}
