import * as $ from 'jquery';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import {
  AdministratorUsersComponent
} from 'app/modules/dashboard/administrator-users/administrator-users.component';

import {
  AdministratorUsersFormComponent
} from 'app/modules/dashboard/administrator-users/form/form.component';

import { TestBedHelper } from 'spec/test-bed/test-bed-helper';
import { DataHelper } from 'app/shared/spec/data-helper';

import { AdministratorService } from 'app/services/administrator/administrator.service';
import { ExportCSVService } from 'app/shared/services/export-csv/export-csv.service';
import { DialogService } from 'app/shared/services/dialog.service';

describe('AdministratorUsersComponent', () => {
  let component: AdministratorUsersComponent;
  let fixture: ComponentFixture<AdministratorUsersComponent>;

  beforeEach(async(() => {
    initializeComponent();
  }));

  it('should be created', () => {
    createComponent();
    expect(component).toBeTruthy();
  });

  it('shows empty list', () => {
    createComponent({ withoutStubData: true });
    expect($('.empty-row').length).toEqual(1);
  });

  // ##########################

  describe('there are a few users in the list', () => {
    beforeEach(() => {
      createComponent();
    });

    it('shows a list of users', () => {
      expect($('datatable-row-wrapper').length).toEqual(2);
      expect($('datatable-row-wrapper:first-child').text()).toContain('user-123456@gmail.com');
      expect($('datatable-row-wrapper:first-child').text()).toContain('Monica Alice');
    });
  });

  // ##########################

  describe('delete user', () => {
    it('shows confirmation and clicks on cancel button', () => {
      createComponent();

      fixture.debugElement.nativeElement.querySelector('.delete-btn').click();

      fixture.detectChanges();
      expect($('datatable-row-wrapper').length).toEqual(2);
    });

    it('shows confirmation and clicks on submit button', () => {
      initializeComponent({ confirmation: true });
      createComponent();

      fixture.debugElement.nativeElement.querySelector('.delete-btn').click();

      fixture.detectChanges();
      expect($('datatable-row-wrapper').length).toEqual(1);
    });
  });

  // ##########################

  function initializeComponent(options = {}) {
    // re-build component
    TestBed.resetTestingModule();
    TestBedHelper.configureTestingModule(
      Object.assign(
        {
          imports: [RouterTestingModule.withRoutes([])],
          declarations: [AdministratorUsersComponent]
        },
        options
      )
    ).compileComponents();
  }

  function createComponent(options = {}) {
    if(!options['withoutStubData']){
      stubRequestFetchList();
      stubRequestDelete();
    }

    fixture = TestBed.createComponent(AdministratorUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  function stubRequestFetchList() {
    let service = TestBed.get(AdministratorService);
    spyOn(service, 'fetchList').and.callFake(() => {
      return of(DataHelper.listOfAdministratorUsers());
    });
  }

  function stubRequestDelete() {
    let service = TestBed.get(AdministratorService);
    spyOn(service, 'delete').and.callFake(() => {
      return of({ deleted: true });
    });
  }
});
