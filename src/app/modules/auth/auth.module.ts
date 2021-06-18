import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'

import { AuthRoutingModule } from './auth-routing.module'
import { AuthContainerComponent } from './containers/auth-container/auth-container.component'


@NgModule({
  declarations: [
    AuthContainerComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }
