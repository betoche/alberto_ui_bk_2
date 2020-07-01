import { injectorsGlobal } from 'app/shared/services/injectors_global.service';
import * as _ from 'lodash';

export const FormCollectionHelper = {
  getAdministratorRoleList: () => {
    return [
      {
        value: 'administrator',
        label: injectorsGlobal.translate.instant('ADMINISTRATOR'),
      },
      {
        value: 'support_administrator',
        label: injectorsGlobal.translate.instant('SUPPORT_ADMINISTRATOR'),
      },
      {
        value: 'business_administrator',
        label: injectorsGlobal.translate.instant('BUSINESS_ADMINISTRATOR'),
      },
    ];
  },
  getTypeOfCompaniesCollection: () => {
    return [
      {
        value: 'Drugstore',
        label: injectorsGlobal.translate.instant('DRUGSTORE'),
      },
      {
        value: 'PharmaceuticalCompany',
        label: injectorsGlobal.translate.instant('PHARMACEUTICAL_COMPANY'),
      },
      {
        value: 'BenefitsProviderCommerce',
        label: injectorsGlobal.translate.instant('BENEFITS_PROVIDER_COMMERCE'),
      },
    ];
  },

  getStatusList: () => {
    return [
      {
        value: 'active',
        label: injectorsGlobal.translate.instant('ACTIVE'),
      },
      {
        value: 'inactive',
        label: injectorsGlobal.translate.instant('INACTIVE'),
      },
      {
        value: 'pending',
        label: injectorsGlobal.translate.instant('PENDING'),
      },
      {
        value: 'suspended',
        label: injectorsGlobal.translate.instant('SUSPENDED'),
      },
    ];
  },

  getCompanyAdministratorRoleList: () => {
    return [
      {
        value: 'pharmaceutical_company_administrator',
        label: injectorsGlobal.translate.instant('PHARMACEUTICAL_COMPANY_ADMINISTRATOR')
      },
      {
        value: 'pharmaceutical_company_manager',
        label: injectorsGlobal.translate.instant('PHARMACEUTICAL_COMPANY_MANAGER')
      },
      {
        value: 'pharmaceutical_company_representative',
        label: injectorsGlobal.translate.instant('PHARMACEUTICAL_COMPANY_REPRESENTATIVE')
      }
    ];
  },

  getMedicationPresentationTypes: () => {
    return [
      {
        value: 'drops',
        label: injectorsGlobal.translate.instant('DROPS')
      },
      {
        value: 'vials',
        label: injectorsGlobal.translate.instant('VIALS')
      },
      {
        value: 'aplications',
        label: injectorsGlobal.translate.instant('APLICATIONS')
      },
      {
        value: 'ml',
        label: injectorsGlobal.translate.instant('ML')
      },
      {
        value: 'tablets',
        label: injectorsGlobal.translate.instant('TABLETS')
      }
    ]
  }
};
