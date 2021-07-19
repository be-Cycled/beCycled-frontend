import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'
import { Title } from '@angular/platform-browser'
import { Observable } from 'rxjs'
import { shareReplay, tap } from 'rxjs/operators'
import { BaseCompetition, BaseWorkout } from '../../../../global/domain'
import { UserHolderService } from '../../../../global/services'
import { shareReplay } from 'rxjs/operators'
import { detectBaseEventTypeByEventType } from 'src/app/global/utils'
import { AbstractEventListPage } from '../../../../global/cdk/components/abstract-event-list-page'
import { BaseCompetition, BaseEventType, BaseWorkout, EventType } from '../../../../global/domain'
import { EventService } from '../../../../global/domain/services/event/event.service'
import { UserStoreService } from '../../../../global/services'

@Component({
  selector: 'cy-affiche-container',
  templateUrl: './affiche-container.component.html',
  styleUrls: [ './affiche-container.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AfficheContainerComponent extends AbstractEventListPage implements OnInit {
  public isUserAuthorized$: Observable<boolean> = this.userStoreService.isAuthChanges

  public events$: Observable<(BaseWorkout | BaseCompetition)[]> = this.eventService.readAffiche().pipe(
    shareReplay(1)
  )

  constructor(private title: Title,
              private eventService: EventService,
              private userStoreService: UserStoreService) {
    super()
    this.title.setTitle(`Афиша`)
  }
}
