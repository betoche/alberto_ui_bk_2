const Many = require('extends-classes');
import { Component, OnInit, Inject } from '@angular/core';
import { FormBaseComponent } from 'app/shared/components/form.base.component';
import { ApplicationBaseComponent } from 'app/shared/components/application.base.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { DatatableBaseComponent } from 'app/shared/components/datatable.base.component';

import { StrategyModel } from 'app/shared/models/strategy/strategy.model';
import { StrategyService } from 'app/services/strategy/strategy.service';

import * as _ from 'lodash';

@Component({
  selector: 'app-strategy-confirmation',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class StrategyConfirmationPopupComponent extends Many(
  ApplicationBaseComponent, FormBaseComponent, DatatableBaseComponent) implements OnInit {

  public strategy: any={};
  public percentageOfCustomersTargeted = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<StrategyConfirmationPopupComponent>,
    private strategyService: StrategyService,
    private router: Router
  ) {
    super();
  }

  ngOnInit() {
    const strategy_attributes = this.data.strategy_attributes;
    this.setStrategy(strategy_attributes);
    this.fetchMarketCoverage();
  }

  private setStrategy(strategy_attributes: {}) {
    this.strategy = new StrategyModel(strategy_attributes);
  }

  private fetchMarketCoverage() {
    let params = this.strategy;

    this.strategyService.fetchMarketCoverage(params).subscribe(response => {
      this.percentageOfCustomersTargeted = response['percentage'];
    })
  }
}
