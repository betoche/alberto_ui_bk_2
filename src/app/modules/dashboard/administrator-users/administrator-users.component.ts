import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AdministratorService } from 'app/services/administrator/administrator.service';
import { egretAnimations } from 'app/shared/animations/egret-animations';
import { DatatableBaseComponent } from 'app/shared/components/datatable.base.component';
import { AdministratorUsersFormComponent } from './form/form.component';
import { FormCollectionHelper } from 'app/helpers/form_collection.helper';
import * as _ from 'lodash';

import { injectorsGlobal } from 'app/shared/services/injectors_global.service';

import { UserModel } from 'app/shared/models/users/user.model';
import { DialogService } from 'app/shared/services/dialog.service';
import { ExportCSVService } from 'app/shared/services/export-csv/export-csv.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';

@Component({
  selector: 'app-administrator-users',
  animations: egretAnimations,
  templateUrl: './administrator-users.component.html',
  styleUrls: ['./administrator-users.component.scss'],
})
export class AdministratorUsersComponent extends DatatableBaseComponent implements OnInit {
  public rows: any = [];
  public scope: string = 'administrator_users';
  public role: string = '';
  public keyword: string = '';
  public formCollectionHelper = FormCollectionHelper;
  public administratorRoleList: any = [];

  constructor(
    private administratorService: AdministratorService,
    private dialogService: DialogService,
    public exportCSVService: ExportCSVService,
    private loader: AppLoaderService
  ) {
    super();
  }

  ngOnInit() {
    this.getUsers();
    this.administratorRoleList = this.formCollectionHelper.getAdministratorRoleList();
  }

  private getUsers() {
    const params = { keyword: this.keyword, role: this.role };
    this.loader.open();
    this.administratorService.fetchList(this.scope, params).subscribe(
      (response) => {
        this.loader.close();
        this.rows = UserModel.buildFrom(_.map(response['data'], 'attributes'));
      },
      (_error) => {
        this.loader.close();
        this.rows = [];
      }
    );
  }

  public deleteItem(row) {
    this.dialogService.deletionConfirm(this, row, {
      title: 'DELETE_USER',
      message: `
        <ul>
          <li>
            <div class="flex-space-between">
              <div>
                ${row.name}
              </div>
              <div>
                ${row.email}
              </div>
              <div>
                ${injectorsGlobal.translate.instant(row.role.toUpperCase())}
              </div>
            </div>
          </li>
        </ul>`,
      width: '738px',
      okButton: () => {
        this.administratorService.delete(this.scope, row.id).subscribe();
      },
    });
  }

  public openPopUp(row: any = {}, isNew?) {
    this.dialogService.openPopUp(this, AdministratorUsersFormComponent, {
      data: { title: 'ROLES_AND_PERMISSION', payload: row, isNew: isNew },
      handleResponse: (data) => {
        if (data) {
          this.getUsers();
        }
      },
    });
  }

  public setRole(role: string) {
    this.role = role;
    this.getUsers();
  }

  public searchUser(keyword: string) {
    this.keyword = keyword;
    this.getUsers();
  }
}
