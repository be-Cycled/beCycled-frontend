import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { EventFilterComponent } from './components/event-filter/event-filter.component'
import { ReactiveFormsModule } from '@angular/forms'
import { TuiFilterModule } from '@taiga-ui/kit'


@NgModule({
  declarations: [
    EventFilterComponent
  ],
  exports: [
    EventFilterComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TuiFilterModule
  ]
})
export class EventFilterModule {
}
