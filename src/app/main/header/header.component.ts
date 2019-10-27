import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  scrollDawn() {
    $('html,body').animate({ scrollTop: $('main').offset().top - $('nav').height() - 50 }, 500);
  }
}
