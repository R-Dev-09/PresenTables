import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CalcService {

  constructor() { }

  getYear() {
    const date = new Date();
    const month = 3600*24*31*1000;
    const newDate = new Date(<any>date - month);
    const year = newDate.getFullYear().toString();
    const result = `'${year.slice(2)}`;
    return result;
  }

  totaal(vergadering: string, formGroup: FormGroup) {
    const totaalArr = this.createArr(vergadering, formGroup);
    if (totaalArr.length < 1) {
      return 0;
    }
    const totaal = totaalArr.reduce((a, b) => a + b);
    return totaal;
  }

  gemiddeld(vergadering: string, formGroup: FormGroup) {
    const totaalArr = this.createArr(vergadering, formGroup);
    if (totaalArr.length < 1) {
      return 0;
    }
    const gemiddeld = this.totaal(vergadering, formGroup) / totaalArr.length;
    return Math.round(gemiddeld);
  }

  getErrorMessage(form: FormGroup, control: string) {
    switch (control) {
      case 'gemeente':
        return form.get('gemeente').hasError('required') ? 'Value is required' : 
          form.get('gemeente').hasError('pattern') ? 'Invalid entry' : '';
      case 'maand':
        return form.get('maand').hasError('required') ? 'Value is required' : '';
      case 'week1LED':
        return form.get('week1LED').hasError('pattern') ? 'Invalid entry' : '';
      case 'week2LED':
        return form.get('week2LED').hasError('required') ? 'Value is required' :
          form.get('week2LED').hasError('pattern') ? 'Invalid entry' : '';
      case 'week3LED':
        return form.get('week3LED').hasError('required') ? 'Value is required' :
          form.get('week3LED').hasError('pattern') ? 'Invalid entry' : '';
      case 'week4LED':
        return form.get('week4LED').hasError('required') ? 'Value is required' :
          form.get('week4LED').hasError('pattern') ? 'Invalid entry' : '';
      case 'week5LED':
        return form.get('week5LED').hasError('pattern') ? 'Invalid entry' : '';
      case 'week1OPW':
        return form.get('week1OPW').hasError('required') ? 'Value is required' :
          form.get('week1OPW').hasError('pattern') ? 'Invalid entry' : '';
      case 'week2OPW':
        return form.get('week2OPW').hasError('required') ? 'Value is required' :
          form.get('week2OPW').hasError('pattern') ? 'Invalid entry' : '';
      case 'week3OPW':
        return form.get('week3OPW').hasError('required') ? 'Value is required' :
          form.get('week3OPW').hasError('pattern') ? 'Invalid entry' : '';
      case 'week4OPW':
        return form.get('week4OPW').hasError('required') ? 'Value is required' :
          form.get('week4OPW').hasError('pattern') ? 'Invalid entry' : '';
      case 'week5OPW':
        return form.get('week5OPW').hasError('pattern') ? 'Invalid entry' : '';
      default:
        return '';
    }
  }

  private createArr(vergadering: string, formGroup: FormGroup) {
    let totaalArr = [];
    if (vergadering === 'LED') {
      totaalArr = [
        +formGroup.get('week1LED').value,
        +formGroup.get('week2LED').value, 
        +formGroup.get('week3LED').value, 
        +formGroup.get('week4LED').value, 
        +formGroup.get('week5LED').value
      ];
    } else {
      totaalArr = [
        +formGroup.get('week1OPW').value,
        +formGroup.get('week2OPW').value,
        +formGroup.get('week3OPW').value,
        +formGroup.get('week4OPW').value,
        +formGroup.get('week5OPW').value
      ];
    }
    let newArr = [];
    for(let i = 0; i < totaalArr.length; i++) {
      if (totaalArr[i] && totaalArr[i] !== 0 && typeof totaalArr[i] === 'number') {
        newArr.push(Math.abs(totaalArr[i]));
      }
    }
    return newArr;
  }
}
