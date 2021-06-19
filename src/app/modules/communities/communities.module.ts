import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { TuiMapperPipeModule } from '@taiga-ui/cdk'
import { TuiButtonModule, TuiDataListModule, TuiLinkModule, TuiTextfieldControllerModule } from '@taiga-ui/core'
import { TuiDataListWrapperModule, TuiFilterModule, TuiInputModule, TuiSelectModule } from '@taiga-ui/kit'

import { CommunitiesRoutingModule } from './communities-routing.module'
import { CommunityCreationComponent } from './components/community-creation/community-creation.component'
import { CommunitiesContainerComponent } from './containers/communities-container/communities-container.component'
import { SingleCommunityContainerComponent } from './containers/single-community-container/single-community-container.component'


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
    TuiLinkModule
  ]
})
export class CommunitiesModule { }
