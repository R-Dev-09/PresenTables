import { Injectable } from '@angular/core';
import { BottomsheetComponent } from './bottomsheet.component';
import { MatBottomSheet } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class BottomsheetService {

  constructor(private _bottomSheet: MatBottomSheet) { }

  openDeleteSheet(presId: number) {
    this._bottomSheet.open(BottomsheetComponent, {
      data: {type: 'delete', presId}
    });
  }

  openLogoutSheet() {
    this._bottomSheet.open(BottomsheetComponent, {
      data: {type: 'logout'}
    });
  }
}
