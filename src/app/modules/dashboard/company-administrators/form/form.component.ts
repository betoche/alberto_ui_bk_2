const Many = require('extends-classes');
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormBaseComponent } from 'app/shared/components/form.base.component';
import { ApplicationBaseComponent } from 'app/shared/components/application.base.component';
import { FormControlsHelper } from 'app/shared/helpers/form_controls.helper';
import { UserModel } from 'app/shared/models/user.model';
import { AdministratorService } from 'app/services/administrator/administrator.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { FormCollectionHelper } from 'app/helpers/form_collection.helper';

@Component({
  selector: 'app-administrator-user-form',
  templateUrl: './form.component.html'
})
export class CompanyAdministratorsFormComponent extends Many(ApplicationBaseComponent, FormBaseComponent)
  implements OnInit {
  public form: FormGroup;
  public formCollectionHelper = FormCollectionHelper;
  public administratorRoleList: any = [];
  public scope: string = 'pharmaceutical_companies_administrators';

  constructor(
    private fb: FormBuilder,
    private loader: AppLoaderService,
    private administratorService: AdministratorService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super();
  }

  ngOnInit() {
    const id = this.route.snapshot.params.id;
    this.isNew = !id;
    this.user = new UserModel({});
    if (id) {
      this.setUser(id);
    }
    this.buildItemForm(this.user);
  }

  private setUser(id: string) {
    this.administratorService.fetch(this.scope, id).subscribe(response => {
      this.user = new UserModel(response['data']['attributes']);
      this.form.patchValue(this.user);
    });
  }

  public buildItemForm(item: UserModel) {
    this.administratorRoleList = this.formCollectionHelper.getCompanyAdministratorRoleList();

    this.form = this.fb.group({
      email: FormControlsHelper.emailField(item.email),
      first_name: FormControlsHelper.requireFieldOnly(item.name),
      last_name: FormControlsHelper.requireFieldOnly(item.last_name),
      role: FormControlsHelper.requireFieldOnly(item.role)
    });
  }

  public submit() {
    if (this.form.valid) {
      if (this.isNew) {
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
      () => {
        this.loader.close();
        this.showUpdateMessageSuccessful();
        this.router.navigate(['/dashboard/company-administrators']);
      },
      response => {
        this.errorsMessages = response.error.errors;
        this.loader.close();
      }
    );
  }

  private createNewUser() {
    this.loader.open();

    let params = this.form.value;
    this.administratorService.create(this.scope, params).subscribe(
      () => {
        this.loader.close();
        this.showUpdateMessageSuccessful();
        this.router.navigate(['/dashboard/company-administrators']);
      },
      response => {
        this.errorsMessages = response.error.errors;
        this.loader.close();
      }
    );
  }
}
