import {ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';

export enum Icon {
  ChevronDown,
  Close,
}

// https://materialdesignicons.com/
const icons: { [key: number]: { path: string; viewBox: string } | string } = {
  [Icon.ChevronDown]: 'M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z',
  [Icon.Close]: 'M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z',
};

@Component({
  selector: 'ctrl-icon',
  templateUrl: './icon.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent implements OnInit, OnChanges {
  @Input() icon: Icon;
  @Input() size: string | number = '24px';
  @Input() color = 'currentColor';
  path: string;
  style = {} as CSSStyleDeclaration;
  viewBox: string;

  ngOnInit(): void {
    this.sizeChanged();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('icon' in changes) {
      this.iconChanged();
    }
    if ('size' in changes) {
      this.sizeChanged();
    }
  }

  private iconChanged() {
    if (this.icon in icons) {
      const icon = icons[this.icon];
      this.path = typeof icon === 'string' ? icon : icon.path;
      this.viewBox = typeof icon !== 'string' && icon.viewBox || '0 0 24 24';
    } else {
      delete this.path;
    }
  }

  private sizeChanged() {
    const style = typeof this.size === 'string'
      ? this.size
      : `${this.size * 1.5}rem`;
    this.style.width = this.style.height = style;
  }
}
