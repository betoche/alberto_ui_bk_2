import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  constructor(private http: HttpClient) {}

  public fetchList() {
    return this.http.get(environment.apiURL + '/administrators/companies');
  }

  public fetch(id) {
    return this.http.get(environment.apiURL + '/administrators/companies/' + id);
  }

  public update(id, params) {
    return this.http.put(environment.apiURL + '/administrators/companies/' + id, params);
  }

  public create(params) {
    return this.http.post(environment.apiURL + '/administrators/companies', params);
  }

  public delete(id) {
    return this.http.delete(environment.apiURL + '/administrators/companies/' + id);
  }

  public deleteList(companies) {
    return this.http.post(environment.apiURL + '/administrators/companies/destroy_list', {
      companies: companies,
    });
  }

  public updateStatus(companies, status) {
    return this.http.post(
      environment.apiURL + '/administrators/companies/update_status',
      { status: status, companies: companies }
    );
  }

  public sendResetPassword(email) {
    return this.http.post(
      environment.apiURL + '/administrators/companies/reset_password',
      { email: email }
    );
  }
}
