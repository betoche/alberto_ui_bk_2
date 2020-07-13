import * as $ from 'jquery';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { StrategiesComponent } from './strategies.component';

import { TestBedHelper } from 'spec/test-bed/test-bed-helper';
import { DataHelper } from 'app/shared/spec/data-helper';

import { StrategyService } from 'app/services/strategy/strategy.service';

describe('StrategiesComponent', () => {
  let component: StrategiesComponent;
  let fixture: ComponentFixture<StrategiesComponent>;

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

  describe('there are a few strategies in the list', () => {
    beforeEach(() => {
      stubRequestFetchList();
      createComponent();
    });

    it('shows a list of strategies', () => {
      expect($('datatable-row-wrapper').length).toEqual(2);
      expect($('datatable-row-wrapper:first-child').text()).toContain('Strategy A');
    });
  });

  // ##########################

  describe('delete strategy', () => {
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

      fixture.debugElement.nativeElement.querySelector('.delete-btn').click();

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
          declarations: [StrategiesComponent]
        },
        options
      )
    ).compileComponents();
  }

  function createComponent() {
    fixture = TestBed.createComponent(StrategiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  function stubRequestFetchList() {
    let service = TestBed.get(StrategyService);
    spyOn(service, 'fetchList').and.callFake(() => {
      return of(DataHelper.listOfStrategies());
    });
  }

  function stubRequestDelete() {
    let service = TestBed.get(StrategyService);
    spyOn(service, 'delete').and.callFake(() => {
      return of({ deleted: true });
    });
  }
});
