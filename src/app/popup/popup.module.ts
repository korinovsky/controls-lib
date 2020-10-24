import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupComponent } from './popup.component';
import {ToasterModule} from '../../../projects/controls/src/lib/toaster/toaster.module';

@NgModule({
  declarations: [
    PopupComponent
  ],
  exports: [
    PopupComponent
  ],
  imports: [
    CommonModule,
    ToasterModule
  ]
})
export class PopupModule { }
