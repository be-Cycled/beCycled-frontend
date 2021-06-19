import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { CompetitionPageComponent } from './components/competition-page/competition-page.component'

const routes: Routes = [
  {
    path: ':id',
    component: CompetitionPageComponent
  }
]

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class CompetitionPageRoutingModule {
}
