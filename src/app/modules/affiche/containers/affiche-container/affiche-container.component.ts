import { ChangeDetectionStrategy, Component } from '@angular/core'
import { Title } from '@angular/platform-browser'
import { Observable } from 'rxjs'
import { shareReplay, tap } from 'rxjs/operators'
import { BaseCompetition, BaseWorkout } from '../../../../global/domain'
import { UserStoreService } from '../../../../global/services'
import { AbstractEventListPage } from '../../../../global/cdk/components/abstract-event-list-page'
import { EventService } from '../../../../global/domain/services/event/event.service'

@Component({
  selector: 'cy-affiche-container',
  templateUrl: './affiche-container.component.html',
  styleUrls: [ './affiche-container.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AfficheContainerComponent extends AbstractEventListPage {
  public isUserAuthorized$: Observable<boolean> = this.userStoreService.isAuthChanges

  public events$: Observable<(BaseWorkout | BaseCompetition)[]> = this.eventService.readAffiche().pipe(
    tap(() => this.isLoading = false),
    shareReplay(1)
  )

  constructor(private title: Title,
              private eventService: EventService,
              private userStoreService: UserStoreService) {
    super()
    this.title.setTitle(`Афиша`)
  }
}
