import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MaterialModule } from './material/material.module';

import { AppComponent } from './app.component';
import { PresDialogComponent } from './pres-dialog/pres-dialog.component';
import { PresentablesComponent } from './presentables/presentables.component';
import { AuthComponent } from './auth/auth.component';
import { AuthInterceptor } from './shared/auth.interceptor';
import { BottomsheetComponent } from './bottomsheet/bottomsheet.component';
import { MAT_BOTTOM_SHEET_DEFAULT_OPTIONS, MatBottomSheetRef } from '@angular/material';

@NgModule({
  declarations: [
    AppComponent,
    PresDialogComponent,
    PresentablesComponent,
    AuthComponent,
    BottomsheetComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: MatBottomSheetRef, useValue: {}},
    {provide: MAT_BOTTOM_SHEET_DEFAULT_OPTIONS, useValue: {closeOnNavigation: true, autoFocus: false, hasBackdrop: true}}
  ],
  entryComponents: [PresDialogComponent, BottomsheetComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
