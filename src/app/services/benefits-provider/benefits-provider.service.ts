import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BenefitsProviderService {
  constructor(private http: HttpClient) {}

  public fetchList() {
    return this.http.get(environment.apiURL + '/administrators/benefits_providers');
  }

  public fetch(id: string) {
    return this.http.get(environment.apiURL + '/administrators/benefits_providers/' + id);
  }

  public update(id: string, params: object) {
    return this.http.put(environment.apiURL + '/administrators/benefits_providers/' + id, {
      benefits_provider: params
    });
  }

  public create(params: any) {
    return this.http.post(environment.apiURL + '/administrators/benefits_providers', {
      benefits_provider: params
    });
  }

  public delete(id: string) {
    return this.http.delete(environment.apiURL + '/administrators/benefits_providers/' + id);
  }
}
