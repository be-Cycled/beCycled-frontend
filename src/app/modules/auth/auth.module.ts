import { CommonModule } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { TuiButtonModule, TuiErrorModule, TuiLinkModule } from '@taiga-ui/core'
import { TuiFieldErrorModule, TuiInputModule, TuiInputPasswordModule } from '@taiga-ui/kit'

import { AuthRoutingModule } from './auth-routing.module'
import { LoginComponent } from './components/login/login.component'
import { RegistrationComponent } from './components/registration/registration.component'
import { AuthContainerComponent } from './containers/auth-container/auth-container.component'
import { AuthorizationService } from './services/authorization/authorization.service'

@NgModule({
  declarations: [
    AuthContainerComponent,
    LoginComponent,
    RegistrationComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    TuiInputModule,
    TuiFieldErrorModule,
    TuiLinkModule,
    TuiInputPasswordModule,
    ReactiveFormsModule,
    TuiButtonModule,
    HttpClientModule,
    TuiErrorModule
  ],
  providers: [
    AuthorizationService
  ]
})
export class AuthModule { }
