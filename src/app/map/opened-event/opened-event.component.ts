import {Component, Inject, OnInit} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material';

@Component({
  selector: 'app-opened-event',
  templateUrl: './opened-event.component.html',
  styleUrls: ['./opened-event.component.css']
})
export class OpenedEventComponent implements OnInit {

  private readonly event: Event;

  constructor(
    private bottomSheetRef: MatBottomSheetRef<OpenedEventComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any
  ) {
    this.event = data.data;
  }

  ngOnInit() {
  }

  close() {
    this.bottomSheetRef.dismiss();
  }
}
