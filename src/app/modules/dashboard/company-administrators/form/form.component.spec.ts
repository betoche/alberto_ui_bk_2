import { of } from 'rxjs';
import { Router } from '@angular/router';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CompanyAdministratorsFormComponent } from './form.component';

import { TestBedHelper } from 'spec/test-bed/test-bed-helper';
import { DataHelper } from 'app/shared/spec/data-helper';

import { AdministratorService } from 'app/services/administrator/administrator.service';

describe('CompanyAdministratorsFormComponent', () => {
  let component: CompanyAdministratorsFormComponent;
  let fixture: ComponentFixture<CompanyAdministratorsFormComponent>;
  const scope: string = 'pharmaceutical_companies_administrators';
  const subAdministrator: object = {
    email: 'company_administrator@example.com',
    first_name: 'First',
    last_name: 'Last',
    role: 'pharmaceutical_company_administrator'
  };

  beforeEach(async(() => {
    initializeComponent({ route_params: { id: '1234567890' } });
  }));

  beforeEach(() => {
    createComponent();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('UPDATE', () => {
    it('fills form fields and clicks on submit button', () => {
      stubRequestFetch();
      let service = stubRequestUpdate();
      createComponent();

      let router = TestBed.get(Router);
      spyOn(router, 'navigate').and.callFake(() => {});

      component.form.get('email').setValue('company_administrator@example.com');
      component.form.get('first_name').setValue('First');
      component.form.get('last_name').setValue('Last');
      component.form.get('role').setValue('pharmaceutical_company_administrator');
      fixture.detectChanges();
      fixture.debugElement.nativeElement.querySelector('#submit-btn').click();

      expect(service.update).toHaveBeenCalledWith(scope, '1234567890', component.form.value);
      expect(router.navigate).toHaveBeenCalledWith(['/dashboard/company-administrators']);
    });
  });

  describe('NEW', () => {
    it('fills form fields and clicks on submit button', () => {
      initializeComponent();
      createComponent();

      let service = stubRequestCreate();
      let router = TestBed.get(Router);
      spyOn(router, 'navigate').and.callFake(() => {});

      component.form.get('email').setValue('company_administrator@example.com');
      component.form.get('first_name').setValue('First');
      component.form.get('last_name').setValue('Last');
      component.form.get('role').setValue('pharmaceutical_company_administrator');
      fixture.detectChanges();
      expect(fixture.debugElement.nativeElement.querySelector('#submit-btn').disabled).toBeFalsy();
      fixture.debugElement.nativeElement.querySelector('#submit-btn').click();

      expect(service.create).toHaveBeenCalledWith(scope, component.form.value);
      expect(router.navigate).toHaveBeenCalledWith(['/dashboard/company-administrators']);
    });
  });

  // ##########################

  function initializeComponent(options = {}) {
    // re-build component
    TestBed.resetTestingModule();
    TestBedHelper.configureTestingModule(
      Object.assign(
        {
          declarations: [CompanyAdministratorsFormComponent]
        },
        options
      )
    ).compileComponents();
  }

  function createComponent() {
    fixture = TestBed.createComponent(CompanyAdministratorsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  function stubRequestFetch() {
    let service = TestBed.get(AdministratorService);
    spyOn(service, 'fetch').and.callFake(() => {
      return of({
        data: DataHelper.usersData('1234567890', subAdministrator)
      });
    });

    return service;
  }

  function stubRequestUpdate() {
    let service = TestBed.get(AdministratorService);
    spyOn(service, 'update').and.callFake(() => {
      return of({
        data: DataHelper.usersData('1234567890', subAdministrator)
      });
    });

    return service;
  }

  function stubRequestCreate() {
    let service = TestBed.get(AdministratorService);
    spyOn(service, 'create').and.callFake(() => {
      return of({ data: DataHelper.usersData('1234567890') });
    });

    return service;
  }
});
