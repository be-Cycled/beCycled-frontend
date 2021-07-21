import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { TuiLetModule, TuiMapperPipeModule } from '@taiga-ui/cdk'
import { TuiButtonModule, TuiDataListModule, TuiGroupModule, TuiHintModule, TuiLabelModule, TuiLinkModule, TuiLoaderModule, TuiSvgModule, TuiTextfieldControllerModule } from '@taiga-ui/core'
import {
  TuiAvatarModule,
  TuiCheckboxBlockModule,
  TuiDataListWrapperModule,
  TuiFieldErrorModule,
  TuiFilterModule,
  TuiInputFileModule,
  TuiInputModule,
  TuiIslandModule,
  TuiMultiSelectModule,
  TuiRadioBlockModule,
  TuiSelectModule,
  TuiTabsModule,
  TuiTextAreaModule
} from '@taiga-ui/kit'
import { EventCardModule } from '../../global/cdk/components/event-card/event-card.module'
import { SafePipeModule } from '../../global/cdk/pipes/safe/safe-pipe.module'
import { ImageNetworkService } from '../../global/services'

import { CommunitiesRoutingModule } from './communities-routing.module'
import { CommunitySingleMainComponent, CommunitySingleSettingsComponent, CommunitySingleUsersComponent } from './components'
import { CommunityCreateContainerComponent, CommunityListContainerComponent, CommunitySingleContainerComponent } from './containers'
import { CommunitySettingsGuard } from './guards'
import { CommunityStoreService } from './services'

@NgModule({
  declarations: [
    CommunityListContainerComponent,
    CommunitySingleContainerComponent,
    CommunitySingleMainComponent,
    CommunitySingleUsersComponent,
    CommunitySingleSettingsComponent,
    CommunityCreateContainerComponent
  ],
  imports: [
    CommonModule,
    CommunitiesRoutingModule,
    TuiButtonModule,
    ReactiveFormsModule,
    TuiInputModule,
    TuiSelectModule,
    TuiTextfieldControllerModule,
    TuiDataListModule,
    TuiFilterModule,
    TuiLinkModule,
    TuiMapperPipeModule,
    TuiLoaderModule,
    SafePipeModule,
    TuiTabsModule,
    TuiLetModule,
    EventCardModule,
    TuiIslandModule,
    TuiSvgModule,
    TuiHintModule,
    TuiAvatarModule,
    TuiTextAreaModule,
    TuiInputFileModule,
    TuiGroupModule,
    TuiRadioBlockModule,
    TuiCheckboxBlockModule,
    TuiLabelModule,
    TuiFieldErrorModule,
    TuiDataListWrapperModule,
    TuiMultiSelectModule
  ],
  providers: [
    CommunitySettingsGuard,
    CommunityStoreService,
    ImageNetworkService
  ]
})
export class CommunitiesModule {
}
