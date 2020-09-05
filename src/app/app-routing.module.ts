import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserListComponent } from './UI/user-list/user-list.component';
import { UsersComponent } from './UI/config-list/config-list.component';
import { PageNotFoundComponent } from './UI/page-not-found/page-not-found.component';
import { ConfigAuditComponent } from './UI/config-audit/config-audit.component';
import { DashboardComponent } from './UI/dashboard/dashboard.component';

const routes: Routes = [
  { path: 'config-list/:userid/:screenid', component: UsersComponent },
  { path: 'config-list/:userid', component: UsersComponent },
  { path: 'config-list', component: UsersComponent },
  { path: 'user-list', component: UserListComponent },
  { path: 'audit-config-list', component: ConfigAuditComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'page-not-found', component: PageNotFoundComponent },
  { path: '', redirectTo: '/config-list', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
