import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { WorkoutPageComponent } from './workout-page/workout-page.component'

const routes: Routes = [
  {
    path: ':id',
    component: WorkoutPageComponent
  }
]

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class WorkoutPageRoutingModule {
}
