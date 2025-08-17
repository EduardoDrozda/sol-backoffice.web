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
      multi: true,
    },
    provideNgxMask(),
  ],
})
export class InputComponent implements ControlValueAccessor {
  @Input() autocomplete?: string;
  @Input() disabled: boolean = false;
  @Input() dropSpecialCharacters: boolean | string[] | readonly string[] | null = true;
  @Input() error: boolean = false;
  @Input() errorMessage?: string;
  @Input() icon?: string;
  @Input() id?: string;
  @Input() label?: string;
  @Input() mask?: string | null;
  @Input() maskOptions?: any;
  @Input() maxlength?: number;
  @Input() minlength?: number;
  @Input() name?: string;
  @Input() pattern?: string;
  @Input() placeholder: string = '';
  @Input() readonly: boolean = false;
  @Input() required: boolean = false;
  @Input() showMaskTyped: boolean | null = false;
  @Input() type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' = 'text';

  @Output() blurEvent = new EventEmitter<FocusEvent>();
  @Output() focusEvent = new EventEmitter<FocusEvent>();
  @Output() inputChange = new EventEmitter<string>();

  innerValue: string = '';
  showPassword = false;

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: any): void {
    this.innerValue = value ?? '';
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  handleModelChange(value: string): void {
    this.innerValue = value;
    this.onChange(value);
    this.inputChange.emit(value);
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
