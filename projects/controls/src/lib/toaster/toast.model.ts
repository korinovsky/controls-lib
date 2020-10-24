export enum ToastType {
  Info,
  Success,
  Warning,
  Error,
}

export interface Toast {
  type: ToastType,
  message: string;
  close: () => void;
}
