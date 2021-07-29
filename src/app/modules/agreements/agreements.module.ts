import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { TuiLinkModule } from '@taiga-ui/core'

import { AgreementsRoutingModule } from './agreements-routing.module'
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component'
import { TermsOfServiceComponent } from './components/terms-of-service/terms-of-service.component'

@NgModule({
  declarations: [
    PrivacyPolicyComponent,
    TermsOfServiceComponent
  ],
  imports: [
    CommonModule,
    AgreementsRoutingModule,
    TuiLinkModule
  ]
})
export class AgreementsModule {
}
