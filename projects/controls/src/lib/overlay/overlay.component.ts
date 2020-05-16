import {AfterViewInit, ChangeDetectionStrategy, Component, Input, ViewChild} from '@angular/core';
import {CdkPortal} from '@angular/cdk/portal';
import {FlexibleConnectedPositionStrategyOrigin, Overlay, OverlayConfig} from '@angular/cdk/overlay';
import _identity from 'lodash/identity';

@Component({
  selector: 'ctrl-overlay',
  templateUrl: './overlay.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverlayComponent implements AfterViewInit {
  @Input() overlayClass: string;
  @Input() connectedTo: FlexibleConnectedPositionStrategyOrigin;
  @ViewChild(CdkPortal) portal: CdkPortal;

  constructor(
    private overlay: Overlay
  ) {}

  private get overlayConfig(): OverlayConfig {
    if (this.connectedTo) {
      const positionStrategy = this.overlay.position().flexibleConnectedTo(this.connectedTo).withPositions([{
        originX: 'start',
        originY: 'bottom',
        overlayX: 'start',
        overlayY: 'top',
        offsetY: -1,
        panelClass: this.getPanelClass('ctrl-overlay-bottom'),
      }, {
        originX: 'start',
        originY: 'top',
        overlayX: 'start',
        overlayY: 'bottom',
        offsetY: 1,
        panelClass: this.getPanelClass('ctrl-overlay-top'),
      }]).withFlexibleDimensions(false);

      positionStrategy.positionChanges.subscribe(changes => {
        console.log(changes);
      });
      const scrollStrategy = this.overlay.scrollStrategies.reposition();
      return {
        positionStrategy,
        scrollStrategy,
      };
    }
    const positionStrategy = this.overlay.position().global().centerHorizontally().centerVertically();
    const scrollStrategy = this.overlay.scrollStrategies.block();
    return {
      positionStrategy,
      scrollStrategy,
      hasBackdrop: true,
    };
  }

  private getPanelClass(className?: string) {
    return ['ctrl-overlay', this.overlayClass, className].filter(_identity);
  }

  ngAfterViewInit(): void {
    const overlayRef = this.overlay.create({
      ...this.overlayConfig,
      panelClass: this.getPanelClass(),
    });
    overlayRef.attach(this.portal);
  }
}
