import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { UserModel } from '@core/models/user.model';
import { ModalComponent } from '@shared/modules/modal';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { passwordConfirmValidatorSimple } from '@shared/validators';

@Component({
  selector: 'app-user-modal',
  imports: [ModalComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './user-modal.component.html',
  styleUrl: './user-modal.component.scss'
})
export class UserModalComponent {
  @Input({ required: true }) title!: string;
  @Input() user: UserModel | null = null;

  private readonly formBuilder = inject(FormBuilder);

  form: FormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required]
  }, {
    validators: passwordConfirmValidatorSimple()
  });
}
