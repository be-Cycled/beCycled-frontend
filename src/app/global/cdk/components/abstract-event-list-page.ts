import { Directive } from '@angular/core'
import { combineLatest, defer, Observable, of } from 'rxjs'
import { map, startWith } from 'rxjs/operators'
import { BaseCompetition, BaseEventType, BaseWorkout, EventType, SportType } from '../../domain'
import { ISO8601 } from '../../models'
import { FormControl } from '@angular/forms'
import { TuiHandler } from '@taiga-ui/cdk'
import { FilterTag } from './event-filter'
import { detectBaseEventTypeByEventType, detectSportTypeByEventType } from '../../utils'

interface EventsByDay {
  date: ISO8601
  events: (BaseWorkout | BaseCompetition)[]
}

/**
 * Общая логика для афиши и ленты
 */
@Directive()
export abstract class AbstractEventListPage {
  public filters: FormControl = new FormControl()

  public events$: Observable<(BaseWorkout | BaseCompetition)[]> = of([])

  public calendar$: Observable<EventsByDay[]> = defer(() => combineLatest([
    this.events$,
    this.filters.valueChanges.pipe(
      startWith([])
    )
  ]).pipe(
    map(([ events, filters ]: [ (BaseWorkout | BaseCompetition)[], FilterTag[] ]) => {
      let activatedSportTypeFilters: string[] = []

      const isWorkoutFilterActivated: boolean = filters.filter((item: FilterTag) => item.value === BaseEventType.workout).length !== 0
      const isCompetitionFilterActivated: boolean = filters.filter((item: FilterTag) => item.value === BaseEventType.competition).length !== 0

      if (filters.length > 0) {
        activatedSportTypeFilters = filters.filter((item: any) =>
          Object.values(SportType).includes(item.value)).map((item: any) => item.value)
      }

      let sortedEvents: (BaseWorkout | BaseCompetition)[] = events

      if (isWorkoutFilterActivated && !isCompetitionFilterActivated) {
        sortedEvents = events.filter((event: BaseWorkout | BaseCompetition) =>
          detectBaseEventTypeByEventType(event.eventType) === BaseEventType.workout)
      }

      if (isCompetitionFilterActivated && !isWorkoutFilterActivated) {
        sortedEvents = events.filter((event: BaseWorkout | BaseCompetition) =>
          detectBaseEventTypeByEventType(event.eventType) === BaseEventType.competition)
      }

      if (activatedSportTypeFilters.length !== 0) {
        sortedEvents = sortedEvents.filter((event: BaseWorkout | BaseCompetition) =>
          activatedSportTypeFilters.includes(detectSportTypeByEventType(event.eventType)))
      }

      const eventsCalendar: EventsByDay[] = []

      let currentDate: null | ISO8601 = null
      let currentCalendarItemIndex: number = 0

      sortedEvents.forEach((event: BaseWorkout | BaseCompetition) => {
        if (currentDate === null) {
          currentDate = event.startDate

          eventsCalendar.push({
            date: event.startDate,
            events: [ event ]
          })
        } else {
          if (this.checkEqualDates(currentDate, event.startDate)) {
            eventsCalendar[ currentCalendarItemIndex ].events.push(event)
          } else {
            currentDate = event.startDate
            currentCalendarItemIndex += 1

            eventsCalendar.push({
              date: event.startDate,
              events: [ event ]
            })
          }
        }
      })

      return eventsCalendar
    })
  ))

  protected checkEqualDates(a: ISO8601, b: ISO8601): boolean {
    const firstDate: Date = new Date(a)
    const secondDate: Date = new Date(b)

    return firstDate.getFullYear() === secondDate.getFullYear() && firstDate.getMonth() === secondDate.getMonth() && firstDate.getDate() === secondDate.getDate()
  }

  public getWorkoutListDate(dateISO: string): string {
    const currentDate: Date = new Date()
    const date: Date = new Date(dateISO)

    if (currentDate.getFullYear() === date.getFullYear()) {
      return new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long' }).format(date)
    }

    return new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }).format(date)
  }

  /**
   * Хэндлер для подсчета элементов фильтром
   */
  public badgeHandler: TuiHandler<Record<string, any>, number> = (item: Record<string, any>) => item.count

  public detectBaseEventTypeByEventType(eventType: EventType): BaseEventType {
    return detectBaseEventTypeByEventType(eventType)
  }
}
