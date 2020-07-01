const Many = require('extends-classes');
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { FormBaseComponent } from 'app/shared/components/form.base.component';
import { ApplicationBaseComponent } from 'app/shared/components/application.base.component';
import { FormControlsHelper } from 'app/shared/helpers/form_controls.helper';
import { CompanyModel } from 'app/shared/models/company/company.model';
import { CompanyService } from 'app/services/company/company.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { FormCollectionHelper } from 'app/helpers/form_collection.helper';
import { FormHelper } from 'app/shared/helpers/form.helper';
import * as _ from 'lodash';

@Component({
  selector: 'user-pharmaceutical-companies-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class CompaniesFormComponent
                 extends Many(ApplicationBaseComponent, FormBaseComponent)
                 implements OnInit {

  public form: FormGroup;
  public formCollectionHelper = FormCollectionHelper;
  public typeOfcompaniesCollection: any = [];
  public step = 1;
  public selected = [];

  // for distinguish edit & new
  public isNew: boolean = true;
  public currentCompany: CompanyModel;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CompaniesFormComponent>,
    private fb: FormBuilder,
    private loader: AppLoaderService,
    private companyService: CompanyService
  ) {
    super();
  }

  ngOnInit() {
    this.isNew = this.data.isNew;
    if(this.isNew){
      this.currentCompany = new CompanyModel();
    }else{
      this.step = 2;
      this.currentCompany = this.data.company;
    }

    this.typeOfcompaniesCollection = this.formCollectionHelper.getTypeOfCompaniesCollection();
    this.buildForm();
  }

  public buildForm() {
    let user = this.currentCompany.administrator_user;

    this.form = this.fb.group({
      type: new FormControl(this.currentCompany.type, [Validators.required]),
      role: new FormControl({ value: 'Administrator', disabled: true }),
      user: new FormGroup({
        id: new FormControl(user.id, []),
        name: new FormControl(user.name, [Validators.required]),
        email: new FormControl(user.email, [Validators.required]),
        phone_number: new FormControl(user.phone_number, [Validators.required]),
        phone_country: new FormControl(user.phone_country || 'CR', [Validators.required]),
        secondary_phone_number: new FormControl(user.secondary_phone_number),
        secondary_phone_country: new FormControl(user.secondary_phone_country || 'CR'),
      }),
      company: new FormGroup( FormHelper.companyFields(this.currentCompany) )
    });
  }

  public changeCompanyType(){
    let disableBillingControls = this.form.get('type').value == 'Drugstore';
    let billingControls = this.form.get('company').get('billing_information_attributes')['controls'];
    _.each(billingControls, (control,) => {
      if(disableBillingControls){
        control.disable();
      }else{
        control.enable();
      }
    });
  }

  public submit() {
    if (this.form.valid) {
      if (this.data.isNew) {
        this.createCompany();
      } else {
        this.updateCompanyInformation();
      }
    }
  }

  private updateCompanyInformation() {
    this.loader.open();

    let params = this.form.value;
    this.companyService.update(this.currentCompany.id, params).subscribe(
      (response) => {
        this.loader.close();
        this.dialogRef.close(true);
      },
      (response) => {
        this.errorsMessages = response.error.errors.join('<br/>');
        this.loader.close();
      }
    );
  }

  private createCompany() {
    this.loader.open();
    let params = this.form.value;
    Object.assign(
      params['company'],
      // this field is disabled, so it won't able get by form.value, do it manual
      { company_code: this.form.get('company').get('company_code').value }
    );

    this.companyService.create(params).subscribe(
      (response) => {
        this.loader.close();
        this.dialogRef.close(response['data']['attributes']);
      },
      (response) => {
        this.errorsMessages = response.error.errors.join('<br/>');
        this.loader.close();
      }
    );
  }

  public continue() {
    this.step = this.step + 1;
  }

  public back() {
    this.step = this.step - 1;
  }

  public createAndAddAnotherCompany(){
    console.log(this.form.controls)
  }
}
