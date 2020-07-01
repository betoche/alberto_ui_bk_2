import * as $ from 'jquery';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MedicationsComponent } from './medications.component';

import { TestBedHelper } from 'spec/test-bed/test-bed-helper';
import { DataHelper } from 'app/shared/spec/data-helper';

import { MedicationCategoryService } from 'app/services/medication-category/medication-category.service';
import { MedicationService } from 'app/services/medication/medication.service';

import {
  PharmaceuticalCompanyService
} from 'app/services/pharmaceutical-company/pharmaceutical-company.service';

describe('MedicationsComponent', () => {
  let component: MedicationsComponent;
  let fixture: ComponentFixture<MedicationsComponent>;

  beforeEach(async(() => {
    initializeComponent();
  }));

  it('should be created', () => {
    createComponent();
    expect(component).toBeTruthy();
  });

  // ##########################

  describe('there are a few items in the list', () => {
    it('shows a few rows of medications', () => {
      createComponent();
      expect($('datatable-row-wrapper').length).toEqual(2);
      expect($('datatable-row-wrapper:first-child').text()).toContain('Antipyretics');
      expect($('datatable-row-wrapper:first-child').text()).toContain('Farmaclan');
      expect($('datatable-row-wrapper:first-child').text()).toContain('Medication 1234567890');
    });
  });

  describe('filters', () => {
    it('filters by keyword', () => {
      createComponent();
      expect($('datatable-row-wrapper').length).toEqual(2);
      component.keyword = '1234567890';
      component.searchAndFilter({});
      fixture.detectChanges();
      expect($('datatable-row-wrapper').length).toEqual(1);
      expect($('datatable-row-wrapper:first-child').text()).toContain('Medication 1234567890');
    });
  });

  // ##########################

  describe('deletion', () => {
    it('shows confirmation and clicks on cancel button', () => {
      createComponent();

      fixture.debugElement.nativeElement.querySelector('.delete-btn').click();

      fixture.detectChanges();
      expect($('datatable-row-wrapper').length).toEqual(2);
    });

    it('shows confirmation and clicks on submit button', () => {
      initializeComponent({ confirmation: true });
      createComponent();

      spyOn(component, 'getMedications');

      fixture.debugElement.nativeElement.querySelector('.delete-btn').click();

      expect(component.getMedications).toHaveBeenCalled();
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
          declarations: [MedicationsComponent]
        },
        options
      )
    ).compileComponents();
  }

  function createComponent() {
    stubRequestFetchList();
    stubRequestDelete();
    fixture = TestBed.createComponent(MedicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  function stubRequestFetchList() {
    let service = TestBed.get(MedicationCategoryService);
    spyOn(service, 'fetchList').and.callFake(() => {
      return of(DataHelper.listOfMedicationCategories());
    });

    let medicationService = TestBed.get(MedicationService);
    spyOn(medicationService, 'fetchList').and.callFake(() => {
      return of(DataHelper.listOfMedications());
    });

    let pharmaceuticalCompanyService = TestBed.get(PharmaceuticalCompanyService);
    spyOn(pharmaceuticalCompanyService, 'fetchListPharmaceuticalCompanies').and.callFake(() => {
      return of(DataHelper.listOfCompanies());
    });
  }

  function stubRequestDelete() {
    let service = TestBed.get(MedicationCategoryService);
    spyOn(service, 'delete').and.callFake(() => {
      return of({ deleted: true });
    });

    let medicationService = TestBed.get(MedicationService);
    spyOn(medicationService, 'deleteList').and.callFake(() => {
      return of({ deleted: true });
    });
  }
});
