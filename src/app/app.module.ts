import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, ErrorHandler } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from "ngx-spinner";
import { ChartsModule } from 'ng2-charts';
import { StorageServiceModule } from 'ngx-webstorage-service';
import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from './app.component';
import { AppHeaderComponent } from './app-header/app-header.component';
import { AppLeftMenuComponent } from './app-left-menu/app-left-menu.component';
import { AppContentComponent } from './app-content/app-content.component';
import { UsersComponent } from './config-list/config-list.component';
import { UserConfigService } from './services/user-config.service';
import { SectorInfoService } from './services/sector-info.service'
import { UsageInfoService } from './services/usage-info.service';
import { ScreenConfigItemService } from './services/screen-config-item.service'
import { AddConfigModalComponent } from './add-config-modal/add-config-modal.component';
import { GlobalVars } from './services/app.global';
import { UserListComponent } from './user-list/user-list.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AddSectorComponent } from './add-sector/add-sector.component';
import { AddUserComponent } from './add-user/add-user.component';
import { AppHttpInterceptorService } from "./services/app-http-interceptor.service";
import { GlobalErrorHandlerService } from "./services/global-error-handler.service";
import { ConfigAuditComponent } from './config-audit/config-audit.component';
import { ActionBtnRendererComponent } from './action-btn-renderer/action-btn-renderer.component';
import { GlobalEventService } from './services/global-event.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardService } from './services/dashboard.service';
import { NgxTypeaheadModule } from "ngx-typeahead";
import { AgGridModule } from 'ag-grid-angular';

@NgModule({
  declarations: [
    AppComponent,
    AppHeaderComponent,
    AppLeftMenuComponent,
    AppContentComponent,
    UsersComponent,
    AddConfigModalComponent,
    UserListComponent,
    PageNotFoundComponent,
    AddSectorComponent,
    AddUserComponent,
    ConfigAuditComponent,
    ActionBtnRendererComponent,
    DashboardComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    AppRoutingModule,
    ChartsModule,
    AgGridModule.withComponents([ActionBtnRendererComponent]),
    StorageServiceModule,
    NgxTypeaheadModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      progressBar: true,
      closeButton: true
    })
  ],
  providers: [
    UserConfigService,
    SectorInfoService,
    UsageInfoService,
    ScreenConfigItemService,
    DashboardService,
    GlobalEventService,
    NgbActiveModal,
    GlobalVars,
    { provide: HTTP_INTERCEPTORS, useClass: AppHttpInterceptorService, multi: true },
    { provide: ErrorHandler, useClass: GlobalErrorHandlerService }
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    AddConfigModalComponent,
    AddSectorComponent,
    AddUserComponent
  ]
})
export class AppModule {
  constructor(private globalVars: GlobalVars) {
    GlobalVars.instance = globalVars;
  }
}
