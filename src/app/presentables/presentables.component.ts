import { Component, OnInit, Input } from '@angular/core';
import { DataService } from '../shared/data.service';
import { PresentForm } from '../shared/form.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CalcService } from '../shared/calc.service';
import { AuthService } from '../auth/auth.service';
import { BottomsheetService } from '../bottomsheet/bottomsheet.service';

@Component({
  selector: 'app-presentables',
  templateUrl: './presentables.component.html',
  styleUrls: ['./presentables.component.scss']
})
export class PresentablesComponent implements OnInit {
  
  @Input() p: PresentForm;
  @Input() presId: number;
  editForm: FormGroup;
  newForm: PresentForm;
  step: number;
  editMode = false;
  isLoadingD = false;
  isLoadingE = false;
  isNew: boolean;
  year = this.calcService.getYear();
  months = [`Januari`, `Februari`, `Maart`, `April`, `Mei`, `Juni`, `Juli`, `Augustus`, `September`, `Oktober`, `November`, `December`];
  private regex = "([0-9]{2,3}|-\\s?(kring|congres)\\s?-|-)";

  constructor(private bottomSheetService: BottomsheetService, private authService: AuthService, private dataService: DataService, private calcService: CalcService) { }

  ngOnInit() {
    this.editForm = new FormGroup({
      'gemeente': new FormControl(this.p.gmt, [Validators.required, Validators.pattern("[A-Z][a-z]+-[A-Z][a-z]+")]),
      'maand': new FormControl(this.p.mnd.split(' ')[0], [Validators.required]),
      'week1LED': new FormControl(this.p.led.w1, [Validators.pattern(this.regex)]),
      'week2LED': new FormControl(this.p.led.w2, [Validators.pattern(this.regex), Validators.required]),
      'week3LED': new FormControl(this.p.led.w3, [Validators.pattern(this.regex), Validators.required]),
      'week4LED': new FormControl(this.p.led.w4, [Validators.pattern(this.regex), Validators.required]),
      'week5LED': new FormControl(this.p.led.w5, [Validators.pattern(this.regex)]),
      'week1OPW': new FormControl(this.p.opw.w1, [Validators.pattern(this.regex), Validators.required]),
      'week2OPW': new FormControl(this.p.opw.w2, [Validators.pattern(this.regex), Validators.required]),
      'week3OPW': new FormControl(this.p.opw.w3, [Validators.pattern(this.regex), Validators.required]),
      'week4OPW': new FormControl(this.p.opw.w4, [Validators.pattern(this.regex), Validators.required]),
      'week5OPW': new FormControl(this.p.opw.w5, [Validators.pattern(this.regex)])
    });
    this.isNew = this.p.isNew;
  }

  setStep(index: number) {
    this.step = index;
  }

  setIsNew(presId: number) {
    if (this.isNew) {
      this.isNew = false;
      const creator = this.authService.getUserEmail();
      this.dataService.onUpdatePresentable({creator, isNew: false}, presId).subscribe();
    }
  }

  deletePresentable(presId: number) {
    this.bottomSheetService.openDeleteSheet(presId);
  }

  onCancel() {
    this.editMode = false;
    this.editForm.reset({
      'gemeente': this.p.gmt,
      'maand': this.p.mnd,
      'week1LED': this.p.led.w1,
      'week2LED': this.p.led.w2,
      'week3LED': this.p.led.w3,
      'week4LED': this.p.led.w4,
      'week5LED': this.p.led.w5,
      'week1OPW': this.p.opw.w1,
      'week2OPW': this.p.opw.w2,
      'week3OPW': this.p.opw.w3,
      'week4OPW': this.p.opw.w4,
      'week5OPW': this.p.opw.w5
    });
  }

  goEdit() {
    this.editMode = true;
  }

  onEdit(presId: number) {
    if (!this.editForm.valid) {
      return new Error('Form not valid!');
    }
    this.isLoadingE = true;
    const date = new Date();
    const hours = date.getHours() < 10 ? `0${date.getHours()}` : `${date.getHours()}`;
    const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : `${date.getMinutes()}`;
    const editDate = date.toLocaleDateString(undefined, {year: 'numeric', month: 'short', day: '2-digit'});
    const edited = `${editDate}, ${hours}:${minutes}`;
    this.newForm = {
      gmt: this.editForm.get('gemeente').value,
      mnd: `${this.editForm.get('maand').value} ${this.year}`,
      led: {
        w1: this.editForm.get('week1LED').value ? this.editForm.get('week1LED').value : false,
        w2: this.editForm.get('week2LED').value,
        w3: this.editForm.get('week3LED').value,
        w4: this.editForm.get('week4LED').value,
        w5: this.editForm.get('week5LED').value ? this.editForm.get('week5LED').value : false
      },
      opw: {
        w1: this.editForm.get('week1OPW').value ? this.editForm.get('week1OPW').value : false,
        w2: this.editForm.get('week2OPW').value,
        w3: this.editForm.get('week3OPW').value,
        w4: this.editForm.get('week4OPW').value,
        w5: this.editForm.get('week5OPW').value ? this.editForm.get('week5OPW').value : false
      },
      totled: this.totaal('LED'),
      totopw: this.totaal('OPW'),
      gemled: this.gemiddeld('LED'),
      gemopw: this.gemiddeld('OPW'),
      creator: this.authService.getUserEmail(),
      edited
    }
    const createdP = this.newForm;
    this.dataService.onUpdatePresentable(createdP, presId).subscribe(res => {
      this.editMode = false;
      this.isLoadingE = false;
      this.dataService.onGetPresentables().subscribe();
    }, error => {
      console.log(error);
      this.isLoadingE = false;
    });
  }

  totaal(vergadering: string) {
    return this.calcService.totaal(vergadering, this.editForm);
  }

  gemiddeld(vergadering: string) {
    return this.calcService.gemiddeld(vergadering, this.editForm);
  }

  getError(control: string) {
    return this.calcService.getErrorMessage(this.editForm, control);
  }
}
