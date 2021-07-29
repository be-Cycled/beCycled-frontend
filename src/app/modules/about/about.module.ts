import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { TuiLinkModule } from '@taiga-ui/core'

import { AboutRoutingModule } from './about-routing.module'
import { AboutContainerComponent } from './containers/about-container/about-container.component'

@NgModule({
  declarations: [
    AboutContainerComponent
  ],
  imports: [
    CommonModule,
    AboutRoutingModule,
    TuiLinkModule
  ]
})
export class AboutModule {
}
