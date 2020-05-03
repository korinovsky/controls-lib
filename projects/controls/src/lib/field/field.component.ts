import {AfterContentInit, Component, ContentChild, HostBinding, Input, OnChanges, SimpleChanges} from '@angular/core';
import {InputDirective, InputField} from '../input/input.directive';
import {NgControl} from '@angular/forms';
import {SelectComponent} from '../select/select.component';

@Component({
  selector: 'ctrl-field',
  templateUrl: './field.component.html',
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
  errors: string[] = [];

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

    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('label' in changes) {
      this.hasLabel = !!this.label;
    }
  }

}
