import { of } from 'rxjs';
import { Router } from '@angular/router';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CompaniesFormComponent } from './form.component';

import { TestBedHelper } from 'spec/test-bed/test-bed-helper';
import { DataHelper } from 'app/shared/spec/data-helper';

import { PharmaceuticalCompanyService } from 'app/services/pharmaceutical-company/pharmaceutical-company.service';

fdescribe('CompaniesFormComponent', () => {
  let component: CompaniesFormComponent;
  let fixture: ComponentFixture<CompaniesFormComponent>;

  beforeEach(async(() => {
    initializeComponent({ mat_dialog_data: { isNew: true } });
  }));

  it('should be created', () => {
    createComponent();
    expect(component).toBeTruthy();
  });

  // ##########################

  function initializeComponent(options = {}) {
    // re-build component
    TestBed.resetTestingModule();
    TestBedHelper.configureTestingModule(
      Object.assign(
        {
          declarations: [CompaniesFormComponent],
        },
        options
      )
    ).compileComponents();
  }

  function createComponent() {
    fixture = TestBed.createComponent(CompaniesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  function stubRequestFetch() {
    let service = TestBed.get(PharmaceuticalCompanyService);
    spyOn(service, 'fetch').and.callFake(() => {
      return of({
        data: DataHelper.pharmaceuticalCompanyData('1234567890', { name: 'Company A' }),
      });
    });

    return service;
  }

  function stubRequestUpdate() {
    let service = TestBed.get(PharmaceuticalCompanyService);
    spyOn(service, 'update').and.callFake(() => {
      return of({
        data: DataHelper.pharmaceuticalCompanyData('1234567890', { name: 'Company updated' }),
      });
    });

    return service;
  }

  function stubRequestCreate() {
    let service = TestBed.get(PharmaceuticalCompanyService);
    spyOn(service, 'create').and.callFake(() => {
      return of({ data: DataHelper.pharmaceuticalCompanyData('1234567890') });
    });

    return service;
  }
});
