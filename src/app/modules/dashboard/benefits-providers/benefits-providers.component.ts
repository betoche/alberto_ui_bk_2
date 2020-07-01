import { Component, OnInit } from '@angular/core';
import { egretAnimations } from 'app/shared/animations/egret-animations';
import { DatatableBaseComponent } from 'app/shared/components/datatable.base.component';
import { BenefitsProviderModel } from 'app/shared/models/benefits-provider/benefits-provider.model';
import { DialogService } from 'app/shared/services/dialog.service';
import { BenefitsProviderService } from 'app/services/benefits-provider/benefits-provider.service';
import { ExportCSVService } from 'app/shared/services/export-csv/export-csv.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-benefits-providers',
  animations: egretAnimations,
  templateUrl: './benefits-providers.component.html',
  styleUrls: ['./benefits-providers.component.css']
})
export class BenefitsProvidersComponent extends DatatableBaseComponent implements OnInit {
  public rows: any = [];

  constructor(
    private dialogService: DialogService,
    private benefitsProviderService: BenefitsProviderService,
    public exportCSVService: ExportCSVService
  ) {
    super();
  }

  ngOnInit() {
    this.getBenefitsProviders();
  }

  private getBenefitsProviders() {
    this.benefitsProviderService.fetchList().subscribe(
      response => {
        this.rows = BenefitsProviderModel.buildFrom(_.map(response['data'], 'attributes'));
      },
      _error => {
        this.rows = [];
      }
    );
  }

  public deleteItem(row) {
    this.dialogService.deletionConfirm(this, row, {
      message: row.name,
      okButton: () => {
        this.benefitsProviderService.delete(row.id).subscribe();
      }
    });
  }
}
