import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MedicationCategoryService {
  constructor(private http: HttpClient) {}

  public fetchList() {
    return this.http.get(environment.apiURL + '/administrators/medication_categories');
  }

  public fetch(id) {
    return this.http.get(environment.apiURL + '/administrators/medication_categories/' + id);
  }

  public update(id, params) {
    return this.http.put(environment.apiURL + '/administrators/medication_categories/' + id, {
      medication_category: params
    });
  }

  public create(params) {
    return this.http.post(environment.apiURL + '/administrators/medication_categories', {
      medication_category: params
    });
  }

  public delete(id) {
    return this.http.delete(environment.apiURL + '/administrators/medication_categories/' + id);
  }
}
