const Many = require('extends-classes');
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { FormBaseComponent } from 'app/shared/components/form.base.component';
import { ApplicationBaseComponent } from 'app/shared/components/application.base.component';
import * as _ from 'lodash';
import { FormCollectionHelper } from 'app/helpers/form_collection.helper';
import { FormControlsHelper } from 'app/shared/helpers/form_controls.helper';
import { DatatableBaseComponent } from 'app/shared/components/datatable.base.component';
import { MasterDataCountry } from 'app/shared/models/master-data/country.model';
import { DialogService } from 'app/shared/services/dialog.service';
import { ProfilePopupFormComponent } from '../create-profile/form.component';
import { LOCATIONS } from 'app/shared/master-data/sample_locations.master-data'

import { StrategyModel } from 'app/shared/models/strategy/strategy.model';
import { StrategyTypeModel } from 'app/shared/models/strategy_type/strategy_type.model';
import { StrategyProfileModel } from 'app/shared/models/strategy_profile/strategy_profile.model';
import { BenefitsProviderModel } from 'app/shared/models/benefits-provider/benefits-provider.model';

import { StrategyService } from 'app/services/strategy/strategy.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { enableRipple } from '@syncfusion/ej2-base';
import { TranslateService } from '@ngx-translate/core';
import { TreeViewComponent } from '@syncfusion/ej2-angular-navigations';
import { DataManager, Query, ReturnOption, Predicate } from '@syncfusion/ej2-data';

enableRipple(true);

