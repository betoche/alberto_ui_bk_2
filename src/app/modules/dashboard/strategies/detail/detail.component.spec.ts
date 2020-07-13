import { of } from 'rxjs';
import { Router } from '@angular/router';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { StrategyDetailComponent } from './detail.component';

import { TestBedHelper } from 'spec/test-bed/test-bed-helper';
import { DataHelper } from 'app/shared/spec/data-helper';

import { StrategyService } from 'app/services/strategy/strategy.service';

describe('StrategyDetailComponent', () => {
  let component: StrategyDetailComponent;
  let fixture: ComponentFixture<StrategyDetailComponent>;

  beforeEach(async(() => {
    initializeComponent({ route_params: { id: '1234567890' } });
  }));

  beforeEach(() => {
    createComponent();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('SHOW', () => {
    stubRequestFetch();

    it('shows detail of an strategy', () => {
      expect($('.client-status').text()).toContain('Activo')
      expect($('.gender').text()).toContain('Femenino')
      expect($('.name').text()).toContain('Strategy A')
      expect($('.strategy-type').text()).toContain('Strategy Type')
    });
  });

  // ##########################

  function initializeComponent(options = {}) {
    // re-build component
    TestBed.resetTestingModule();
    TestBedHelper.configureTestingModule(
      Object.assign(
        {
          declarations: [StrategyDetailComponent]
        },
        options
      )
    ).compileComponents();
  }

  function createComponent() {
    fixture = TestBed.createComponent(StrategyDetailComponent);
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
});
