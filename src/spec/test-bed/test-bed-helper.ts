import { ActivatedRoute } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedMaterialModule } from 'app/shared/shared-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormGroupDirective, ControlContainer } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { TranslateModule, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { DialogService } from 'app/shared/services/dialog.service';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { InjectorsHelper } from 'app/shared/services/injectors_global.service';

import { SharedModule } from 'app/shared/shared.module';
import { NgxSpinnerModule } from 'ngx-spinner';

export const TestBedHelper = {
  configureTestingModule: function(options = {}) {
    // mock class MatDialog from options
    class MatDialogMock {
      open(option?) {
        return { afterClosed: () => of(options['dialog_close_data']) };
      }
      close() {}
    }

    const MatDialogRefMock = {
      close: jasmine.createSpy('close')
    };

    // mock class AppConfirmService from options
    class AppConfirmServiceMock {
      confirm() {
        return of(options['confirmation']);
      }
    }

    // mock class AppLoaderService from options
    class AppLoaderServiceMock {
      open() {}
      close() {}
    }

    // ###################################

    let optionsDefault = {
      // ##############
      imports: [
        RouterTestingModule.withRoutes([]),
        SharedModule,
        BrowserModule,
        BrowserAnimationsModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedMaterialModule,
        FlexLayoutModule,
        PerfectScrollbarModule,
        NgxDatatableModule,
        HttpClientTestingModule,
        NgxSpinnerModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }
        })
      ].concat(options['imports'] || []),


      // ##############
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: options['mat_dialog_data'] || {} },
        { provide: MatDialog, useClass: MatDialogMock },
        { provide: MatDialogRef, useValue: MatDialogRefMock },
        { provide: AppConfirmService, useClass: AppConfirmServiceMock },
        { provide: AppLoaderService, useClass: AppLoaderServiceMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: options['route_params'] || {},
              queryParams: options['query_params'] || {}
            },
            params: of(options['route_params'] || {})
          }
        },
        InjectorsHelper,
        HttpClientTestingModule,
        DialogService,
        FormGroupDirective
      ].concat(options['providers'] || []),

      // ##############
      declarations: [].concat(options['declarations'] || []),

      // ##############
      entryComponents: [].concat(options['entryComponents'] || []),

      // ##############
      exports: [ReactiveFormsModule, SharedModule].concat(options['entryComponents'] || [])
    };

    let testModule = TestBed.configureTestingModule(optionsDefault);

    TestBed.get(InjectorsHelper);

    return testModule;
  }
};
