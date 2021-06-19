import { CommonModule } from '@angular/common'
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { AuthInterceptor } from '../interceptors'
import { UserService } from './services'
import { CommunityService } from './services/community/community.service'
import { CompetitionService } from './services/competition/competition.service'
import { PostService } from './services/post/post.service'
import { RouteService } from './services/route/route.service'
import { WorkoutService } from './services/workout/workout.service'

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
    WorkoutService,
    CompetitionService,
    PostService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
})
export class DomainModule {
}
