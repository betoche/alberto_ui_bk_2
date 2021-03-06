import { of } from 'rxjs';
import { Router } from '@angular/router';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MedicationCategoryFormComponent } from './form.component';

import { TestBedHelper } from 'spec/test-bed/test-bed-helper';
import { DataHelper } from 'app/shared/spec/data-helper';

import { MedicationCategoryService } from 'app/services/medication-category/medication-category.service';

describe('MedicationCategoryFormComponent', () => {
  let component: MedicationCategoryFormComponent;
  let fixture: ComponentFixture<MedicationCategoryFormComponent>;

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

      component.form.get('name').setValue('Category updated');
      fixture.detectChanges();
      fixture.debugElement.nativeElement.querySelector('#submit-btn').click();

      expect(service.update).toHaveBeenCalledWith('1234567890', component.form.value);
      expect(router.navigate).toHaveBeenCalledWith(['/dashboard/medication-categories']);
    });
  });

  describe('NEW', () => {
    it('fills form fields and clicks on submit button', () => {
      initializeComponent();
      createComponent();

      let service = stubRequestCreate();
      let router = TestBed.get(Router);
      spyOn(router, 'navigate').and.callFake(() => {});

      component.form.get('name').setValue('New category');
      fixture.detectChanges();
      expect(fixture.debugElement.nativeElement.querySelector('#submit-btn').disabled).toBeFalsy();
      fixture.debugElement.nativeElement.querySelector('#submit-btn').click();

      expect(service.create).toHaveBeenCalledWith(component.form.value);
      expect(router.navigate).toHaveBeenCalledWith(['/dashboard/medication-categories']);
    });
  });

  // ##########################

  function initializeComponent(options = {}) {
    // re-build component
    TestBed.resetTestingModule();
    TestBedHelper.configureTestingModule(
      Object.assign(
        {
          declarations: [MedicationCategoryFormComponent]
        },
        options
      )
    ).compileComponents();
  }

  function createComponent() {
    fixture = TestBed.createComponent(MedicationCategoryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  function stubRequestFetch() {
    let service = TestBed.get(MedicationCategoryService);
    spyOn(service, 'fetch').and.callFake(() => {
      return of({
        data: DataHelper.medicationCategoryData('1234567890', { name: 'Category A' })
      });
    });

    return service;
  }

  function stubRequestUpdate() {
    let service = TestBed.get(MedicationCategoryService);
    spyOn(service, 'update').and.callFake(() => {
      return of({
        data: DataHelper.medicationCategoryData('1234567890', { name: 'Category updated' })
      });
    });

    return service;
  }

  function stubRequestCreate() {
    let service = TestBed.get(MedicationCategoryService);
    spyOn(service, 'create').and.callFake(() => {
      return of({ data: DataHelper.medicationCategoryData('1234567890') });
    });

    return service;
  }
});
