import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AfficheModule } from './modules/affiche/affiche.module'
import { AuthModule } from './modules/auth/auth.module'
import { CommunitiesModule } from './modules/communities/communities.module'
import { FeedModule } from './modules/feed/feed.module'
import { PostsModule } from './modules/posts/posts.module'
import { ProfileModule } from './modules/profile/profile.module'

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./modules/affiche/affiche.module').then((module: { AfficheModule: AfficheModule }) => module.AfficheModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.module').then((module: { AuthModule: AuthModule }) => module.AuthModule)
  },
  {
    path: 'feed',
    loadChildren: () => import('./modules/feed/feed.module').then((module: { FeedModule: FeedModule }) => module.FeedModule)
  },
  {
    path: 'communities',
    loadChildren: () => import('./modules/communities/communities.module').then((module: { CommunitiesModule: CommunitiesModule }) => module.CommunitiesModule)
  },
  {
    path: 'posts',
    loadChildren: () => import('./modules/posts/posts.module').then((module: { PostsModule: PostsModule }) => module.PostsModule)
  },
  {
    path: 'users',
    loadChildren: () => import('./modules/profile/profile.module').then((module: { ProfileModule: ProfileModule }) => module.ProfileModule)
  }
]

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {
}
