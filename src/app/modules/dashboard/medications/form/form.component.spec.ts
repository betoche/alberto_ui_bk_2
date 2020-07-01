import { of } from 'rxjs';
import { Router } from '@angular/router';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MedicationFormComponent } from './form.component';

import { TestBedHelper } from 'spec/test-bed/test-bed-helper';
import { DataHelper } from 'app/shared/spec/data-helper';
import { RouterTestingModule } from '@angular/router/testing';

import { MedicationCategoryService } from 'app/services/medication-category/medication-category.service';
import { MedicationService } from 'app/services/medication/medication.service';
import { CountriesService } from 'app/services/administrator/countries.service';

import {
  PharmaceuticalCompanyService
} from 'app/services/pharmaceutical-company/pharmaceutical-company.service';

import { MatDialogRef } from '@angular/material';
class MedicationsComponent {}

describe('MedicationFormComponent', () => {
  let component: MedicationFormComponent;
  let fixture: ComponentFixture<MedicationFormComponent>;


  describe('NEW', () => {
    beforeEach(async(() => {
      initializeComponent();
    }));

    beforeEach(() => {
      createComponent();
    });

    it('should be created', () => {
      expect(component).toBeTruthy();
    });

    it('fills form fields and clicks on submit button', () => {
      stubFetchListPharmaceuticalCompanies()
      stubFetchListOfMedicationCategories()
      let service = stubRequestCreate();
      component.form.get('name').setValue('FullName');
      component.form.get('pharmaceutical_company_id').setValue('55555');
      component.form.get('medication_category_id').setValue('123456');
      component.form.get('code').setValue('123321');
      component.form.get('logo_url').setValue('http://example.com/logo.png');
      component.form.get('description').setValue('Description');
      component.form.get('adults_dosification_amount').setValue('1');
      component.form.get('adults_dosification_frequency_measure').setValue('2');
      component.form.get('adults_dosification_frequency').setValue('hour');
      component.form.get('children_dosification_amount').setValue('1');
      component.form.get('children_dosification_frequency_measure').setValue('2');
      component.form.get('children_dosification_frequency').setValue('hour');
      component.form.get('medication_presentations_attributes').setValue([{
        presentation_type: 'type', presentation_content: 'content'
      }]);

      fixture.detectChanges();
      expect(fixture.debugElement.nativeElement.querySelector('#submit-btn').disabled).toBeFalsy();
      fixture.debugElement.nativeElement.querySelector('#submit-btn').click();
      expect(service.create).toHaveBeenCalledWith(component.form.value);
    });
  });

  describe('EDIT', () => {
    beforeEach(async(() => {
      initializeComponent({route_params: {id: '1234567890'}});
    }));

    beforeEach(() => {
      stubRequestFetch()
      createComponent();
    });

    it('fills form fields and clicks on submit button', () => {
      stubFetchListPharmaceuticalCompanies()
      stubFetchListOfMedicationCategories()
      let service = stubRequestUpdate();
      component.form.get('name').setValue('Updated name');

      fixture.detectChanges();
      expect(fixture.debugElement.nativeElement.querySelector('#submit-btn').disabled).toBeFalsy();
      fixture.debugElement.nativeElement.querySelector('#submit-btn').click();
      expect(service.update).toHaveBeenCalledWith('1234567890', component.form.value);
    });
  });

  // ##########################

  function initializeComponent(options = {}) {
    // re-build component
    TestBed.resetTestingModule();
    TestBedHelper.configureTestingModule(
      Object.assign(
        {
          imports: [
            RouterTestingModule.withRoutes([
              { path: 'dashboard/medications', component: MedicationsComponent }
            ])
          ],
          declarations: [MedicationFormComponent]
        },
        options
      )
    ).compileComponents();
  }

  function createComponent() {
    fixture = TestBed.createComponent(MedicationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  function stubRequestFetch() {
    let service = TestBed.get(MedicationService);
    spyOn(service, 'fetch').and.callFake(() => {
      return of({data: DataHelper.medicationData('1234567890')});
    });

    return service;
  }

  function stubRequestUpdate() {
    let service = TestBed.get(MedicationService);
    spyOn(service, 'update').and.callFake(() => {
      return of({
        data: DataHelper.medicationData('1234567890', { name: 'Updated name' })
      });
    });

    return service;
  }


  function stubFetchListPharmaceuticalCompanies() {
    let pharmaceuticalCompanyService = TestBed.get(PharmaceuticalCompanyService);
    spyOn(pharmaceuticalCompanyService, 'fetchListPharmaceuticalCompanies').and.callFake(() => {
      return of(DataHelper.listOfCompanies());
    });
  }

  function stubFetchListOfMedicationCategories() {
    let service = TestBed.get(MedicationCategoryService);
    spyOn(service, 'fetchList').and.callFake(() => {
      return of(DataHelper.listOfMedicationCategories());
    });
  }

  function stubRequestCreate() {
    let service = TestBed.get(MedicationService);
    spyOn(service, 'create').and.callFake(() => {
      return of({ data: DataHelper.medicationData('1234567890') });
    });

    return service;
  }
});
