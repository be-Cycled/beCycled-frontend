import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { UserByTokenResolver } from './global/resolvers'
import { AfficheModule } from './modules/affiche/affiche.module'
import { AuthModule } from './modules/auth/auth.module'
import { CommunitiesModule } from './modules/communities/communities.module'
import { FeedModule } from './modules/feed/feed.module'
import { PostsModule } from './modules/posts/posts.module'
import { ProfileModule } from './modules/profile/profile.module'
import { RoutesModule } from './modules/routes/routes.module'
import { WorkoutPageModule } from './modules/workout-page/workout-page.module'
import { CompetitionPageModule } from './modules/competition-page/competition-page.module'
import { AddEventModule } from './modules/add-event/add-event.module'

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./modules/affiche/affiche.module').then((module: { AfficheModule: AfficheModule }) => module.AfficheModule),
    resolve: {
      user: UserByTokenResolver
    }
  },
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.module').then((module: { AuthModule: AuthModule }) => module.AuthModule)
  },
  {
    path: 'feed',
    loadChildren: () => import('./modules/feed/feed.module').then((module: { FeedModule: FeedModule }) => module.FeedModule),
    resolve: {
      user: UserByTokenResolver
    }
  },
  {
    path: 'communities',
    loadChildren: () => import('./modules/communities/communities.module').then((module: { CommunitiesModule: CommunitiesModule }) => module.CommunitiesModule),
    resolve: {
      user: UserByTokenResolver
    }
  },
  {
    path: 'posts',
    loadChildren: () => import('./modules/posts/posts.module').then((module: { PostsModule: PostsModule }) => module.PostsModule),
    resolve: {
      user: UserByTokenResolver
    }
  },
  {
    path: 'users',
    loadChildren: () => import('./modules/profile/profile.module').then((module: { ProfileModule: ProfileModule }) => module.ProfileModule),
    resolve: {
      user: UserByTokenResolver
    }
  },
  {
    path: 'routes',
    loadChildren: () => import('./modules/routes/routes.module').then((module: { RoutesModule: RoutesModule }) => module.RoutesModule),
    resolve: {
      user: UserByTokenResolver
    }
  },
  {
    path: 'workouts',
    loadChildren: () => import('./modules/workout-page/workout-page.module').then((module: { WorkoutPageModule: WorkoutPageModule }) => module.WorkoutPageModule)
  },
  {
    path: 'competitions',
    loadChildren: () => import('./modules/competition-page/competition-page.module').then((module: { CompetitionPageModule: CompetitionPageModule }) => module.CompetitionPageModule)
  },
  {
    path: 'add-event',
    loadChildren: () => import('./modules/add-event/add-event.module').then((module: { AddEventModule: AddEventModule }) => module.AddEventModule)
  }
]

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {
}
