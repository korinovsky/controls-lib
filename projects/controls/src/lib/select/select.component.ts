import {
  ChangeDetectionStrategy, Component, EventEmitter, forwardRef, HostBinding, HostListener, Input, OnChanges, OnInit, SimpleChanges,
  ViewChild
} from '@angular/core';
import {InputDirective, InputField} from '../input/input.directive';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {Icon} from '../icon/icon.component';
import {BehaviorSubject} from 'rxjs';

export interface SelectItem {
  value: any;
  text: string;
}

@Component({
  selector: 'ctrl-select',
  templateUrl: './select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SelectComponent),
    multi: true
  }],
})
export class SelectComponent implements OnInit, OnChanges, ControlValueAccessor, InputField {
  @Input() items: SelectItem[];
  @Input() allowClear = true;
  @Input() autoSelectFirst = false;
  @ViewChild(InputDirective, {static: true}) inputDirective: InputDirective;
  @HostBinding('class.has-dropdown') hasDropdown = false;
  filtered: SelectItem[] = [];
  isDisabled = false;
  isFocused = false;
  changed: EventEmitter<string>;
  focused = new BehaviorSubject(false);
  activeItemIndex: number;
  iconChevronDown = Icon.ChevronDown;
  iconClose = Icon.Close;
  private selected: SelectItem;
  private onChange: (_: any) => void = (value => this.preloadValue = value);
  private preloadValue: any;
  private onTouched: () => void;

  get inputValue() {
    return this.inputDirective.inputValue;
  }

  get isFieldFocused() {
    return this.focused.value;
  }

  ngOnInit(): void {
    this.changed = this.inputDirective.changed;
    this.changed.subscribe(value => {
      let selected = this.selected;
      if (value) {
        value = value.toUpperCase();
        selected = this.items && this.items.find(({text}) => text.toUpperCase() === value) || selected;
      } else if (this.allowClear) {
        selected = null;
      }
      if (this.selected !== selected) {
        this.selected = selected;
        this.onChange(selected ? selected.value : null);
      }
      this.filter(value);
    });
    this.inputDirective.focused.subscribe(value => {
      if (value) {
        this.onFocus();
      } else {
        this.onBlur();
      }
    });
    this.focused.subscribe(() => delete this.activeItemIndex);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('items' in changes) {
      this.filter(this.inputValue);
    }
  }

  private filter(value: string) {
    const items = this.items || [];
    if (value) {
      value = value.toUpperCase();
      this.filtered = items.filter(({text}) => text.toUpperCase().includes(value));
    } else {
      this.filtered = items;
    }
    this.hasDropdown = this.filtered.length > 0;
    delete this.activeItemIndex;
  }

  registerOnChange(fn: (_: any) => void): void {
    this.onChange = fn;
    if (this.preloadValue !== undefined) {
      this.onChange(this.preloadValue);
    }
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  writeValue(value: any): void {
    let selected = this.items && this.items.find(item => item.value === value) || null;
    if (this.selected === undefined && !selected && this.autoSelectFirst && this.items?.length > 0) {
      selected = this.items[0];
    }
    this.selected = selected;
    this.setInputValue(selected);
  }

  select(item: SelectItem, target?): void {
    this.setInputValue(item);
    if (target) {
      this.isFocused = false;
      this.setBlur();
      (target as HTMLButtonElement).blur();
    }
  }

  clear() {
    this.select(null);
    this.inputDirective.element.focus();
  }

  onFocus() {
    if (this.isFocused) {
      return;
    }
    this.isFocused = true;
    setTimeout(() => {
      if (this.isFocused) {
        this.focused.next(true);
      }
    });
  }

  onBlur() {
    if (!this.isFocused) {
      return;
    }
    this.isFocused = false;
    setTimeout(() => {
      if (!this.isFocused) {
        this.setBlur();
      }
    });
  }

  private setBlur() {
    this.setInputValue(this.selected);
    this.focused.next(false);
    this.onTouched();
  }

  private setInputValue(item: SelectItem) {
    this.inputDirective.inputValue = item?.text || '';
  }

  close(event: MouseEvent | KeyboardEvent) {
    let target = event.target as HTMLElement;
    if (!['INPUT', 'BUTTON'].includes(target.tagName)) {
      target = target.closest('button');
    }
    if (target) {
      target.blur();
    }
  }

  onInput(value: string) {
    if (value && this.filtered.length > 0) {
      this.activeItemIndex = 0;
    } else {
      delete this.activeItemIndex;
    }
  }

  @HostListener('keydown.arrowDown', ['$event'])
  onKeyArrowDown(event) {
    this.offsetActiveItem(1, event);
  }

  @HostListener('keydown.arrowUp', ['$event'])
  onKeyArrowUp(event) {
    this.offsetActiveItem(-1, event);
  }

  @HostListener('keydown.enter', ['$event'])
  onKeyEnter(event) {
    this.selectActiveItem(event);
  }

  @HostListener('keydown.escape', ['$event'])
  onKeyEscape(event) {
    this.close(event);
  }

  private offsetActiveItem(offset: number, event: Event) {
    if (!this.hasDropdown) {
      return;
    }
    const index = this.activeItemIndex !== undefined
      ? this.activeItemIndex + offset
      : offset < 0
        ? this.filtered.length - 1
        : 0;
    if (index >= 0 && index < this.filtered.length) {
      this.activeItemIndex = index;
    }
    event.preventDefault();
  }

  private selectActiveItem(event: Event) {
    if (this.activeItemIndex !== undefined) {
      this.select(this.filtered[this.activeItemIndex], event.target);
    }
  }
}
