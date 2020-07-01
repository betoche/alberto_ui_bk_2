import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';

import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserEntityService {
  constructor(private http: HttpClient) {}

  public fetchList() {
    return this.http.get(environment.apiURL + '/administrators/user_entities');
  }

  public deleteList(ids) {
    return this.http.post(environment.apiURL + '/administrators/user_entities/', {
      user_ids: ids
    });
  }

  public updateStatus(user_ids, status) {
    return this.http.post(
      environment.apiURL + '/administrators/user_entities/update_status',
      { status: status, user_ids: user_ids }
    );
  }
}
