import {AfterViewInit, Component, Inject, OnInit} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material';
import {HttpClient} from '@angular/common/http';
import * as $ from 'jquery';
import {LocationService} from '../../services/location.service';

declare var H: any;

@Component({
  selector: 'app-opened-place',
  templateUrl: './opened-place.component.html',
  styleUrls: ['./opened-place.component.css']
})
export class OpenedPlaceComponent implements OnInit, AfterViewInit {

  private readonly place: Place;

  addresLabel = '';
  targetLocation: any;
  addressLocation: any;
  group: any;

  constructor(
    private bottomSheetRef: MatBottomSheetRef<OpenedPlaceComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private locationService: LocationService,
    private http: HttpClient
  ) {
    this.place = data.data;
    this.group = data.group;
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    $('[data-fancybox="gallery"]').fancybox({});
  }

  close() {
    this.bottomSheetRef.dismiss();
  }

  route() {
    this.targetLocation = {
      latitude: this.place.location[0],
      longitude: this.place.location[1]
    };
  }

  searchAddress(event) {
    this.locationService.searchAddress(event.target.value).subscribe(result => {
      this.addresLabel = result.Response.View[0].Result[0].Location.Address.Label;
      this.addressLocation = result.Response.View[0].Result[0].Location.DisplayPosition;
      $('#addressAlert').css('opacity', 1);
      $('#addressAlert').text(this.addresLabel);
      $('#closeModal').css('opacity', 1);
    });
  }

  finishRoutes() {
    // tslint:disable-next-line:max-line-length
    this.http.get(`https://route.api.here.com/routing/7.2/calculateroute.json?app_id=UdRH6PlISTlADYsW6mzl&app_code=lfrrTheP9nBedeJyy1NtIA&waypoint0=geo!${this.addressLocation.Latitude},${this.addressLocation.Longitude}&waypoint1=geo!${this.targetLocation.latitude},${this.targetLocation.longitude}&mode=fastest;car;traffic:disabled&routeattributes=sh,gr`)
      .subscribe(result => {
        console.log(result);
        // @ts-ignore
        this.addRouteShapeToMap(result.response.route[0]);
        // @ts-ignore
        this.addManueversToMap(result.response.route[0]);
        this.bottomSheetRef.dismiss();
    });
  }

  addRouteShapeToMap(route) {
    const lineString = new H.geo.LineString();
    route.shape.forEach((point) => {
      const ll = point.split(',');
      lineString.pushLatLngAlt(+ll[0], +ll[1]);
    });
    this.group.removeAll();
    const polylineRoute = new H.map.Polyline(lineString, {
      style: {
        lineWidth  : 4,
        strokeColor: 'rgba(255, 255, 0, 0.7)'
      }
    });
    this.group.addObject(polylineRoute);
  }

  addManueversToMap(route) {
    // tslint:disable-next-line:one-variable-per-declaration
    const svgMarkup = '<svg width="18" height="18" ' +
      'xmlns="http://www.w3.org/2000/svg">' +
      '<circle cx="8" cy="8" r="8" ' +
      'fill="#666666" stroke="white" stroke-width="1"  />' +
      '</svg>',
      dotIcon = new H.map.Icon(svgMarkup, {anchor: {x: 8, y: 8}});

    for (let i = 0;  i < route.leg.length; i += 1) {
      for (let j = 0;  j < route.leg[i].maneuver.length; j += 1) {

        const maneuver = route.leg[i].maneuver[j];

        const marker =  new H.map.Marker({
            lat: maneuver.position.latitude,
            lng: maneuver.position.longitude},
          {icon: dotIcon});
        marker.instruction = maneuver.instruction;
        this.group.addObject(marker);
      }
    }

    this.group.addEventListener('tap', (evt) => {
    }, false);
  }
}
