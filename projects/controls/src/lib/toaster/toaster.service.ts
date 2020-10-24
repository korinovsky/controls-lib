import {Injectable} from '@angular/core';
import {Overlay, OverlayRef} from '@angular/cdk/overlay';
import {Toast, ToastType} from './toast.model';
import {ComponentPortal} from '@angular/cdk/portal';
import {ToasterComponent} from './toaster.component';

@Injectable({
  providedIn: 'root'
})
export class ToasterService {
  private overlayRef: OverlayRef;
  private componentPortal: ComponentPortal<ToasterComponent>;
  private toasterComponent: ToasterComponent;
  private toasts: Toast[] = [];

  constructor(
    overlay: Overlay
  ) {
    this.overlayRef = overlay.create({
      positionStrategy: overlay.position().global().top().right()
    });
    this.componentPortal = new ComponentPortal(ToasterComponent);
  }

  show(message: string, type = ToastType.Info, timeout?: number): Toast {
    const toast = {
      type,
      message
    } as Toast;
    toast.close = () => this.hide(toast);
    if (timeout) {
      setTimeout(() => toast.close(), timeout * 1000);
    }
    this.attachedToasterComponent.toasts = this.toasts = [...this.toasts, toast];
    return toast;
  }

  private get attachedToasterComponent(): ToasterComponent {
    if (this.overlayRef.hasAttached()) {
      return this.toasterComponent;
    }
    return this.toasterComponent = this.overlayRef.attach(this.componentPortal).instance;
  }

  hide(toast: Toast): void {
    if (!this.toasts.includes(toast)) {
      return;
    }
    this.toasts = this.toasts.filter(item => item !== toast);
    if (this.toasts.length > 0) {
      this.attachedToasterComponent.toasts = this.toasts;
    } else if (this.overlayRef.hasAttached()) {
      this.overlayRef.detach();
    }
  }
}
