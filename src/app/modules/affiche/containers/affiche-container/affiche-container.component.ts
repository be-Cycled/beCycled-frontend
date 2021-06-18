import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'
import { ISO8601 } from '../../../../global/models'
import { Competition, Workout } from '../../../../global/domain'
import { combineLatest, Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { AfficheService } from '../../services/affiche.service'

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

  public calendar: Observable<EventListByDay[]> = combineLatest([
    this.afficheService.getWorkouts(),
    this.afficheService.getCompetitions()
  ]).pipe(
    map(([ workouts, competitions ]: [ Workout[], Competition[] ]) => {
      const wrappedWorkouts: WrappedEvent<EventType.workout, Workout>[] = workouts.map((workout: Workout) => {
        return {
          type: EventType.workout,
          value: workout
        }
      })

      const wrappedCompetitions: WrappedEvent<EventType.competition, Competition>[] = competitions.map((competition: Competition) => {
        return {
          type: EventType.competition,
          value: competition
        }
      })

      const sortedEvents: SomeWrappedEvent[] = [ ...wrappedWorkouts, ...wrappedCompetitions ]
        .sort((a: SomeWrappedEvent, b: SomeWrappedEvent) =>
          new Date(a.value.startDate).getTime() - new Date(b.value.startDate).getTime())

      const eventsCalendar: EventListByDay[] = []

      let currentDate: null | ISO8601 = null
      let currentCalendarItemIndex: number = 0

      sortedEvents.forEach((event: SomeWrappedEvent) => {
        if (currentDate === null) {
          currentDate = event.value.startDate

          eventsCalendar.push({
            date: event.value.startDate,
            events: [ event ]
          })
        } else {
          if (this.checkEqualDates(currentDate, event.value.startDate)) {
            eventsCalendar[ currentCalendarItemIndex ].events.push(event)
          } else {
            currentDate = event.value.startDate
            currentCalendarItemIndex += 1

            eventsCalendar.push({
              date: event.value.startDate,
              events: [ event ]
            })
          }
        }
      })

      return eventsCalendar
    })
  )

  constructor(private afficheService: AfficheService) {
  }

  public ngOnInit(): void {
  }

  private checkEqualDates(a: ISO8601, b: ISO8601): boolean {
    const firstDate: Date = new Date(a)
    const secondDate: Date = new Date(b)

    return firstDate.getFullYear() === secondDate.getFullYear() && firstDate.getMonth() === secondDate.getMonth() && firstDate.getDate() === secondDate.getDate()
  }

}
