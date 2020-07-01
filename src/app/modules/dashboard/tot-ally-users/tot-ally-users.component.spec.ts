import * as $ from 'jquery';
import { of } from 'rxjs';

import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TotAllyUsersComponent } from './tot-ally-users.component';

import { TestBedHelper } from 'spec/test-bed/test-bed-helper';
import { DataHelper } from 'app/shared/spec/data-helper';
import { UserEntityService } from 'app/services/user-entity/user-entity.service';

describe('TotAllyUsersComponent', () => {
  let component: TotAllyUsersComponent;
  let fixture: ComponentFixture<TotAllyUsersComponent>;

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

  describe('there are a few users in the list', () => {
    beforeEach(() => {
      stubRequestFetchList();
      createComponent();
    });

    it('shows a list of users', () => {
      expect($('datatable-row-wrapper').length).toEqual(3);
    });
  });

  // ##########################

  describe('delete user', () => {
    it('shows confirmation and clicks on cancel button', () => {
      stubRequestFetchList();
      createComponent();

      fixture.debugElement.nativeElement.querySelector('.delete-btn').click();

      fixture.detectChanges();
      expect($('datatable-row-wrapper').length).toEqual(3);
    });

    it('shows confirmation and clicks on submit button', () => {
      initializeComponent({ confirmation: true });
      stubRequestFetchList();
      stubRequestDelete();
      createComponent();

      let service = TestBed.get(UserEntityService);

      fixture.debugElement.nativeElement.querySelector('.delete-btn').click();

      fixture.detectChanges();
      expect(service.fetchList).toHaveBeenCalled();
    });
  });

  // ##########################

  function initializeComponent(options = {}) {
    // re-build component
    TestBed.resetTestingModule();
    TestBedHelper.configureTestingModule(
      Object.assign(
        {
          declarations: [TotAllyUsersComponent],
        },
        options
      )
    ).compileComponents();
  }

  function createComponent() {
    fixture = TestBed.createComponent(TotAllyUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  function stubRequestFetchList() {
    let service = TestBed.get(UserEntityService);
    spyOn(service, 'fetchList').and.callFake(() => {
      return of({data: DataHelper.listOfCompanies()});
    });
  }

  function stubRequestDelete() {
    let service = TestBed.get(UserEntityService);
    spyOn(service, 'deleteList').and.callFake(() => {
      return of({ deleted: true });
    });
  }
});
