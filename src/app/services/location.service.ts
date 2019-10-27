import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  locationSubject = new BehaviorSubject(null);
  routeSubject = new BehaviorSubject(null);

  constructor(
    private httpClient: HttpClient
  ) { }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(location => {
        this.locationSubject.next({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        });
      }, () => {
        this.getByIpInfo();
      });
    } else {
      this.getByIpInfo();
    }
  }

  getByIpInfo() {
    this.httpClient.get<any>('https://ipinfo.io').subscribe(response => {
      const location = response.loc.split(',');
      this.locationSubject.next({
        latitude: +location[0],
        longitude: +location[1]
      });
    });
  }

  searchAddress(text): Observable<any> {
    // tslint:disable-next-line:max-line-length
    return this.httpClient.get(`https://geocoder.api.here.com/6.2/geocode.json?app_id=UdRH6PlISTlADYsW6mzl&app_code=lfrrTheP9nBedeJyy1NtIA&searchtext=${text}`);
  }
}
