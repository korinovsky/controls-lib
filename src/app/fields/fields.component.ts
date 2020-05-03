import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-fields',
  templateUrl: './fields.component.html',
  styleUrls: ['./fields.component.scss']
})
export class FieldsComponent implements OnInit {
  inputControl = new FormControl();
  inputControl2 = new FormControl();
  textControl = new FormControl();
  selectControl = new FormControl();

  constructor() {
  }

  ngOnInit(): void {
  }

}
