import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'
import { EventType, ISO8601, SomeWrappedEvent, WrappedEvent } from '../../../../global/models'
import { FormControl, FormGroup } from '@angular/forms'
import { TuiHandler, TuiIdentityMatcher } from '@taiga-ui/cdk'
import { combineLatest, Observable } from 'rxjs'
import { Competition, SportType, Workout } from '../../../../global/domain'
import { map, shareReplay, startWith, tap } from 'rxjs/operators'
import { WorkoutService } from '../../../../global/domain/services/workout/workout.service'
import { CompetitionService } from '../../../../global/domain/services/competition/competition.service'

interface EventListByDay {
  date: ISO8601
  events: SomeWrappedEvent[]
}

interface FilterTag {
  title: string
  value: EventType | SportType
  count: number
}

@Component({
  selector: 'cy-feed-container',
  templateUrl: './feed-container.component.html',
  styleUrls: [ './feed-container.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeedContainerComponent implements OnInit {

  public items: FilterTag[] = [
    {
      title: 'Тренировки',
      value: EventType.workout,
      count: 0
    },
    {
      title: 'Соревнования',
      value: EventType.competition,
      count: 0
    },
    {
      title: 'Велосипед',
      value: SportType.bicycle,
      count: 0
    },
    {
      title: 'Роликовые коньки',
      value: SportType.rollerblade,
      count: 0
    },
    {
      title: 'Бег',
      value: SportType.run,
      count: 0
    },
    {
      title: 'Лыжи',
      value: SportType.ski,
      count: 0
    }
  ]

  public form: FormGroup = new FormGroup({
    filters: new FormControl()
  })

  public identityMatcher: TuiIdentityMatcher<FilterTag> = (
    item1: FilterTag,
    item2: FilterTag
  ) => item1.title === item2.title

  public events: Observable<[ Workout[], Competition[] ]> = combineLatest([
    this.workoutService.getWorkouts(),
    this.competitionService.getCompetitions()
  ]).pipe(
    tap(([ workouts, competitions ]: [ Workout[], Competition[] ]) => {
      const currentTime: number = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).getTime()
      const mixedEvents: (Workout | Competition)[] = [ ...workouts, ...competitions ]

      return this.items = [
        {
          title: 'Тренировки',
          value: EventType.workout,
          count: workouts.filter((item: Workout) => new Date(item.startDate).getTime() >= currentTime).length
        },
        {
          title: 'Соревнования',
          value: EventType.competition,
          count: competitions.filter((item: Competition) => new Date(item.startDate).getTime() >= currentTime).length
        },
        {
          title: 'Велосипед',
          value: SportType.bicycle,
          count: mixedEvents.filter((item: Competition | Workout) => item.sportType === SportType.bicycle).length
        },
        {
          title: 'Роликовые коньки',
          value: SportType.rollerblade,
          count: mixedEvents.filter((item: Competition | Workout) => item.sportType === SportType.rollerblade).length
        },
        {
          title: 'Бег',
          value: SportType.run,
          count: mixedEvents.filter((item: Competition | Workout) => item.sportType === SportType.run).length
        },
        {
          title: 'Лыжи',
          value: SportType.ski,
          count: mixedEvents.filter((item: Competition | Workout) => item.sportType === SportType.ski).length
        }
      ]
    }),
    shareReplay(1)
  )

  public calendar: Observable<EventListByDay[]> = combineLatest([
    this.events,
    this.form.valueChanges.pipe(
      startWith({ filters: [] })
    )
  ]).pipe(
    map(([ [ workouts, competitions ], { filters } ]: [ [ Workout[], Competition[] ], { filters: FilterTag[] } ]) => {
      const currentTime: number = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).getTime()
      let activatedSportTypeFilters: string[] = []

      const isWorkoutFilterActivated: boolean = filters.filter((item: FilterTag) => item.value === EventType.workout).length !== 0
      const isCompetitionFilterActivated: boolean = filters.filter((item: FilterTag) => item.value === EventType.competition).length !== 0

      if (filters.length > 0) {
        activatedSportTypeFilters = filters.filter((item: any) =>
          Object.values(SportType).includes(item.value)).map((item: any) => item.value)
      }

      const wrappedWorkouts: WrappedEvent<EventType.workout, Workout>[] = workouts
        .filter((item: Workout) => new Date(item.startDate).getTime() < currentTime)
        .map((workout: Workout) => {
          return {
            type: EventType.workout,
            value: workout
          }
        })

      const wrappedCompetitions: WrappedEvent<EventType.competition, Competition>[] = competitions
        .filter((item: Competition) => new Date(item.startDate).getTime() < currentTime)
        .map((competition: Competition) => {
          return {
            type: EventType.competition,
            value: competition
          }
        })

      let sortedEvents: SomeWrappedEvent[] = [ ...wrappedWorkouts, ...wrappedCompetitions ]

      if (isWorkoutFilterActivated && !isCompetitionFilterActivated) {
        sortedEvents = [ ...wrappedWorkouts ]
      }

      if (isCompetitionFilterActivated && !isWorkoutFilterActivated) {
        sortedEvents = [ ...wrappedCompetitions ]
      }

      if (activatedSportTypeFilters.length !== 0) {
        sortedEvents = sortedEvents.filter((item: SomeWrappedEvent) => activatedSportTypeFilters.includes(item.value.sportType))
      }

      sortedEvents = sortedEvents.slice()
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

  constructor(private workoutService: WorkoutService,
              private competitionService: CompetitionService) {
  }

  public ngOnInit(): void {
  }

  public badgeHandler: TuiHandler<Record<string, any>, number> = (item: Record<string, any>) => item.count

  private checkEqualDates(a: ISO8601, b: ISO8601): boolean {
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

}
