import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OverlayComponent} from './overlay.component';
import {OverlayModule as CdkOverlayModule} from '@angular/cdk/overlay';
import {PortalModule} from '@angular/cdk/portal';

@NgModule({
  declarations: [
    OverlayComponent
  ],
  exports: [
    OverlayComponent
  ],
  imports: [
    CommonModule,
    CdkOverlayModule,
    PortalModule
  ]
})
export class OverlayModule {}
