import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FieldsComponent} from './fields.component';
import {FieldModule} from 'projects/controls/src/public-api';
import {ReactiveFormsModule} from '@angular/forms';
import {SelectModule} from '../../../projects/controls/src/lib/select/select.module';
import {InputModule} from '../../../projects/controls/src/lib/input/input.module';

@NgModule({
  declarations: [
    FieldsComponent
  ],
  imports: [
    CommonModule,
    FieldModule,
    InputModule,
    ReactiveFormsModule,
    SelectModule,
  ],
  exports: [
    FieldsComponent
  ]
})
export class FieldsModule {
}
