import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-fields',
  templateUrl: './fields.component.html',
  styleUrls: ['./fields.component.scss']
})
export class FieldsComponent implements OnInit {
  inputControl = new FormControl(null, Validators.required);
  inputControl2 = new FormControl();
  textControl = new FormControl(null, Validators.required);
  selectControl = new FormControl({value: null, disabled: false}, Validators.required);

  constructor() {
  }

  ngOnInit(): void {
  }

}
