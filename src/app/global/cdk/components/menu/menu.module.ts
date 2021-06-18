import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { MenuComponent } from './components/menu/menu.component'


@NgModule({
  declarations: [
    MenuComponent
  ],
  exports: [
    MenuComponent
  ],
  imports: [
    CommonModule
  ]
})
export class MenuModule { }
