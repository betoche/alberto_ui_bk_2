import { Component, OnInit } from '@angular/core';
import { AdministratorService } from 'app/services/administrator/administrator.service';
import { egretAnimations } from 'app/shared/animations/egret-animations';
import { DatatableBaseComponent } from 'app/shared/components/datatable.base.component';
import * as _ from 'lodash';

import { UserModel } from 'app/shared/models/user.model';
import { DialogService } from 'app/shared/services/dialog.service';
import { ExportCSVService } from 'app/shared/services/export-csv/export-csv.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';

@Component({
  selector: 'app-support-agents',
  animations: egretAnimations,
  templateUrl: './support-agents.component.html',
  styleUrls: ['./support-agents.component.css']
})
export class SupportAgentsComponent extends DatatableBaseComponent implements OnInit {
  public rows: any = [];
  public scope: string = 'support_agent_users';

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
