import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { TuiLetModule } from '@taiga-ui/cdk'
import { TuiIslandModule } from '@taiga-ui/kit'
import { NgxMapboxGLModule } from 'ngx-mapbox-gl'

import { CompetitionPageRoutingModule } from './competition-page-routing.module'
import { CompetitionPageComponent } from './components/competition-page/competition-page.component'

@NgModule({
  declarations: [
    CompetitionPageComponent
  ],
  imports: [
    CommonModule,
    CompetitionPageRoutingModule,
    TuiIslandModule,
    NgxMapboxGLModule,
    TuiLetModule
  ]
})
export class CompetitionPageModule {
}
