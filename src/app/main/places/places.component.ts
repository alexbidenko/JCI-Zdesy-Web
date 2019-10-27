import { Component, OnInit } from '@angular/core';
import {PlacesService} from '../../services/places.service';
import {LocationService} from '../../services/location.service';

@Component({
  selector: 'app-places',
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.css']
})
export class PlacesComponent implements OnInit {

  private places: Place[];
  private pagePlaces: Place[];
  private startPage = 0;
  private endPage = 4;

  constructor(
    private placesService: PlacesService,
    private locationService: LocationService
  ) { }

  ngOnInit() {
    this.locationService.locationSubject.subscribe(location => {
      if (location != null) {
        this.placesService.getPlaces(location.latitude, location.longitude, 1).subscribe(places => {
          this.places = places.appartments;
          this.pagePlaces = places.appartments.slice(this.startPage, this.endPage);
        });
      }
    });
  }

  changePage(to: number) {
    if (to > 0) {
      if (this.endPage + 4 > this.places.length && this.endPage !== this.places.length) {
        this.endPage = this.places.length;
        this.startPage += 4;
      } else if (this.endPage !== this.places.length) {
        this.endPage += 4;
        this.startPage += 4;
      }
    } else {
      if (this.startPage - 4 < 0 && this.startPage !== 0) {
        this.endPage -= 4;
        this.startPage = 0;
      } else if (this.startPage !== 0) {
        this.startPage -= 4;
        this.endPage = this.startPage + 4;
      }
    }
    this.pagePlaces = this.places.slice(this.startPage, this.endPage);
  }
}
