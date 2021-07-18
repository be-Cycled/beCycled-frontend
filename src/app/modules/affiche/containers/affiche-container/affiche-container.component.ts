import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'
import { Title } from '@angular/platform-browser'
import { Observable } from 'rxjs'
import { shareReplay } from 'rxjs/operators'
import { BaseCompetition, BaseWorkout } from '../../../../global/domain'
import { UserHolderService } from '../../../../global/services'
import { AfficheService } from '../../../../global/domain/services/affiche/affiche.service'
import { AbstractEventListPage } from '../../../../global/cdk/components/abstract-event-list-page'

@Component({
  selector: 'cy-affiche-container',
  templateUrl: './affiche-container.component.html',
  styleUrls: [ './affiche-container.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AfficheContainerComponent extends AbstractEventListPage implements OnInit {
  public isUserAuthorized$: Observable<boolean> = this.userHolderService.isUserAuthorizedChanges

  public events$: Observable<(BaseWorkout | BaseCompetition)[]> = this.afficheService.readAll().pipe(
    shareReplay(1)
  )

  constructor(private afficheService: AfficheService,
              private title: Title,
              private userHolderService: UserHolderService) {
    super()
    this.title.setTitle(`Афиша`)
  }

  public ngOnInit(): void {
  }
}
