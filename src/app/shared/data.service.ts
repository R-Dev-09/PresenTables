import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { PresentForm } from './form.model';
import { Subject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private presentables: PresentForm[] = [];
  private pbUpdated = new Subject<PresentForm[]>();

  constructor(private http: HttpClient, private _snackbar: MatSnackBar) { }

  
  onCreatePresentable(postData: PresentForm) {
    return this.http.post(`api/`, postData).pipe(catchError(this.handleError.bind(this)));
  }

  onGetPresentables() {
    return this.http.get<{message: string, presentables: PresentForm[]}>(`api/`).pipe(
      catchError(this.handleError.bind(this)),
      tap(resPres => {
        this.presentables = resPres.presentables.map(pres => {
          return {
            ...pres,
            led: {
              ...pres.led,
              w1: pres.led.w1 ? pres.led.w1 : '-',
              w5: pres.led.w5 ? pres.led.w5 : '-'
            },
            opw: {
              ...pres.opw,
              w1: pres.opw.w1 ? pres.opw.w1 : '-',
              w5: pres.opw.w5 ? pres.opw.w5 : '-'
            }
          };
        });
        this.pbUpdated.next(this.presentables);
      })
    );
  }

  onDeletePresentable(presId: number) {
    return this.http.delete(`api/${presId}`).pipe(catchError(this.handleError.bind(this)));
  }

  onUpdatePresentable(putData: any, presId: number) {
    return this.http.put(`api/${presId}`, putData).pipe(catchError(this.handleError.bind(this)));
  }

  getPbUpdateListener() {
    return this.pbUpdated.asObservable();
  }

  private openSnackBar(message: string) {
    this._snackbar.open(message, 'OK', {
      duration: 5000
    });
  }

  private handleError(errorRes: HttpErrorResponse) {
    if (errorRes.status === 0) {
      this.openSnackBar('No connection: server offline');
      return throwError(errorRes.message);
    }
    console.log(errorRes);
    this.openSnackBar(errorRes.error.message)
    return throwError(errorRes.error.message);
  }
}
