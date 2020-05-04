import {
  AfterContentInit, ChangeDetectionStrategy, Component, ContentChild, HostBinding, Input, OnChanges, SimpleChanges
} from '@angular/core';
import {InputDirective, InputField} from '../input/input.directive';
import {AbstractControl, NgControl} from '@angular/forms';
import {SelectComponent} from '../select/select.component';

enum FieldStatus {
  Valid = 'VALID',
  Invalid = 'INVALID',
  Pending = 'PENDING',
  Disabled = 'DISABLED',
}

const touchedErrors = ['required', 'minlength'];
const errorMessages = {
  required: 'Обязательно для заполнения',
  minlength: 'Неполное значение',
};

@Component({
  selector: 'ctrl-field',
  templateUrl: './field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldComponent implements AfterContentInit, OnChanges {
  @Input() label: string;
  @Input() hint: string;
  @Input() warning: string;
  @ContentChild(InputDirective, {static: true}) inputDirective: InputDirective;
  @ContentChild(SelectComponent, {static: true}) selectComponent: SelectComponent;
  @ContentChild(NgControl, {static: true}) controlField: NgControl;
  @HostBinding('class.has-value') hasValue = false;
  @HostBinding('class.has-focus') hasFocus = false;
  @HostBinding('class.has-label') hasLabel = false;
  @HostBinding('class.has-error') hasError = false;
  @HostBinding('class.is-disabled') isDisabled = false;
  errors: string[] = [];
  private pristine: boolean;
  private touched: boolean;
  private status: FieldStatus;

  get inputField(): InputField {
    return this.inputDirective || this.selectComponent;
  }

  ngAfterContentInit(): void {
    const {inputField, controlField} = this;
    if (inputField) {
      const {focused, changed, inputValue} = inputField;
      this.hasValue = !!inputValue;
      changed.subscribe(next => this.hasValue = !!next);
      focused.subscribe(next => this.hasFocus = next);
    }

    if (controlField) {
      const {control} = controlField;
      const callFn = (fnName: string, callback: () => void) => {
        control[fnName] = function(...props) {
          (AbstractControl.prototype[fnName] as Function).apply(control, props);
          callback();
        };
      };
      const setParam = (param: string, force = false) => {
        if (!force && this[param] === control[param]) {
          return;
        }
        this[param] = control[param];
        this.updateState();
      };
      ['markAsDirty', 'markAsPristine'].forEach(fn =>
        callFn(fn, () => setParam('pristine'))
      );
      ['markAsTouched', 'markAsUntouched'].forEach(fn =>
        callFn(fn, () => setParam('touched'))
      );
      ['markAsPending', 'disable'].forEach(fn =>
        callFn(fn, () => setParam('status'))
      );
      ['updateValueAndValidity', 'setErrors'].forEach(fn =>
        callFn(fn, () => setParam('status', true))
      );
      this.pristine = control.pristine;
      this.touched = control.touched;
      this.status = control.status as FieldStatus;
      this.updateState();
      if (inputField) {
        inputField.changed.subscribe(() => control.markAsUntouched());
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('label' in changes) {
      this.hasLabel = !!this.label;
    }
  }

  private updateState() {
    this.errors = [];
    const {errors} = this.controlField;
    if (errors && (this.touched || !this.pristine)) {
      let codes = Object.keys(errors);
      if (!this.touched) {
        codes = codes.filter(code => !touchedErrors.includes(code));
      }
      codes.forEach(code => {
        const error = errors[code];
        this.errors.push(typeof error === 'string' ? error : errorMessages[code] || code);
      });
    }
    this.hasError = this.errors.length > 0;
    this.isDisabled = this.status === FieldStatus.Disabled;
  }
}
