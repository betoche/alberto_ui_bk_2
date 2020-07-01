import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdministratorService {
  constructor(private http: HttpClient) {}

  public fetchList(scope: string, params: any = {}) {
    return this.http.get(environment.apiURL + '/administrators/' + scope, { params });
  }

  public fetch(scope: string, id: string) {
    return this.http.get(environment.apiURL + '/administrators/' + scope + '/' + id);
  }

  public update(scope: string, id: string, params: any) {
    return this.http.put(environment.apiURL + '/administrators/' + scope + '/' + id, {
      user: params,
    });
  }

  public create(scope: string, params: any) {
    return this.http.post(environment.apiURL + '/administrators/' + scope + '', {
      user: params,
    });
  }

  public delete(scope: string, id: string) {
    return this.http.delete(environment.apiURL + '/administrators/' + scope + '/' + id);
  }
}
