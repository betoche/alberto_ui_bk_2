import * as $ from 'jquery';
import { of } from 'rxjs';

import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CompaniesComponent } from './companies.component';

import { TestBedHelper } from 'spec/test-bed/test-bed-helper';
import { DataHelper } from 'app/shared/spec/data-helper';

import { CompanyService } from 'app/services/company/company.service';

import { DialogService } from 'app/shared/services/dialog.service';

describe('CompaniesComponent', () => {
  let component: CompaniesComponent;
  let fixture: ComponentFixture<CompaniesComponent>;

  beforeEach(async(() => {
    initializeComponent();
  }));

  it('should be created', () => {
    createComponent();
    expect(component).toBeTruthy();
  });

  it('shows empty records', () => {
    createComponent();
    expect($('.empty-row').length).toEqual(0);
  });

  // ##########################

  describe('there are a few users in the list', () => {
    it('shows a list of users', () => {
      createComponent();
      expect($('datatable-row-wrapper').length).toEqual(3);
    });
  });

  it('deletes companies', () => {
    initializeComponent({ confirmation: true });
    createComponent();

    spyOn(component, 'getCompanies').and.callThrough();
    let service = TestBed.get(CompanyService);

    fixture.debugElement.nativeElement.querySelector('.row-55555 .delete-btn').click();

    expect(service.deleteList).toHaveBeenCalledWith(
      [{ id: '55555', type: 'PharmaceuticalCompany'}]
    );
    expect(component.getCompanies).toHaveBeenCalled();
  });

  it('updates status companies', () => {
    createComponent();
    let service = TestBed.get(CompanyService);

    expect($('datatable-row-wrapper').length).toEqual(3);

    fixture.debugElement.nativeElement.querySelector('.row-55555 .update-status span').click();

    expect(service.updateStatus).toHaveBeenCalledWith(
      [{ id: '55555', type: 'PharmaceuticalCompany'}], 'suspended'
    );
  });

  describe('filters', () => {
    it('filters by keyword', () => {
      createComponent();
      component.filterOptions.keyword = '55555';
      fixture.detectChanges();

      expect($('datatable-row-wrapper').length).toEqual(1);
    });

    it('filters by company type', () => {
      createComponent();
      component.filterOptions.type = 'Drugstore';
      fixture.detectChanges();

      expect($('datatable-row-wrapper').length).toEqual(1);
    });

    it('filters by country', () => {
      createComponent();
      component.filterOptions.country = 'CR';
      fixture.detectChanges();

      expect($('datatable-row-wrapper').length).toEqual(2);
    });

    it('filters by status', () => {
      createComponent();
      component.filterOptions.status = 'active';
      fixture.detectChanges();

      expect($('datatable-row-wrapper').length).toEqual(2);
    });
  });

  it('resends password', () => {
    createComponent();
    let service = TestBed.get(CompanyService);
    fixture.debugElement.nativeElement.querySelector('.row-55555 .send-password-btn').click();

    expect(service.sendResetPassword).toHaveBeenCalledWith(
      'test@example.com'
    );
  });


  // ##########################

  function initializeComponent(options = {}) {
    // re-build component
    TestBed.resetTestingModule();
    TestBedHelper.configureTestingModule(
      Object.assign(
        {
          declarations: [CompaniesComponent],
        },
        options
      )
    ).compileComponents();
  }

  function createComponent() {
    stubRequestFetchList();
    stubRequestDelete();
    stubUpdateStatus();
    stubSendResetPassword();

    fixture = TestBed.createComponent(CompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  function stubRequestFetchList() {
    let service = TestBed.get(CompanyService);
    spyOn(service, 'fetchList').and.callFake(() => {
      return of({data: DataHelper.listOfCompanies()});
    });
  }

  function stubRequestDelete() {
    let service = TestBed.get(CompanyService);
    spyOn(service, 'deleteList').and.callFake(() => {
      return of({ deleted: true });
    });
  }

  function stubUpdateStatus() {
    let service = TestBed.get(CompanyService);
    spyOn(service, 'updateStatus').and.callFake(() => {
      return of({ status: true });
    });
  }

  function stubSendResetPassword() {
    let service = TestBed.get(CompanyService);
    spyOn(service, 'sendResetPassword').and.callFake(() => {
      return of({ status: true });
    });
  }
});

