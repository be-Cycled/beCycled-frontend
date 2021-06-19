import { CommonModule } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { UserService } from './services'
import { RouteService } from './services/route/route.service'
import { CommunityService } from './services/community/community.service'

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    UserService,
    RouteService,
    CommunityService
  ]
})
export class DomainModule {
}
