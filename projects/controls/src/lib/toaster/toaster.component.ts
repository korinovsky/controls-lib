import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {Toast, ToastType} from './toast.model';

@Component({
  selector: 'ctrl-toaster',
  templateUrl: './toaster.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToasterComponent {
  className = {
    [ToastType.Info]: 'toast-info',
    [ToastType.Success]: 'toast-success',
    [ToastType.Warning]: 'toast-warning',
    [ToastType.Error]: 'toast-error',
  };
  title = {
    [ToastType.Info]: 'Info',
    [ToastType.Success]: 'Success',
    [ToastType.Warning]: 'Warning',
    [ToastType.Error]: 'Error',
  };

  constructor(
    private cdr: ChangeDetectorRef
  ) {}

  private _toasts: Toast[];

  get toasts(): Toast[] {
    return this._toasts;
  }

  set toasts(value: Toast[]) {
    this._toasts = value;
    this.cdr.markForCheck();
  }
}
