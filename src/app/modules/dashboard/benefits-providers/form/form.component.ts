const Many = require('extends-classes');
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormBaseComponent } from 'app/shared/components/form.base.component';
import { ApplicationBaseComponent } from 'app/shared/components/application.base.component';
import { FormControlsHelper } from 'app/shared/helpers/form_controls.helper';
import { BenefitsProviderModel } from 'app/shared/models/benefits-provider/benefits-provider.model';
import { BenefitsProviderService } from 'app/services/benefits-provider/benefits-provider.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';

@Component({
  selector: 'app-benefits-providers-form',
  templateUrl: './form.component.html'
})
export class BenefitsProviderFormComponent extends Many(ApplicationBaseComponent, FormBaseComponent) implements OnInit {
  public form: FormGroup;
  public benefit: BenefitsProviderModel;

  constructor(
    private fb: FormBuilder,
    private loader: AppLoaderService,
    private route: ActivatedRoute,
    private router: Router,
    private benefitsProviderService: BenefitsProviderService
  ) {
    super();
  }

  ngOnInit() {
    const id = this.route.snapshot.params.id;
    this.isNew = !id;
    this.benefit = new BenefitsProviderModel({});
    if (id) {
      this.setBenefitsProvider(id);
    }

    this.buildForm(this.benefit);
  }

  private setBenefitsProvider(id: string) {
    this.benefitsProviderService.fetch(id).subscribe(response => {
      this.benefit = new BenefitsProviderModel(response['data']['attributes']);
      this.form.patchValue(this.benefit);
    });
  }

  public buildForm(item: BenefitsProviderModel) {
    item = item || this.benefit;

    this.form = this.fb.group({
      name: FormControlsHelper.requireFieldOnly(item.name)
    });
  }

  public submit() {
    if (this.form.valid) {
      if (this.isNew) {
        this.createNewBenefitsProvider();
      } else {
        this.updateBenefitsProviderInformation();
      }
    }
  }

  private updateBenefitsProviderInformation() {
    this.loader.open();

    let params = this.form.value;
    this.benefitsProviderService.update(this.benefit.id, params).subscribe(
      () => {
        this.loader.close();
        this.showUpdateMessageSuccessful();
        this.router.navigate(['/dashboard/benefits-providers']);
      },
      response => {
        this.errorsMessages = response.error.errors;
        this.loader.close();
      }
    );
  }

  private createNewBenefitsProvider() {
    this.loader.open();

    let params = this.form.value;
    this.benefitsProviderService.create(params).subscribe(
      () => {
        this.loader.close();
        this.showUpdateMessageSuccessful();
        this.router.navigate(['/dashboard/benefits-providers']);
      },
      response => {
        this.errorsMessages = response.error.errors;
        this.loader.close();
      }
    );
  }
}
