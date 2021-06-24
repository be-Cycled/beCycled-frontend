import { ChangeDetectionStrategy, Component, forwardRef } from '@angular/core'
import { TuiHandler, TuiIdentityMatcher } from '@taiga-ui/cdk'
import { EventType } from '../../../../../models'
import { Competition, SportType, Workout } from '../../../../../domain'
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms'

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
export class EventFilterComponent implements ControlValueAccessor {

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

  public badgeHandler: TuiHandler<Record<string, any>, number> = (item: Record<string, any>) => item.count

  public setBadgesCount([ workouts, competitions ]: [ Workout[], Competition[] ]): void {
    this.items.find((filterTag: FilterTag) => filterTag.value === EventType.workout)!.count = workouts.length
    this.items.find((filterTag: FilterTag) => filterTag.value === EventType.competition)!.count = competitions.length;

    [ ...workouts, ...competitions ].forEach((event: Workout | Competition) => {
      const currentBadge: FilterTag | undefined = this.items.find((filterTag: FilterTag) => event.sportType === filterTag.value)

      if (typeof currentBadge !== 'undefined') {
        currentBadge.count += 1
      }
    })
  }

  public setValue(value: FilterTag[] | null): void {
    console.log(value)
  }

  public markAsTouched(): void {
    console.log('markAsTouched')
  }

  public registerOnChange(fn: (value: FilterTag[]) => void): void {
    this.setValue = fn
    console.log('registerOnChange')
  }

  public registerOnTouched(fn: () => void): void {
    this.markAsTouched = fn
    console.log('registerOnTouched')
  }

  public writeValue(obj: any): void {
    console.log('writeValue')
  }

}
