import { Component, OnInit } from '@angular/core';
import { egretAnimations } from 'app/shared/animations/egret-animations';
import { DatatableBaseComponent } from 'app/shared/components/datatable.base.component';
import { CompanyModel } from 'app/shared/models/company/company.model';
import { DialogService } from 'app/shared/services/dialog.service';
import { EntityService } from 'app/services/entity/entity.service';
import { CompanyService } from 'app/services/company/company.service';
import { ExportCSVService } from 'app/shared/services/export-csv/export-csv.service';
import { injectorsGlobal } from 'app/shared/services/injectors_global.service';
import { FormCollectionHelper } from 'app/helpers/form_collection.helper';
import * as _ from 'lodash';
import { CompaniesFormComponent } from './form/form.component';
import { EditCompanyComponent } from './edit/edit.component';
import { UserService } from 'app/shared/services/user.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { MasterDataCountry } from 'app/shared/models/master-data/country.model';

@Component({
  selector: 'app-companies',
  animations: egretAnimations,
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss'],
})
export class CompaniesComponent extends DatatableBaseComponent implements OnInit {
  public rows: any = [];
  public listAllData: any = [];
  public formCollectionHelper = FormCollectionHelper;
  public typeOfcompaniesCollection: any = [];
  public statusList: any = [];
  public selected: any = [];
  public filterType: string = 'company';
  public keyword: string = '';
  public entityType: string = '';
  public countryCode: string = '';
  public status: string = '';
  public messageOptions: any = {};
  public countries: any = [];

  // filtering the data in table
  public filterOptions: any = {
    keyword: '', country: '', status: '', type: ''
  };

  constructor(
    private dialogService: DialogService,
    private entityService: EntityService,
    private companyService: CompanyService,
    public exportCSVService: ExportCSVService,
    private userService: UserService,
    private snack: MatSnackBar,
    private translate: TranslateService
  ) {
    super();
  }

  ngOnInit() {
    this.countries = MasterDataCountry.all();
    this.typeOfcompaniesCollection = this.formCollectionHelper.getTypeOfCompaniesCollection();
    this.statusList = this.formCollectionHelper.getStatusList();
    this.getCompanies();
  }

  public getCompanies() {
    this.companyService.fetchList().subscribe(
      (response) => {
        this.selected = [];
        const data = CompanyModel.buildFromResponse(response);
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

    let companies = _.map(items, (item) => _.pick(item, ['id', 'type']))

    this.dialogService.deletionConfirm(this, items, {
      title: 'DELETE_CONFIRM',
      message: message,
      width: '738px',
      okButton: () => {
        this.companyService.deleteList(companies).subscribe(() => {
          this.showDeletedMessage();
          this.getCompanies();
        });
      },
    });
  }

  public setFilterType(value: string) {
    this.filterType = value;
  }

  public showNewCompanyForm() {
    this.dialogService.openPopUp(this, CompaniesFormComponent, {
      data: { isNew: true },
      width: '1150px',
      handleResponse: (data) => {
        if(data){
          this.showAddedMessage();
          this.getCompanies();
        }
      },
    });
  }

  public showEditCompanyForm(row) {
    this.dialogService.openPopUp(this, CompaniesFormComponent, {
      data: { isNew: false, company: row },
      width: '1150px',
      handleResponse: (data) => {
        this.showUpdatedMessage();
        this.getCompanies();
      },
      modelClass: CompanyModel
    });
  }

  public onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  public searchAndFilter({ keyword, entityType, countryCode, status }: any) {
    if (!_.isNil(keyword)) {
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

    const searchResult = this.listAllData.filter(({ name, type, canton_code, status }) => {
      return (
        (name.toLowerCase().indexOf(this.keyword) !== -1 || _.isEmpty(this.keyword)) &&
        type.indexOf(this.entityType) !== -1 &&
        (canton_code && canton_code.indexOf(this.countryCode) !== -1) &&
        status.indexOf(this.status) !== -1
      );
    });

    this.rows = searchResult;
  }

  public activateMultipleStatuses(rows, confirmation = true){
    this.updateMultipleStatuses(rows, 'active', confirmation);
  }

  public suspendMultipleStatuses(rows, confirmation = true){
    this.updateMultipleStatuses(rows, 'suspended', confirmation);
  }

  public updateMultipleStatuses(rows, status, confirmation = true){
    const companies = _.map(rows, (company) => _.pick(company, ['id', 'type']));

    let message = '<ul>';
    rows.forEach(row => { message += `<li>${row.name}</li>` });
    message += '</ul>';

    if(confirmation){
      this.dialogService.suspensionConfirm({
        title: 'SUSPEND_CONFIRM',
        message: message,
        width: '738px',
        okButton: () => {
          this.companyService.updateStatus(companies, status).subscribe(() => {
            rows.forEach(row => { row.status = status });
            this.selected = [];
            this.showSuspendedMessage();
          });
        },
      });
    }else{
      this.companyService.updateStatus(companies, status).subscribe(() => {
        rows.forEach(row => { row.status = status });
        this.showSuspendedMessage();
      });
    }
  }

  private showSuspendedMessage(){
    this.messageOptions = {
      type: 'success',
      message: 'SUSPEND_COMPANIES'
    }
  }

  private showDeletedMessage(){
    this.messageOptions = {
      type: 'success',
      message: 'DELETED_COMPANIES',
      scrollToTop: true
    }
  }

  private showAddedMessage(){
    this.messageOptions = {
      type: 'success',
      message: 'ADDED_COMPANY',
      scrollToTop: true
    }
  }

  private showUpdatedMessage(){
    this.messageOptions = {
      type: 'success',
      message: 'UPDATED_COMPANY',
      scrollToTop: true
    }
  }

  public sendResetPassword(row){
    if(!row.administrator_user){
      return false;
    }

    this.companyService.sendResetPassword(row.administrator_user.email).subscribe(
      response => {
        this.messageOptions = {
          type: 'success',
          message: 'SENT_RESET_PASSWORD_EMAIL'
        }
      }
    );
  }

}
