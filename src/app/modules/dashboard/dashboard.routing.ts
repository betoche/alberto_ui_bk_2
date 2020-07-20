import { Routes } from '@angular/router';

import { AdministratorUsersComponent } from './administrator-users/administrator-users.component';
import { AdministratorUsersFormComponent } from './administrator-users/form/form.component';

import { BenefitProviderAdministratorsComponent } from './benefit-provider-administrators/benefit-provider-administrators.component';
import { BenefitProviderAdministratorsFormComponent } from './benefit-provider-administrators/form/form.component';

import { DrugstoreAdministratorsComponent } from './drugstore-administrators/drugstore-administrators.component';
import { DrugstoreAdministratorsFormComponent } from './drugstore-administrators/form/form.component';

import { MedicationsComponent } from './medications/medications.component';
import { MedicationFormComponent } from './medications/form/form.component';
import { MedicationDetailComponent } from './medications/detail/detail.component';

import { MedicationDistributorsComponent } from './medication-distributors/medication-distributors.component';
import { MedicationDistributorsFormComponent } from './medication-distributors/form/form.component';

import { MedicationCategoriesComponent } from './medication-categories/medication-categories.component';
import { MedicationCategoryFormComponent } from './medication-categories/form/form.component';

import { CompaniesComponent } from './companies/companies.component';

import { TotAllyUsersComponent } from './tot-ally-users/tot-ally-users.component';

import { SupportAgentsComponent } from './support-agents/support-agents.component';
import { SupportAgentsFormComponent } from './support-agents/form/form.component';
import { StrategiesComponent } from './strategies/strategies.component';
import { StrategyFormComponent } from './strategies/form/form.component';
import { StrategyDetailComponent } from './strategies/detail/detail.component';

import { DashboardIndexComponent } from './app-index/app-index.component';
import { EditProfileComponent } from 'app/shared/modules/dashboard/edit-profile/edit-profile.component';
import { ProfileComponent } from 'app/shared/modules/dashboard/profile/profile.component';
import { DataImportingComponent } from 'app/shared/modules/dashboard/data-importing/data-importing.component';

import { BenefitsProvidersComponent } from './benefits-providers/benefits-providers.component';
import { BenefitsProviderFormComponent } from './benefits-providers/form/form.component';

import { CompanyAdministratorsComponent } from './company-administrators/company-administrators.component';

import { TermsAndConditionsComponent } from 'app/shared/features/terms-and-conditions/terms-and-conditions.component';

export const DashboardRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'edit_profile',
        component: EditProfileComponent,
        data: { title: 'EDIT_PROFILE', breadcrumb: 'EDIT_PROFILE' },
      },
      {
        path: 'profile',
        component: ProfileComponent,
        data: { title: 'PROFILE', breadcrumb: 'PROFILE' },
      },
      {
        path: 'administrator-users',
        data: {
          title: 'ADMINISTRATOR_USERS',
          breadcrumb: 'ADMINISTRATOR_USERS',
        },
        children: [
          {
            path: '',
            component: AdministratorUsersComponent,
          },
          {
            path: 'new',
            data: { title: 'ADD', breadcrumb: 'ADD' },
            component: AdministratorUsersFormComponent,
          },
          {
            path: ':id/edit',
            data: { title: 'MODIFY', breadcrumb: 'MODIFY' },
            component: AdministratorUsersFormComponent,
          },
        ],
      },
      {
        path: 'medication-categories',
        data: {
          title: 'MEDICATION_CATEGORIES',
          breadcrumb: 'MEDICATION_CATEGORIES',
        },
        children: [
          {
            path: '',
            component: MedicationCategoriesComponent,
          },
          {
            path: 'new',
            data: { title: 'ADD', breadcrumb: 'ADD' },
            component: MedicationCategoryFormComponent,
          },
          {
            path: ':id/edit',
            data: { title: 'MODIFY', breadcrumb: 'MODIFY' },
            component: MedicationCategoryFormComponent,
          },
        ],
      },
      {
        path: 'medications',
        data: {
          title: 'MEDICATION',
          breadcrumb: 'MEDICATION',
        },
        children: [
          {
            path: '',
            component: MedicationsComponent,
          },
          {
            path: 'new',
            data: { title: 'ADD', breadcrumb: 'ADD' },
            component: MedicationFormComponent,
          },
          {
            path: ':id/edit',
            data: { title: 'MODIFY', breadcrumb: 'MODIFY' },
            component: MedicationFormComponent,
          },
          {
            path: ':id/details',
            data: { title: 'MODIFY', breadcrumb: 'MODIFY' },
            component: MedicationDetailComponent,
          },
        ],
      },
      {
        path: 'strategies',
        data: {
          title: 'STRATEGY',
          breadcrumb: 'STRATEGY',
        },
        children: [
          {
            path: '',
            component: StrategiesComponent,
          },
          {
            path: 'new',
            data: { title: 'ADD', breadcrumb: 'ADD' },
            component: StrategyFormComponent,
          },
          {
            path: ':id/edit',
            data: { title: 'MODIFY', breadcrumb: 'MODIFY' },
            component: StrategyFormComponent,
          },
          {
            path: ':id/detail',
            data: { title: 'MODIFY', breadcrumb: 'MODIFY' },
            component: StrategyDetailComponent,
          },
        ],
      },
      {
        path: 'companies',
        data: {
          title: 'ALLIES_TOT',
          breadcrumb: 'ALLIES_TOT',
        },
        children: [
          {
            path: '',
            component: CompaniesComponent,
          },
        ],
      },
      {
        path: 'users',
        data: {
          title: 'USERS',
          breadcrumb: 'USERS',
        },
        children: [
          {
            path: '',
            component: TotAllyUsersComponent,
          },
        ],
      },
      {
        path: 'terms-and-conditions',
        data: {
          title: 'TERMS_AND_CONDITIONS',
          breadcrumb: 'TERMS_AND_CONDITIONS',
        },
        component: TermsAndConditionsComponent
      },
      {
        path: 'data-importing/:type',
        component: DataImportingComponent,
        data: { title: 'IMPORT_DATA', breadcrumb: 'IMPORT_DATA' },
      },
      {
        path: '',
        component: ProfileComponent,
        data: { title: 'PROFILE', breadcrumb: 'PROFILE' }
      },
    ],
  },
];
