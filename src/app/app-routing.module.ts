import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserListComponent } from './user-list/user-list.component';
import { UsersComponent } from './config-list/config-list.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  { path: 'config-list/:userid/:screen', component: UsersComponent },
  { path: 'config-list/:userid', component: UsersComponent },
  { path: 'config-list', component: UsersComponent },
  { path: 'user-list', component: UserListComponent },
  { path: 'page-not-found', component: PageNotFoundComponent },
  { path: '', redirectTo: '/config-list', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
