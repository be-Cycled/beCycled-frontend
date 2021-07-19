import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { TuiLetModule } from '@taiga-ui/cdk'
import { TuiIslandModule } from '@taiga-ui/kit'
import { NgxMapboxGLModule } from 'ngx-mapbox-gl'

import { CompetitionPageRoutingModule } from './competition-page-routing.module'
import { CompetitionPageComponent } from './components/competition-page/competition-page.component'
import { TuiButtonModule, TuiDataListModule, TuiHostedDropdownModule } from '@taiga-ui/core'

@NgModule({
  declarations: [
    CompetitionPageComponent
  ],
  imports: [
    CommonModule,
    CompetitionPageRoutingModule,
    TuiIslandModule,
    NgxMapboxGLModule,
    TuiLetModule,
    TuiHostedDropdownModule,
    TuiDataListModule,
    TuiButtonModule
  ]
})
export class CompetitionPageModule {
}
