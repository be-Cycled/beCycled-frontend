import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges
} from '@angular/core'
import { TuiHandler, TuiIdentityMatcher } from '@taiga-ui/cdk'
import { EventType } from '../../../../../models'
import { Competition, SportType, Workout } from '../../../../../domain'
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms'
import { takeUntil, tap } from 'rxjs/operators'
import { Observable, Subject } from 'rxjs'

interface FilterTag {
  title: string
  value: EventType | SportType
  count: number
}

@Component({
  selector: 'cy-event-filter',
  templateUrl: './event-filter.component.html',
  styleUrls: [ './event-filter.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EventFilterComponent),
      multi: true
    }
  ]
})
export class EventFilterComponent implements ControlValueAccessor, OnChanges, OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject()

  /**
   * TODO: Рассмотреть возможность разделения на две разных группы фильтров
   */
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

  /**
   * Поток, который следит за изменением выбранных фильтров и актуализирует счетчик в тегах
   */
  private badgeSportTypeCountChanges$: Observable<{ filters: FilterTag[] }> = this.form.valueChanges.pipe(
    takeUntil(this.destroy$),
    tap(({ filters }: { filters: FilterTag[] }) => {
      const selectedValues: string[] = filters.map((item: FilterTag) => item.value)

      if (selectedValues.includes(EventType.workout) && !selectedValues.includes(EventType.competition)) {
        this.resetSportTypeBadgeCount()

        this.updateSportTypeBadgesCount(this.events[ 0 ])
      } else if (selectedValues.includes(EventType.competition) && !selectedValues.includes(EventType.workout)) {
        this.resetSportTypeBadgeCount()

        this.updateSportTypeBadgesCount(this.events[ 1 ])
      } else {
        this.resetSportTypeBadgeCount()

        this.updateAllBadgesCount(this.events)
      }
    })
  )

  /**
   * Ивенты нужны только для актуализации данных счетчиков в тегах
   */
  @Input()
  public events: [ Workout[], Competition[] ] = [ [], [] ]

  public ngOnInit(): void {
    this.badgeSportTypeCountChanges$.subscribe()
  }

  public ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  public resetSportTypeBadgeCount(): void {
    const badges: string[] = Object.values(SportType)

    this.items.forEach((item: FilterTag) => {
      if (badges.includes(item.value)) {
        item.count = 0
      }
    })
  }

  public updateSportTypeBadgesCount(events: Workout[] | Competition[]): void {
    events.forEach((event: Workout | Competition) => {
      const currentBadge: FilterTag | undefined = this.items.find((filterTag: FilterTag) => event.sportType === filterTag.value)

      if (typeof currentBadge !== 'undefined') {
        currentBadge.count += 1
      }
    })
  }

  public updateAllBadgesCount([ workouts, competitions ]: [ Workout[], Competition[] ]): void {
    this.items.find((filterTag: FilterTag) => filterTag.value === EventType.workout)!.count = workouts.length
    this.items.find((filterTag: FilterTag) => filterTag.value === EventType.competition)!.count = competitions.length;

    [ ...workouts, ...competitions ].forEach((event: Workout | Competition) => {
      const currentBadge: FilterTag | undefined = this.items.find((filterTag: FilterTag) => event.sportType === filterTag.value)

      if (typeof currentBadge !== 'undefined') {
        currentBadge.count += 1
      }
    })
  }

  public onChanges(value: any): void {
  }

  public registerOnChange(fn: any): void {
    this.onChanges = fn
  }

  public registerOnTouched(fn: any): void {
  }

  public writeValue(obj: any): void {
  }

  public ngOnChanges({ events }: SimpleChanges): void {
    if (events.currentValue !== null) {
      this.updateAllBadgesCount(events.currentValue)

      this.form.get('filters')?.reset([])
    }
  }

  public identityMatcher: TuiIdentityMatcher<FilterTag> = (
    item1: FilterTag,
    item2: FilterTag
  ) => item1.title === item2.title

  public badgeHandler: TuiHandler<Record<string, any>, number> = (item: Record<string, any>) => item.count
}
