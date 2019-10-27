import {Component, HostListener, OnInit} from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  page = 1;
  oldScroll = 0;
  timeLastScrollUpdate = 0;

  constructor() { }

  ngOnInit() {
    setTimeout(() => {
      $('.hide-header-elements').removeClass('hide-header-elements');
    }, 200);
  }

  deltaPage(page: number): number {
    return Math.abs(page - this.page);
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (new Date().getTime() - this.timeLastScrollUpdate > 1000) {
      const scrolled = window.pageYOffset || document.documentElement.scrollTop;
      if (scrolled < this.oldScroll) {
        this.page--;
        if (this.page !== 1) {
          this.oldScroll = 1;
        } else {
          this.oldScroll = 0;
        }

        $('#nav-top').removeClass('nav-top-scrolled');
        $('#header-arrow').removeClass('hide-header-elements');

      } else {
        this.page++;
        this.oldScroll = 1;

        $('#nav-top').addClass('nav-top-scrolled');
        $('#header-arrow').addClass('hide-header-elements');
      }
      if (this.page !== 1) {
        setTimeout(() => {
          $('html,body').animate({scrollTop: 1}, 0);
        }, 300);
      }
      this.timeLastScrollUpdate = new Date().getTime();
    } else {
      $('html,body').animate({scrollTop: this.oldScroll}, 0);
    }
  }
}
