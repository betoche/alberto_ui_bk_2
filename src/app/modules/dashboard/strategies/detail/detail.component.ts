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
  selector: 'app-strategy-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class StrategyDetailComponent extends Many(
  ApplicationBaseComponent, FormBaseComponent, DatatableBaseComponent) implements OnInit {

  public strategy: any={};
  public percentageOfCustomersTargeted = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<StrategyDetailComponent>,
    private strategyService: StrategyService,
    private router: Router
  ) {
    super();
  }

  ngOnInit() {
    const id = this.data.payload.id;
    this.percentageOfCustomersTargeted = this.data.percentage_of_oustomers_targeted;
    this.setStrategy(id);
    this.fetchMarketCoverage();
  }

  private setStrategy(id: string) {
    this.strategyService.fetch(id).subscribe(response => {
      this.strategy = new StrategyModel(response['data']['attributes']);
    });
  }

  private fetchMarketCoverage() {
    let params = this.strategy;

    this.strategyService.fetchMarketCoverage(params).subscribe(response => {
      this.percentageOfCustomersTargeted = response['percentage'];
    })
  }
}
