import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PharmaceuticalCompanyService {
  constructor(private http: HttpClient) {}

  public fetchList() {
    return this.http.get(environment.apiURL + '/administrators/pharmaceutical_companies');
  }



  public fetch(id) {
    return this.http.get(environment.apiURL + '/administrators/pharmaceutical_companies/' + id);
  }

  public update(id, params) {
    return this.http.put(environment.apiURL + '/administrators/pharmaceutical_companies/' + id, {
      pharmaceutical_company: params
    });
  }

  public create(params) {
    return this.http.post(environment.apiURL + '/administrators/pharmaceutical_companies', {
      pharmaceutical_company: params
    });
  }

  public delete(id) {
    return this.http.delete(environment.apiURL + '/administrators/pharmaceutical_companies/' + id);
  }

  public fetchListPharmaceuticalCompanies() {
    return this.http.get(environment.apiURL + '/pharmaceutical_companies_resources');
  }
}
