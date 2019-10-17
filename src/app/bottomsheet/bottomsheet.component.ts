import { Component, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material';
import { AuthService } from '../auth/auth.service';
import { DataService } from '../shared/data.service';

@Component({
  selector: 'app-bottomsheet',
  templateUrl: './bottomsheet.component.html',
  styleUrls: ['./bottomsheet.component.scss']
})
export class BottomsheetComponent {

  type = this.data.type;
  presId = this.data.presId;
  isLoadingD = false;

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: any, private authService: AuthService, private _bottomSheetRef: MatBottomSheetRef<BottomsheetComponent>, private dataService: DataService) { }

  closeSheet() {
    this._bottomSheetRef.dismiss();
  }

  onDelete() {
    this.isLoadingD = true;
    this.dataService.onDeletePresentable(this.presId).subscribe(res => {
      this.dataService.onGetPresentables().subscribe();
      this.isLoadingD = false;
      this._bottomSheetRef.dismiss();
    }, error => {
      console.log(error);
      this.isLoadingD = false;
      this._bottomSheetRef.dismiss();
    });
  }

  onLogout() {
    this.authService.onLogout();
    this._bottomSheetRef.dismiss();
  }
}
