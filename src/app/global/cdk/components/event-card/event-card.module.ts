import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { TuiAvatarModule, TuiIslandModule } from '@taiga-ui/kit'
import { RouterModule } from '@angular/router'
import { TuiLetModule } from '@taiga-ui/cdk'
import { EventInfoComponent } from './event-info/event-info.component'
import { TuiButtonModule, TuiHintModule, TuiLinkModule } from '@taiga-ui/core'
import { EventCardComponent } from './event-card/event-card.component'
import { DomainModule } from '../../../domain/domain.module'
import { CommunityStoreService } from '../../../../modules/communities/services'

@NgModule({
  declarations: [
    EventInfoComponent,
    EventCardComponent
  ],
  imports: [
    CommonModule,
    TuiIslandModule,
    RouterModule,
    TuiLetModule,
    TuiButtonModule,
    TuiAvatarModule,
    DomainModule,
    TuiHintModule,
    TuiLinkModule
  ],
  exports: [
    EventInfoComponent,
    EventCardComponent
  ],
  providers: [
    CommunityStoreService
  ]
})
export class EventCardModule {
}
