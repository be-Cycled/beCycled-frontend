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

  public eventType: { workout: EventType; competition: EventType } = {
    workout: EventType.workout,
    competition: EventType.competition
  }

  public ngOnInit(): void {
  }

  private checkEqualDates(a: ISO8601, b: ISO8601): boolean {
    const firstDate: Date = new Date(a)
    const secondDate: Date = new Date(b)

    return firstDate.getFullYear() === secondDate.getFullYear() && firstDate.getMonth() === secondDate.getMonth() && firstDate.getDate() === secondDate.getDate()
  }

}
