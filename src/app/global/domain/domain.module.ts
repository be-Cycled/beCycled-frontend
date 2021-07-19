import { CommonModule } from '@angular/common'
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { AuthInterceptor } from '../interceptors'
import { UserService } from './services'
import { CommunityService } from './services/community/community.service'
import { PostService } from './services/post/post.service'
import { RouteService } from './services/route/route.service'
import { TelemetryService } from './services/telemetry/telemetry.service'
import { TrackerService } from './services/tracker/tracker.service'
import { EventService } from './services/event/event.service'

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    UserService,
    RouteService,
    CommunityService,
    PostService,
    TrackerService,
    TelemetryService,
    EventService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
})
export class DomainModule {
}
