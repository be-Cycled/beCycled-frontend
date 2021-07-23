import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { TuiButtonModule } from '@taiga-ui/core'
import { ToolbarComponent } from './components/toolbar/toolbar.component'
import { ToolbarService } from './services/toolbar/toolbar.service'

@NgModule({
  declarations: [
    ToolbarComponent
  ],
  imports: [
    CommonModule,
    TuiButtonModule
  ],
  exports: [
    ToolbarComponent
  ],
  providers: [
    ToolbarService
  ]
})
export class ToolbarModule {
}
