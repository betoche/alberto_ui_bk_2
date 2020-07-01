const Many = require('extends-classes');
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { FormBaseComponent } from 'app/shared/components/form.base.component';
import { ApplicationBaseComponent } from 'app/shared/components/application.base.component';
import { FormControlsHelper } from 'app/shared/helpers/form_controls.helper';
import { CompanyModel } from 'app/shared/models/company/company.model';
import { CompanyService } from 'app/services/company/company.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { FormHelper } from 'app/shared/helpers/form.helper';

@Component({
  selector: 'edit-company-form',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditCompanyComponent extends Many(ApplicationBaseComponent, FormBaseComponent) implements OnInit {
  public form: FormGroup;
  public company: CompanyModel;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditCompanyComponent>,
    private fb: FormBuilder,
    private loader: AppLoaderService,
    private companyService: CompanyService
  ) {
    super();
    this.company = this.data.payload;
    console.log(this.company)
    this.buildForm();
  }

  ngOnInit() {
  }

  public buildForm() {
    this.form = this.fb.group({
      company: new FormGroup(FormHelper.companyFields(this.company)),
      type: new FormControl(this.company.type)
    });
  }

  public submit() {
    if(this.form.valid) {
      this.updateCompanyInformation();
    }
  }

  private updateCompanyInformation() {
    this.loader.open();

    let params = this.form.value;
    this.companyService.update(this.company.id, params).subscribe(
      () => {
        this.loader.close();
        this.dialogRef.close(true);
        this.showUpdateMessageSuccessful();
      },
      (response) => {
        this.errorsMessages = response.error.errors.join('<br/>');
        this.loader.close();
      }
    );
  }

}
