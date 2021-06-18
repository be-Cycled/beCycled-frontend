import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'
import { ISO8601 } from '../../../../global/models'
import { Competition, Workout } from '../../../../global/domain'

enum EventType {
  workout = 'WORKOUT',
  competition = 'COMPETITION'
}

interface WrappedEvent<T, U> {
  type: T,
  value: U
}

interface EventListByDay {
  date: ISO8601
  events: SomeWrappedEvent[]
}

type SomeWrappedEvent = WrappedEvent<EventType.workout, Workout> | WrappedEvent<EventType.competition, Competition>

@Component({
  selector: 'cy-affiche-container',
  templateUrl: './affiche-container.component.html',
  styleUrls: [ './affiche-container.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AfficheContainerComponent implements OnInit {

  public ngOnInit(): void {
  }

}
