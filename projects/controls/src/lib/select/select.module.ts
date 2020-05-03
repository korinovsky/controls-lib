import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SelectComponent} from './select.component';
import {InputModule} from '../input/input.module';
import {IconModule} from "../icon/icon.module";

@NgModule({
  declarations: [
    SelectComponent
  ],
  exports: [
    SelectComponent
  ],
  imports: [
    CommonModule,
    InputModule,
    IconModule,
  ]
})
export class SelectModule {}
