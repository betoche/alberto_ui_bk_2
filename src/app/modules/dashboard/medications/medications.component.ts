import { Component, OnInit } from '@angular/core';
import { egretAnimations } from 'app/shared/animations/egret-animations';
import { ActivatedRoute, Router } from '@angular/router';

import { DatatableBaseComponent } from 'app/shared/components/datatable.base.component';
import { DialogService } from 'app/shared/services/dialog.service';
import { EntityService } from 'app/services/entity/entity.service';
import { ExportCSVService } from 'app/shared/services/export-csv/export-csv.service';
import { injectorsGlobal } from 'app/shared/services/injectors_global.service';
import { FormCollectionHelper } from 'app/helpers/form_collection.helper';
import * as _ from 'lodash';


import { MedicationModel } from 'app/shared/models/medication/medication.model';
import { MedicationService } from 'app/services/medication/medication.service';
import { MedicationPopupFormComponent } from './popup-form/form.component';
import { MedicationDetailComponent } from './detail/detail.component';
import { MatSnackBar, MatDialog } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { MedicationCategoryService } from 'app/services/medication-category/medication-category.service';
import { MedicationCategoryModel } from 'app/shared/models/medication-category/medication-category.model';
import { PharmaceuticalCompanyService } from 'app/services/pharmaceutical-company/pharmaceutical-company.service';
import { PharmaceuticalCompanyModel } from 'app/shared/models/pharmaceutical-company/pharmaceutical-company.model';

@Component({
  selector: 'app-medications',
  animations: egretAnimations,
  templateUrl: './medications.component.html',
  styleUrls: ['./medications.component.css']
})

export class MedicationsComponent extends DatatableBaseComponent implements OnInit {
  public rows: any = [];
  public listAllData: any = [];
  public formCollectionHelper = FormCollectionHelper;
  public typeOfcompaniesCollection: any = [];
  public selected: any = [];
  public successful: boolean = false;
  public keyword: string = '';
  public medicationCategory: string;
  public pharmaceuticalCompany: string;
  public pharmaceuticalCompanies = [];
  public medicationCategories = [];

  constructor(
    private dialogService: DialogService,
    private medicationService: MedicationService,
    public exportCSVService: ExportCSVService,
    private snack: MatSnackBar,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router,
    private medicationCategoryService: MedicationCategoryService,
    private pharmaceuticalCompanyService: PharmaceuticalCompanyService
  ) {
    super();
  }

  ngOnInit() {
    this.typeOfcompaniesCollection = this.formCollectionHelper.getTypeOfCompaniesCollection();
    this.getMedications();
    this.fetchMedicationCategories()
    this.fetchPharmaceuticalCompanies()
  }

  private fetchMedicationCategories() {
    this.medicationCategoryService.fetchList().subscribe(response => {
      this.medicationCategory = 'ALL'
      this.medicationCategories = MedicationCategoryModel.buildFrom(_.map(response['data'], 'attributes'));
    })
  }

  private fetchPharmaceuticalCompanies() {
    this.pharmaceuticalCompanyService.fetchListPharmaceuticalCompanies().subscribe(response => {
      this.pharmaceuticalCompany = 'ALL'
      this.pharmaceuticalCompanies = PharmaceuticalCompanyModel.buildFrom(_.map(response['data'], 'attributes'));
    })
  }

  public getMedications() {
    this.medicationService.fetchList().subscribe(
      (response) => {
        this.selected = [];
        const data = MedicationModel.buildFrom(_.map(response['data'], 'attributes'));
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
        this.medicationService.deleteList(items).subscribe(() => {
          this.getMedications();
        });
      },
    });
  }

  public openPopUp(row: any = {}, isNew?) {
    this.dialogService.openPopUp(this, MedicationPopupFormComponent, {
      data: { title: 'NEW_MEDICATION', payload: row, isNew: isNew },
      width: '1150px'
    });
  }

  public openDetail(row: any) {
    this.router.navigate([`/dashboard/medications/${row.id}/details`]);
  }

  public editMedication(row: any){
    this.dialogService.openPopUp(this, MedicationPopupFormComponent, {
      data: { title: 'EDIT_MEDICATION', payload: row },
      width: '1150px'
    });
  }

  public onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  public searchAndFilter({ keyword, medicationCategory, pharmaceuticalCompany }: any = {}) {
    if (!_.isNil(keyword)) {
      this.keyword = keyword.toLowerCase();
    }

    const searchResult = this.listAllData.filter(({ name, medication_category_id, pharmaceutical_company_id }) => {
      return (
        (name.toLowerCase().indexOf(this.keyword) !== -1 || _.isEmpty(this.keyword)) &&
        (medicationCategory == medication_category_id || this.medicationCategory == 'ALL') &&
        (pharmaceuticalCompany == pharmaceutical_company_id || this.pharmaceuticalCompany == 'ALL')
      );
    });

    this.rows = searchResult;
  }

}
