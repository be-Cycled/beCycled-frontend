import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AddEventComponent } from './components/add-event/add-event.component'

const routes: Routes = [
  {
    path: '',
    component: AddEventComponent
  }
]

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class AddEventRoutingModule {
}
