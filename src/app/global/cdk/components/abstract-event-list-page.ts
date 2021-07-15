import { Directive } from '@angular/core'
import { combineLatest, Observable, of } from 'rxjs'
import { map, startWith } from 'rxjs/operators'
import { Competition, EventType, SportType, Workout } from '../../domain'
import { ISO8601 } from '../../models'
import { FormControl } from '@angular/forms'
import { TuiHandler } from '@taiga-ui/cdk'
import { FilterTag } from './event-filter'

interface EventsByDay {
  date: ISO8601
  events: (Workout | Competition)[]
}

/**
 * Общая логика для афиши и ленты
 */
@Directive()
export class AbstractEventListPage {
  public filters: FormControl = new FormControl()

  public events$: Observable<(Workout | Competition)[]> = of([])

  public calendar$: Observable<EventsByDay[]> = combineLatest([
    this.events$,
    this.filters.valueChanges.pipe(
      startWith([])
    )
  ]).pipe(
    map(([ events, filters ]: [ (Workout | Competition)[], FilterTag[] ]) => {
      let activatedSportTypeFilters: string[] = []

      const isWorkoutFilterActivated: boolean = filters.filter((item: FilterTag) => item.value === EventType.workout).length !== 0
      const isCompetitionFilterActivated: boolean = filters.filter((item: FilterTag) => item.value === EventType.competition).length !== 0

      if (filters.length > 0) {
        activatedSportTypeFilters = filters.filter((item: any) =>
          Object.values(SportType).includes(item.value)).map((item: any) => item.value)
      }

      let sortedEvents: (Workout | Competition)[] = events

      if (isWorkoutFilterActivated && !isCompetitionFilterActivated) {
        sortedEvents = events.filter((event: Workout | Competition) => event.eventType === EventType.workout)
      }

      if (isCompetitionFilterActivated && !isWorkoutFilterActivated) {
        sortedEvents = events.filter((event: Workout | Competition) => event.eventType === EventType.competition)
      }

      if (activatedSportTypeFilters.length !== 0) {
        sortedEvents = sortedEvents.filter((event: Workout | Competition) => activatedSportTypeFilters.includes(event.sportType))
      }

      const eventsCalendar: EventsByDay[] = []

      let currentDate: null | ISO8601 = null
      let currentCalendarItemIndex: number = 0

      sortedEvents.forEach((event: Workout | Competition) => {
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
  )

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
}
