import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { TuiButtonModule, TuiDataListModule, TuiHostedDropdownModule, TuiLinkModule } from '@taiga-ui/core'
import { TuiAvatarModule } from '@taiga-ui/kit'
import { HeaderComponent } from './components/header/header.component'

@NgModule({
  declarations: [
    HeaderComponent
  ],
  exports: [
    HeaderComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    TuiHostedDropdownModule,
    TuiAvatarModule,
    TuiDataListModule,
    TuiButtonModule,
    TuiLinkModule
  ]
})
export class HeaderModule {
}
