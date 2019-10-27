import { Injectable } from '@angular/core';
import {ApiService} from './api.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventsService extends ApiService {

  constructor(
    private httpClient: HttpClient
  ) {
    super();
  }

  getEvents(latitude: number, longitude: number): Observable<Event[]> {
    return this.httpClient.get<Event[]>(this.url + 'getEvents.php?latitude=' + latitude + '&longitude=' + longitude);
  }
}
