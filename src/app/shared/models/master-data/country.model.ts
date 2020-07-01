import { COUNTRIES } from 'app/shared/master-data/countries.master-data'
import * as _ from 'lodash';

export class MasterDataCountry{
  public name: string;
  public provinces: any = [];

  public static all(){
    let data = [];
    _.each(COUNTRIES, (country, code) => {
      let provinces = [];
      _.each(country.provinces, (province, province_id) => {
        provinces.push( { id: province_id, name: province.name } );
      });

      data.push( { name: country.name, code: code, provinces: provinces } );
    });

    return data;
  }
}
