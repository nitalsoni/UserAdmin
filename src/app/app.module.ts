import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { AppHeaderComponent } from './app-header/app-header.component';
import { AppLeftMenuComponent } from './app-left-menu/app-left-menu.component';
import { AppContentComponent } from './app-content/app-content.component';
import { UsersComponent } from './config-list/config-list.component';
import { UserConfigService } from './services/user-config.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AddConfigModalComponent } from './add-config-modal/add-config-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    AppHeaderComponent,
    AppLeftMenuComponent,
    AppContentComponent,
    UsersComponent,
    AddConfigModalComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    HttpClientModule,
    NgbModule
  ],
  providers: [
    UserConfigService,
    NgbActiveModal
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    AddConfigModalComponent
  ]
})
export class AppModule { }
