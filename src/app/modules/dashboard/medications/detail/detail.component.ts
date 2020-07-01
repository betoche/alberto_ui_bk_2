const Many = require('extends-classes');
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { FormBaseComponent } from 'app/shared/components/form.base.component';
import { ApplicationBaseComponent } from 'app/shared/components/application.base.component';
import { FormControlsHelper } from 'app/shared/helpers/form_controls.helper';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from 'app/shared/services/dialog.service';
import { DatatableBaseComponent } from 'app/shared/components/datatable.base.component';

import { MedicationModel } from 'app/shared/models/medication/medication.model';
import { MedicationService } from 'app/services/medication/medication.service';
import { MedicationCategoryService } from 'app/services/medication-category/medication-category.service';
import { MedicationCategoryModel } from 'app/shared/models/medication-category/medication-category.model';
import { PharmaceuticalCompanyService } from 'app/services/pharmaceutical-company/pharmaceutical-company.service';
import { PharmaceuticalCompanyModel } from 'app/shared/models/pharmaceutical-company/pharmaceutical-company.model';

import { FormCollectionHelper } from 'app/helpers/form_collection.helper';
import { FormHelper } from 'app/shared/helpers/form.helper';
import * as _ from 'lodash';

@Component({
  selector: 'app-medication-details',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class MedicationDetailComponent extends Many(
  ApplicationBaseComponent, FormBaseComponent, DatatableBaseComponent) implements OnInit {

  public medication: any={};

  constructor(
    private fb: FormBuilder,
    private dialogService: DialogService,
    private loader: AppLoaderService,
    private route: ActivatedRoute,
    private router: Router,
    private medicationService: MedicationService,
    private pharmaceuticalCompanyService: PharmaceuticalCompanyService,
    private medicationCategoryService: MedicationCategoryService,
  ) {
    super();
  }

  ngOnInit() {
    const id = this.route.snapshot.params.id;
    this.setMedication(id)
  }

  private setMedication(id: string) {
    this.medicationService.fetch(id).subscribe(response => {
      this.medication = new MedicationModel(response['data']['attributes']);
    });
  }

  public deleteItem() {
    let message = '<ul>';
    message += `<li>${this.medication.name}</li>`;
    message += '</ul>';

    this.dialogService.deletionConfirm(this, this.medication, {
      title: 'DELETE_CONFIRM',
      message: message,
      width: '738px',
      okButton: () => {
        this.medicationService.delete(this.medication.id).subscribe(() => {
          this.router.navigate([`/dashboard/medications`]);
        });
      },
    });
  }
}
