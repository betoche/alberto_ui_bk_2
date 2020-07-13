const Many = require('extends-classes');
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { FormBaseComponent } from 'app/shared/components/form.base.component';
import { ApplicationBaseComponent } from 'app/shared/components/application.base.component';
import { FormControlsHelper } from 'app/shared/helpers/form_controls.helper';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';

import { StrategyService } from 'app/services/strategy/strategy.service';
import { StrategyProfileModel } from 'app/shared/models/strategy_profile/strategy_profile.model';

import { FormCollectionHelper } from 'app/helpers/form_collection.helper';
import { FormHelper } from 'app/shared/helpers/form.helper';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';

@Component({
  selector: 'profile-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class ProfilePopupFormComponent extends Many(ApplicationBaseComponent, FormBaseComponent) implements OnInit {
  public form: FormGroup;
  public strategyProfile: StrategyProfileModel;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ProfilePopupFormComponent>,
    private fb: FormBuilder,
    private loader: AppLoaderService,
    private strategyService: StrategyService,
    private translate: TranslateService,
    private router: Router
  ) {
    super();
  }

  ngOnInit() {
    this.strategyProfile = new StrategyProfileModel({});
    this.buildForm(this.strategyProfile);
  }

  public buildForm(item: StrategyProfileModel) {
    item = item || this.strategyProfile;

    this.form = this.fb.group({
      name: [item.name, [Validators.required]],
      strategy_attributes: [this.data.strategy_attributes]
    });
  }

  public submit() {
    if (this.form.valid) {
      this.createNewProfile();
      this.dialogRef.close();
    }
  }

  private createNewProfile() {
    this.loader.open();

    let params = this.form.value;
    this.strategyService.createProfile(params).subscribe(
      () => {
        this.loader.close();
        this.showCreationMessageSuccessful(this.translate.instant('PROFILE_CREATED'));
      },
      response => {
        this.errorsMessages = response.error.errors;
        this.loader.close();
      }
    );
  }
}
