import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { TuiFilterModule } from '@taiga-ui/kit'
import { EventFilterComponent } from './components/event-filter/event-filter.component'

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
