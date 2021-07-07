import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'

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
    CommunitiesRoutingModule
  ],
  providers: [
    CommunitySettingsGuard,
    CommunityStoreService
  ]
})
export class CommunitiesModule {
}
