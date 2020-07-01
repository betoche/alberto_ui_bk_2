import { of } from 'rxjs';
import { Router } from '@angular/router';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AdministratorUsersFormComponent } from './form.component';

import { TestBedHelper } from 'spec/test-bed/test-bed-helper';
import { DataHelper } from 'app/shared/spec/data-helper';

import { AdministratorService } from 'app/services/administrator/administrator.service';
import { MatDialogRef } from '@angular/material';


describe('AdministratorUsersFormComponent', () => {
  let component: AdministratorUsersFormComponent;
  let fixture: ComponentFixture<AdministratorUsersFormComponent>;
  const scope: string = 'administrator_users';
  const subAdministrator: object = {
    email: 'technical_administrator@example.com',
    first_name: 'First',
    last_name: 'Last',
    role: 'technical_administrator'
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

  describe('NEW', () => {
    it('fills form fields and clicks on submit button', () => {
      let user = DataHelper.usersData('1234567890');
      initializeComponent();
      createComponent();

      let service = stubRequestCreate(user);
      let router = TestBed.get(Router);
      let dialogRef = TestBed.get(MatDialogRef);

      spyOn(router, 'navigate').and.callFake(() => {});

      component.form.get('email').setValue('technical_administrator@example.com');
      component.form.get('name').setValue('FullName');
      component.form.get('government_id').setValue('81234567890');
      component.form.get('role').setValue('support_administrator');
      fixture.detectChanges();
      expect(fixture.debugElement.nativeElement.querySelector('#submit-btn').disabled).toBeFalsy();
      fixture.debugElement.nativeElement.querySelector('#submit-btn').click();

      expect(service.create).toHaveBeenCalledWith(scope, component.form.value);
      expect(dialogRef.close).toHaveBeenCalledWith(user['attributes']);
    });
  });

  // ##########################

  function initializeComponent(options = {}) {
    // re-build component
    TestBed.resetTestingModule();
    TestBedHelper.configureTestingModule(
      Object.assign(
        {
          declarations: [AdministratorUsersFormComponent],
          mat_dialog_data: { payload: DataHelper.usersData('1234567890'), isNew: true }
        },
        options
      )
    ).compileComponents();
  }

  function createComponent() {
    fixture = TestBed.createComponent(AdministratorUsersFormComponent);
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

  function stubRequestUpdate(user = {}) {
    let service = TestBed.get(AdministratorService);
    spyOn(service, 'update').and.callFake(() => {
      return of({
        data: user || DataHelper.usersData('1234567890', subAdministrator)
      });
    });

    return service;
  }

  function stubRequestCreate(user = {}) {
    let service = TestBed.get(AdministratorService);
    spyOn(service, 'create').and.callFake(() => {
      return of({ data: user || DataHelper.usersData('1234567890') });
    });

    return service;
  }
});
