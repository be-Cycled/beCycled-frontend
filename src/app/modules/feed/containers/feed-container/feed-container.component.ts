import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'
import { FormControl } from '@angular/forms'
import { Title } from '@angular/platform-browser'
import { Observable } from 'rxjs'
import { shareReplay } from 'rxjs/operators'
import { Competition, Workout } from '../../../../global/domain'
import { AbstractEventListPage } from '../../../../global/cdk/components/abstract-event-list-page'
import { FeedService } from '../../../../global/domain/services/feed/feed.service'

@Component({
  selector: 'cy-feed-container',
  templateUrl: './feed-container.component.html',
  styleUrls: [ './feed-container.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeedContainerComponent extends AbstractEventListPage implements OnInit {
  public filters: FormControl = new FormControl()

  public events$: Observable<(Workout | Competition)[]> = this.feedService.readAll().pipe(
    shareReplay(1)
  )

  constructor(private feedService: FeedService,
              private title: Title) {
    super()
    this.title.setTitle('Лента')
  }

  public ngOnInit(): void {
  }
}
