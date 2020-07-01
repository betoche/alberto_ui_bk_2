import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'environments/environment';
import _ from "lodash";

@Injectable({
  providedIn: 'root'
})
export class MedicationService {
  constructor(private http: HttpClient) {}

  public fetchList() {
    return this.http.get(environment.apiURL + '/administrators/medications');
  }

  public fetch(id) {
    return this.http.get(environment.apiURL + '/administrators/medications/' + id);
  }

  public update(id, params) {
    return this.http.put(environment.apiURL + '/administrators/medications/' + id, {
      medication: params
    });
  }

  public create(params) {
    return this.http.post(environment.apiURL + '/administrators/medications', {
      medication: params
    });
  }

  public delete(id) {
    return this.http.delete(environment.apiURL + '/administrators/medications/' + id);
  }

  public deleteList(items) {
    return this.http.post(environment.apiURL + '/administrators/medications/delete_list', {
      medication_ids: _.map(items, (item) => item.id),
    });
  }
}
