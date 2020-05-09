import {Directive, ElementRef, EventEmitter, HostListener, OnInit} from '@angular/core';
import {FormControl, NgControl} from '@angular/forms';
import {filter, map} from 'rxjs/operators';
import {BehaviorSubject, merge, Observable} from 'rxjs';

export interface InputField {
  focused: BehaviorSubject<boolean>;
  changed: EventEmitter<string>;
  inputValue: string;
}

@Directive({
  selector: '[ctrlInput]'
})
export class InputDirective implements InputField, OnInit {
  focused = new BehaviorSubject(false);
  changed = new EventEmitter<string>();
  element: HTMLInputElement;
  private input = new EventEmitter<string>();
  private _value: string;

  constructor(
    private ngControl: NgControl,
    {nativeElement}: ElementRef
  ) {
    this.element = nativeElement;
  }

  get inputValue(): string {
    return this.element.value;
  }

  set inputValue(value: string) {
    this.element.value = value;
    if (this._value !== value) {
      this.setValue(value);
    }
  }

  private get control(): FormControl {
    return this.ngControl && this.ngControl.control as FormControl;
  }

  ngOnInit(): void {
    this.initChanged();
    this.initStyle();
  }

  private setValue(value: string) {
    this._value = value;
    this.changed.emit(this._value);
  }

  private initChanged() {
    const {control} = this;
    this._value = this.element.value;
    const changed: Observable<string> = control
      ? merge(this.input, control.valueChanges.pipe(map(() => this.element.value)))
      : this.input;
    changed
      .pipe(filter(value => value !== this._value))
      .subscribe(this.setValue.bind(this));
  }

  private initStyle() {
    this.element.classList.add('field-input');
    if (this.element.tagName !== 'TEXTAREA') {
      return;
    }
    const setHeight = height => this.element.style.height = height;
    const setScrollHeight = () => setHeight(this.element.scrollHeight + 'px');
    this.changed.subscribe(() => {
      setHeight('auto');
      setScrollHeight();
    });
    setScrollHeight();
  }

  @HostListener('focus')
  private onFocus() {
    this.focused.next(true);
  }

  @HostListener('blur')
  private onBlur() {
    this.focused.next(false);
  }

  @HostListener('input')
  private onInput() {
    this.input.emit(this.element.value);
  }
}
