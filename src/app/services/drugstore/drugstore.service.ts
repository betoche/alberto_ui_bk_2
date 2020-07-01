import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DrugstoreService {
  constructor(private http: HttpClient) {}

  public fetchList() {
    return this.http.get(environment.apiURL + '/administrators/drugstores');
  }

  public fetch(id) {
    return this.http.get(environment.apiURL + '/administrators/drugstores/' + id);
  }

  public update(id, params) {
    return this.http.put(environment.apiURL + '/administrators/drugstores/' + id, {
      drugstore: params
    });
  }

  public create(params) {
    return this.http.post(environment.apiURL + '/administrators/drugstores', {
      drugstore: params
    });
  }

  public delete(id) {
    return this.http.delete(environment.apiURL + '/administrators/drugstores/' + id);
  }
}
