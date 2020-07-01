const Many = require('extends-classes');
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { FormBaseComponent } from 'app/shared/components/form.base.component';
import { ApplicationBaseComponent } from 'app/shared/components/application.base.component';
import { FormControlsHelper } from 'app/shared/helpers/form_controls.helper';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';

import { MedicationCategoryService } from 'app/services/medication-category/medication-category.service';
import { MedicationCategoryModel } from 'app/shared/models/medication-category/medication-category.model';
import { PharmaceuticalCompanyService } from 'app/services/pharmaceutical-company/pharmaceutical-company.service';
import { PharmaceuticalCompanyModel } from 'app/shared/models/pharmaceutical-company/pharmaceutical-company.model';

import { FormCollectionHelper } from 'app/helpers/form_collection.helper';
import { FormHelper } from 'app/shared/helpers/form.helper';
import * as _ from 'lodash';

@Component({
  selector: 'user-pharmaceutical-companies-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class MedicationPopupFormComponent extends Many(ApplicationBaseComponent, FormBaseComponent) implements OnInit {
  public form: FormGroup;
  public formUploadCsv: FormGroup;
  public medicationCategories = [];
  public pharmaceuticalCompanies = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<MedicationPopupFormComponent>,
    private fb: FormBuilder,
    private loader: AppLoaderService,
    private medicationCategoryService: MedicationCategoryService,
    private pharmaceuticalCompanyService: PharmaceuticalCompanyService,
    private router: Router,
  ) {
    super();
  }

  ngOnInit() {
    this.fetchMedicationCategories()
    this.fetchPharmaceuticalCompanies()
    this.buildForm();
  }

  private fetchPharmaceuticalCompanies() {
    this.pharmaceuticalCompanyService.fetchListPharmaceuticalCompanies().subscribe(response => {
      this.pharmaceuticalCompanies = PharmaceuticalCompanyModel.buildFrom(_.map(response['data'], 'attributes'));
    })
  }

  private fetchMedicationCategories() {
    this.medicationCategoryService.fetchList().subscribe(response => {
      this.medicationCategories = MedicationCategoryModel.buildFrom(_.map(response['data'], 'attributes'));
    })
  }

  public buildForm() {

    this.formUploadCsv = this.fb.group({
      csv_file_url: new FormControl('', [Validators.required]),
    })

    this.form = this.fb.group({
      name: FormControlsHelper.requireFieldOnly(this.data.payload.name),
      pharmaceutical_company_id: FormControlsHelper.requireFieldOnly(this.data.payload.pharmaceutical_company_id),
      medication_category_id: FormControlsHelper.requireFieldOnly(this.data.payload.medication_category_id)
    });
  }

  public continue() {
    if (this.form.valid) {
      this.dialogRef.close();
      if (this.data.isNew) {
        this.router.navigate(['/dashboard/medications/new'], { queryParams: this.form.value });
      } else {
        this.router.navigate([`/dashboard/medications/${this.data.payload.id}/edit`], { queryParams: this.form.value });
      }
    }
  }

}
