const Many = require('extends-classes');
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { FormBaseComponent } from 'app/shared/components/form.base.component';
import { ApplicationBaseComponent } from 'app/shared/components/application.base.component';
import { FormControlsHelper } from 'app/shared/helpers/form_controls.helper';
import * as _ from 'lodash';
import { FormCollectionHelper } from 'app/helpers/form_collection.helper';
import { DatatableBaseComponent } from 'app/shared/components/datatable.base.component';

import { MedicationModel } from 'app/shared/models/medication/medication.model';
import { MedicationService } from 'app/services/medication/medication.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';

import { CountriesService } from 'app/services/administrator/countries.service';
import { CountryModel } from 'app/shared/models/country/country.model';
import { MedicationCategoryService } from 'app/services/medication-category/medication-category.service';
import { MedicationCategoryModel } from 'app/shared/models/medication-category/medication-category.model';
import { PharmaceuticalCompanyService } from 'app/services/pharmaceutical-company/pharmaceutical-company.service';
import { PharmaceuticalCompanyModel } from 'app/shared/models/pharmaceutical-company/pharmaceutical-company.model';

@Component({
  selector: 'app-medications-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class MedicationFormComponent extends Many(ApplicationBaseComponent, FormBaseComponent, DatatableBaseComponent)
  implements OnInit {
  public form: FormGroup;
  public medication: MedicationModel;
  public name: string;
  public errorsMessages: string;
  public pharmaceutical_company_id: string;
  public medication_category_id: string;
  public description: string;
  public pharmaceuticalCompanies = [];
  public medicationCategories = [];
  public formCollectionHelper = FormCollectionHelper;

  public isAddingCountries: boolean=false;
  public isSelectedAllCountries: boolean=false;
  public isNew: boolean=true;
  public allMedicationPrices = [];
  public selectedMedicationPrices = [];
  public selectedCountriesCodes = [];

  constructor(
    private fb: FormBuilder,
    private loader: AppLoaderService,
    private route: ActivatedRoute,
    private router: Router,
    private medicationService: MedicationService,
    private pharmaceuticalCompanyService: PharmaceuticalCompanyService,
    private medicationCategoryService: MedicationCategoryService,
    private countriesService: CountriesService,
  ) {
    super();
  }

  ngOnInit() {
    this.name = this.route.snapshot.queryParams.name;
    this.pharmaceutical_company_id = this.route.snapshot.queryParams.pharmaceutical_company_id;
    this.medication_category_id = this.route.snapshot.queryParams.medication_category_id;

    this.fetchPharmaceuticalCompanies()
    this.fetchMedicationCategories()

    this.medication = new MedicationModel({
      name: this.name,
      pharmaceutical_company_id: this.pharmaceutical_company_id,
      medication_category_id: this.medication_category_id,
    });
    this.buildForm(this.medication);

    const id = this.route.snapshot.params.id;
    this.isNew = !id;
    if (id) {
      this.setMedication(id, (medication) => {
        this.buildForm(this.medication);
        this.fetchCountries()
      });
    } else {
      this.buildForm(this.medication);
      this.fetchCountries()
    }
  }

  public priceWithIVA(item) {
    if (item.price.value == "" || item.iva_tax_percentage.value == "") {
      return 0
    } else {
      let price = parseFloat(item.price.value)
      let tax = parseFloat(item.iva_tax_percentage.value)
      return price * ((tax / 100) + 1 )
    }
  }

  public getSelectedCountries() {
    return _.filter(this.allMedicationPrices, { _destroy: false })
  }

  public addCountries() {
    this.isAddingCountries = true
  }

  public setMedicationPricesOnCountries() {
    this.isAddingCountries = false
  }

  public toggleCheckedAllCountries($event) {
    if ($event.checked) {
      this.isSelectedAllCountries = true
      _.map(this.form['controls']['medication_prices_attributes']['controls'], (medication_price_control) => {
        return medication_price_control.patchValue({_destroy: false})
      })
    } else {
      this.isSelectedAllCountries = false
      _.map(this.form['controls']['medication_prices_attributes']['controls'], (medication_price_control) => {
        return medication_price_control.patchValue({_destroy: true})
      })
    }
  }

  public toggleMedicationPrice($event, medication_price, index) {
    if ($event.checked) {
      medication_price.patchValue({_destroy: false})
    } else {
      medication_price.patchValue({_destroy: true})
    }

    if (_.filter(this.form.controls.medication_prices_attributes.value, {_destroy: true}).length == 0) {
      this.isSelectedAllCountries = true
    } else {
      this.isSelectedAllCountries = false
    }
  }

  public isSelectedCountry(country) {
    let medicationPrice = _.find(this.selectedMedicationPrices, {code: country.code})

    return !!medicationPrice
  }

  private fetchCountries() {
    this.countriesService.fetchList().subscribe(
      response => {
        if (this.medication.medication_prices_attributes.length > 0) {
          _.forEach(response, country => {
            let medicationPrice = _.find(this.medication.medication_prices_attributes, {country_code: country.code})
            let medication_price_attributes
            if (!!medicationPrice) {
              medication_price_attributes = this.fb.group({
                id: medicationPrice.id,
                country_code: country.code,
                country_name: country.name,
                price: medicationPrice.price,
                iva_tax_percentage: medicationPrice.iva_tax_percentage,
                _destroy: false
              });
            } else {
              medication_price_attributes = this.fb.group({
                country_code: country.code,
                country_name: country.name,
                price: '',
                iva_tax_percentage: '',
                _destroy: true
              });
            }
            (this.form.controls.medication_prices_attributes as FormArray).push(medication_price_attributes);
          })
        } else {
          _.forEach(response, country => {
            let medication_price_attributes = this.fb.group({
              country_code: country.code,
              country_name: country.name,
              price: '',
              iva_tax_percentage: '',
              _destroy: true
            });
            (this.form.controls.medication_prices_attributes as FormArray).push(medication_price_attributes);
          })
        }
      },
      _error => {
        this.allMedicationPrices = [];
      }
    );
  }

  private fetchMedicationCategories() {
    this.medicationCategoryService.fetchList().subscribe(response => {
      this.medicationCategories = MedicationCategoryModel.buildFrom(_.map(response['data'], 'attributes'));
    })
  }

  private fetchPharmaceuticalCompanies() {
    this.pharmaceuticalCompanyService.fetchListPharmaceuticalCompanies().subscribe(response => {
      this.pharmaceuticalCompanies = PharmaceuticalCompanyModel.buildFrom(_.map(response['data'], 'attributes'));
    })
  }

  private setMedication(id: string, callbackAfterGetMedication) {
    this.medicationService.fetch(id).subscribe(response => {
      this.medication = new MedicationModel(response['data']['attributes']);

      if (!!this.pharmaceutical_company_id && !!this.name && this.medication_category_id) {
        this.medication = Object.assign(this.medication, {
          name: this.name,
          pharmaceutical_company_id: this.pharmaceutical_company_id,
          medication_category_id: this.medication_category_id,
        })
      }

      callbackAfterGetMedication(this.medication)
    });
  }

  public buildForm(item: MedicationModel) {
    this.medicationPresentationTypes = this.formCollectionHelper.getMedicationPresentationTypes();

    item = item || this.medication;

    this.form = this.fb.group({
      name: FormControlsHelper.requireFieldOnly(item.name),
      pharmaceutical_company_id: FormControlsHelper.requireFieldOnly(item.pharmaceutical_company_id),
      medication_category_id: FormControlsHelper.requireFieldOnly(item.medication_category_id),
      pharmaceutical_company_id_disabled: new FormControl({ value: item.pharmaceutical_company_id, disabled: true }),
      code: FormControlsHelper.requireFieldOnly(item.code),
      logo_url: FormControlsHelper.requireFieldOnly(item.logo_url),
      description: FormControlsHelper.requireFieldOnly(item.description),
      adults_dosification_amount: [item.adults_dosification_amount, [Validators.required]],
      adults_dosification_frequency_measure: [item.adults_dosification_frequency_measure, [Validators.required]],
      adults_dosification_frequency: [item.adults_dosification_frequency, [Validators.required]],
      children_dosification_amount: [item.children_dosification_amount, [Validators.required]],
      children_dosification_frequency_measure: [item.children_dosification_frequency_measure, [Validators.required]],
      children_dosification_frequency: [item.children_dosification_frequency, [Validators.required]],
      medication_presentations_attributes: this.fb.array([]),
      medication_prices_attributes: this.fb.array([])
    })

    if (this.isNew) {
      let medication_presentation_attributes = this.fb.group({
        presentation_type: FormControlsHelper.requireFieldOnly(''),
        presentation_content: FormControlsHelper.requireFieldOnly('')
      });
      (this.form.controls.medication_presentations_attributes as FormArray).push(medication_presentation_attributes);
    } else {
      this.medication.medication_presentations_attributes.forEach(medication_presentation => {
        let medication_presentation_attributes = this.fb.group({
          id: FormControlsHelper.requireFieldOnly(medication_presentation.id),
          presentation_type: FormControlsHelper.requireFieldOnly(medication_presentation.presentation_type),
          presentation_content: FormControlsHelper.requireFieldOnly(medication_presentation.presentation_content)
        });
        (this.form.controls.medication_presentations_attributes as FormArray).push(medication_presentation_attributes);
      })
    }
  }

  public submit() {
    if (this.form.valid) {
      if (this.isNew) {
        this.createNewMedication();
      } else {
        this.updateMedicationInformation();
      }
    }
  }

  private updateMedicationInformation() {
    this.loader.open();

    let params = this.form.value;

    this.medicationService.update(this.medication.id, params).subscribe(
      () => {
        this.loader.close();
        this.showUpdateMessageSuccessful();
        this.router.navigate(['/dashboard/medications']);
      },
      response => {
        this.errorsMessages = response.error.errors;
        this.loader.close();
      }
    );
  }

  private createNewMedication() {
    this.loader.open();

    let params = this.form.value;
    this.medicationService.create(params).subscribe(
      () => {
        this.loader.close();
        this.showUpdateMessageSuccessful();
        this.router.navigate(['/dashboard/medications']);
      },
      response => {
        this.errorsMessages = response.error.errors;
        this.loader.close();
      }
    );
  }
}
