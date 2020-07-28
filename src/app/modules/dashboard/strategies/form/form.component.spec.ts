import { of } from 'rxjs';
import { Router } from '@angular/router';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { StrategyFormComponent } from './form.component';

import { TestBedHelper } from 'spec/test-bed/test-bed-helper';
import { DataHelper } from 'app/shared/spec/data-helper';

import { StrategyService } from 'app/services/strategy/strategy.service';

describe('StrategyFormComponent', () => {
  let component: StrategyFormComponent;
  let fixture: ComponentFixture<StrategyFormComponent>;

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
      stubFetchProfiles();
      stubFetchStrategyTypes();

      let service = stubRequestUpdate();
      let router = TestBed.get(Router);
      spyOn(router, 'navigate').and.callFake(() => {});

      component.form.get('name').setValue('Strategy updated');
      component.form.get('client_status').setValue('active');
      component.form.get('age_min_limit').setValue('20');
      component.form.get('age_max_limit').setValue('50');
      component.form.get('description').setValue('Description');
      component.form.get('strategy_type_id').setValue('Strategy updated');
      component.form.get('terms_and_conditions_url').setValue('Strategy updated');
      component.form.get('logo_url').setValue('Strategy updated');
      component.form.get('benefits_provider_commerce_id').setValue('Strategy updated');
      fixture.detectChanges();
      fixture.debugElement.nativeElement.querySelector('#submit-btn').click();

      expect(service.update).toHaveBeenCalledWith('1234567890', component.form.value);
      expect(router.navigate).toHaveBeenCalledWith(['/dashboard/strategies']);
    });
  });

  describe('NEW', () => {
    it('fills form fields and clicks on submit button', () => {
      initializeComponent();
      stubFetchProfiles();
      stubFetchStrategyTypes();

      let service = stubRequestCreate();
      let router = TestBed.get(Router);
      spyOn(router, 'navigate').and.callFake(() => {});

      component.form.get('name').setValue('New strategy');
      component.form.get('client_status').setValue('active');
      component.form.get('age_min_limit').setValue('20');
      component.form.get('age_max_limit').setValue('50');
      component.form.get('description').setValue('Description');
      component.form.get('strategy_type_id').setValue('Strategy updated');
      component.form.get('terms_and_conditions_url').setValue('Strategy updated');
      component.form.get('logo_url').setValue('Strategy updated');
      component.form.get('benefits_provider_commerce_id').setValue('Strategy updated');
      fixture.detectChanges();
      expect(fixture.debugElement.nativeElement.querySelector('#submit-btn').disabled).toBeFalsy();
      fixture.debugElement.nativeElement.querySelector('#submit-btn').click();

      expect(service.create).toHaveBeenCalledWith(component.form.value);
      expect(router.navigate).toHaveBeenCalledWith(['/dashboard/strategies']);
    });

    it('returns selected conditions', () => {
      initializeComponent();
      stubFetchProfiles();
      stubFetchStrategyTypes();

      let service = stubRequestCreate();
      let router = TestBed.get(Router);
      spyOn(router, 'navigate').and.callFake(() => {});

      component.form.get('can_be_exchanged').setValue('');
      component.form.get('amount_of_times_can_be_exchanged').setValue('10');

      expect(component.selectedConditions).toEqual('No aplica');

      component.form.get('can_be_exchanged').setValue('amount_defined');
      expect(component.selectedConditions).toEqual('Establecer cantidad: 10');
    });
  });

  // ##########################

  function initializeComponent(options = {}) {
    // re-build component
    TestBed.resetTestingModule();
    TestBedHelper.configureTestingModule(
      Object.assign(
        {
          declarations: [StrategyFormComponent]
        },
        options
      )
    ).compileComponents();
  }

  function createComponent() {
    fixture = TestBed.createComponent(StrategyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  function stubRequestFetch() {
    let service = TestBed.get(StrategyService);
    spyOn(service, 'fetch').and.callFake(() => {
      return of({
        data: DataHelper.strategyData('1234567890', { name: 'Strategy A' })
      });
    });

    return service;
  }

  function stubRequestUpdate() {
    let service = TestBed.get(StrategyService);
    spyOn(service, 'update').and.callFake(() => {
      return of({
        data: DataHelper.strategyData('1234567890', { name: 'Strategy updated' })
      });
    });

    return service;
  }

  function stubRequestCreate() {
    let service = TestBed.get(StrategyService);
    spyOn(service, 'create').and.callFake(() => {
      return of({ data: DataHelper.strategyData('1234567890') });
    });

    return service;
  }

  function stubFetchProfiles() {
    let strategyService = TestBed.get(StrategyService);
    spyOn(strategyService, 'fetchProfiles').and.callFake(() => {
      return of(DataHelper.listOfStrategyProfiles());
    });
  }

  function stubFetchStrategyTypes() {
    let strategyService = TestBed.get(StrategyService);
    spyOn(strategyService, 'fetchStrategyTypes').and.callFake(() => {
      return of(DataHelper.listOfStrategyTypes());
    });
  }
});
