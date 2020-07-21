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
import { UserWithCompanyFormHepler } from 'app/shared/helpers/user_with_company_form.helper';
import { UserEntityModel } from 'app/shared/models/users/user.entity.model';
import { UserModel } from 'app/shared/models/users/user.model';
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

  public user: UserModel = new UserModel({});

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
      this.user.company = new CompanyModel();
    }else{
      this.step = 2;
      if(this.data.company.administrator_user){
        this.user = UserEntityModel.getUserInstance(this.data.company.administrator_user);
      }

      this.user.company = new CompanyModel(
        Object.assign(this.data.company, { without_user_relation: true })
      );
    }

    this.typeOfcompaniesCollection = this.formCollectionHelper.getTypeOfCompaniesCollection();

    this.buildForm();
  }

  public buildForm() {
    let companyFields = UserWithCompanyFormHepler.companyFields(
      this.user.company,
      { isBillingShownToUI: this.user.isBillingShownToUI() }
    );

    this.form = this.fb.group({
      is_billing_function_shown: new FormControl(this.user['isBillingFunctionShown'], []),
      type: new FormControl(this.user.company.type, [Validators.required]),
      role: new FormControl({ value: 'Administrator', disabled: true }),
      user: new FormGroup({
        id: new FormControl(this.user.id, []),
        name: new FormControl(this.user.name, [Validators.required]),
        email: new FormControl(this.user.email, [Validators.required]),
        phone_number: new FormControl(this.user.phone_number, [Validators.required]),
        phone_country: new FormControl(this.user.phone_country || 'CR', [Validators.required]),
        secondary_phone_number: new FormControl(this.user.secondary_phone_number),
        secondary_phone_country: new FormControl(this.user.secondary_phone_country || 'CR'),
      }),
      company: new FormGroup(companyFields)
    });
  }

  public changeCompanyType(){
    this.user = UserEntityModel.getUserInstance(
      {
        role: this.user.administratorRoleFromTypeOfCompany(this.form.get('type').value),
        company: Object.assign(
          { type: this.form.get('type').value }, { without_user_relation: true }
        )
      }
    );

    this.buildForm();
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

    let params = UserWithCompanyFormHepler.getFormValueForUserAndCompanyForm(this.form);

    this.companyService.update(this.user.company.id, params).subscribe(
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
    let params = UserWithCompanyFormHepler.getFormValueForUserAndCompanyForm(this.form);

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
    if (this.form.get('type').valid) {
      this.step = this.step + 1;
    }
  }

  public back() {
    this.step = this.step - 1;
  }

  public createAndAddAnotherCompany(){
    console.log(this.form.controls)
  }
}
