import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatListModule,
  MatIconModule,
  MatButtonModule,
  MatCardModule,
  MatMenuModule,
  MatSlideToggleModule,
  MatGridListModule,
  MatChipsModule,
  MatCheckboxModule,
  MatRadioModule,
  MatTabsModule,
  MatSelectModule,
  MatInputModule,
  MatProgressBarModule,
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ChartsModule } from 'ng2-charts';
import { SharedModule } from './../../shared/shared.module';
import { DashboardRoutes } from './dashboard.routing';
import { TranslateModule } from '@ngx-translate/core';
import { AgmCoreModule } from '@agm/core';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { AdministratorUsersComponent } from './administrator-users/administrator-users.component';
import { AdministratorUsersFormComponent } from './administrator-users/form/form.component';

import { BenefitProviderAdministratorsComponent } from './benefit-provider-administrators/benefit-provider-administrators.component';
import { BenefitProviderAdministratorsFormComponent } from './benefit-provider-administrators/form/form.component';

import { DrugstoreAdministratorsComponent } from './drugstore-administrators/drugstore-administrators.component';
import { DrugstoreAdministratorsFormComponent } from './drugstore-administrators/form/form.component';

import { MedicationDistributorsComponent } from './medication-distributors/medication-distributors.component';
import { MedicationDistributorsFormComponent } from './medication-distributors/form/form.component';

import { MedicationsComponent } from './medications/medications.component';
import { MedicationDetailComponent } from './medications/detail/detail.component';
import { MedicationFormComponent } from './medications/form/form.component';
import { MedicationPopupFormComponent } from './medications/popup-form/form.component';
import { MedicationCategoriesComponent } from './medication-categories/medication-categories.component';
import { MedicationCategoryFormComponent } from './medication-categories/form/form.component';

import { CompaniesComponent } from './companies/companies.component';
import { EditCompanyComponent } from './companies/edit/edit.component';
import { CompaniesFormComponent } from './companies/form/form.component';

import { TotAllyUsersComponent } from './tot-ally-users/tot-ally-users.component';
import { TotAllyUserFormComponent } from './tot-ally-users/form/form.component';

import { SupportAgentsComponent } from './support-agents/support-agents.component';
import { SupportAgentsFormComponent } from './support-agents/form/form.component';

import { DashboardIndexComponent } from './app-index/app-index.component';
import { EditProfileComponent } from './../../shared/modules/dashboard/edit-profile/edit-profile.component';

import { DialogService } from 'app/shared/services/dialog.service';

import { BenefitsProvidersComponent } from './benefits-providers/benefits-providers.component';
import { BenefitsProviderFormComponent } from './benefits-providers/form/form.component';

import { CompanyAdministratorsComponent } from './company-administrators/company-administrators.component';
import { CompanyAdministratorsFormComponent } from './company-administrators/form/form.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatMenuModule,
    MatSlideToggleModule,
    MatGridListModule,
    MatChipsModule,
    MatCheckboxModule,
    MatRadioModule,
    MatTabsModule,
    MatSelectModule,
    MatInputModule,
    MatProgressBarModule,
    FlexLayoutModule,
    NgxDatatableModule,
    ChartsModule,
    PerfectScrollbarModule,

    SharedModule,
    TranslateModule,
    RouterModule.forChild(DashboardRoutes),
    AgmCoreModule.forRoot({ apiKey: 'AIzaSyC2q98PSobmuY7FJI5AowXOSTSGNyuDjzU' }),
  ],
  declarations: [
    AdministratorUsersComponent,
    AdministratorUsersFormComponent,
    MedicationsComponent,
    MedicationDetailComponent,
    MedicationFormComponent,
    MedicationPopupFormComponent,
    MedicationCategoriesComponent,
    MedicationCategoryFormComponent,
    BenefitProviderAdministratorsComponent,
    BenefitProviderAdministratorsFormComponent,
    DrugstoreAdministratorsComponent,
    DrugstoreAdministratorsFormComponent,
    MedicationDistributorsComponent,
    MedicationDistributorsFormComponent,
    CompaniesComponent,
    EditCompanyComponent,
    CompaniesFormComponent,
    TotAllyUsersComponent,
    TotAllyUserFormComponent,
    DashboardIndexComponent,
    EditProfileComponent,
    SupportAgentsComponent,
    SupportAgentsFormComponent,
    BenefitsProvidersComponent,
    BenefitsProviderFormComponent,
    CompanyAdministratorsComponent,
    CompanyAdministratorsFormComponent
  ],
  entryComponents: [CompaniesFormComponent, TotAllyUserFormComponent, EditCompanyComponent, MedicationPopupFormComponent, MedicationDetailComponent],
  exports: [ReactiveFormsModule],
  providers: [DialogService],
})
export class DashboardModule {}
