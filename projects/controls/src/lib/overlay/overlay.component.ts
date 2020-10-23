import {
  AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, Output, ViewChild
} from '@angular/core';
import {CdkPortal} from '@angular/cdk/portal';
import {FlexibleConnectedPositionStrategyOrigin, Overlay, OverlayConfig, OverlayRef} from '@angular/cdk/overlay';
import _identity from 'lodash/identity';

const overlayClass = 'ctrl-overlay';
const overlayAboveClass = 'ctrl-overlay-above';

@Component({
  selector: 'ctrl-overlay',
  templateUrl: './overlay.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverlayComponent implements AfterViewInit, OnDestroy {
  @Input() overlayClass: string;
  @Input() connectedTo: FlexibleConnectedPositionStrategyOrigin;
  @Output() above = new EventEmitter<boolean>();
  @ViewChild(CdkPortal) portal: CdkPortal;
  private overlayRef: OverlayRef;
  private isAbove: boolean;

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
        panelClass: this.getPanelClass(),
      }, {
        originX: 'start',
        originY: 'top',
        overlayX: 'start',
        overlayY: 'bottom',
        offsetY: 1,
        panelClass: this.getPanelClass(overlayAboveClass),
      }]).withFlexibleDimensions(false);

      positionStrategy.positionChanges.subscribe(changes => {
        const isAbove = changes.connectionPair.panelClass.includes(overlayAboveClass)
        if (this.isAbove !== isAbove) {
          this.isAbove = isAbove;
          this.above.emit(isAbove);
        }
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
    return [overlayClass, this.overlayClass, className].filter(_identity);
  }

  ngAfterViewInit(): void {
    this.overlayRef = this.overlay.create({
      ...this.overlayConfig,
      panelClass: this.getPanelClass(),
    });
    this.overlayRef.attach(this.portal);
  }

  ngOnDestroy(): void {
    this.overlayRef?.dispose();
  }
}
