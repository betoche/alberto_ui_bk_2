const Many = require('extends-classes');
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormBaseComponent } from 'app/shared/components/form.base.component';
import { ApplicationBaseComponent } from 'app/shared/components/application.base.component';
import { FormControlsHelper } from 'app/shared/helpers/form_controls.helper';
import { MedicationCategoryModel } from 'app/shared/models/medication-category/medication-category.model';
import { MedicationCategoryService } from 'app/services/medication-category/medication-category.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';

@Component({
  selector: 'app-medication-categories-form',
  templateUrl: './form.component.html'
})
export class MedicationCategoryFormComponent extends Many(ApplicationBaseComponent, FormBaseComponent)
  implements OnInit {
  public form: FormGroup;
  public category: MedicationCategoryModel;

  constructor(
    private fb: FormBuilder,
    private loader: AppLoaderService,
    private route: ActivatedRoute,
    private router: Router,
    private medicationCategoryService: MedicationCategoryService
  ) {
    super();
  }

  ngOnInit() {
    const id = this.route.snapshot.params.id;
    this.isNew = !id;
    this.category = new MedicationCategoryModel({});
    if (id) {
      this.setMedicationCategory(id);
    }

    this.buildForm(this.category);
  }

  private setMedicationCategory(id: string) {
    this.medicationCategoryService.fetch(id).subscribe(response => {
      this.category = new MedicationCategoryModel(response['data']['attributes']);
      this.form.patchValue(this.category);
    });
  }

  public buildForm(item: MedicationCategoryModel) {
    item = item || this.category;

    this.form = this.fb.group({
      name: FormControlsHelper.requireFieldOnly(item.name)
    });
  }

  public submit() {
    if (this.form.valid) {
      if (this.isNew) {
        this.createNewMedicationCategory();
      } else {
        this.updateMedicationCategoryInformation();
      }
    }
  }

  private updateMedicationCategoryInformation() {
    this.loader.open();

    let params = this.form.value;
    this.medicationCategoryService.update(this.category.id, params).subscribe(
      () => {
        this.loader.close();
        this.showUpdateMessageSuccessful();
        this.router.navigate(['/dashboard/medication-categories']);
      },
      response => {
        this.errorsMessages = response.error.errors;
        this.loader.close();
      }
    );
  }

  private createNewMedicationCategory() {
    this.loader.open();

    let params = this.form.value;
    this.medicationCategoryService.create(params).subscribe(
      () => {
        this.loader.close();
        this.showUpdateMessageSuccessful();
        this.router.navigate(['/dashboard/medication-categories']);
      },
      response => {
        this.errorsMessages = response.error.errors;
        this.loader.close();
      }
    );
  }
}
