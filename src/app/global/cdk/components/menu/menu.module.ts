import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { TuiButtonModule, TuiLinkModule } from '@taiga-ui/core'
import { TuiAvatarModule } from '@taiga-ui/kit'
import { PolymorpheusModule } from '@tinkoff/ng-polymorpheus'
import { MenuComponent } from './components/menu/menu.component'

@NgModule({
  declarations: [
    MenuComponent
  ],
  exports: [
    MenuComponent
  ],
  imports: [
    CommonModule,
    TuiLinkModule,
    RouterModule,
    TuiButtonModule,
    PolymorpheusModule,
    TuiAvatarModule
  ]
})
export class MenuModule { }
