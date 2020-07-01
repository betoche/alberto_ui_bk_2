import { Component, OnInit } from '@angular/core';
import { AdministratorService } from 'app/services/administrator/administrator.service';
import { egretAnimations } from 'app/shared/animations/egret-animations';
import { DatatableBaseComponent } from 'app/shared/components/datatable.base.component';
import * as _ from 'lodash';

import { UserModel } from 'app/shared/models/user.model';
import { DialogService } from 'app/shared/services/dialog.service';
import { ExportCSVService } from 'app/shared/services/export-csv/export-csv.service';

@Component({
  selector: 'app-company-administrators',
  animations: egretAnimations,
  templateUrl: './company-administrators.component.html',
  styleUrls: ['./company-administrators.component.css']
})
export class CompanyAdministratorsComponent extends DatatableBaseComponent implements OnInit {
  public rows: any = [];
  public scope: string = 'pharmaceutical_companies_administrators';

  constructor(
    private administratorService: AdministratorService,
    private dialogService: DialogService,
    public exportCSVService: ExportCSVService
  ) {
    super();
  }

  ngOnInit() {
    this.getUsers();
  }

  private getUsers() {
    this.administratorService.fetchList(this.scope).subscribe(
      response => {
        this.rows = UserModel.buildFrom(_.map(response['data'], 'attributes'));
      },
      _error => {
        this.rows = [];
      }
    );
  }

  public deleteItem(row) {
    this.dialogService.deletionConfirm(this, row, {
      message: row.full_name,
      okButton: () => {
        this.administratorService.delete(this.scope, row.id).subscribe();
      }
    });
  }
}
