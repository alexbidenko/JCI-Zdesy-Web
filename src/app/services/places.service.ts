import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ApiService} from './api.service';

@Injectable({
  providedIn: 'root'
})
export class PlacesService extends ApiService {

  constructor(
    private httpClient: HttpClient
  ) {
    super();
  }

  getPlaces(latitude: number, longitude: number, radius: number): Observable<{appartments: Place[]}> {
    return this.httpClient.post<{appartments: Place[]}>(
      this.url + `get`,
      {lat: latitude, lng: longitude, radius}
    );
  }
}
