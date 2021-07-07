import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { TuiMapperPipeModule } from '@taiga-ui/cdk'
import { TuiButtonModule, TuiDataListModule, TuiLinkModule, TuiLoaderModule, TuiTextfieldControllerModule } from '@taiga-ui/core'
import { TuiFilterModule, TuiInputModule, TuiSelectModule } from '@taiga-ui/kit'

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
    TuiLoaderModule
  ],
  providers: [
    CommunitySettingsGuard,
    CommunityStoreService
  ]
})
export class CommunitiesModule {
}
