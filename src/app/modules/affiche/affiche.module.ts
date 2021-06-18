import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'

import { AfficheRoutingModule } from './affiche-routing.module'
import { AfficheContainerComponent } from './containers/affiche-container/affiche-container.component'


@NgModule({
  declarations: [
    AfficheContainerComponent
  ],
  imports: [
    CommonModule,
    AfficheRoutingModule
  ]
})
export class AfficheModule { }
