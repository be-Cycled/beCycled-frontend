import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { TuiLetModule, TuiMapperPipeModule } from '@taiga-ui/cdk'
import { TuiButtonModule, TuiDataListModule, TuiHintModule, TuiLinkModule, TuiLoaderModule, TuiSvgModule, TuiTextfieldControllerModule } from '@taiga-ui/core'
import { TuiAvatarModule, TuiDataListWrapperModule, TuiFilterModule, TuiInputModule, TuiIslandModule, TuiMultiSelectModule, TuiSelectModule, TuiTabsModule, TuiTextAreaModule } from '@taiga-ui/kit'
import { EventCardModule } from '../../global/cdk/components/event-card/event-card.module'
import { SafePipeModule } from '../../global/cdk/pipes/safe/safe-pipe.module'

import { CommunitiesRoutingModule } from './communities-routing.module'
import { CommunityReviewComponent } from './components/community-review/community-review.component'
import { CommunitySettingsComponent } from './components/community-settings/community-settings.component'
import { CommunityUsersComponent } from './components/community-users/community-users.component'
import { CommunitiesContainerComponent } from './containers/communities-container/communities-container.component'
import { SingleCommunityContainerComponent } from './containers/single-community-container/single-community-container.component'
import { CommunityStore } from './services/community-store/community-store.service'

@NgModule({
  declarations: [
    CommunitiesContainerComponent,
    SingleCommunityContainerComponent,
    CommunityReviewComponent,
    CommunitySettingsComponent,
    CommunityUsersComponent
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
    TuiHintModule,
    TuiTabsModule,
    TuiSvgModule,
    TuiTextAreaModule,
    TuiMultiSelectModule,
    SafePipeModule,
    TuiLoaderModule
  ],
  providers: [
    CommunityStore
  ]
})
export class CommunitiesModule { }
