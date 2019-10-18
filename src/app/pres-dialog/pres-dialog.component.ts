import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PresentForm } from '../shared/form.model';
import { MatDialogRef } from '@angular/material';
import { DataService } from '../shared/data.service';
import { CalcService } from '../shared/calc.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-pres-dialog',
  templateUrl: './pres-dialog.component.html',
  styleUrls: ['./pres-dialog.component.scss']
})
export class PresDialogComponent implements OnInit {

  form: FormGroup;
  gemeente: string;
  maand: string;
  presentForm: PresentForm;
  isLoading = false;
  year = this.calcService.getYear();
  months = [`Januari`, `Februari`, `Maart`, `April`, `Mei`, `Juni`, `Juli`, `Augustus`, `September`, `Oktober`, `November`, `December`];

  constructor(private authService: AuthService, private dialogRef: MatDialogRef<PresDialogComponent>, private dataService: DataService, private calcService: CalcService) {}

  private regex = "([0-9]{2,3}|-\\s?(kring|congres)\\s?-|-)";

  ngOnInit() {
    this.form = new FormGroup({
      'gemeente': new FormControl('', [Validators.pattern("[A-Z][a-z]+-[A-Z][a-z]+"), Validators.required]),
      'maand': new FormControl(null, [Validators.required]),
      'week1LED': new FormControl(null, [Validators.pattern(this.regex)]),
      'week2LED': new FormControl(null, [Validators.pattern(this.regex), Validators.required]),
      'week3LED': new FormControl(null, [Validators.pattern(this.regex), Validators.required]),
      'week4LED': new FormControl(null, [Validators.pattern(this.regex), Validators.required]),
      'week5LED': new FormControl(null, [Validators.pattern(this.regex)]),
      'week1OPW': new FormControl(null, [Validators.pattern(this.regex), Validators.required]),
      'week2OPW': new FormControl(null, [Validators.pattern(this.regex), Validators.required]),
      'week3OPW': new FormControl(null, [Validators.pattern(this.regex), Validators.required]),
      'week4OPW': new FormControl(null, [Validators.pattern(this.regex), Validators.required]),
      'week5OPW': new FormControl(null, [Validators.pattern(this.regex)])
    });
  }

  onSubmit() {
    if (!this.form.valid) {
      return new Error('Form not valid!');
    }
    this.isLoading = true;
    const date = new Date();
    const created = date.toLocaleDateString(undefined, {year: 'numeric', month: 'short', day: '2-digit'});
    this.presentForm = {
      gmt: this.form.get('gemeente').value,
      mnd: `${this.form.get('maand').value} ${this.year}`,
      led: {
        w1: this.form.get('week1LED').value ? this.form.get('week1LED').value : false,
        w2: this.form.get('week2LED').value,
        w3: this.form.get('week3LED').value,
        w4: this.form.get('week4LED').value,
        w5: this.form.get('week5LED').value ? this.form.get('week5LED').value : false
      },
      opw: {
        w1: this.form.get('week1OPW').value ? this.form.get('week1OPW').value : false,
        w2: this.form.get('week2OPW').value,
        w3: this.form.get('week3OPW').value,
        w4: this.form.get('week4OPW').value,
        w5: this.form.get('week5OPW').value ? this.form.get('week5OPW').value : false
      },
      totled: this.calcService.totaal('LED', this.form),
      totopw: this.calcService.totaal('OPW', this.form),
      gemled: this.calcService.gemiddeld('LED', this.form),
      gemopw: this.calcService.gemiddeld('OPW', this.form),
      creator: this.authService.getUserEmail(),
      isNew: true,
      created
    }
    const createdP = this.presentForm;
    this.dataService.onCreatePresentable(createdP).subscribe(res => {
      this.onReset();
      this.closeDialog();
      this.isLoading = false;
      this.dataService.onGetPresentables().subscribe();
    }, error => {
      console.log(error);
      this.isLoading = false;
    });
  }

  onReset() {
    this.form.reset({
      gemeente: '',
      maand: this.form.get('maand').value
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }

  totaal(vergadering: string) {
    return this.calcService.totaal(vergadering, this.form);
  }

  gemiddeld(vergadering: string) {
    return this.calcService.gemiddeld(vergadering, this.form);
  }

  getError(control: string) {
    return this.calcService.getErrorMessage(this.form, control);
  }
}
