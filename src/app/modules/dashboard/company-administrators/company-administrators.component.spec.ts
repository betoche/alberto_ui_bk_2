import * as $ from 'jquery';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AdministratorUsersComponent } from 'app/modules/dashboard/administrator-users/administrator-users.component';

import { TestBedHelper } from 'spec/test-bed/test-bed-helper';
import { DataHelper } from 'app/shared/spec/data-helper';

import { AdministratorService } from 'app/services/administrator/administrator.service';
import { ExportCSVService } from 'app/shared/services/export-csv/export-csv.service';

describe('AdministratorUsersComponent', () => {
  let component: AdministratorUsersComponent;
  let fixture: ComponentFixture<AdministratorUsersComponent>;

  beforeEach(async(() => {
    initializeComponent();
  }));

  beforeEach(() => {
    createComponent();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('shows empty list', () => {
    expect($('.empty-row').length).toEqual(1);
  });

  // ##########################

  describe('there are a few users in the list', () => {
    beforeEach(() => {
      stubRequestFetchList();
      createComponent();
    });

    it('shows a list of users', () => {
      expect($('datatable-row-wrapper').length).toEqual(2);
    });
  });

  // ##########################

  describe('delete user', () => {
    it('shows confirmation and clicks on cancel button', () => {
      stubRequestFetchList();
      createComponent();

      fixture.debugElement.nativeElement.querySelector('.delete-btn').click();

      fixture.detectChanges();
      expect($('datatable-row-wrapper').length).toEqual(2);
    });

    it('shows confirmation and clicks on submit button', () => {
      initializeComponent({ confirmation: true });
      stubRequestFetchList();
      stubRequestDelete();
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

  function createComponent() {
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
