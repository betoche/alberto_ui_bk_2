import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'environments/environment';
import _ from "lodash";

@Injectable({
  providedIn: 'root'
})
export class StrategyService {
  constructor(private http: HttpClient) {}

  public fetchList(status) {
    return this.http.get(environment.apiURL + '/administrators/strategies', {
      params: Object.assign({
        status: status
      })
    });
  }

  public fetchTypesList() {
    return this.http.get(environment.apiURL + '/administrators/strategy_types');
  }

  public fetchSponsorsList() {
    return this.http.get(environment.apiURL + '/administrators/benefits_provider_commerces');
  }

  public fetchProfiles() {
    return this.http.get(environment.apiURL + '/administrators/strategies/profiles');
  }

  public fetch(id) {
    return this.http.get(environment.apiURL + '/administrators/strategies/' + id);
  }

  public fetchMarketCoverage(params) {
    return this.http.post(environment.apiURL + '/administrators/strategies/market_coverage', {
      params: params
    });
  }

  public update(id, params) {
    return this.http.put(environment.apiURL + '/administrators/strategies/' + id, {
      strategy: params
    });
  }

  public create(params) {
    return this.http.post(environment.apiURL + '/administrators/strategies', {
      strategy: params
    });
  }

  public createProfile(params) {
    return this.http.post(environment.apiURL + '/administrators/strategies/create_profile', {
      profile: params
    });
  }

  public delete(id) {
    return this.http.delete(environment.apiURL + '/administrators/strategies/' + id);
  }
}
