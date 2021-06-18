import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { HeaderComponent } from './components/header/header.component'

@NgModule({
  declarations: [
    HeaderComponent
  ],
  exports: [
    HeaderComponent
  ],
  imports: [
    CommonModule
  ]
})
export class HeaderModule {
}
