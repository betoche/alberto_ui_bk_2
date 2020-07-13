import { Component, OnInit } from '@angular/core';
import { egretAnimations } from 'app/shared/animations/egret-animations';
import { ActivatedRoute, Router } from '@angular/router';

import { DatatableBaseComponent } from 'app/shared/components/datatable.base.component';
import { DialogService } from 'app/shared/services/dialog.service';
import { ExportCSVService } from 'app/shared/services/export-csv/export-csv.service';
import { FormCollectionHelper } from 'app/helpers/form_collection.helper';
import * as _ from 'lodash';


import { StrategyModel } from 'app/shared/models/strategy/strategy.model';
import { StrategyService } from 'app/services/strategy/strategy.service';
import { StrategyDetailComponent } from './detail/detail.component';
import { StrategyFormComponent } from './form/form.component';
import { MatSnackBar, MatDialog } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-strategies',
  animations: egretAnimations,
  templateUrl: './strategies.component.html',
  styleUrls: ['./strategies.component.css']
})

export class StrategiesComponent extends DatatableBaseComponent implements OnInit {
  public rows: any = [];
  public listAllData: any = [];
  public formCollectionHelper = FormCollectionHelper;
  public typeOfcompaniesCollection: any = [];
  public selected: any = [];
  public successful: boolean = false;
  public keyword: string = '';

  // filtering the data in table
  public filterOptions: any = {
    keyword: '', name: ''
  };

  constructor(
    private dialogService: DialogService,
    private strategyService: StrategyService,
    public exportCSVService: ExportCSVService,
    private snack: MatSnackBar,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    super();
  }

  ngOnInit() {
    this.getStrategies();
  }

  private getStrategies() {
    this.strategyService.fetchList().subscribe(
      (response) => {
        this.selected = [];
        const data = StrategyModel.buildFrom(_.map(response['data'], 'attributes'));
        this.listAllData = [...data];
        this.rows = data;
      },
      (_error) => {
        this.rows = [];
      }
    );
  }

  public openPopUp(row: any = {}, isNew?) {
    this.dialogService.openPopUp(this, StrategyFormComponent, {
      data: { title: 'NEW_STRATEGY', payload: row, isNew: isNew },
      width: '1150px'
    });
  }

  public openDetail(row: any) {
    this.dialogService.openPopUp(this, StrategyDetailComponent, {
      data: { payload: row },
      width: '1150px'
    });
  }

  public editStrategy(row: any){
    this.router.navigate([`/dashboard/strategies/${row.id}/edit`]);
  }

  public deleteItem(row) {
    this.dialogService.deletionConfirm(this, row, {
      title: 'DELETE_CONFIRM',
      message: row.name,
      okButton: () => {
        this.strategyService.delete(row.id).subscribe();
      }
    });
  }
}
