import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'
import { FormControl } from '@angular/forms'
import { Title } from '@angular/platform-browser'
import { TuiHandler } from '@taiga-ui/cdk'
import { combineLatest, Observable } from 'rxjs'
import { map, shareReplay, startWith } from 'rxjs/operators'
import { Competition, SportType, Workout } from '../../../../global/domain'
import { CompetitionService } from '../../../../global/domain/services/competition/competition.service'
import { WorkoutService } from '../../../../global/domain/services/workout/workout.service'
import { EventType, ISO8601, SomeWrappedEvent, WrappedEvent } from '../../../../global/models'
import { UserHolderService } from '../../../../global/services'

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
  selector: 'cy-affiche-container',
  templateUrl: './affiche-container.component.html',
  styleUrls: [ './affiche-container.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AfficheContainerComponent implements OnInit {
  public isUserAuthorized$: Observable<boolean> = this.userHolderService.isUserAuthorizedChanges

  public filters: FormControl = new FormControl()

  public events$: Observable<[ Workout[], Competition[] ]> = combineLatest([
    this.workoutService.readWorkouts().pipe(
      map((workouts: Workout[]) => {
        const currentTime: number = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).getTime()

        return workouts.filter((item: Workout) => new Date(item.startDate).getTime() >= currentTime)
      })
    ),
    this.competitionService.readCompetitions().pipe(
      map((competitions: Competition[]) => {
        const currentTime: number = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).getTime()

        return competitions.filter((item: Workout) => new Date(item.startDate).getTime() >= currentTime)
      })
    )
  ]).pipe(
    shareReplay(1)
  )

  /**
   * TODO: Решить вопрос с дублированием этого кода в афише и ленте
   */
  public calendar$: Observable<EventListByDay[]> = combineLatest([
    this.events$,
    this.filters.valueChanges.pipe(
      startWith([])
    )
  ]).pipe(
    map(([ [ workouts, competitions ], filters ]: [ [ Workout[], Competition[] ], FilterTag[] ]) => {
      let activatedSportTypeFilters: string[] = []

      const isWorkoutFilterActivated: boolean = filters.filter((item: FilterTag) => item.value === EventType.workout).length !== 0
      const isCompetitionFilterActivated: boolean = filters.filter((item: FilterTag) => item.value === EventType.competition).length !== 0

      if (filters.length > 0) {
        activatedSportTypeFilters = filters.filter((item: any) =>
          Object.values(SportType).includes(item.value)).map((item: any) => item.value)
      }

      const wrappedWorkouts: WrappedEvent<EventType.workout, Workout>[] = workouts
        .map((workout: Workout) => {
          return {
            type: EventType.workout,
            value: workout
          }
        })

      const wrappedCompetitions: WrappedEvent<EventType.competition, Competition>[] = competitions
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
              private competitionService: CompetitionService,
              private title: Title,
              private userHolderService: UserHolderService) {
    this.title.setTitle(`Афиша`)
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
