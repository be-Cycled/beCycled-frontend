import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { TuiLetModule } from '@taiga-ui/cdk'
import { TuiAvatarModule, TuiIslandModule } from '@taiga-ui/kit'
import { NgxMapboxGLModule } from 'ngx-mapbox-gl'

import { CompetitionPageRoutingModule } from './competition-page-routing.module'
import { CompetitionPageComponent } from './components/competition-page/competition-page.component'
import { TuiButtonModule, TuiDataListModule, TuiHostedDropdownModule } from '@taiga-ui/core'
import { EventCardModule } from '../../global/cdk/components/event-card/event-card.module'

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
    TuiButtonModule,
    EventCardModule,
    TuiAvatarModule
  ]
})
export class CompetitionPageModule {
}
