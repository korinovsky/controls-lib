import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ToasterComponent} from './toaster.component';
import {OverlayModule} from '@angular/cdk/overlay';

@NgModule({
  declarations: [
    ToasterComponent
  ],
  imports: [
    CommonModule,
    OverlayModule
  ]
})
export class ToasterModule {}
