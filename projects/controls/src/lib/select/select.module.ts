import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SelectComponent} from './select.component';
import {InputModule} from '../input/input.module';
import {IconModule} from '../icon/icon.module';
import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {OverlayModule} from '@angular/cdk/overlay';

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
    PerfectScrollbarModule,
    OverlayModule,
  ]
})
export class SelectModule {}
