import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppHeaderComponent } from './app-header/app-header.component';
import { AppLeftMenuComponent } from './app-left-menu/app-left-menu.component';
import { AppContentComponent } from './app-content/app-content.component';
import { UsersComponent } from './users/users.component';
import { UserConfigService } from './services/user-config.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';


@NgModule({
  declarations: [
    AppComponent,
    AppHeaderComponent,
    AppLeftMenuComponent,
    AppContentComponent,
    UsersComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [UserConfigService],
  bootstrap: [AppComponent]
})
export class AppModule { }
