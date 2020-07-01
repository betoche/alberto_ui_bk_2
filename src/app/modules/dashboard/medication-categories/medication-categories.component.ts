import { Component, OnInit } from '@angular/core';
import { egretAnimations } from 'app/shared/animations/egret-animations';
import { DatatableBaseComponent } from 'app/shared/components/datatable.base.component';
import { MedicationCategoryModel } from 'app/shared/models/medication-category/medication-category.model';
import { DialogService } from 'app/shared/services/dialog.service';
import { MedicationCategoryService } from 'app/services/medication-category/medication-category.service';
import { ExportCSVService } from 'app/shared/services/export-csv/export-csv.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-medication-categories',
  animations: egretAnimations,
  templateUrl: './medication-categories.component.html',
  styleUrls: ['./medication-categories.component.css']
})
export class MedicationCategoriesComponent extends DatatableBaseComponent implements OnInit {
  public rows: any = [];

  constructor(
    private dialogService: DialogService,
    private medicationCategoryService: MedicationCategoryService,
    public exportCSVService: ExportCSVService
  ) {
    super();
  }

  ngOnInit() {
    this.getMedicationCategories();
  }

  private getMedicationCategories() {
    this.medicationCategoryService.fetchList().subscribe(
      response => {
        this.rows = MedicationCategoryModel.buildFrom(_.map(response['data'], 'attributes'));
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
        this.medicationCategoryService.delete(row.id).subscribe();
      }
    });
  }
}
