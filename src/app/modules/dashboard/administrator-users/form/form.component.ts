const Many = require('extends-classes');
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormBaseComponent } from 'app/shared/components/form.base.component';
import { ApplicationBaseComponent } from 'app/shared/components/application.base.component';
import { FormControlsHelper } from 'app/shared/helpers/form_controls.helper';
import { UserModel } from 'app/shared/models/users/user.model';
import { AdministratorService } from 'app/services/administrator/administrator.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { FormCollectionHelper } from 'app/helpers/form_collection.helper';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-administrator-user-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class AdministratorUsersFormComponent extends Many(ApplicationBaseComponent, FormBaseComponent)
  implements OnInit {
  public form: FormGroup;
  public user: any = {};
  public formCollectionHelper = FormCollectionHelper;
  public administratorRoleList: any = [];
  public scope: string = 'administrator_users';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AdministratorUsersFormComponent>,
    private fb: FormBuilder,
    private loader: AppLoaderService,
    private administratorService: AdministratorService
  ) {
    super();
  }

  ngOnInit() {
    this.user = this.data.payload;
    this.buildItemForm(this.user);
  }

  public buildItemForm(item: UserModel) {
    this.administratorRoleList = this.formCollectionHelper.getAdministratorRoleList();

    this.form = this.fb.group({
      email: FormControlsHelper.emailField(item.email),
      name: FormControlsHelper.requireFieldOnly(item.name),
      government_id: FormControlsHelper.requireFieldOnly(item.government_id),
      role: FormControlsHelper.requireFieldOnly(item.role),
    });
  }

  public submit() {
    if (this.form.valid) {
      if (this.data.isNew) {
        this.createNewUser();
      } else {
        this.updateUserInformation();
      }
    }
  }

  private updateUserInformation() {
    this.loader.open();

    let params = this.form.value;
    this.administratorService.update(this.scope, this.user.id, params).subscribe(
      (response) => {
        this.loader.close();
        this.showUpdateMessageSuccessful();
        this.dialogRef.close(response['data']['attributes']);
      },
      (response) => {
        this.errorsMessages = response.error.errors;
        this.loader.close();
      }
    );
  }

  private createNewUser() {
    this.loader.open();

    let params = this.form.value;
    this.administratorService.create(this.scope, params).subscribe(
      (response) => {
        this.loader.close();
        this.showCreationMessageSuccessful();
        this.dialogRef.close(response['data']['attributes']);
      },
      (response) => {
        this.errorsMessages = response.error.errors;
        this.loader.close();
      }
    );
  }
}
