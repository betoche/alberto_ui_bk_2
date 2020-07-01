const Many = require('extends-classes');
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { FormBaseComponent } from 'app/shared/components/form.base.component';
import { ApplicationBaseComponent } from 'app/shared/components/application.base.component';
import { FormControlsHelper } from 'app/shared/helpers/form_controls.helper';
import { PharmaceuticalCompanyModel } from 'app/shared/models/pharmaceutical-company/pharmaceutical-company.model';
import { PharmaceuticalCompanyService } from 'app/services/pharmaceutical-company/pharmaceutical-company.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { FormCollectionHelper } from 'app/helpers/form_collection.helper';

@Component({
  selector: 'user-pharmaceutical-companies-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class TotAllyUserFormComponent extends Many(ApplicationBaseComponent, FormBaseComponent) implements OnInit {
  public form: FormGroup;
  public company: PharmaceuticalCompanyModel;
  public formCollectionHelper = FormCollectionHelper;
  public companyTypeList: any = [];
  public step = 1;
  public selected = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<TotAllyUserFormComponent>,
    private fb: FormBuilder,
    private loader: AppLoaderService,
    private pharmaceuticalCompanyService: PharmaceuticalCompanyService
  ) {
    super();
  }

  ngOnInit() {
    this.company = new PharmaceuticalCompanyModel(this.data.payload);
    this.typeOfcompaniesCollection = this.formCollectionHelper.getTypeOfCompaniesCollection();
    this.buildForm(this.company);
  }

  public buildForm(item: PharmaceuticalCompanyModel) {
    item = item || this.company;
    this.form = this.fb.group({
      name: FormControlsHelper.requireFieldOnly(item.name),
      type: FormControlsHelper.requireFieldOnly(''),
      email: FormControlsHelper.emailField(item.name),
      role: new FormControl({
        value: 'Administrator',
        disabled: true,
      }),
      phone_country: new FormControl({
        value: '506',
        disabled: true,
      }),
      company_id: new FormControl({
        value: '313-510-678904-2',
        disabled: true,
      }),
    });
  }

  public submit() {
    console.log(this.form.valid);
    if (this.form.valid) {
      if (this.data.isNew) {
        this.createNewPharmaceuticalCompany();
      } else {
        this.updatePharmaceuticalCompanyInformation();
      }
    }
  }

  public continue() {
    console.log(this.form);
    this.step = this.step + 1;
  }

  public back() {
    this.step = this.step - 1;
  }
  private updatePharmaceuticalCompanyInformation() {
    this.loader.open();

    let params = this.form.value;
    this.pharmaceuticalCompanyService.update(this.company.id, params).subscribe(
      () => {
        this.loader.close();
        // this.showUpdateMessageSuccessful();
      },
      (response) => {
        this.errorsMessages = response.error.errors;
        this.loader.close();
      }
    );
  }

  private createNewPharmaceuticalCompany() {
    this.loader.open();

    let params = this.form.value;
    this.pharmaceuticalCompanyService.create(params).subscribe(
      (response) => {
        this.loader.close();
        this.dialogRef.close(response['data']['attributes']);
      },
      (response) => {
        this.errorsMessages = response.error.errors;
        this.loader.close();
      }
    );
  }
}
