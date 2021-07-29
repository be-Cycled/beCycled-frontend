import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component'
import { TermsOfServiceComponent } from './components/terms-of-service/terms-of-service.component'

const routes: Routes = [
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent
  },
  {
    path: 'terms-of-service',
    component: TermsOfServiceComponent
  }
]

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class AgreementsRoutingModule {
}
