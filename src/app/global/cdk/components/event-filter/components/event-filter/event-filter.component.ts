import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges
} from '@angular/core'
import { TuiHandler, TuiIdentityMatcher } from '@taiga-ui/cdk'
import { BaseCompetition, BaseEventType, BaseWorkout, SportType } from '../../../../../domain'
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms'
import { takeUntil, tap } from 'rxjs/operators'
import { Observable, Subject } from 'rxjs'
import { ActivatedRoute, Params, Router } from '@angular/router'
import { FilterTag, FilterType } from '../../models'
import {
  checkCompetition,
  checkWorkout,
  detectBaseEventTypeByEventType,
  detectSportTypeByEventType
} from '../../../../../utils'

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
export class EventFilterComponent implements ControlValueAccessor, OnChanges, OnDestroy {
  private destroy$: Subject<void> = new Subject()

  public queryParams: Params | null = null

  private eventTypeItems: FilterTag[] = [
    {
      title: 'Тренировки',
      value: BaseEventType.workout,
      count: 0
    },
    {
      title: 'Соревнования',
      value: BaseEventType.competition,
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
      const selectedFilterValues: string[] = filters.map((item: FilterTag) => item.value)

      if (selectedFilterValues.includes(BaseEventType.workout) && !selectedFilterValues.includes(BaseEventType.competition)) {
        this.resetSportTypeBadgeCount()

        this.updateSportTypeBadgesCount(this.events.filter((event: BaseWorkout | BaseCompetition) => checkWorkout(event.eventType)))
      } else if (selectedFilterValues.includes(BaseEventType.competition) && !selectedFilterValues.includes(BaseEventType.workout)) {
        this.resetSportTypeBadgeCount()

        this.updateSportTypeBadgesCount(this.events.filter((event: BaseWorkout | BaseCompetition) => checkCompetition(event.eventType)))
      } else {
        this.resetSportTypeBadgeCount()
        this.resetBaseEventTypeBadgeCount()

        this.updateAllBadgesCount(this.events)
      }
    })
  )

  /**
   * Ивенты нужны только для актуализации данных счетчиков в тегах
   */
  @Input()
  public events: (BaseWorkout | BaseCompetition)[] = []

  @Input()
  public filterType: FilterType = 'all'

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router) {
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

    this.badgeSportTypeCountChanges$.subscribe()

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

  public ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  private updateSportTypeBadgesCount(events: BaseWorkout[] | BaseCompetition[]): void {
    events.forEach((event: BaseWorkout | BaseCompetition) => {
      const sportType: SportType = detectSportTypeByEventType(event.eventType)
      const currentBadge: FilterTag | undefined = this.items.find((filterTag: FilterTag) => sportType === filterTag.value)

      if (typeof currentBadge !== 'undefined') {
        currentBadge.count += 1
      }
    })
  }

  private updateAllBadgesCount(events: (BaseWorkout | BaseCompetition)[]): void {
    events.forEach((event: BaseWorkout | BaseCompetition) => {
      const baseEventType: BaseEventType = detectBaseEventTypeByEventType(event.eventType)
      const sportType: SportType = detectSportTypeByEventType(event.eventType)

      const currentSportTypeTag: FilterTag | undefined = this.items.find((filterTag: FilterTag) => sportType === filterTag.value)
      const currentEventTypeTag: FilterTag | undefined = this.items.find((filterTag: FilterTag) => baseEventType === filterTag.value)

      if (typeof currentSportTypeTag !== 'undefined') {
        currentSportTypeTag.count += 1
      }

      if (typeof currentEventTypeTag !== 'undefined') {
        currentEventTypeTag.count += 1
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

  private resetBaseEventTypeBadgeCount(): void {
    const badges: string[] = Object.values(BaseEventType)

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
    const selectedFilters: (SportType | BaseEventType)[] = filters.map((item: FilterTag) => item.value)

    if (selectedFilters.length > 0) {
      const selectedEventFilters: (BaseEventType | SportType)[] = selectedFilters.filter((item: BaseEventType | SportType) =>
        Object.values(BaseEventType).includes(item as BaseEventType))

      const selectedSportFilters: (BaseEventType | SportType)[] = selectedFilters.filter((item: BaseEventType | SportType) =>
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
