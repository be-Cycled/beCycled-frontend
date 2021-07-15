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
import { Competition, EventType, SportType, Workout } from '../../../../../domain'
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms'
import { takeUntil, tap } from 'rxjs/operators'
import { Observable, Subject } from 'rxjs'
import { ActivatedRoute, Params, Router } from '@angular/router'

interface FilterTag {
  title: string
  value: EventType | SportType
  count: number
}

export type FilterType = 'event' | 'sport' | 'all'

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

  public queryParams: Params | null = null

  private eventTypeItems: FilterTag[] = [
    {
      title: 'Тренировки',
      value: EventType.workout,
      count: 0
    },
    {
      title: 'Соревнования',
      value: EventType.competition,
      count: 0
    }
  ]

  private sportTypeItems: FilterTag[] = [
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

  public items: FilterTag[] = []

  public filters: FormControl = new FormControl()

  /**
   * Поток, который следит за изменением выбранных фильтров и актуализирует счетчик в тегах
   */
  private badgeSportTypeCountChanges$: Observable<FilterTag[]> = this.filters.valueChanges.pipe(
    takeUntil(this.destroy$),
    tap((filters: FilterTag[]) => {
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

  @Input()
  public filterType: FilterType = 'all'

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router) {
    this.activatedRoute.queryParams.pipe(
      takeUntil(this.destroy$),
      tap((params: Params) => {
        if (Object.keys(params).length > 0) {
          this.queryParams = params

          this.applyFilterFromQueryParams()
        } else {
          this.filters.reset([])
        }
      })
    ).subscribe()
  }

  public ngOnInit(): void {
    this.badgeSportTypeCountChanges$.subscribe()

    switch (this.filterType) {
      case 'event':
        this.items = this.eventTypeItems
        break
      case 'sport':
        this.items = this.sportTypeItems
        break
      case 'all':
      default:
        this.items = [ ...this.eventTypeItems, ...this.sportTypeItems ]
    }
  }

  public ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  private updateSportTypeBadgesCount(events: Workout[] | Competition[]): void {
    events.forEach((event: Workout | Competition) => {
      const currentBadge: FilterTag | undefined = this.items.find((filterTag: FilterTag) => event.sportType === filterTag.value)

      if (typeof currentBadge !== 'undefined') {
        currentBadge.count += 1
      }
    })
  }

  private updateAllBadgesCount([ workouts, competitions ]: [ Workout[], Competition[] ]): void {
    this.items.find((filterTag: FilterTag) => filterTag.value === EventType.workout)!.count = workouts.length
    this.items.find((filterTag: FilterTag) => filterTag.value === EventType.competition)!.count = competitions.length;

    [ ...workouts, ...competitions ].forEach((event: Workout | Competition) => {
      const currentBadge: FilterTag | undefined = this.items.find((filterTag: FilterTag) => event.sportType === filterTag.value)

      if (typeof currentBadge !== 'undefined') {
        currentBadge.count += 1
      }
    })
  }

  private resetSportTypeBadgeCount(): void {
    const badges: string[] = Object.values(SportType)

    this.items.forEach((item: FilterTag) => {
      if (badges.includes(item.value)) {
        item.count = 0
      }
    })
  }

  private applyFilterFromQueryParams(): void {
    /**
     * Логика установки предварительно выбранных значений фильтра
     */
    if (this.queryParams !== null) {
      let selectedFilters: string[] = []

      /**
       * При установке квери параметров, массив собираю в строку при помощи join(),
       * следовательно, здесь я его разбираю на массив при помощи split()
       */
      if (typeof this.queryParams[ 'sport-type' ] !== 'undefined') {
        selectedFilters = [ ...selectedFilters, ...this.queryParams[ 'sport-type' ].split(',') ]
      }

      if (typeof this.queryParams[ 'event-type' ] !== 'undefined') {
        selectedFilters = [ ...selectedFilters, ...this.queryParams[ 'event-type' ].split(',') ]
      }

      const selectedItems: FilterTag[] = this.items.filter((item: FilterTag) => selectedFilters.includes(item.value))

      this.filters.setValue(selectedItems)
    } else {
      this.filters.reset([])
    }
  }

  private valueAccessorCallBack(value: any): void {

  }

  public onChanges(value: any): void {
    const filters: FilterTag[] = this.filters.value

    /**
     * Логика обновления квери параметров при активации фильтра
     */
    const selectedFilters: (EventType | SportType)[] = filters.map((item: FilterTag) => item.value)

    if (selectedFilters.length > 0) {
      const selectedEventFilters: (EventType | SportType)[] = selectedFilters.filter((item: EventType | SportType) =>
        Object.values(EventType).includes(item as EventType))

      const selectedSportFilters: (EventType | SportType)[] = selectedFilters.filter((item: EventType | SportType) =>
        Object.values(SportType).includes(item as SportType))

      let queryParams: Params = {}

      if (selectedEventFilters.length > 0) {
        queryParams = {
          'event-type': selectedEventFilters.join(',')
        }
      }

      if (selectedSportFilters.length > 0) {
        queryParams = {
          ...queryParams,
          'sport-type': selectedSportFilters.join(',')
        }
      }

      this.router.navigate(
        [],
        {
          relativeTo: this.activatedRoute,
          queryParams: queryParams
        })
    } else {
      this.queryParams = null

      this.router.navigate(
        [],
        {
          relativeTo: this.activatedRoute
        })
    }

    this.valueAccessorCallBack(value)
  }

  public registerOnChange(fn: any): void {
    this.valueAccessorCallBack = fn
  }

  public registerOnTouched(fn: any): void {
  }

  public writeValue(obj: any): void {
  }

  public ngOnChanges({ events }: SimpleChanges): void {
    if (events.currentValue !== null) {
      this.updateAllBadgesCount(events.currentValue)

      this.applyFilterFromQueryParams()
    }
  }

  public identityMatcher: TuiIdentityMatcher<FilterTag> = (
    item1: FilterTag,
    item2: FilterTag
  ) => item1.title === item2.title

  public badgeHandler: TuiHandler<Record<string, any>, number> = (item: Record<string, any>) => item.count
}
