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
    loadChildren: () => import('./modules/profile/profile.module').then((module: { ProfileModule: ProfileModule }) => module.ProfileModule)
  },
  {
    path: 'routes',
    loadChildren: () => import('./modules/routes/routes.module').then((module: { RoutesModule: RoutesModule }) => module.RoutesModule)
  }
]

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {
}
