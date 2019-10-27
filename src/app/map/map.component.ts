import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {PlacesService} from '../services/places.service';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {OpenedPlaceComponent} from './opened-place/opened-place.component';
import {EventsService} from '../services/events.service';
import {OpenedEventComponent} from './opened-event/opened-event.component';
import {LocationService} from '../services/location.service';
import {HttpClient} from '@angular/common/http';
import * as $ from 'jquery';

declare var H: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit {

  private platform: any;
  private map: any;
  places: Place[];

  private updateTimeout: number;

  private placesGroup = new H.map.Group();
  private routingGroup = new H.map.Group();
  private pointsLastUpdate = {
    places: null
  };

  tags = [
    {
      key: 'Парки',
      isCheck: false
    },
    {
      key: 'База отдыха',
      isCheck: false
    },
    {
      key: 'Частные дома',
      isCheck: false
    },
    {
      key: 'Производство',
      isCheck: false
    },
    {
      key: 'Фермы и ранчо',
      isCheck: false
    },
    {
      key: 'Алкоголь',
      isCheck: false
    }
  ];
  radius: number;
  addresLabel = '';
  targetLocation: any;

  @ViewChild('map', {static: false})
  public mapElement: ElementRef;

  constructor(
    private placesService: PlacesService,
    private bottomSheet: MatBottomSheet,
    private eventsService: EventsService,
    private locationService: LocationService,
    private http: HttpClient
  ) {
    this.platform = new H.service.Platform({
      app_id: 'UdRH6PlISTlADYsW6mzl',
      app_code: 'lfrrTheP9nBedeJyy1NtIA',
      useHTTPS: true
    });
  }

  changeR() {
    this.refresh();
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    const pixelRatio = window.devicePixelRatio || 1;
    const defaultLayers = this.platform.createDefaultLayers({
      lg : 'rus',
      tileSize: pixelRatio === 1 ? 256 : 512,
      ppi : pixelRatio === 1 ? undefined : 320
    });
    this.map = new H.Map(
      this.mapElement.nativeElement,
      defaultLayers.normal.map,
      {
        zoom: 9,
        center: { lat: 45.04484, lng: 38.97603 }
      },
      {
        pixelRatio
      }
    );

    const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(this.map));

    const ui = H.ui.UI.createDefault(this.map, defaultLayers, 'ru-RU');

    const mapSettings = ui.getControl('mapsettings');
    const zoom = ui.getControl('zoom');
    const scalebar = ui.getControl('scalebar');
    const pano = ui.getControl('panorama');

    scalebar.setVisibility(false);

    mapSettings.setAlignment('bottom-center');
    zoom.setAlignment('bottom-center');
    pano.setAlignment('bottom-center');

    this.map.addEventListener('mapviewchange', () => {
      clearTimeout(this.updateTimeout);
      if (this.map.getZoom() > 0) {
        this.updateTimeout = setTimeout(() => {
          this.getPlacesData();
        }, 1500);
      }
    });

    this.map.addObject(this.placesGroup);
    this.map.addObject(this.routingGroup);

    this.placesGroup.addEventListener('tap', event => {
      this.openBottomSheet('place', event.target.getData().data);
    });

    this.locationService.locationSubject.subscribe(location => {
      if (location != null) {
        this.map.setCenter({lat: location.latitude, lng: location.longitude});
        this.map.setZoom(12);
      }
    });
  }

  openBottomSheet(type: string, data: any) {
    let component;
    if (type === 'place') {
      component = OpenedPlaceComponent;
    } else {
      component = OpenedEventComponent;
    }
    // @ts-ignore
    this.bottomSheet.open(component, {
      data: { data, service: this.locationService.routeSubject, group: this.routingGroup },
      panelClass: 'bottom-sheet'
    });
  }

  getPlacesData() {
    if (
      this.pointsLastUpdate.places == null ||
      this.placesService.getDistance(this.map.getCenter(), this.pointsLastUpdate.places) > 1000
    ) {
      let r = 0;
      if (!!this.radius) {
        r = this.radius / 111.13486;
      }
      this.placesService.getPlaces(
        this.map.getCenter().lat,
        this.map.getCenter().lng,
        r
      ).subscribe(places => {
        this.places = places.appartments;
        this.refresh();
      });
    }
  }

  refresh() {
    this.placesGroup.removeAll();

    this.places.forEach(place => {
      let isReady = true;
      this.tags.forEach(tag => {
        if (tag.isCheck) {
          let isR = false;
          place.tags.forEach(tttt => {
            if (tttt.toLowerCase() === tag.key.toLowerCase()) {
              isR = true;
            }
          });
          isReady = isReady && isR;
        }
      });
      if (isReady) {
        this.placesGroup.addObject(
          this.createMarker(place.location[0], place.location[1], place.photos[0], place)
        );
      }
    });
  }

  createMarker(latitude: number, longitude: number, icon: string, data: any): any {
    const domIcon = new H.map.DomIcon(`<div>
      <div style="
      border-radius: 50%;
      margin-top: -21px;
      margin-left: -21px;
      width: 42px;
      height: 42px;
      background: url(${icon}) no-repeat center / cover;
      border: 1px solid #999;" class="circle responsive-img"></div>
    </div>`);
    const position = {
      lat: latitude,
      lng: longitude
    };
    const marker = new H.map.DomMarker(position, {
      icon: domIcon, min: 0, max: 20
    });
    marker.setData({data});
    return marker;
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.map.getViewPort().resize();
  }

  searchAddress(event) {
    this.locationService.searchAddress(event.target.value).subscribe(result => {
      this.addresLabel = result.Response.View[0].Result[0].Location.Address.Label;
      this.targetLocation = result.Response.View[0].Result[0].Location.DisplayPosition;
      $('#addressAlerts').css('opacity', 1);
      $('#addressAlerts').text(this.addresLabel);
      $('#closeModals').css('opacity', 1);
    });
  }

  finishRoutes() {
    this.map.setCenter({lat: this.targetLocation.Latitude, lng: this.targetLocation.Longitude});
  }
  changeF() {
    this.refresh();
  }
}
