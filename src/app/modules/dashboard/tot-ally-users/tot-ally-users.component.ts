import { Component, OnInit } from '@angular/core';
import { egretAnimations } from 'app/shared/animations/egret-animations';
import { DatatableBaseComponent } from 'app/shared/components/datatable.base.component';
import { UserModel } from 'app/shared/models/users/user.model';
import { DialogService } from 'app/shared/services/dialog.service';
import { UserEntityService } from 'app/services/user-entity/user-entity.service';
import { ExportCSVService } from 'app/shared/services/export-csv/export-csv.service';
import { FormCollectionHelper } from 'app/helpers/form_collection.helper';
import * as _ from 'lodash';
import { TotAllyUserFormComponent } from './form/form.component';

@Component({
  selector: 'app-tot-ally-users',
  animations: egretAnimations,
  templateUrl: './tot-ally-users.component.html',
  styleUrls: ['./tot-ally-users.component.scss'],
})
export class TotAllyUsersComponent extends DatatableBaseComponent implements OnInit {
  public rows: any = [];
  public listAllData: any = [];
  public formCollectionHelper = FormCollectionHelper;
  public typeOfcompaniesCollection: any = [];
  public statusList: any = [];
  public selected = [];
  public successful = false;
  public filterType: string = 'company';
  public keyword: string = '';
  public entityType: string = '';
  public countryCode: string = '';
  public status: string = '';

  constructor(
    private dialogService: DialogService,
    private userEntityService: UserEntityService,
    public exportCSVService: ExportCSVService
  ) {
    super();
  }

  ngOnInit() {
    this.typeOfcompaniesCollection = this.formCollectionHelper.getTypeOfCompaniesCollection();
    this.statusList = this.formCollectionHelper.getStatusList();
    this.getUsers();
  }

  private getUsers() {
    this.userEntityService.fetchList().subscribe(
      (response) => {
        const data = UserModel.buildFromResponse(response);
        this.listAllData = [...data];
        this.rows = data;
      },
      (_error) => {
        this.rows = [];
      }
    );
  }

  public deleteItems(items) {
    let message = '<ul>';
    items.forEach( (item) => { message += `<li>${item.name}</li>` } );
    message += '</ul>';

    this.dialogService.deletionConfirm(this, items, {
      title: 'DELETE_CONFIRM',
      message: message,
      width: '738px',
      okButton: () => {
        const ids = _.map(items, 'id');
        this.userEntityService.deleteList(ids).subscribe(() => {
          this.getUsers();
        });
      },
    });
  }

  public activateMultipleStatuses(rows, confirmation = true){
    this.updateMultipleStatuses(rows, 'active', confirmation);
  }

  public suspendMultipleStatuses(rows, confirmation = true){
    this.updateMultipleStatuses(rows, 'suspended', confirmation);
  }

  public updateMultipleStatuses(rows, status, confirmation = true){
    const user_ids = _.map(rows, 'id');

    let message = '<ul>';
    rows.forEach(row => { message += `<li>${row.name}</li>` });
    message += '</ul>';

    if(confirmation){
      this.dialogService.suspensionConfirm({
        title: 'SUSPEND_CONFIRM',
        message: message,
        width: '738px',
        okButton: () => {
          this.userEntityService.updateStatus(user_ids, status).subscribe(() => {
            rows.forEach(row => { row.status = status });
            this.selected = [];
          });
        },
      });
    }else{
      this.userEntityService.updateStatus(user_ids, status).subscribe(() => {
        rows.forEach(row => { row.status = status });
      });
    }
  }

  public setFilterType(value: string) {
    this.filterType = value;
  }

  public openPopUp(row: any = {}, isNew?) {
    this.dialogService.openPopUp(this, TotAllyUserFormComponent, {
      data: { title: 'NEW_COMPANY', payload: row, isNew: isNew },
      width: '1150px',
      handleResponse: (data) => {
        this.successful = true;
      },
    });
  }

  public onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  searchAndFilter({ keyword, entityType, countryCode, status }: any) {
    if (keyword) {
      this.keyword = keyword.toLowerCase();
    }

    if (entityType) {
      this.entityType = entityType !== 'ALL' ? entityType : '';
    }

    if (countryCode) {
      this.countryCode = countryCode !== 'ALL' ? countryCode : '';
    }

    if (status) {
      this.status = status !== 'ALL' ? status : '';
    }

    // filter our data
    const searchResult = this.listAllData.filter(({ name, type, country_code, status }) => {
      return (
        name.toLowerCase().indexOf(this.keyword) !== -1 &&
        type.indexOf(this.entityType) !== -1 &&
        country_code.indexOf(this.countryCode) !== -1 &&
        status.indexOf(this.status) !== -1
      );
    });

    // update the rows
    this.rows = searchResult;
  }
}
