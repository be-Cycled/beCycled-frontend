import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { TuiLetModule, TuiMapperPipeModule } from '@taiga-ui/cdk'
import { TuiButtonModule, TuiDataListModule, TuiHintModule, TuiLinkModule, TuiTextfieldControllerModule } from '@taiga-ui/core'
import { TuiAvatarModule, TuiDataListWrapperModule, TuiFilterModule, TuiInputModule, TuiIslandModule, TuiSelectModule } from '@taiga-ui/kit'
import { EventCardModule } from '../../global/cdk/components/event-card/event-card.module'

import { CommunitiesRoutingModule } from './communities-routing.module'
import { CommunityCreationComponent } from './components/community-creation/community-creation.component'
import { CommunitiesContainerComponent } from './containers/communities-container/communities-container.component'
import { SingleCommunityContainerComponent } from './containers/single-community-container/single-community-container.component'
import { SingleCommunityResolver } from './resolvers/single-community/single-community.resolver'

@NgModule({
  declarations: [
    CommunitiesContainerComponent,
    SingleCommunityContainerComponent,
    CommunityCreationComponent
  ],
  imports: [
    CommonModule,
    CommunitiesRoutingModule,
    TuiButtonModule,
    TuiInputModule,
    TuiFilterModule,
    TuiSelectModule,
    TuiDataListWrapperModule,
    TuiTextfieldControllerModule,
    ReactiveFormsModule,
    TuiDataListModule,
    TuiMapperPipeModule,
    TuiLinkModule,
    TuiIslandModule,
    EventCardModule,
    TuiLetModule,
    TuiAvatarModule,
    TuiHintModule
  ],
  providers: [
    SingleCommunityResolver
  ]
})
export class CommunitiesModule { }
