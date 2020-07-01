import * as $ from 'jquery';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MedicationCategoriesComponent } from './medication-categories.component';

import { TestBedHelper } from 'spec/test-bed/test-bed-helper';
import { DataHelper } from 'app/shared/spec/data-helper';

import { MedicationCategoryService } from 'app/services/medication-category/medication-category.service';
import { ExportCSVService } from 'app/shared/services/export-csv/export-csv.service';

describe('MedicationCategoriesComponent', () => {
  let component: MedicationCategoriesComponent;
  let fixture: ComponentFixture<MedicationCategoriesComponent>;

  beforeEach(async(() => {
    initializeComponent();
  }));

  beforeEach(() => {
    createComponent();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('shows empty records', () => {
    expect($('.empty-row').length).toEqual(1);
  });

  // ##########################

  describe('there are a few medication categories in the list', () => {
    beforeEach(() => {
      stubRequestFetchList();
      createComponent();
    });

    it('shows a list of medication categories', () => {
      expect($('datatable-row-wrapper').length).toEqual(2);
      expect($('datatable-row-wrapper:first-child').text()).toContain('Category A');
    });
  });

  // ##########################

  describe('delete medication category', () => {
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

      $('.delete-btn').get(0).click()

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
          declarations: [MedicationCategoriesComponent]
        },
        options
      )
    ).compileComponents();
  }

  function createComponent() {
    fixture = TestBed.createComponent(MedicationCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  function stubRequestFetchList() {
    let service = TestBed.get(MedicationCategoryService);
    spyOn(service, 'fetchList').and.callFake(() => {
      return of(DataHelper.listOfMedicationCategories());
    });
  }

  function stubRequestDelete() {
    let service = TestBed.get(MedicationCategoryService);
    spyOn(service, 'delete').and.callFake(() => {
      return of({ deleted: true });
    });
  }
});