@Component({
  selector: 'app-strategies-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class StrategyFormComponent extends Many(ApplicationBaseComponent, FormBaseComponent, DatatableBaseComponent)
  implements OnInit {

  @ViewChild('listTreeObj', { static: false }) public listTreeObj: TreeViewComponent;
  @ViewChild('locationnListTreeObj', { static: false }) public locationnListTreeObj: TreeViewComponent;

  public form: FormGroup;
  public strategy: StrategyModel;
  public search_geographically_target_market: string;
  public strategyTypes = [];
  public sponsors = [];
  public search_sponsor: string;
  public profiles = [];
  public errorsMessages: string;
  public formCollectionHelper = FormCollectionHelper;
  public isNew: boolean=true;
  public isSelectedSavedProfile: boolean = false;
  public amountOfTimesInputEnabled: boolean=false;
  public endDateInputEnabled: boolean=false;
  public currentFormStep: 1;
  public ageRangeLabel = '';
  public selectedGeographicalLocations = [];
  public percentageOfCustomersTargeted = 0;
  public addressAttributes = [];
  public masterDataCountry = [];
  public sponsorName = '';

  constructor(
    private fb: FormBuilder,
    private loader: AppLoaderService,
    private route: ActivatedRoute,
    private router: Router,
    private strategyService: StrategyService,
    private translate: TranslateService,
    private dialogService: DialogService
  ) {
    super();
  }

  // maps the appropriate column to fields property
  public field: Object = {
    dataSource: this.masterDataCountry,
    id: 'id',
    parentID: 'pid',
    text: 'name',
    hasChildren: 'hasChild',
    expanded: 'expanded'
  };

  // set the CheckBox to the TreeView
  public showCheckBox: boolean = true;

  public location_fields: Object = {
    dataSource: LOCATIONS,
    id: 'id',
    text: 'name'
  };

  ngOnInit() {
    this.strategy = new StrategyModel({});
    this.buildForm(this.strategy);

    const id = this.route.snapshot.params.id;
    this.isNew = !id;
    if(id){
      this.setStrategy(id, (strategy) => {
        this.isSelectedSavedProfile = !!strategy.strategy_profile_id;
        this.masterDataCountry = MasterDataCountry.listCountriesForTreeview(
          strategy.addresses_attributes
        );
        this.field['dataSource'] = this.masterDataCountry;

        this.buildForm(strategy);
      });
    }else{
      this.masterDataCountry = MasterDataCountry.listCountriesForTreeview();
      this.field['dataSource'] = this.masterDataCountry;
    }

    this.fetchProfiles();
    this.fetchStrategyTypes();
    this.fetchSponsors();
    this.setAgeRange();
    this.currentFormStep = 1;
  }

  //Change the dataSource for TreeView
  public changeDataSource(data) {
    this.listTreeObj.fields = {
      dataSource: data, id: 'id', text: 'name',
      parentID: 'pid', hasChildren: 'hasChild'
    }
  }

  //Filtering the TreeNodes
  public searchNodes(event) {
    let _text = event.target.value;
    let predicats = [], _array = [], _filter = [];
    if (_text == "") {
      this.changeDataSource(this.masterDataCountry);
    }
    else {
      let predicate = new Predicate('name', 'contains', _text, true);
      let filteredList = new DataManager(this.masterDataCountry).executeLocal(new Query().where(predicate));
      console.log(filteredList);

      for (let j = 0; j < filteredList.length; j++) {
        _filter.push(filteredList[j]["id"]);
        let filters = this.getFilterItems(filteredList[j], this.masterDataCountry);
        for (let i = 0; i < filters.length; i++) {
          if (_array.indexOf(filters[i]) == -1 && filters[i] != null) {
            _array.push(filters[i]);
            predicats.push(new Predicate('id', 'equal', filters[i], false));
          }
        }
      }

      if (predicats.length == 0) {
        this.changeDataSource([]);
      } else {
        let query = new Query().where(Predicate.or(predicats));
        let newList = new DataManager(this.masterDataCountry).executeLocal(query);
        this.changeDataSource(newList);
        let proxy = this;
        setTimeout(function (this) {
          proxy.listTreeObj.expandAll();
        }, 100);
      }
    }
  }

  //Find the Parent Nodes for corresponding childs
  public getFilterItems(fList, list) {
    let nodes = [];
    nodes.push(fList["id"]);
    let query2 = new Query().where('id', 'equal', fList["pid"], false);
    let fList1 = new  DataManager(list).executeLocal(query2);
    if (fList1.length != 0) {
      let pNode = this.getFilterItems(fList1[0], list);
      for (let i = 0; i < pNode.length; i++) {
        if (nodes.indexOf(pNode[i]) == -1 && pNode[i] != null) {
          nodes.push(pNode[i]);
        }
      }
      return nodes;
    }
    return nodes;
  }

  private fetchStrategyTypes() {
    this.strategyService.fetchTypesList().subscribe(response => {
      this.strategyTypes = StrategyTypeModel.buildFrom(_.map(response['data'], 'attributes'));
    })
  }

  private fetchSponsors() {
    this.strategyService.fetchSponsorsList().subscribe(response => {
      this.sponsors = BenefitsProviderModel.buildFrom(_.map(response['data'], 'attributes'));
    })
  }

  private setStrategy(id: string, callbackAfterGetStrategy) {
    this.strategyService.fetch(id).subscribe(response => {
      this.strategy = new StrategyModel(response['data']['attributes']);

      callbackAfterGetStrategy(this.strategy)
    });
  }

  public buildForm(item: StrategyModel) {
    item = item || this.strategy;

    this.form = this.fb.group({
      client_status: [item.client_status, [Validators.required]],
      age_min_limit: [item.age_min_limit, [Validators.required]],
      age_max_limit: [item.age_max_limit, [Validators.required]],
      all_ages_selected: [item.all_ages_selected],
      name: [item.name, [Validators.required]],
      description: [item.description],
      strategy_type_id: [item.strategy_type_id],
      terms_and_conditions_url: [item.terms_and_conditions_url],
      logo_url: [item.logo_url],
      benefits_provider_commerce_id: [item.benefits_provider_commerce_id],
      strategy_profile_id: [item.strategy_profile_id],
      gender_of_target_market: [item.gender_of_target_market, [Validators.required]],
      expiration_option: [item.expiration_option, [Validators.required]],
      initial_date: [item.initial_date, [Validators.required]],
      end_date: [item.end_date],
      can_be_exchanged: [item.can_be_exchanged],
      amount_of_times_can_be_exchanged: [item.amount_of_times_can_be_exchanged],
      addresses_attributes: this.fb.array([])
    })
  }

  public useSavedProfile($event) {
    this.isSelectedSavedProfile = $event.checked
  }

  public selectAllAges($event) {
    if ($event.checked) {
      this.form.controls['age_min_limit'].disable();
      this.form.controls['age_max_limit'].disable();
      this.ageRangeLabel = this.translate.instant('ALL');
    } else {
      this.form.controls['age_min_limit'].enable();
      this.form.controls['age_max_limit'].enable();
      this.ageRangeLabel = '';
    }
  }

  public showAmountOfTimesInput($event) {
    this.amountOfTimesInputEnabled = ($event.value == 'amount_defined');
  }

  public showEndDateInput($event) {
    this.endDateInputEnabled = ($event.value == 'defined');
  }

  private fetchProfiles() {
    this.strategyService.fetchProfiles().subscribe(response => {
      this.profiles = StrategyProfileModel.buildFrom(_.map(response['data'], 'attributes'));
    })
  }

  private fetchMarketCoverage() {
    let params = this.form.value;

    this.strategyService.fetchMarketCoverage(params).subscribe(response => {
      this.percentageOfCustomersTargeted = response['percentage'];
    })
  }

  public doesShowStepForm(step) {
    return this.currentFormStep == step;
  }

  public doesEnableContinueButton(step) {
    const fields_to_be_completed_on_each_step = {
      1 : [
        'age_min_limit', 'age_max_limit',
        'client_status', 'gender_of_target_market'
      ],
      2 : ['addresses_attributes'],
      3 : ['benefits_provider_commerce_id'],
      4 : ['name', 'description', 'strategy_type_id'],
      5 : ['can_be_exchanged'],
      6 : ['initial_date', 'expiration_option']
    };

    for (let item of fields_to_be_completed_on_each_step[step]) {
      if (this.form.controls[item].value == null) {
        return true;
      }
    }

    return false;
  }

  public setAgeRange() {
    let min = this.form.controls.age_min_limit.value;
    let max = this.form.controls.age_max_limit.value;

    if (min == null || max == null) {
      this.ageRangeLabel = '';
    } else {
      this.ageRangeLabel = [min, max].join(' - ');
    }
  }

  public setSponsorName(event) {
    let selectedSponsor = this.sponsors.filter(
      sponsor => sponsor.id === event.value
    )[0];

    this.sponsorName = selectedSponsor.name;
  }

  public setProfileAttributes(event) {
    if (event.value == null || event.value == '') {
      return
    }

    let selected_profile = this.profiles.filter(
      profile => profile.id === event.value
    )[0];

    this.strategy = new StrategyModel(selected_profile.strategy_attributes);
    this.strategy.strategy_profile_id = this.form.controls.strategy_profile_id.value;
    this.buildForm(this.strategy);
    this.setAgeRange();
  }

  public locationNodeChecked(event) {
    this.selectedGeographicalLocations = this.getLocationsFromNodeChecked()
    this.setAddressAttributes();
  }

  public getLocationsFromNodeChecked() {
    let selected_locations = this.masterDataCountry.filter(
      item => (
        this.listTreeObj.checkedNodes.some(e => e === item.id.toString()) && item.type === 'district'
      )
    );

    return selected_locations
  }

  public setAddressAttributes() {
    for (let item of this.selectedGeographicalLocations) {
      let addresses_attributes = this.fb.group({
        country_code: item.country_code,
        province_code: item.province_code,
        canton_code: item.canton_code,
        district_code: item.district_code
      });
      (this.form.controls.addresses_attributes as FormArray).push(addresses_attributes);
    }
  }

  public continue() {
    this.currentFormStep += 1;
    this.fetchMarketCoverage();
  }

  public openProfilePopUp() {
    this.dialogService.openPopUp(this, ProfilePopupFormComponent, {
      data: { title: 'NEW_PROFILE', strategy_attributes: this.form.value },
      width: '1150px'
    });
  }

  public getClassForStep(step) {
    if (this.currentFormStep > step) {
      return 'completed-step'
    } else if (this.currentFormStep == step) {
      return 'incompleted-step'
    }
  }

  public submit() {
    if (this.form.valid) {
      if (this.isNew) {
        this.createNewStrategy();
      } else {
        this.updateStrategyInformation();
      }
    }
  }

  private updateStrategyInformation() {
    this.loader.open();

    let params = this.form.value;

    this.strategyService.update(this.strategy.id, params).subscribe(
      (response) => {
        this.loader.close();
        this.showUpdateMessageSuccessful();
        this.router.navigate(['/dashboard/strategies']);
      },
      (response) => {
        this.errorsMessages = response.error.errors;
        this.loader.close();
      }
    );
  }

  private createNewStrategy() {
    this.loader.open();

    let params = this.form.value;
    this.strategyService.create(params).subscribe(
      (response) => {
        this.loader.close();
        this.router.navigate(['/dashboard/strategies']);
      },
      (response) => {
        this.loader.close();
        this.errorsMessages = response.error.errors.join('<br/>');
        this.scrollToTop();
      }
    );
  }
}
