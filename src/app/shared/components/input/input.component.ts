import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxMaskDirective],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    },
    provideNgxMask()
  ]
})
export class InputComponent implements ControlValueAccessor {
  @Input() type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' = 'text';
  @Input() placeholder: string = '';
  @Input() disabled: boolean = false;
  @Input() error: boolean = false;
  @Input() required: boolean = false;
  @Input() label?: string;
  @Input() id?: string;
  @Input() name?: string;
  @Input() autocomplete?: string;
  @Input() readonly: boolean = false;
  @Input() maxlength?: number;
  @Input() minlength?: number;
  @Input() pattern?: string;
  @Input() mask?: string | null;
  @Input() maskOptions?: any;
  @Input() showMaskTyped: boolean | null = false;
  @Input() dropSpecialCharacters: boolean | string[] | readonly string[] | null = true;
  @Input() Icon?: string;

  @Output() inputChange = new EventEmitter<string>();
  @Output() focusEvent = new EventEmitter<FocusEvent>();
  @Output() blurEvent = new EventEmitter<FocusEvent>();

  value: string = '';
  showPassword: boolean = false;
  private onChange = (value: any) => {};
  private onTouched = () => {};

  writeValue(value: any): void {
    this.value = value || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
    this.inputChange.emit(this.value);
  }

  onFocus(event: FocusEvent): void {
    this.focusEvent.emit(event);
  }

  onBlur(event: FocusEvent): void {
    this.onTouched();
    this.blurEvent.emit(event);
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  getInputType(): string {
    if (this.type === 'password') {
      return this.showPassword ? 'text' : 'password';
    }
    return this.type;
  }
}
