import { of } from 'rxjs';
import { Router } from '@angular/router';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MedicationDistributorsFormComponent } from './form.component';

import { TestBedHelper } from 'spec/test-bed/test-bed-helper';
import { DataHelper } from 'app/shared/spec/data-helper';

import { AdministratorService } from 'app/services/administrator/administrator.service';

describe('MedicationDistributorsFormComponent', () => {
  let component: MedicationDistributorsFormComponent;
  let fixture: ComponentFixture<MedicationDistributorsFormComponent>;
  const scope: string = 'medications_distributor_users';
  const medicationDistributors: object = {
    email: 'medication_distributors@example.com',
    first_name: 'First',
    last_name: 'Last',
    role: 'medications_distributor'
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

      component.form.get('email').setValue('medication_distributors@example.com');
      component.form.get('name').setValue('FullName');
      fixture.detectChanges();
      fixture.debugElement.nativeElement.querySelector('#submit-btn').click();

      expect(service.update).toHaveBeenCalledWith(scope, '1234567890', component.form.value);
      expect(router.navigate).toHaveBeenCalledWith(['/dashboard/medication-distributors']);
    });
  });


  // ##########################

  function initializeComponent(options = {}) {
    // re-build component
    TestBed.resetTestingModule();
    TestBedHelper.configureTestingModule(
      Object.assign(
        {
          declarations: [MedicationDistributorsFormComponent]
        },
        options
      )
    ).compileComponents();
  }

  function createComponent() {
    fixture = TestBed.createComponent(MedicationDistributorsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  function stubRequestFetch() {
    let service = TestBed.get(AdministratorService);
    spyOn(service, 'fetch').and.callFake(() => {
      return of({
        data: DataHelper.usersData('1234567890', medicationDistributors)
      });
    });

    return service;
  }

  function stubRequestUpdate() {
    let service = TestBed.get(AdministratorService);
    spyOn(service, 'update').and.callFake(() => {
      return of({
        data: DataHelper.usersData('1234567890', medicationDistributors)
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
