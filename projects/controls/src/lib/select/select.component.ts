import {Component, EventEmitter, forwardRef, HostBinding, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {InputDirective, InputField} from '../input/input.directive';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {Icon} from "../icon/icon.component";

export interface Item {
  value: any;
  text: string;
}

@Component({
  selector: 'ctrl-select',
  templateUrl: './select.component.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SelectComponent),
    multi: true
  }],
})
export class SelectComponent implements OnInit, OnChanges, ControlValueAccessor, InputField {
  @Input() items: Item[];
  @HostBinding('class.allow-clear')
  @Input() allowClear = true;
  @Input() autoSelectFirst = false;
  @ViewChild(InputDirective, {static: true}) inputDirective: InputDirective;
  @HostBinding('class.has-dropdown') hasDropdown = false;
  filtered: Item[] = [];
  isDisabled = false;
  changed: EventEmitter<string>;
  focused = new EventEmitter<boolean>();
  focusIndex: number;
  iconChevronDown = Icon.ChevronDown;
  iconClose = Icon.Close;
  private selected: Item;
  private onChange: (_: any) => void = (value => this.preloadValue = value);
  private preloadValue: any;
  private onTouched: () => void;
  private isFocused = false;

  get inputValue() {
    return this.inputDirective.inputValue;
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
        delete this.focusIndex;
        this.onFocus();
      } else {
        this.onBlur();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('items' in changes) {
      this.filter(this.inputValue);
    }
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
    if (this.selected === undefined && !selected === !value) {
      this.selected = selected;
    }
    if (!selected && this.autoSelectFirst && this.items && this.items.length > 0) {
      selected = this.items[0];
    }
    this.setInputValue(selected);
  }

  select(item: Item, target?): void {
    this.setInputValue(item);
    if (target) {
      this.isFocused = false;
      this.setBlur();
      (target as HTMLButtonElement).blur();
    }
  }

  clear() {
    this.select(null);
    this.inputDirective.element.focus()
  }

  onFocus() {
    if (this.isFocused) {
      return;
    }
    this.isFocused = true;
    setTimeout(() => {
      if (this.isFocused) {
        this.focused.emit(true);
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

  offsetFocused(offset: number, event: Event) {
    if (!this.hasDropdown) {
      return;
    }
    const focusIndex = this.focusIndex !== undefined
      ? this.focusIndex + offset
      : offset < 0
        ? this.filtered.length - 1
        : 0;
    if (focusIndex >= 0 && focusIndex < this.filtered.length) {
      this.focusIndex = focusIndex;
    }
    event.preventDefault();
  }

  selectFocused(event: Event) {
    if (this.focusIndex !== undefined) {
      this.select(this.filtered[this.focusIndex], event.target);
    }
  }

  private setBlur() {
    this.setInputValue(this.selected);
    this.focused.emit(false);
    this.onTouched();
  }

  private setInputValue(item: Item) {
    this.inputDirective.inputValue = item ? item.text : '';
  }

  private filter(value: string) {
    const items = this.items || [];
    if (value) {
      value = value.toUpperCase();
      this.filtered = items.filter(({text}) => text.toUpperCase().startsWith(value));
    } else {
      this.filtered = items;
    }
    this.hasDropdown = this.filtered.length > 0;
    delete this.focusIndex;
  }
}
