import { of } from 'rxjs';
import { Router } from '@angular/router';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfilePopupFormComponent } from './form.component';

import { TestBedHelper } from 'spec/test-bed/test-bed-helper';
import { DataHelper } from 'app/shared/spec/data-helper';

import { StrategyService } from 'app/services/strategy/strategy.service';

describe('ProfilePopupFormComponent', () => {
  let component: ProfilePopupFormComponent;
  let fixture: ComponentFixture<ProfilePopupFormComponent>;

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
      initializeComponent();
      let service = stubRequestCreate();
      let router = TestBed.get(Router);
      spyOn(router, 'navigate').and.callFake(() => {});

      component.form.get('name').setValue('New profile');
      component.form.get('strategy_attributes').setValue(
        DataHelper.strategyData('1234567890', { name: 'Strategy' }).attributes
      );
      expect(fixture.debugElement.nativeElement.querySelector('#submit-btn').disabled).toBeFalsy();
      fixture.debugElement.nativeElement.querySelector('#submit-btn').click();

      expect(service.create).toHaveBeenCalledWith(component.form.value);
      expect(router.navigate).toHaveBeenCalledWith(['/dashboard/strategies']);
    });
  });

  // ##########################

  function initializeComponent(options = {}) {
    // re-build component
    TestBed.resetTestingModule();
    TestBedHelper.configureTestingModule(
      Object.assign(
        {
          declarations: [ProfilePopupFormComponent]
        },
        options
      )
    ).compileComponents();
  }

  function createComponent() {
    fixture = TestBed.createComponent(ProfilePopupFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  function stubRequestCreate() {
    let service = TestBed.get(StrategyService);
    spyOn(service, 'createProfile').and.callFake(() => {
      return of({ data: DataHelper.strategyProfileData('1234567890') });
    });

    return service;
  }
});
